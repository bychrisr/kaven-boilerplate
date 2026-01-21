import axios from 'axios';
import { PrismaClient } from '@prisma/client';

interface CachedRate {
  rate: number;
  timestamp: number;
  source: 'coingecko' | 'tradingview';
}

interface CoinGeckoPrice {
  [currency: string]: number;
}

interface CurrencyMetadata {
  coingeckoId?: string;
  tradingviewSymbol?: string;
  satsPerBtc?: number;
}

/**
 * Service para integração com APIs de cotação (CoinGecko + TradingView fallback)
 * Fornece cotações de criptomoedas em tempo real com cache de 5 minutos
 * Busca configurações de moedas do banco de dados (sem hardcoded)
 * 
 * Fallback automático:
 * 1. Tenta CoinGecko (free tier, sem key)
 * 2. Se falhar, usa TradingView como fallback
 * 
 * @example
 * const service = CoinGeckoService.getInstance();
 * const rate = await service.getExchangeRate('BRL', 'SATS');
 */
export class CoinGeckoService {
  private static instance: CoinGeckoService;
  private cache = new Map<string, CachedRate>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos
  private readonly COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
  private readonly TRADINGVIEW_BASE_URL = 'https://scanner.tradingview.com';
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  static getInstance(): CoinGeckoService {
    if (!this.instance) {
      this.instance = new CoinGeckoService();
    }
    return this.instance;
  }

