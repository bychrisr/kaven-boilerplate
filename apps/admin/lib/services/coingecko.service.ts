import axios from 'axios';
import { PrismaClient } from '@prisma/client';

interface CachedRate {
  rate: number;
  timestamp: number;
}

interface CoinGeckoPrice {
  [currency: string]: number;
}

interface CurrencyMetadata {
  coingeckoId?: string;
  satsPerBtc?: number;
}

/**
 * Service para integração com CoinGecko API (Free Tier)
 * Fornece cotações de criptomoedas em tempo real com cache de 5 minutos
 * Busca configurações de moedas do banco de dados (sem hardcoded)
 * 
 * @example
 * const service = CoinGeckoService.getInstance();
 * const rate = await service.getExchangeRate('BRL', 'SATS');
 */
export class CoinGeckoService {
  private static instance: CoinGeckoService;
  private cache = new Map<string, CachedRate>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos
  private readonly BASE_URL = 'https://api.coingecko.com/api/v3';
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
      console.log(`[CoinGecko] Cache hit: ${cacheKey}`);
      return this.cache.get(cacheKey)!.rate;
    }

    console.log(`[CoinGecko] Cache miss: ${cacheKey}, fetching from API...`);

    // Buscar da API
    const rate = await this.fetchRate(from, to);

    // Armazenar em cache
    this.cache.set(cacheKey, { rate, timestamp: Date.now() });

    return rate;
  }

  /**
   * Busca taxa de câmbio da API CoinGecko
   */
  private async fetchRate(from: string, to: string): Promise<number> {
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
      return await this.getCryptoToFiatRate(fromCurrency, to);
    }

    // Caso 3: Fiat → Crypto
    if (!fromIsCrypto && toIsCrypto) {
      const inverseRate = await this.getCryptoToFiatRate(toCurrency, from);
      return 1 / inverseRate;
    }

    // Caso 4: Crypto → Crypto (usar USD como ponte)
    const fromToUsd = await this.getCryptoToFiatRate(fromCurrency, 'USD');
    const toToUsd = await this.getCryptoToFiatRate(toCurrency, 'USD');
    return fromToUsd / toToUsd;
  }

  /**
   * Busca cotação de criptomoeda em moeda fiat
   */
  private async getCryptoToFiatRate(
    cryptoCurrency: any,
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

    try {
      const response = await axios.get<Record<string, CoinGeckoPrice>>(
        `${this.BASE_URL}/simple/price`,
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
    } catch (error) {
      console.error('[CoinGecko] Erro ao buscar cotação:', error);
      throw new Error(`Falha ao buscar cotação ${cryptoCurrency.code}/${fiatCode}`);
    }
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
    console.log('[CoinGecko] Cache cleared');
  }

  /**
   * Fecha conexão com Prisma (importante para cleanup)
   */
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
