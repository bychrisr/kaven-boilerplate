/**
 * Authorization Types
 * 
 * Tipos TypeScript para o sistema de autorização baseado em Capabilities.
 * Suporta Spaces, Roles, Grants, Policies e Auditoria completa.
 */

import { CapabilityScope, GrantType, AccessLevel, CapabilitySensitivity } from '@prisma/client';

// ===========================
// REQUEST CONTEXT
// ===========================

/**
 * Contexto completo de uma requisição para autorização
 * Inclui rastreamento de IP, Device, UserAgent e Origem
 */
export interface AuthorizationContext {
  userId: string;
  tenantId?: string;
  spaceId?: string;
  
  // User info
  user?: {
    id: string;
    email: string;
    role: string;
    twoFactorEnabled: boolean;
  };
  
  // Session info
  session?: {
    id: string;
    mfaVerified: boolean;
    mfaVerifiedAt?: Date;
  };
  
  // Request tracking (para auditoria e policies)
  ip?: string;
  userAgent?: string;
  deviceId?: string;
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  origin?: 'web' | 'mobile' | 'api';
}

// ===========================
// AUTHORIZATION RESULT
// ===========================

/**
 * Resultado de uma verificação de autorização
 */
export interface AuthorizationResult {
  allowed: boolean;
  reason: AuthorizationReason;
  
  // Informações adicionais quando permitido
  accessLevel?: AccessLevel;
  grantId?: string;
  
  // Metadata adicional
  metadata?: {
    requiresMFA?: boolean;
    expiresAt?: Date;
    grantedBy?: string;
    policies?: string[];
  };
}

/**
 * Razões possíveis para permitir ou negar acesso
 */
export type AuthorizationReason =
  // Allowed reasons
  | 'SUPER_ADMIN'
  | 'ROLE_CAPABILITY'
  | 'ADD_GRANT'
  | 'SPACE_DEFAULT_PERMISSION'
  
  // Denied reasons
  | 'CAPABILITY_NOT_FOUND'
  | 'CAPABILITY_INACTIVE'
  | 'DENY_GRANT'
  | 'NO_PERMISSION'
  | 'MFA_NOT_ENABLED'
  | 'MFA_NOT_VERIFIED'
  | 'MFA_EXPIRED'
  | 'IP_NOT_ALLOWED'
  | 'DEVICE_NOT_TRUSTED'
  | 'TIME_RESTRICTION'
  | 'RATE_LIMIT_EXCEEDED'
  | 'GRANT_EXPIRED'
  | 'APPROVAL_REQUIRED'
  | 'SCOPE_MISMATCH';

// ===========================
// CHECK CAPABILITY PARAMS
// ===========================

/**
 * Parâmetros para verificação de capability
 */
export interface CheckCapabilityParams {
  userId: string;
  capabilityCode: string;
  spaceId?: string;
  scope?: CapabilityScope;
  context?: AuthorizationContext;
}

// ===========================
// DEVICE TRACKING
// ===========================

/**
 * Informações de um dispositivo rastreado
 */
export interface DeviceInfo {
  deviceId: string;
  deviceName?: string;
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  isTrusted: boolean;
  firstSeenAt: Date;
  lastSeenAt: Date;
}

/**
 * Parâmetros para rastreamento de dispositivo
 */
export interface TrackDeviceParams {
  userId: string;
  userAgent: string;
  ip: string;
}

// ===========================
// IP VALIDATION
// ===========================

/**
 * Parâmetros para validação de IP
 */
export interface ValidateIpParams {
  ip: string;
  policyId?: string;
  whitelists?: Array<{
    ipAddress: string;
    isActive: boolean;
  }>;
}

// ===========================
// AUDIT PARAMS
// ===========================

/**
 * Parâmetros para registro de auditoria
 */
export interface AuditCapabilityParams {
  userId: string;
  capabilityId: string;
  spaceId?: string;
  action: 'check' | 'granted' | 'denied';
  result: 'allowed' | 'denied';
  reason: AuthorizationReason;
  grantId?: string;
  context?: AuthorizationContext;
  metadata?: Record<string, any>;
}

// ===========================
// POLICY VALIDATION
// ===========================

/**
 * Resultado de validação de políticas
 */
export interface PolicyValidationResult {
  allowed: boolean;
  reason?: AuthorizationReason;
  failedPolicy?: {
    id: string;
    type: string;
    enforcement: string;
  };
}

/**
 * Capability com informações de policies
 */
export interface CapabilityWithPolicies {
  id: string;
  code: string;
  sensitivity: CapabilitySensitivity;
  requiresMFA: boolean;
  requiresApproval: boolean;
  isActive: boolean;
}

// ===========================
// USER CAPABILITIES
// ===========================

/**
 * Capabilities resolvidas de um usuário
 */
export interface UserCapabilities {
  userId: string;
  spaceId?: string;
  capabilities: string[];
  grants: Array<{
    id: string;
    capabilityCode: string;
    type: GrantType;
    accessLevel: AccessLevel;
    expiresAt?: Date;
  }>;
}

// ===========================
// GRANT INFO
// ===========================

/**
 * Informações detalhadas de um grant
 */
export interface GrantInfo {
  id: string;
  type: GrantType;
  accessLevel: AccessLevel;
  expiresAt?: Date;
  grantedBy: string;
  grantedAt: Date;
  justification: string;
  status: string;
}

// ===========================
// ERROR TYPES
// ===========================

/**
 * Erro de autorização customizado
 */
export class AuthorizationError extends Error {
  constructor(
    public reason: AuthorizationReason,
    public statusCode: number = 403,
    public metadata?: Record<string, any>
  ) {
    super(`Authorization failed: ${reason}`);
    this.name = 'AuthorizationError';
  }
}

/**
 * Mapeamento de razões para mensagens de erro amigáveis
 */
export const ERROR_MESSAGES: Record<AuthorizationReason, string> = {
  // Allowed (não são erros, mas incluídos para completude)
  SUPER_ADMIN: 'Acesso concedido como Super Admin',
  ROLE_CAPABILITY: 'Acesso concedido via role',
  ADD_GRANT: 'Acesso concedido via grant temporário',
  SPACE_DEFAULT_PERMISSION: 'Acesso concedido via permissão padrão do space',
  
  // Denied
  CAPABILITY_NOT_FOUND: 'Capability não encontrada',
  CAPABILITY_INACTIVE: 'Capability está inativa',
  DENY_GRANT: 'Acesso explicitamente negado por grant',
  NO_PERMISSION: 'Você não possui permissão para esta ação',
  MFA_NOT_ENABLED: 'Esta ação requer autenticação de dois fatores (2FA)',
  MFA_NOT_VERIFIED: 'Por favor, verifique seu 2FA para continuar',
  MFA_EXPIRED: 'Sua verificação 2FA expirou. Por favor, verifique novamente',
  IP_NOT_ALLOWED: 'Seu endereço IP não está autorizado para esta ação',
  DEVICE_NOT_TRUSTED: 'Este dispositivo não é confiável. Entre em contato com o administrador',
  TIME_RESTRICTION: 'Esta ação não está disponível neste horário',
  RATE_LIMIT_EXCEEDED: 'Você excedeu o limite de requisições. Tente novamente mais tarde',
  GRANT_EXPIRED: 'Seu acesso temporário expirou',
  APPROVAL_REQUIRED: 'Esta ação requer aprovação de um administrador',
  SCOPE_MISMATCH: 'Escopo de acesso incompatível',
};
