/**
 * Masking Configuration
 * 
 * Define quais campos de quais entidades são considerados sensíveis
 * e qual Capability é necessária para visualizar o dado original.
 */

export enum MaskingType {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  NAME = 'NAME',
  TOKEN = 'TOKEN',
  ADDRESS = 'ADDRESS',
  GENERIC = 'GENERIC',
}

export interface MaskingRule {
  type: MaskingType;
  requiredCapability: string; // Ex: 'users.view_pii'
}

export interface EntityMaskingConfig {
  [field: string]: MaskingRule;
}

export interface MaskingConfig {
  [entityName: string]: EntityMaskingConfig;
}

export const MASKING_CONFIG: MaskingConfig = {
  User: {
    email: { type: MaskingType.EMAIL, requiredCapability: 'users.view_pii' },
    phoneNumber: { type: MaskingType.PHONE, requiredCapability: 'users.view_pii' },
    address: { type: MaskingType.ADDRESS, requiredCapability: 'users.view_pii' },
    company: { type: MaskingType.GENERIC, requiredCapability: 'users.view_pii' },
  },
  EmailIntegration: {
    apiKey: { type: MaskingType.TOKEN, requiredCapability: 'platform.view_secrets' },
    apiSecret: { type: MaskingType.TOKEN, requiredCapability: 'platform.view_secrets' },
    webhookSecret: { type: MaskingType.TOKEN, requiredCapability: 'platform.view_secrets' },
    smtpPassword: { type: MaskingType.TOKEN, requiredCapability: 'platform.view_secrets' },
  },
  AuditLog: {
    ipAddress: { type: MaskingType.GENERIC, requiredCapability: 'audit.view_pii' },
  },
};
