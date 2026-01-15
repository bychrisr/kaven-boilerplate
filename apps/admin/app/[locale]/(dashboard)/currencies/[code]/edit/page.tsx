'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CurrencyForm } from '@/components/currencies/currency-form';
import type { Currency } from '@/hooks/use-currency';

interface PageProps {
  params: Promise<{ code: string }>;
}

export default function EditCurrencyPage({ params }: PageProps) {
  const { code } = use(params);
  
  console.log('[DEBUG] EditCurrencyPage montado:', { code });

  const { data: currency, isLoading, error } = useQuery<Currency>({
    queryKey: ['currency', code],
    queryFn: async () => {
      const url = `/api/currencies/${code}`;
      console.log('[DEBUG] Fazendo fetch:', { url, code });
      
      const response = await fetch(url);
      
      console.log('[DEBUG] Response recebido:', {
        url,
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[DEBUG] Erro na API:', { url, status: response.status, errorText });
        throw new Error('Failed to fetch currency');
      }
      
      const data = await response.json();
      console.log('[DEBUG] Currency carregada:', data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!currency) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Moeda não encontrada</div>
      </div>
    );
  }

  return <CurrencyForm currency={currency} mode="edit" />;
}
