import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

type PaymentStatus = 'pending' | 'approved' | 'expired' | 'failed' | 'cancelled';

interface Purchase {
  id: string;
  status: PaymentStatus;
  pixQrCode: string;
  pixQrCodeText: string;
  expiresAt: string;
  amount: number;
  planId: string;
  priceId: string;
}

export function usePayment(purchaseId: string | null, options?: { enabled?: boolean }) {
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutos em segundos
  const [isExpired, setIsExpired] = useState(false);
  
  // Query para buscar purchase
  const { data: purchase, isLoading } = useQuery<Purchase>({
    queryKey: ['purchase', purchaseId],
    queryFn: async () => {
      const { data } = await api.get(`/api/purchases/${purchaseId}`);
      return data;
    },
    enabled: !!purchaseId && (options?.enabled ?? true),
    refetchInterval: (data) => {
      // Polling a cada 5s se status for pending
      if (data?.status === 'pending' && !isExpired) {
        return 5000;
      }
      return false;
    },
  });
  
  // Timer de expiração
  useEffect(() => {
    if (!purchase) return;
    
    const expiresAt = new Date(purchase.expiresAt);
    const now = new Date();
    const secondsRemaining = Math.floor((expiresAt.getTime() - now.getTime()) / 1000);
    
    setTimeRemaining(Math.max(0, secondsRemaining));
    
    if (secondsRemaining <= 0) {
      setIsExpired(true);
      return;
    }
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const newValue = prev - 1;
        if (newValue <= 0) {
          clearInterval(timer);
          setIsExpired(true);
          return 0;
        }
        return newValue;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [purchase]);
  
  // Formatar tempo restante (MM:SS)
  const formattedTime = `${Math.floor(timeRemaining / 60).toString().padStart(2, '0')}:${(timeRemaining % 60).toString().padStart(2, '0')}`;
  
  // Copiar código PIX
  const copyPixCode = async () => {
    if (!purchase?.pixQrCodeText) return;
    
    try {
      await navigator.clipboard.writeText(purchase.pixQrCodeText);
      return true;
    } catch (error) {
      console.error('Erro ao copiar código PIX:', error);
      return false;
    }
  };
  
  return {
    purchase,
    isLoading,
    status: isExpired ? 'expired' : purchase?.status || 'pending',
    timeRemaining,
    formattedTime,
    isExpired,
    copyPixCode,
  };
}
