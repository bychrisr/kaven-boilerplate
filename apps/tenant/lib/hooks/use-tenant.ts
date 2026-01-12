import { useTenantStore } from '../store/tenant-store';

export const useTenant = () => {
  const { tenant, isLoading, error, setTenant } = useTenantStore();

  return {
    tenant,
    isLoading,
    error,
    setTenant,
    // Add helpers
    tenantName: tenant?.name || 'Kaven Tenant',
    tenantId: tenant?.id,
  };
};
