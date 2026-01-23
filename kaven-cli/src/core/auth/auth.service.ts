import { injectable, inject } from 'inversify';
import axios, { AxiosInstance, AxiosError } from 'axios';
import open from 'open';
import { z } from 'zod';
import { TYPES } from '../ioc/types.js';
import type { ICredentialManager } from '../credential-manager.js';
import type { ILogger } from '../logger.js';
import 'reflect-metadata';

// --- Zod Schemas ---
const DeviceCodeResponseSchema = z.object({
  device_code: z.string(),
  user_code: z.string(),
  verification_uri: z.string(),
  verification_uri_complete: z.string().optional(),
  expires_in: z.number(),
  interval: z.number().default(5),
});

const TokenResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(),
  token_type: z.string(),
  scope: z.string().optional(),
});

const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
});

export type DeviceCodeResponse = z.infer<typeof DeviceCodeResponseSchema>;
export type TokenResponse = z.infer<typeof TokenResponseSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;

export interface IAuthService {
  login(apiBaseUrl: string): Promise<UserProfile>;
  logout(): Promise<void>;
  isAuthenticated(): Promise<boolean>;
  whoami(apiBaseUrl: string): Promise<UserProfile | null>;
  getAccessToken(): Promise<string | null>;
}

@injectable()
export class AuthService implements IAuthService {
  private client: AxiosInstance;
  private readonly clientId = 'kaven-cli';

  constructor(
    @inject(TYPES.CredentialManager) private credManager: ICredentialManager,
    @inject(TYPES.Logger) private logger: ILogger
  ) {
    this.client = axios.create({
      timeout: 15000,
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'KavenCLI/2.0' },
    });
  }

  async login(apiBaseUrl: string): Promise<UserProfile> {
    this.client.defaults.baseURL = apiBaseUrl;
    this.logger.startSpinner('Iniciando autenticação...');

    try {
      // 1. Request Code
      const deviceCode = await this.requestDeviceCode();
      this.logger.stopSpinner(true, 'Código gerado.');
      
      this.logger.info(`\n👉 Código: ${deviceCode.user_code}`);
      this.logger.info(`👉 Url: ${deviceCode.verification_uri_complete}\n`);

      try {
        await open(deviceCode.verification_uri_complete || deviceCode.verification_uri);
      } catch (e) {
        this.logger.warn('Não foi possível abrir o navegador. Copie a URL acima.');
      }

      // 2. Poll for Token
      this.logger.startSpinner('Aguardando autorização...');
      const tokens = await this.pollForToken(deviceCode);
      
      // 3. Save
      await this.credManager.saveCredentials({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        scope: tokens.scope
      });

      this.logger.stopSpinner(true, 'Login realizado com sucesso!');
      return await this.whoami(apiBaseUrl) as UserProfile;

    } catch (error: any) {
      this.logger.stopSpinner(false, 'Falha no login.');
      throw error;
    }
  }

  async logout(): Promise<void> {
    await this.credManager.deleteCredentials();
  }

  async isAuthenticated(): Promise<boolean> {
    // TODO: add expiration check logic
    const creds = await this.credManager.getCredentials();
    return !!creds?.accessToken;
  }

  async getAccessToken(): Promise<string | null> {
      const creds = await this.credManager.getCredentials();
      return creds?.accessToken || null;
  }

  async whoami(apiBaseUrl: string): Promise<UserProfile | null> {
    const creds = await this.credManager.getCredentials();
    if (!creds?.accessToken) return null;

    try {
      const res = await this.client.get(`${apiBaseUrl}/api/me`, {
        headers: { Authorization: `Bearer ${creds.accessToken}` }
      });
      return UserProfileSchema.parse(res.data);
    } catch (error) {
      return null;
    }
  }

  // --- Internals ---

  private async requestDeviceCode(): Promise<DeviceCodeResponse> {
    const res = await this.client.post('/oauth/device/code', {
      client_id: this.clientId,
      scope: 'marketplace:read marketplace:download openid profile',
    });
    return DeviceCodeResponseSchema.parse(res.data);
  }

  private async pollForToken(deviceCode: DeviceCodeResponse): Promise<TokenResponse> {
    const { device_code, interval, expires_in } = deviceCode;
    const start = Date.now();
    let currentInterval = interval * 1000;

    while (Date.now() - start < expires_in * 1000) {
      await new Promise(r => setTimeout(r, currentInterval));

      try {
        const res = await this.client.post('/oauth/token', {
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
          device_code,
          client_id: this.clientId,
        });
        return TokenResponseSchema.parse(res.data);
      } catch (error: any) {
        const errType = error.response?.data?.error;
        if (errType === 'authorization_pending') continue;
        if (errType === 'slow_down') {
          currentInterval += 2000;
          continue;
        }
        if (errType === 'expired_token') throw new Error('Token expirado.');
        if (errType === 'access_denied') throw new Error('Acesso negado.');
        throw error;
      }
    }
    throw new Error('Timeout.');
  }
}
