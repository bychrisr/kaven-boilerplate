import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errors';
import { useAuthStore } from '@/stores/auth.store';

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
  emailVerified?: boolean;
  avatarUrl?: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  zipcode?: string;
  company?: string;
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
  status?: 'ACTIVE' | 'PENDING';
  tenantId?: string;
  emailVerified?: boolean;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  zipcode?: string;
  company?: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  role?: 'USER' | 'TENANT_ADMIN' | 'SUPER_ADMIN';
  tenantId?: string | null;
  status?: 'ACTIVE' | 'PENDING' | 'BANNED' | 'REJECTED';
  emailVerified?: boolean;
  phone?: string | null;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  zipcode?: string;
  company?: string;
}

interface UserStats {
  total: number;
  active: number;
  pending: number;
  banned: number;
  rejected: number;
}

export function useUserStats() {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  
  return useQuery<UserStats>({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const response = await api.get('/api/users/stats');
      return response.data;
    },
    enabled: isInitialized,
  });
}

// Query: Listar usuários
export function useUsers(params?: { 
  page?: number; 
  limit?: number; 
  tenantId?: string;
  search?: string;
  status?: string;
}) {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  const tenantId = params?.tenantId;
  const search = params?.search;
  const status = params?.status;

  return useQuery<UsersResponse>({
    queryKey: ['users', page, limit, tenantId, search, status],
    queryFn: async () => {
      const params = { 
        page, 
        limit, 
        tenantId,
        search: search || undefined,
        status: status && status !== 'all' ? status : undefined,
      };
      
      console.log('🔍 [useUsers] Params received:', { page, limit, tenantId, search, status });
      console.log('🔍 [useUsers] Params to send:', params);
      
      const response = await api.get('/api/users', { params });
      
      console.log('✅ [useUsers] Response:', {
        total: response.data.pagination?.total,
        returned: response.data.users?.length,
        filters: { search, status }
      });
      
      return response.data;
    },
    enabled: isInitialized,
  });
}

// Query: Buscar usuário por ID
export function useUser(id: string) {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  
  console.log('🔍 [useUser] Hook called with ID:', id);
  console.log('🔍 [useUser] isInitialized:', isInitialized);
  
  return useQuery<User>({
    queryKey: ['user', id],
    queryFn: async () => {
      console.log('🌐 [useUser] Fetching user from API:', `/api/users/${id}`);
      const response = await api.get(`/api/users/${id}`);
      console.log('✅ [useUser] API Response:', response.data);
      return response.data;
    },
    enabled: isInitialized && !!id,
  });
}

// Query: Usuário atual
export function useCurrentUser() {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  
  return useQuery<User>({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const response = await api.get('/api/users/me');
      return response.data;
    },
    enabled: isInitialized,
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
