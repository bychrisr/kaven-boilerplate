import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useSpaces } from '@/hooks/use-spaces';

export interface Capability {
  id: string;
  code: string;
  resource: string;
  action: string;
  description?: string;
  category: string;
}

export interface RoleCapability {
  capability: Capability;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  spaceId: string;
  isSystem: boolean;
  capabilities: RoleCapability[];
  _count?: {
    users: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface CreateRoleData {
  name: string;
  description?: string;
  spaceId: string;
  capabilities: string[];
}

interface UpdateRoleData {
  id: string;
  name?: string;
  description?: string;
  capabilities?: string[];
}

export function useRoles(spaceId?: string) {
  const { currentSpace } = useSpaces();
  const targetSpaceId = spaceId || currentSpace?.id;

  return useQuery<Role[]>({
    queryKey: ['roles', targetSpaceId],
    queryFn: async () => {
      if (!targetSpaceId) return [];
      const response = await api.get(`/api/spaces/${targetSpaceId}/roles`);
      return response.data;
    },
    enabled: !!targetSpaceId,
  });
}

export function useCapabilitiesList() {
  return useQuery<Capability[]>({
    queryKey: ['capabilities-list'],
    queryFn: async () => {
      const response = await api.get('/api/capabilities');
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useRole(id: string) {
  return useQuery<Role>({
    queryKey: ['role', id],
    queryFn: async () => {
      const response = await api.get(`/api/roles/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRoleData) => {
      const response = await api.post(`/api/spaces/${data.spaceId}/roles`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles', variables.spaceId] });
      toast.success('Role criada com sucesso!');
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.error || 'Erro ao criar role');
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateRoleData) => {
      const response = await api.put(`/api/roles/${data.id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: ['roles', data.spaceId] });
      // Invalidate detail
      queryClient.invalidateQueries({ queryKey: ['role', data.id] });
      toast.success('Role atualizada com sucesso!');
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.error || 'Erro ao atualizar role');
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/roles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role removida com sucesso!');
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.error || 'Erro ao remover role');
    },
  });
}
