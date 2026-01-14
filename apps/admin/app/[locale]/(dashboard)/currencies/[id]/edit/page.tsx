```typescript
'use client';

import React, { use } from 'react';
import { notFound } from 'next/navigation';
import { CurrencyForm } from '@/components/currencies/currency-form';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditCurrencyPage({ params }: PageProps) {
  const { id } = use(params);

  // Fetch currency data
  const [currency, setCurrency] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchCurrency() {
      try {
        const response = await fetch(`/api/currencies/${id}`);
        if (!response.ok) {
          notFound();
        }
        const data = await response.json();
        setCurrency(data);
      } catch (error) {
        console.error('Error fetching currency:', error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    }
    fetchCurrency();
  }, [id]);

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
