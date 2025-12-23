import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errors';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'USER';
  status?: 'ACTIVE' | 'PENDING' | 'BANNED' | 'REJECTED';
  tenantId?: string;
  tenant?: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role?: 'USER' | 'TENANT_ADMIN';
  tenantId?: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  role?: 'USER' | 'TENANT_ADMIN' | 'SUPER_ADMIN';
  tenantId?: string;
}

interface UserStats {
  total: number;
  active: number;
  pending: number;
  banned: number;
  rejected: number;
}

export function useUserStats() {
  return useQuery<UserStats>({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const response = await api.get('/api/users/stats');
      return response.data;
    },
  });
}

// Query: Listar usuários
export function useUsers(params?: { page?: number; limit?: number; tenantId?: string }) {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  const tenantId = params?.tenantId;

  return useQuery<UsersResponse>({
    queryKey: ['users', page, limit, tenantId],
    queryFn: async () => {
      const response = await api.get('/api/users', {
        params: { page, limit, tenantId },
      });
      return response.data;
    },
  });
}

// Query: Buscar usuário por ID
export function useUser(id: string) {
  return useQuery<User>({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await api.get(`/api/users/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Query: Usuário atual
export function useCurrentUser() {
  return useQuery<User>({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const response = await api.get('/api/users/me');
      return response.data;
    },
  });
}

// Mutation: Criar usuário
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserData) => {
      const response = await api.post('/api/users', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuário criado com sucesso!');
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      toast.error(message || 'Erro ao criar usuário');
    },
  });
}

// Mutation: Atualizar usuário
export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserData) => {
      const response = await api.put(`/api/users/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      toast.success('Usuário atualizado com sucesso!');
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      toast.error(message || 'Erro ao atualizar usuário');
    },
  });
}

// Mutation: Deletar usuário
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/api/users/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      toast.success('Usuário deletado com sucesso!');
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      toast.error(message || 'Erro ao deletar usuário');
    },
  });
}
