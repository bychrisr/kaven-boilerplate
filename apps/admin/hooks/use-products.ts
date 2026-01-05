import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';

// Types
export interface Product {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: 'ONE_TIME' | 'CONSUMABLE' | 'ADD_ON';
  price: number;
  currency: string;
  originalPrice?: number;
  isActive: boolean;
  isPublic: boolean;
  sortOrder: number;
  stock: number;
  maxPerTenant: number;
  stripeProductId?: string;
  stripePriceId?: string;
  imageUrl?: string;
  tenantId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  effects: ProductEffect[];
}

export interface ProductEffect {
  id: string;
  productId: string;
  featureId: string;
  featureCode: string;
  featureName: string;
  effectType: 'ADD' | 'SET' | 'MULTIPLY' | 'ENABLE';
  value?: number;
  isPermanent: boolean;
  durationDays?: number;
}

export interface CreateProductInput {
  code: string;
  name: string;
  description?: string;
  type: 'ONE_TIME' | 'CONSUMABLE' | 'ADD_ON';
  price: number;
  currency?: string;
  originalPrice?: number;
  isPublic?: boolean;
  sortOrder?: number;
  stock?: number;
  maxPerTenant?: number;
  imageUrl?: string;
  effects: {
    featureCode: string;
    effectType: 'ADD' | 'SET' | 'MULTIPLY' | 'ENABLE';
    value?: number;
    isPermanent?: boolean;
    durationDays?: number;
  }[];
}

// Queries
export function useProducts(filters?: { tenantId?: string; isActive?: boolean; type?: string }) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.tenantId) params.append('tenantId', filters.tenantId);
      if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
      if (filters?.type) params.append('type', filters.type);
      
      const { data } = await api.get(`/products?${params.toString()}`);
      return data.products as Product[];
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      return data as Product;
    },
    enabled: !!id,
  });
}

// Mutations
export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (product: CreateProductInput) => {
      const { data } = await api.post('/products', product);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error));
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...product }: Partial<CreateProductInput> & { id: string }) => {
      const { data } = await api.put(`/products/${id}`, product);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error));
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error));
    },
  });
}
