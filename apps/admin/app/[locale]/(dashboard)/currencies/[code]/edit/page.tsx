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

  const { data: currency, isLoading } = useQuery<Currency>({
    queryKey: ['currency', code],
    queryFn: async () => {
      const response = await fetch(`/api/currencies/${code}`);
      if (!response.ok) throw new Error('Failed to fetch currency');
      return response.json();
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
