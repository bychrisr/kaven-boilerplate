'use client';

import { useQuery } from '@tanstack/react-query';
import { CurrencyForm } from '@/components/currencies/currency-form';
import type { Currency } from '@/hooks/use-currency';

export default function EditCurrencyPage({ params }: { params: { id: string } }) {
  const { data: currency, isLoading } = useQuery<Currency>({
    queryKey: ['currency', params.id],
    queryFn: async () => {
      const response = await fetch(`/api/currencies/${params.id}`);
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
