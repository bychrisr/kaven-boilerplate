// Shared TypeScript types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'USER';
  tenantId?: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL';
}
