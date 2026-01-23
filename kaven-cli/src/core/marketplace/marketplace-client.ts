import { injectable, inject } from 'inversify';
import axios, { AxiosInstance } from 'axios';
import { TYPES } from '../ioc/types.js';
import type { AuthService } from '../auth/auth-service.js';
import type { ILogger } from '../logger.js';
import 'reflect-metadata';

export interface ModuleInfo {
  id: string;
  slug: string;
  version: string;
  displayName: string;
  description: string;
  pricing: any;
}

export interface DownloadToken {
  url: string;
  sha256: string;
  signature: string;
  publicKey: string;
}

export interface IMarketplaceClient {
  listModules(query?: string): Promise<ModuleInfo[]>;
  getModule(slug: string): Promise<ModuleInfo>;
  getDownloadToken(slug: string, version: string, licenseKey?: string): Promise<DownloadToken>;
}

@injectable()
export class MarketplaceClient implements IMarketplaceClient {
  private client: AxiosInstance;
  // TODO: Move to config
  private baseUrl = 'https://api.kaven.dev/marketplace';

  constructor(
    @inject(TYPES.AuthService) private auth: AuthService,
    @inject(TYPES.Logger) private logger: ILogger
  ) {
    this.client = axios.create({ baseURL: this.baseUrl, timeout: 10000 });
    
    // Auth Interceptor is handled by AuthService logic, or explicitly here?
    // AuthService in Phase 1 stub provides getCredentials via credential manager.
    // But `AuthService` class I wrote uses `getAccessToken` ? Let's check imports.
    // The previous view_file of AuthService didn't have `getAccessToken`.
    // I need to update AuthService interface and impl to expose `getAccessToken` or `getCredentials`.
  }

  async listModules(query?: string): Promise<ModuleInfo[]> {
    this.logger.debug(`Fetching modules query=${query || '*'}`);
    try {
      // Mock implementation until API is live
      return [
        { 
            id: '1', slug: 'observability', version: '1.0.0', 
            displayName: 'Observability Stack', description: 'Metrics & Logs', pricing: { type: 'free' } 
        },
        { 
            id: '2', slug: 'payments', version: '1.2.0', 
            displayName: 'Payments Core', description: 'Stripe/Pix', pricing: { type: 'paid' } 
        }
      ];
      // const res = await this.client.get('/modules', { params: { q: query } });
      // return res.data.items;
    } catch (error: any) {
      this.logger.error(`Failed to list modules: ${error.message}`);
      throw error;
    }
  }

  async getModule(slug: string): Promise<ModuleInfo> {
      // Mock
      return { 
          id: '1', slug, version: '1.0.0', 
          displayName: 'Mock Module', description: 'Mock Description', pricing: {} 
      };
  }

  async getDownloadToken(slug: string, version: string, licenseKey?: string): Promise<DownloadToken> {
      // Mock Download Token
      // In real life, this calls POST /modules/:slug/download-token with { licenseKey }
      if (licenseKey) {
          this.logger.debug(`Requesting download token with License Key: ${licenseKey.substring(0, 8)}...`);
      }

      // Check for 'paid' slug without key (Mock logic)
      if (slug === 'payments' && !licenseKey) {
          // This simulates backend 402/403
          throw new Error('Payment required: This module requires a license key. Use --key <YOUR_KEY>');
      }

      return {
          url: 'https://storage.kaven.dev/mock.tgz', // Mock URL
          sha256: 'mock-sha',
          signature: 'mock-sig',
          publicKey: 'mock-pub'
      };
  }
}
