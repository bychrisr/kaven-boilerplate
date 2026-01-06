import axios, { AxiosInstance, AxiosError } from 'axios';

/**
 * Cliente HTTP para PagueBit com retry automático em rate limit
 */
export class PagueBitClient {
  private client: AxiosInstance;

  constructor() {
    const apiToken = process.env.PAGUEBIT_API_TOKEN || '';

    if (!apiToken) {
      console.warn('⚠️  PAGUEBIT_API_TOKEN não configurado');
    }

    this.client = axios.create({
      baseURL: 'https://api.paguebit.com/v1',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  /**
   * POST com retry automático em rate limit (429)
   */
  async post<T = any>(endpoint: string, data: any, retries = 3): Promise<T> {
    try {
      const response = await this.client.post(endpoint, data);
      return response.data;
    } catch (error) {
      return this.handleError(error, () => this.post(endpoint, data, retries - 1), retries);
    }
  }

  /**
   * GET com retry automático em rate limit (429)
   */
  async get<T = any>(endpoint: string, retries = 3): Promise<T> {
    try {
      const response = await this.client.get(endpoint);
      return response.data;
    } catch (error) {
      return this.handleError(error, () => this.get(endpoint, retries - 1), retries);
    }
  }

  /**
   * Handler de erro com retry em rate limit
   */
  private async handleError<T>(
    error: unknown,
    retryFn: () => Promise<T>,
    retries: number
  ): Promise<T> {
    const axiosError = error as AxiosError;

    // Rate limit (429) - retry com backoff exponencial
    if (axiosError.response?.status === 429 && retries > 0) {
      const delay = Math.pow(2, 4 - retries) * 1000; // 2s, 4s, 8s
      console.log(`⏳ Rate limit atingido. Aguardando ${delay}ms antes de retry...`);
      await this.sleep(delay);
      return retryFn();
    }

    // Outros erros - propagar
    throw error;
  }

  /**
   * Sleep helper
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
