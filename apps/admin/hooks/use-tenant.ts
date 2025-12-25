import { useEffect } from 'react';
import { useTenantStore } from '@/stores/tenant.store';

/**
 * Hook para buscar e gerenciar dados do tenant atual
 */
export function useTenant() {
  const { tenant, isLoading, error, fetchTenant } = useTenantStore();
  
  useEffect(() => {
    if (!tenant && !isLoading) {
      fetchTenant();
    }
  }, [tenant, isLoading, fetchTenant]);
  
  return { tenant, isLoading, error };
}
