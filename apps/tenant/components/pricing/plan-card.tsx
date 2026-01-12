import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Plan } from '@/hooks/use-plans';

interface PlanCardProps {
  plan: Plan;
  interval: 'MONTHLY' | 'YEARLY';
  isCurrent?: boolean;
  isPopular?: boolean;
  onSelect: () => void;
}

export function PlanCard({ plan, interval, isCurrent, isPopular, onSelect }: PlanCardProps) {
  const price = plan.prices?.find(p => p.interval === interval && p.isActive);
  
  if (!price) return null;
  
  const amount = Number(price.amount);
  const originalAmount = price.originalAmount ? Number(price.originalAmount) : null;
  const hasDiscount = originalAmount && originalAmount > amount;
  
  return (
    <Card className={`relative ${isCurrent ? 'border-primary' : ''} ${isPopular ? 'shadow-lg' : ''}`} data-testid="plan-card">
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
          Popular
        </Badge>
      )}
      
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {plan.name}
          {isCurrent && (
            <Badge variant="outline">Current Plan</Badge>
          )}
        </CardTitle>
        {plan.description && (
          <CardDescription>{plan.description}</CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">
              R$ {amount.toFixed(2)}
            </span>
            <span className="text-muted-foreground">
              /{interval === 'MONTHLY' ? 'mês' : 'ano'}
            </span>
          </div>
          {hasDiscount && (
            <p className="text-sm text-muted-foreground line-through">
              R$ {originalAmount.toFixed(2)}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          {plan.features?.map((feature) => (
            <div key={feature.code} className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">
                {feature.name}
                {feature.limitValue !== null && feature.limitValue !== -1 && (
                  <span className="text-muted-foreground">
                    {' '}({feature.limitValue} {feature.unit})
                  </span>
                )}
                {feature.limitValue === -1 && (
                  <span className="text-muted-foreground"> (Ilimitado)</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={onSelect}
          disabled={isCurrent}
          variant={isCurrent ? 'outline' : 'default'}
        >
          {isCurrent ? 'Plano Atual' : 'Selecionar Plano'}
        </Button>
      </CardFooter>
    </Card>
  );
}
