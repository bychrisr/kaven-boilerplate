import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errors';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string | null;
  logo?: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTenantDTO {
  name: string;
  slug: string;
  domain?: string;
  logo?: string;
}

export interface UpdateTenantDTO extends Partial<CreateTenantDTO> {
  active?: boolean;
}

interface TenantsResponse {
  tenants: Tenant[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useTenants(page: number = 1, limit: number = 100) {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
  } = useQuery<TenantsResponse>({
    queryKey: ['tenants', page, limit],
    queryFn: async () => {
      const response = await api.get('/api/tenants', {
        params: { page, limit },
      });
      return response.data;
    },
  });

  const createTenant = useMutation({
    mutationFn: async (data: CreateTenantDTO) => {
      const response = await api.post('/api/tenants', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('Tenant criado com sucesso!');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  const updateTenant = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTenantDTO }) => {
      const response = await api.put(`/api/tenants/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('Tenant atualizado com sucesso!');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  const deleteTenant = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/tenants/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('Tenant removido com sucesso!');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  return {
    tenants: data?.tenants || [],
    pagination: data?.pagination,
    isLoading,
    error,
    createTenant,
    updateTenant,
    deleteTenant,
  };
}
