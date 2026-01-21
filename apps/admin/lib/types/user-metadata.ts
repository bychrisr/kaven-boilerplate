/**
 * Internal Roles para Admin Tenant
 * Usados no campo metadata.internalRole
 */
export type InternalRole = 
  | 'ARCHITECT'   // Super Admin - Acesso total ao sistema (Mapeia para Space ADMIN)
  | 'SUPPORT'     // Customer Success
  | 'FINANCE'     // CFO
  | 'MARKETING'   // Growth
  | 'DEVOPS'      // System Health
  | 'EXECUTIVE';  // Gestão Executiva

/**
 * Estrutura do campo metadata no User
 * Usado para permissões granulares do Admin Tenant
 */
export interface UserMetadata {
  /** Role interna para Admin Tenant */
  internalRole?: InternalRole;
  
  /** Permissões granulares específicas */
  permissions?: string[];
  
  /** Preferências do usuário */
  preferences?: {
    theme?: 'light' | 'dark';
    language?: 'pt-BR' | 'en-US';
  };
}

/**
 * Permissões por Internal Role
 * Define o que cada persona pode fazer no sistema
 */
export const INTERNAL_ROLE_PERMISSIONS: Record<InternalRole, string[]> = {
  ARCHITECT: ['*'], // Acesso total - bypass RLS
  
  SUPPORT: [
    'view:tenants',
    'view:users',
    'action:impersonate',
    'action:reset_2fa',
    'view:audit_logs'
  ],
  
  FINANCE: [
    'view:banking_dashboard',
    'manage:stripe_plans',
    'action:refund',
    'view:invoices',
    'view:subscriptions',
    'manage:payments'
  ],
  
  MARKETING: [
    'view:analytics',
    'manage:crm',
    'manage:referrals',
    'action:send_broadcast',
    'view:user_metrics'
  ],
  DEVOPS: [
    'view:grafana',
    'view:logs',
    'view:health_check',
    'view:audit_logs',
    'view:security_logs'
  ],
  
  EXECUTIVE: [
    'view:analytics',
    'view:management_dashboard',
    'view:reports',
    'view:audit_logs'
  ]
};

/**
 * Helper para obter permissões de um internal role
 */
export function getPermissionsForRole(role: InternalRole): string[] {
  return INTERNAL_ROLE_PERMISSIONS[role] || [];
}

/**
 * Helper para verificar se usuário tem permissão específica
 */
export function hasPermission(metadata: UserMetadata | null, permission: string): boolean {
  if (!metadata || !metadata.permissions) return false;
  
  // ARCHITECT tem acesso total
  if (metadata.permissions.includes('*')) return true;
  
  // Verifica permissão específica
  return metadata.permissions.includes(permission);
}
