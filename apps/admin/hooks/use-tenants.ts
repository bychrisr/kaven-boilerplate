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

export function useTenants() {
  const queryClient = useQueryClient();

  const {
    data: tenants,
    isLoading,
    error,
  } = useQuery<Tenant[]>({
    queryKey: ['tenants'],
    queryFn: async () => {
      const response = await api.get('/tenants');
      return response.data;
    },
  });

  const createTenant = useMutation({
    mutationFn: async (data: CreateTenantDTO) => {
      const response = await api.post('/tenants', data);
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
      const response = await api.put(`/tenants/${id}`, data);
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
      await api.delete(`/tenants/${id}`);
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
    tenants,
    isLoading,
    error,
    createTenant,
    updateTenant,
    deleteTenant,
  };
}