  /**
   * Obtém taxa de câmbio entre duas moedas
   * Usa cache de 5 minutos para evitar exceder rate limit da API
   * 
   * @param from - Código da moeda de origem (ex: 'BRL')
   * @param to - Código da moeda de destino (ex: 'SATS')
   * @returns Taxa de conversão (1 from = X to)
   */
  async getExchangeRate(from: string, to: string): Promise<number> {
    const cacheKey = `${from}_${to}`;

    // Verificar cache
    if (this.isCacheValid(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      console.log(`[ExchangeService] Cache hit: ${cacheKey} (source: ${cached.source})`);
      return cached.rate;
    }

    console.log(`[ExchangeService] Cache miss: ${cacheKey}, fetching from API...`);

    // Buscar da API com fallback
    const { rate, source } = await this.fetchRateWithFallback(from, to);

    // Armazenar em cache
    this.cache.set(cacheKey, { rate, timestamp: Date.now(), source });

    return rate;
  }

  /**
   * Busca taxa com fallback automático
   * Tenta CoinGecko primeiro, se falhar usa TradingView
   */
  private async fetchRateWithFallback(
    from: string,
    to: string
  ): Promise<{ rate: number; source: 'coingecko' | 'tradingview' }> {
    try {
      // Tentar CoinGecko primeiro
      const rate = await this.fetchRate(from, to, 'coingecko');
      console.log(`[ExchangeService] ✅ CoinGecko success: ${from}/${to}`);
      return { rate, source: 'coingecko' };
    } catch (coingeckoError) {
      console.warn(`[ExchangeService] ⚠️ CoinGecko failed, trying TradingView fallback...`);
      console.warn(`[ExchangeService] CoinGecko error:`, coingeckoError);

      try {
        // Fallback para TradingView
        const rate = await this.fetchRate(from, to, 'tradingview');
        console.log(`[ExchangeService] ✅ TradingView fallback success: ${from}/${to}`);
        return { rate, source: 'tradingview' };
      } catch (tradingviewError) {
        console.error(`[ExchangeService] ❌ Both APIs failed`);
        console.error(`[ExchangeService] TradingView error:`, tradingviewError);
        throw new Error(
          `Falha ao buscar cotação ${from}/${to}. ` +
          `CoinGecko e TradingView indisponíveis.`
        );
      }
    }
  }

  /**
   * Busca taxa de câmbio da API especificada
   */
  private async fetchRate(
    from: string,
    to: string,
    source: 'coingecko' | 'tradingview'
  ): Promise<number> {
    // Buscar informações das moedas do banco
    const [fromCurrency, toCurrency] = await Promise.all([
      this.prisma.currency.findUnique({ where: { code: from } }),
      this.prisma.currency.findUnique({ where: { code: to } }),
    ]);

    if (!fromCurrency || !toCurrency) {
      throw new Error(`Moeda não encontrada: ${!fromCurrency ? from : to}`);
    }

    const fromIsCrypto = fromCurrency.isCrypto;
    const toIsCrypto = toCurrency.isCrypto;

    // Caso 1: Ambas são fiat (não suportado diretamente)
    if (!fromIsCrypto && !toIsCrypto) {
      throw new Error('Conversão fiat-to-fiat não suportada');
    }

    // Caso 2: Crypto → Fiat
    if (fromIsCrypto && !toIsCrypto) {
      return await this.getCryptoToFiatRate({ 
        code: fromCurrency.code, 
        metadata: fromCurrency.metadata as unknown as CurrencyMetadata, 
        isCrypto: fromCurrency.isCrypto 
      }, to, source);
    }

    // Caso 3: Fiat → Crypto
    if (!fromIsCrypto && toIsCrypto) {
      const inverseRate = await this.getCryptoToFiatRate({ 
        code: toCurrency.code, 
        metadata: toCurrency.metadata as unknown as CurrencyMetadata, 
        isCrypto: toCurrency.isCrypto 
      }, from, source);
      return 1 / inverseRate;
    }

    // Caso 4: Crypto → Crypto (usar USD como ponte)
    const fromToUsd = await this.getCryptoToFiatRate({ 
      code: fromCurrency.code, 
      metadata: fromCurrency.metadata as unknown as CurrencyMetadata, 
      isCrypto: fromCurrency.isCrypto 
    }, 'USD', source);
    const toToUsd = await this.getCryptoToFiatRate({ 
      code: toCurrency.code, 
      metadata: toCurrency.metadata as unknown as CurrencyMetadata, 
      isCrypto: toCurrency.isCrypto 
    }, 'USD', source);
    return fromToUsd / toToUsd;
  }

  /**
   * Busca cotação de criptomoeda em moeda fiat
   */
  private async getCryptoToFiatRate(
    cryptoCurrency: { code: string; metadata: CurrencyMetadata | null; isCrypto: boolean },
    fiatCode: string,
    source: 'coingecko' | 'tradingview'
  ): Promise<number> {
    if (source === 'coingecko') {
      return await this.getCryptoToFiatRateFromCoinGecko(cryptoCurrency, fiatCode);
    } else {
      return await this.getCryptoToFiatRateFromTradingView(cryptoCurrency, fiatCode);
    }
  }

  /**
   * Busca cotação via CoinGecko
   */
  private async getCryptoToFiatRateFromCoinGecko(
    cryptoCurrency: { code: string; metadata: CurrencyMetadata | null },
    fiatCode: string
  ): Promise<number> {
    const metadata = cryptoCurrency.metadata as CurrencyMetadata | null;
    const coingeckoId = metadata?.coingeckoId;

    if (!coingeckoId) {
      throw new Error(
        `CoinGecko ID não configurado para ${cryptoCurrency.code}. ` +
        `Adicione "coingeckoId" no campo metadata da currency.`
      );
    }

    const vsCurrency = fiatCode.toLowerCase();

    const response = await axios.get<Record<string, CoinGeckoPrice>>(
      `${this.COINGECKO_BASE_URL}/simple/price`,
      {
        params: {
          ids: coingeckoId,
          vs_currencies: vsCurrency,
        },
        timeout: 10000,
      }
    );

    const price = response.data[coingeckoId]?.[vsCurrency];

    if (!price) {
      throw new Error(`Cotação não encontrada para ${cryptoCurrency.code}/${fiatCode}`);
    }

    // Se for SATS, converter de BTC para sats
    if (cryptoCurrency.code === 'SATS') {
      const satsPerBtc = metadata?.satsPerBtc || 100000000;
      return price / satsPerBtc;
    }

    return price;
  }

  /**
   * Busca cotação via TradingView (fallback)
   */
  private async getCryptoToFiatRateFromTradingView(
    cryptoCurrency: { code: string; metadata: CurrencyMetadata | null },
    fiatCode: string
  ): Promise<number> {
    const metadata = cryptoCurrency.metadata as CurrencyMetadata | null;
    const tradingviewSymbol = metadata?.tradingviewSymbol;

    if (!tradingviewSymbol) {
      throw new Error(
        `TradingView symbol não configurado para ${cryptoCurrency.code}. ` +
        `Adicione "tradingviewSymbol" no campo metadata da currency.`
      );
    }

    // TradingView usa símbolos como "BTCUSD", "BTCBRL"
    const symbol = `${tradingviewSymbol}${fiatCode}`;

    const response = await axios.post(
      `${this.TRADINGVIEW_BASE_URL}/crypto/scan`,
      {
        symbols: { tickers: [symbol] },
        columns: ['close'],
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );

    const price = response.data?.data?.[0]?.d?.[0];

    if (!price) {
      throw new Error(`Cotação não encontrada para ${symbol} no TradingView`);
    }

    // Se for SATS, converter de BTC para sats
    if (cryptoCurrency.code === 'SATS') {
      const satsPerBtc = metadata?.satsPerBtc || 100000000;
      return price / satsPerBtc;
    }

    return price;
  }

  /**
   * Verifica se cache é válido (< 5 minutos)
   */
  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.CACHE_TTL;
  }

  /**
   * Limpa cache (útil para testes)
   */
  clearCache(): void {
    this.cache.clear();
    console.log('[ExchangeService] Cache cleared');
  }

  /**
   * Fecha conexão com Prisma (importante para cleanup)
   */
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
