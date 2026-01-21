import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Types
export interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  priceId?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  status: 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED';
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  cancelReason?: string;
  trialEnd?: string;
  discountCode?: string;
  discountPercent?: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
  plan: {
    id: string;
    code: string;
    name: string;
    type: string;
  };
  price?: {
    id: string;
    interval: string;
    amount: number;
    currency: string;
  };
}

export interface SubscriptionWithFeatures extends Subscription {
  features: {
    [key: string]: {
      type: 'BOOLEAN' | 'QUOTA' | 'CUSTOM';
      enabled?: boolean;
      limit?: number;
      current?: number;
      customValue?: string;
    };
  };
}

// Queries
export function useSubscriptions(filters?: { 
  tenantId?: string; 
  status?: string;
  planId?: string;
}) {
  return useQuery({
    queryKey: ['subscriptions', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.tenantId) params.append('tenantId', filters.tenantId);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.planId) params.append('planId', filters.planId);
      
      const { data } = await api.get(`/subscriptions?${params.toString()}`);
      return data.subscriptions as Subscription[];
    },
  });
}

export function useSubscription(id: string) {
  return useQuery({
    queryKey: ['subscriptions', id],
    queryFn: async () => {
      const { data } = await api.get(`/subscriptions/${id}`);
      return data as SubscriptionWithFeatures;
    },
    enabled: !!id,
  });
}

export function useCurrentSubscription(tenantId?: string) {
  return useQuery({
    queryKey: ['subscriptions', 'current', tenantId],
    queryFn: async () => {
      const { data } = await api.get('/subscriptions/current');
      return data.subscription as SubscriptionWithFeatures;
    },
    enabled: !!tenantId,
  });
}
