import { injectable, inject } from 'inversify';
import { TYPES } from '../ioc/types.js';
import type { IAuthService } from '../auth/auth.service.js';
import type { ILogger } from '../logger.js';
import type { ICredentialManager } from '../credential-manager.js';
import 'reflect-metadata';

export interface Entitlement {
  moduleId: string;
  status: 'active' | 'expired' | 'revoked';
  expiryDate?: string;
  plan?: string;
}

export interface IPassportService {
  /**
   * Main gate: checks if current user/machine is allowed to use/install the module.
   */
  checkEntitlement(moduleSlug: string): Promise<boolean>;
  
  /**
   * Validates a raw license key format (offline check) and online status.
   */
  validateLicenseKey(key: string): Promise<{ valid: boolean; moduleId?: string }>;
}

@injectable()
export class PassportService implements IPassportService {
  constructor(
    @inject(TYPES.AuthService) private auth: IAuthService,
    @inject(TYPES.CredentialManager) private creds: ICredentialManager,
    @inject(TYPES.Logger) private logger: ILogger
  ) {}

  async checkEntitlement(moduleSlug: string): Promise<boolean> {
    // 1. Check if authenticated
    const isAuth = await this.auth.isAuthenticated();
    if (!isAuth) {
      this.logger.debug(`Passport: User not authenticated. Checking offline keys...`);
      // Fallback: Check local license keys store (if implemented)
      // For now, strict gating: Must be login OR provide key in command args (handled by command layer)
      return false;
    }

    // 2. Fetch User Entitlements (Cached or Live)
    // TODO: MarketplaceClient integration here to fetch /api/me/entitlements
    // Mock for Phase 1:
    this.logger.debug(`Passport: Checking entitlement for ${moduleSlug} via API (MOCK)`);
    
    // Simulating Allow-All for 'observability' and 'payments' in dev mode
    if (['observability', 'payments'].includes(moduleSlug)) {
      return true;
    }

    return false;
  }

  async validateLicenseKey(key: string): Promise<{ valid: boolean; moduleId?: string }> {
    // Basic format check: KVN-XXXX-YYYY-ZZZZ
    const pattern = /^KVN-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    if (!pattern.test(key)) {
      return { valid: false };
    }

    // TODO: Online verification via MarketplaceAPI
    this.logger.debug(`Passport: Validating key format ${key} (Offline OK)`);
    return { valid: true };
  }
}
