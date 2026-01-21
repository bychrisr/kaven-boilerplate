import { useState, useMemo } from 'react';
import { usePlan } from './use-plans';
import { useCurrentSubscription } from './use-current-subscription';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

interface ApiErrorResponse {
  message: string;
}

type BillingInterval = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'LIFETIME' | 'FOREVER';

interface CheckoutData {
  planId: string;
  priceId: string;
  prorated?: boolean;
}

export function useCheckout(planId: string) {
  const [selectedInterval, setSelectedInterval] = useState<BillingInterval>('MONTHLY');
  
  const { data: plan, isLoading: isPlanLoading } = usePlan(planId);
  const { data: currentSubscription } = useCurrentSubscription();
  
  // Encontrar preço selecionado
  const selectedPrice = useMemo(() => {
    return plan?.prices?.find(p => p.interval === selectedInterval && p.isActive);
  }, [plan, selectedInterval]);
  
  // Calcular proration
  const prorationAmount = useMemo(() => {
    if (!currentSubscription || !selectedPrice) return 0;
    
    const now = new Date();
    const periodEnd = new Date(currentSubscription.currentPeriodEnd);
    const daysRemaining = Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining <= 0) return 0;
    
    const currentDailyRate = Number(currentSubscription.price.amount) / 30;
    const newDailyRate = Number(selectedPrice.amount) / 30;
    const proratedAmount = (newDailyRate - currentDailyRate) * daysRemaining;
    
    return Math.max(0, proratedAmount);
  }, [currentSubscription, selectedPrice]);
  
  // Mutation para criar purchase
  const createPurchaseMutation = useMutation({
    mutationFn: async (data: CheckoutData) => {
      const { data: purchase } = await api.post('/api/purchases', data);
      return purchase;
    },
    onSuccess: (purchase) => {
      // Redirecionar para modal de pagamento será feito no componente
      return purchase;
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(error.response?.data?.message || 'Erro ao criar pedido');
    },
  });
  
  const checkout = async (prorated: boolean = true) => {
    if (!selectedPrice) {
      toast.error('Selecione um intervalo de pagamento');
      return null;
    }
    
    return await createPurchaseMutation.mutateAsync({
      planId,
      priceId: selectedPrice.id,
      prorated,
    });
  };
  
  const totalAmount = useMemo(() => {
    if (!selectedPrice) return 0;
    return Number(selectedPrice.amount) + prorationAmount;
  }, [selectedPrice, prorationAmount]);
  
  return {
    plan,
    isPlanLoading,
    selectedInterval,
    setSelectedInterval,
    selectedPrice,
    prorationAmount,
    totalAmount,
    checkout,
    isCheckingOut: createPurchaseMutation.isPending,
    currentSubscription,
  };
}
