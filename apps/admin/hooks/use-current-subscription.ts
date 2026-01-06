import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  priceId: string;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PAST_DUE';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  plan: {
    id: string;
    code: string;
    name: string;
    type: 'SUBSCRIPTION' | 'LIFETIME';
    features: Array<{
      featureCode: string;
      enabled: boolean;
      limitValue: number | null;
      customValue: string | null;
    }>;
  };
  price: {
    id: string;
    interval: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'LIFETIME' | 'FOREVER';
    intervalCount: number;
    amount: number;
    currency: string;
  };
}

export function useCurrentSubscription() {
  return useQuery<Subscription>({
    queryKey: ['subscription', 'current'],
    queryFn: async () => {
      const { data } = await api.get('/api/subscriptions/current');
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
