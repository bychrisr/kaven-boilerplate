import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils';

// Types
export interface Feature {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: 'BOOLEAN' | 'QUOTA' | 'CUSTOM';
  defaultValue?: string;
  unit?: string;
  category?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeatureInput {
  code: string;
  name: string;
  description?: string;
  type: 'BOOLEAN' | 'QUOTA' | 'CUSTOM';
  defaultValue?: string;
  unit?: string;
  category?: string;
  sortOrder?: number;
}

// Queries
export function useFeatures(filters?: { category?: string; isActive?: boolean }) {
  return useQuery({
    queryKey: ['features', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
      
      const { data } = await api.get(`/features?${params.toString()}`);
      return data.features as Feature[];
    },
  });
}

export function useFeature(id: string) {
  return useQuery({
    queryKey: ['features', id],
    queryFn: async () => {
      const { data } = await api.get(`/features/${id}`);
      return data as Feature;
    },
    enabled: !!id,
  });
}

export function useFeatureCategories() {
  return useQuery({
    queryKey: ['features', 'categories'],
    queryFn: async () => {
      const { data } = await api.get('/features/categories');
      return data.categories as string[];
    },
  });
}

// Mutations
export function useCreateFeature() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (feature: CreateFeatureInput) => {
      const { data } = await api.post('/features', feature);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error));
    },
  });
}

export function useUpdateFeature() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...feature }: Partial<CreateFeatureInput> & { id: string }) => {
      const { data } = await api.put(`/features/${id}`, feature);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      queryClient.invalidateQueries({ queryKey: ['features', variables.id] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error));
    },
  });
}

export function useDeleteFeature() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/features/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error));
    },
  });
}
