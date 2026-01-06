'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCheckout } from '@/hooks/use-checkout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/radix-select';
import { Loader2, ArrowLeft } from 'lucide-react';
import { PaymentModal } from '@/components/payments/payment-modal';

type BillingInterval = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'LIFETIME' | 'FOREVER';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('planId');
  const initialInterval = (searchParams.get('interval') || 'MONTHLY') as BillingInterval;
  
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const {
    plan,
    isPlanLoading,
    selectedInterval,
    setSelectedInterval,
    selectedPrice,
    prorationAmount,
    totalAmount,
    checkout,
    isCheckingOut,
    currentSubscription,
  } = useCheckout(planId || '');
  
  useEffect(() => {
    if (initialInterval) {
      setSelectedInterval(initialInterval);
    }
  }, [initialInterval, setSelectedInterval]);
  
  if (!planId) {
    router.push('/pricing');
    return null;
  }
  
  if (isPlanLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (!plan) {
    return (
      <div className="container mx-auto py-8">
        <p>Plano não encontrado</p>
      </div>
    );
  }
  
  const handleCheckout = async () => {
    const purchase = await checkout(true);
    if (purchase) {
      setPurchaseId(purchase.id);
      setShowPaymentModal(true);
    }
  };
  
  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    router.push('/dashboard');
  };
  
  return (
    <div className="container mx-auto py-8 max-w-2xl space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Finalizar Compra</h1>
        <p className="text-muted-foreground">
          Revise seu pedido e prossiga para o pagamento
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Plano Selecionado</CardTitle>
          <CardDescription>{plan.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Intervalo de Pagamento</label>
            <Select
              value={selectedInterval}
              onValueChange={(value) => setSelectedInterval(value as BillingInterval)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {plan.prices?.filter(p => p.isActive).map((price) => (
                  <SelectItem key={price.id} value={price.interval}>
                    {price.interval === 'MONTHLY' && 'Mensal'}
                    {price.interval === 'QUARTERLY' && 'Trimestral'}
                    {price.interval === 'YEARLY' && 'Anual'}
                    {price.interval === 'LIFETIME' && 'Vitalício'}
                    {' - R$ '}
                    {Number(price.amount).toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>R$ {selectedPrice ? Number(selectedPrice.amount).toFixed(2) : '0.00'}</span>
            </div>
            
            {prorationAmount > 0 && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Proration (dias restantes)</span>
                <span>R$ {prorationAmount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>R$ {totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          {currentSubscription && (
            <div className="bg-muted p-3 rounded-lg text-sm">
              <p className="font-medium">Plano Atual: {currentSubscription.plan.name}</p>
              <p className="text-muted-foreground">
                Você será cobrado proporcionalmente pelos dias restantes do período atual.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleCheckout}
          disabled={!selectedPrice || isCheckingOut}
          className="flex-1"
        >
          {isCheckingOut ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            'Prosseguir para Pagamento'
          )}
        </Button>
      </div>
      
      {showPaymentModal && purchaseId && (
        <PaymentModal
          purchaseId={purchaseId}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
