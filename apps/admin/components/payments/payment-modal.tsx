'use client';

import { useEffect } from 'react';
import { usePayment } from '@/hooks/use-payment';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Copy, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { CurrencyDisplay } from '@/components/ui/currency-display';

interface PaymentModalProps {
  purchaseId: string;
  onSuccess: () => void;
  onClose: () => void;
}

export function PaymentModal({ purchaseId, onSuccess, onClose }: PaymentModalProps) {
  const { purchase, isLoading, status, formattedTime, isExpired, copyPixCode } = usePayment(purchaseId);
  
  useEffect(() => {
    if (status === 'approved') {
      toast.success('Pagamento aprovado!');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }
  }, [status, onSuccess]);
  
  const handleCopyPixCode = async () => {
    const success = await copyPixCode();
    if (success) {
      toast.success('Código PIX copiado!');
    } else {
      toast.error('Erro ao copiar código');
    }
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Gerando QR Code PIX...</p>
        </div>
      );
    }
    
    if (status === 'approved') {
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">Pagamento Aprovado!</h3>
            <p className="text-muted-foreground">
              Seu plano foi ativado com sucesso.
            </p>
          </div>
        </div>
      );
    }
    
    if (status === 'expired' || isExpired) {
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Clock className="h-16 w-16 text-orange-500" />
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">QR Code Expirado</h3>
            <p className="text-muted-foreground">
              O tempo para pagamento expirou. Por favor, tente novamente.
            </p>
          </div>
          <Button onClick={onClose}>Tentar Novamente</Button>
        </div>
      );
    }
    
    if (status === 'failed') {
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <XCircle className="h-16 w-16 text-red-500" />
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">Pagamento Falhou</h3>
            <p className="text-muted-foreground">
              Ocorreu um erro ao processar seu pagamento.
            </p>
          </div>
          <Button onClick={onClose}>Tentar Novamente</Button>
        </div>
      );
    }
    
    // Status: pending
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-orange-600">
            <Clock className="h-5 w-5" />
            <span className="text-lg font-mono font-semibold">
              Expira em {formattedTime}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Escaneie o QR Code ou copie o código PIX
          </p>
        </div>
        
        {purchase?.pixQrCode && (
          <Card className="p-6 flex items-center justify-center bg-white">
            <div className="relative w-64 h-64">
              <Image
                src={`data:image/png;base64,${purchase.pixQrCode}`}
                alt="QR Code PIX"
                fill
                className="object-contain"
              />
            </div>
          </Card>
        )}
        
        <div className="space-y-2">
          <Button
            onClick={handleCopyPixCode}
            variant="outline"
            className="w-full"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copiar Código PIX
          </Button>
          
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                Aguardando pagamento...
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Atualizando automaticamente
            </p>
          </div>
        </div>
        
        <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
          <p className="font-medium">Valor: <CurrencyDisplay value={Number(purchase?.amount)} /></p>
          <p className="text-muted-foreground">
            Após o pagamento, seu plano será ativado automaticamente.
          </p>
        </div>
      </div>
    );
  };
  
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pagamento via PIX</DialogTitle>
          <DialogDescription>
            Complete o pagamento para ativar seu plano
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
