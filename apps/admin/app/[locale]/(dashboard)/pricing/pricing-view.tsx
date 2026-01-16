'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { usePlans } from '@/hooks/use-plans';
import { useCurrentSubscription } from '@/hooks/use-current-subscription';
import { PlanCard } from '@/components/pricing/plan-card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type BillingInterval = 'MONTHLY' | 'YEARLY';

export default function PricingView() {

  const router = useRouter();
  const [selectedInterval, setSelectedInterval] = useState<BillingInterval>('MONTHLY');
  
  const { data: plans, isLoading } = usePlans({ isPublic: true, isActive: true });
  const { data: currentSubscription } = useCurrentSubscription();
  
  const handleSelectPlan = (planId: string) => {
    router.push(`/checkout?planId=${planId}&interval=${selectedInterval}`);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Escolha seu Plano</h1>
        <p className="text-xl text-muted-foreground">
          Selecione o plano ideal para o seu negócio
        </p>
      </div>
      
      {/* Toggle Mensal/Anual */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 p-1 bg-muted rounded-lg">
          <Button
            variant={selectedInterval === 'MONTHLY' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedInterval('MONTHLY')}
          >
            Mensal
          </Button>
          <Button
            variant={selectedInterval === 'YEARLY' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedInterval('YEARLY')}
          >
            Anual
            <span className="ml-2 text-xs bg-primary/20 px-2 py-0.5 rounded">
              Economize 20%
            </span>
          </Button>
        </div>
      </div>
      
      {/* Grid de Planos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans?.map((plan, index) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            interval={selectedInterval}
            isCurrent={currentSubscription?.planId === plan.id}
            isPopular={plan.badge === 'Popular' || index === 1}
            onSelect={() => handleSelectPlan(plan.id)}
          />
        ))}
      </div>
      
      {/* FAQ ou Features Comparison pode ser adicionado aqui */}
    </div>
  );
}
