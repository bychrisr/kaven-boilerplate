import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils';

// Types
export interface Plan {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: 'SUBSCRIPTION' | 'LIFETIME';
  trialDays: number;
  isDefault: boolean;
  isPublic: boolean;
  isActive: boolean;
  sortOrder: number;
  badge?: string;
  stripeProductId?: string;
  tenantId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  prices: Price[];
  features: PlanFeature[];
}

export interface Price {
  id: string;
  planId: string;
  code?: string;
  interval: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'LIFETIME' | 'FOREVER';
  intervalCount: number;
  amount: number;
  currency: string;
  originalAmount?: number;
  isActive: boolean;
  stripePriceId?: string;
  pagueBitPriceId?: string;
}

export interface PlanFeature {
  code: string;
  name: string;
  description?: string;
  type: 'BOOLEAN' | 'QUOTA' | 'CUSTOM';
  unit?: string;
  category?: string;
  enabled?: boolean;
  limitValue?: number;
  customValue?: string;
  displayOverride?: string;
}

export interface CreatePlanInput {
  code: string;
  name: string;
  description?: string;
  type: 'SUBSCRIPTION' | 'LIFETIME';
  trialDays?: number;
  isPublic?: boolean;
  isDefault?: boolean;
  badge?: string;
  sortOrder?: number;
  prices: {
    interval: string;
    intervalCount?: number;
    amount: number;
    currency?: string;
    originalAmount?: number;
  }[];
  features: {
    featureCode: string;
    enabled?: boolean;
    limitValue?: number;
    customValue?: string;
  }[];
}

// Queries
export function usePlans(filters?: { tenantId?: string; isActive?: boolean }) {
  return useQuery({
    queryKey: ['plans', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.tenantId) params.append('tenantId', filters.tenantId);
      if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
      
      const { data } = await api.get(`/plans?${params.toString()}`);
      return data.plans as Plan[];
    },
  });
}

export function usePlan(id: string) {
  return useQuery({
    queryKey: ['plans', id],
    queryFn: async () => {
      const { data } = await api.get(`/plans/${id}`);
      return data as Plan;
    },
    enabled: !!id,
  });
}

// Mutations
export function useCreatePlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (plan: CreatePlanInput) => {
      const { data } = await api.post('/plans', plan);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error));
    },
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...plan }: Partial<CreatePlanInput> & { id: string }) => {
      const { data } = await api.put(`/plans/${id}`, plan);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      queryClient.invalidateQueries({ queryKey: ['plans', variables.id] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error));
    },
  });
}

export function useDeletePlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/plans/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error));
    },
  });
}
