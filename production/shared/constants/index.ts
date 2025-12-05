// Shared constants
export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  TENANT_ADMIN: 'TENANT_ADMIN',
  USER: 'USER',
} as const;

export const TENANT_STATUS = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  TRIAL: 'TRIAL',
} as const;
