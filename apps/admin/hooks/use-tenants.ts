import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errors';
import { useAuthStore } from '@/stores/auth.store';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string | null;
  logo?: string | null;
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
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
  status?: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
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

export function useTenants(params?: { 
  page?: number; 
  limit?: number;
  search?: string;
  status?: string;
}) {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const queryClient = useQueryClient();
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  const search = params?.search;
  const status = params?.status;

  const { data, isLoading, error } = useQuery<TenantsResponse>({
    queryKey: ['tenants', page, limit, search, status],
    queryFn: async () => {
      const queryParams = { 
        page, 
        limit,
        search,
        status,
      };
      const response = await api.get('/api/tenants', { params: queryParams });
      return response.data;
    },
    enabled: isInitialized,
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['tenant', variables.id] });
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

export function useTenant(idOrSlug: string) {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  
  return useQuery<Tenant>({
    queryKey: ['tenant', idOrSlug],
    queryFn: async () => {
      const response = await api.get(`/api/tenants/${idOrSlug}`);
      return response.data;
    },
    enabled: isInitialized && !!idOrSlug,
  });
}

export function useTenantStats() {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  
  return useQuery({
    queryKey: ['tenant-stats'],
    queryFn: async () => {
      const response = await api.get('/api/tenants/stats');
      return response.data;
    },
    enabled: isInitialized,
  });
}
