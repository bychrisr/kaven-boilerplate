import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import { useSpaces } from '@/hooks/use-spaces';

interface CapabilitiesResponse {
  capabilities: string[];
  grants: Array<{
    id: string;
    capabilityCode: string;
    type: string;
    accessLevel: string;
    expiresAt?: string;
    justification: string;
  }>;
}

export function useCapabilities() {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const { currentSpace } = useSpaces();

  const query = useQuery<CapabilitiesResponse>({
    queryKey: ['capabilities', currentSpace?.id],
    queryFn: async () => {
      const response = await api.get('/api/users/me/capabilities', {
        headers: {
          'x-space-id': currentSpace?.id
        }
      });
      return response.data;
    },
    enabled: isInitialized,
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
    retry: 1,
  });

  /**
   * Verifica se o usuário possui a capability necessária.
   * Retorna true se:
   * 1. capabilityCode não for fornecido (item público)
   * 2. Usuário for SUPER_ADMIN (retorna '*')
   * 3. Usuário tiver a capability específica
   */
  const check = useCallback((capabilityCode?: string) => {
    if (!capabilityCode) return true;
    
    // Se ainda está carregando ou deu erro, assume falso por segurança (fail-secure)
    // EXCETO se quisermos mostrar skeleton, mas para menu é melhor esconder
    if (!query.data?.capabilities) return false;

    // Super Admin bypass (backend retorna '*')
    if (query.data.capabilities.includes('*')) return true;

    return query.data.capabilities.includes(capabilityCode);
  }, [query.data]);

  return {
    capabilities: query.data?.capabilities || [],
    grants: query.data?.grants || [],
    isLoading: query.isLoading,
    error: query.error,
    check,
  };
}
