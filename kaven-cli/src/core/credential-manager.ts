import { injectable } from 'inversify';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import 'reflect-metadata';

// Service/Account for Keychain
const SERVICE_NAME = 'kaven-cli';
const ACCOUNT_NAME = 'kaven-user';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt?: string;
  scope?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface ICredentialManager {
  saveCredentials(tokens: AuthTokens): Promise<void>;
  getCredentials(): Promise<AuthTokens | null>;
  deleteCredentials(): Promise<void>;
}

@injectable()
export class CredentialManager implements ICredentialManager {
  private fallbackPath: string;

  constructor() {
    const homeDir = os.homedir();
    // Use .kaven/credentials.json as secure fallback
    this.fallbackPath = path.join(homeDir, '.kaven', 'credentials.json');
  }

  private async getKeytar(): Promise<any> {
    try {
        // Dynamic import to avoid crash if keytar is not installed/built
        // @ts-ignore
        const keytar = await import('keytar');
        return keytar.default || keytar;
    } catch (e) {
        return null;
    }
  }

  async saveCredentials(tokens: AuthTokens): Promise<void> {
    const payload = JSON.stringify(tokens);
    let usedKeychain = false;

    const keytar = await this.getKeytar();
    if (keytar) {
        try {
            await keytar.setPassword(SERVICE_NAME, ACCOUNT_NAME, payload);
            usedKeychain = true;
        } catch (error) {
            // Keychain failed, proceed to fallback
        }
    }

    // Always fallback if keychain didn't work (or if we want redundancy, but usually backup is redundant if keychain works)
    // Here we use fallback only if keychain failed or is missing.
    if (!usedKeychain) {
        await this.saveFallback(tokens);
    } else {
        // If keychain worked, ensure we clean up fallback to avoid stale data
        if (await fs.pathExists(this.fallbackPath)) {
            await fs.remove(this.fallbackPath);
        }
    }
  }

  async getCredentials(): Promise<AuthTokens | null> {
    const keytar = await this.getKeytar();
    if (keytar) {
        try {
            const payload = await keytar.getPassword(SERVICE_NAME, ACCOUNT_NAME);
            if (payload) {
                return JSON.parse(payload);
            }
        } catch (error) {
            // Ignore keychain errors
        }
    }

    return this.getFallback();
  }

  async deleteCredentials(): Promise<void> {
    const keytar = await this.getKeytar();
    if (keytar) {
        try {
            await keytar.deletePassword(SERVICE_NAME, ACCOUNT_NAME);
        } catch (e) { }
    }
    
    if (await fs.pathExists(this.fallbackPath)) {
        await fs.remove(this.fallbackPath);
    }
  }

  private async saveFallback(tokens: AuthTokens): Promise<void> {
    try {
      await fs.ensureDir(path.dirname(this.fallbackPath));
      await fs.writeJson(this.fallbackPath, tokens, { spaces: 0 });
      // 0600 = Read/Write by owner only - Critical for Security
      await fs.chmod(this.fallbackPath, 0o600);
    } catch (error: any) {
      throw new Error(`Credential save failed: ${error.message}`);
    }
  }

  private async getFallback(): Promise<AuthTokens | null> {
    if (!await fs.pathExists(this.fallbackPath)) {
      return null;
    }
    try {
      return await fs.readJson(this.fallbackPath);
    } catch (error) {
      return null;
    }
  }
}
