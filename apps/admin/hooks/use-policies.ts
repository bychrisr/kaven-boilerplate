import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '@/lib/api';
import { toast } from 'sonner';

export type PolicyType = 'IP_WHITELIST' | 'DEVICE_TRUST' | 'TIME_BASED' | 'GEO_RESTRICTION';
export type PolicyTargetType = 'SPACE' | 'ROLE' | 'CAPABILITY' | 'USER' | 'GLOBAL';
export type PolicyEnforcement = 'DENY' | 'ALLOW' | 'WARN' | 'REQUIRE_MFA';

interface ApiErrorResponse {
  error: string;
  message?: string;
}

export interface Policy {
  id: string;
  name: string;
  description?: string;
  type: PolicyType;
  targetType: PolicyTargetType;
  targetId?: string;
  conditions: Record<string, unknown>;
  enforcement: PolicyEnforcement;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ListPoliciesFilters {
  type?: PolicyType;
  targetType?: PolicyTargetType;
  targetId?: string;
  isActive?: boolean;
}

interface CreatePolicyData {
  name: string;
  description?: string;
  type: PolicyType;
  targetType: PolicyTargetType;
  targetId?: string;
  conditions: Record<string, unknown>;
  enforcement: PolicyEnforcement;
  isActive?: boolean;
}

interface UpdatePolicyData {
  id: string;
  name?: string;
  description?: string;
  conditions?: Record<string, unknown>;
  enforcement?: PolicyEnforcement;
  isActive?: boolean;
}

export function usePolicies(filters: ListPoliciesFilters = {}) {
  return useQuery<{ policies: Policy[] }>({
    queryKey: ['policies', filters],
    queryFn: async () => {
      const response = await api.get('/api/policies', { params: filters });
      return response.data;
    },
  });
}

export function usePolicy(id: string) {
  return useQuery<{ policy: Policy }>({
    queryKey: ['policy', id],
    queryFn: async () => {
      const response = await api.get(`/api/policies/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreatePolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePolicyData) => {
      const response = await api.post('/api/policies', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      toast.success('Política criada com sucesso!');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(error.response?.data?.error || 'Erro ao criar política');
    },
  });
}

export function useUpdatePolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdatePolicyData) => {
      const { id, ...rest } = data;
      const response = await api.put(`/api/policies/${id}`, rest);
      return response.data;
    },
    onSuccess: (data: { policy: Policy }) => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      if (data.policy?.id) {
        queryClient.invalidateQueries({ queryKey: ['policy', data.policy.id] });
      }
      toast.success('Política atualizada com sucesso!');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(error.response?.data?.error || 'Erro ao atualizar política');
    },
  });
}

export function useDeletePolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/policies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      toast.success('Política removida com sucesso!');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(error.response?.data?.error || 'Erro ao remover política');
    },
  });
}

export function useEvaluatePolicy() {
  return useMutation({
    mutationFn: async (data: { id: string; context: Record<string, unknown> }) => {
      const response = await api.post(`/api/policies/${data.id}/evaluate`, data.context);
      return response.data;
    },
  });
}
