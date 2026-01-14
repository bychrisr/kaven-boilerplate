import axios from 'axios';

interface CachedRate {
  rate: number;
  timestamp: number;
}

interface CoinGeckoPrice {
  [currency: string]: number;
}

/**
 * Service para integração com CoinGecko API (Free Tier)
 * Fornece cotações de criptomoedas em tempo real com cache de 5 minutos
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

  // Mapeamento de códigos de moeda para IDs do CoinGecko
  private readonly COINGECKO_IDS: Record<string, string> = {
    BTC: 'bitcoin',
    SATS: 'bitcoin', // 1 BTC = 100,000,000 sats
    ETH: 'ethereum',
    USDT: 'tether',
  };

  // Conversão de sats: 1 BTC = 100 milhões de sats
  private readonly SATS_PER_BTC = 100_000_000;

  private constructor() {}

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
    // Caso 1: Ambas são fiat (não suportado diretamente, usar USD como ponte)
    if (!this.isCrypto(from) && !this.isCrypto(to)) {
      throw new Error('Conversão fiat-to-fiat não suportada');
    }

    // Caso 2: Crypto → Fiat
    if (this.isCrypto(from) && !this.isCrypto(to)) {
      return await this.getCryptoToFiatRate(from, to);
    }

    // Caso 3: Fiat → Crypto
    if (!this.isCrypto(from) && this.isCrypto(to)) {
      const inverseRate = await this.getCryptoToFiatRate(to, from);
      return 1 / inverseRate;
    }

    // Caso 4: Crypto → Crypto (usar USD como ponte)
    const fromToUsd = await this.getCryptoToFiatRate(from, 'USD');
    const toToUsd = await this.getCryptoToFiatRate(to, 'USD');
    return fromToUsd / toToUsd;
  }

  /**
   * Busca cotação de criptomoeda em moeda fiat
   */
  private async getCryptoToFiatRate(crypto: string, fiat: string): Promise<number> {
    const coinId = this.COINGECKO_IDS[crypto];
    if (!coinId) {
      throw new Error(`Criptomoeda não suportada: ${crypto}`);
    }

    const vsCurrency = fiat.toLowerCase();

    try {
      const response = await axios.get<Record<string, CoinGeckoPrice>>(
        `${this.BASE_URL}/simple/price`,
        {
          params: {
            ids: coinId,
            vs_currencies: vsCurrency,
          },
          timeout: 10000,
        }
      );

      const price = response.data[coinId]?.[vsCurrency];

      if (!price) {
        throw new Error(`Cotação não encontrada para ${crypto}/${fiat}`);
      }

      // Se for SATS, converter de BTC para sats
      if (crypto === 'SATS') {
        return price / this.SATS_PER_BTC;
      }

      return price;
    } catch (error) {
      console.error('[CoinGecko] Erro ao buscar cotação:', error);
      throw new Error(`Falha ao buscar cotação ${crypto}/${fiat}`);
    }
  }

  /**
   * Verifica se uma moeda é criptomoeda
   */
  private isCrypto(code: string): boolean {
    return code in this.COINGECKO_IDS;
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
}
