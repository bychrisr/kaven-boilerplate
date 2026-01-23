'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, Clock, User, Shield, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { grantRequestService } from '@/services/grant-request.service';

import { GrantRequest } from '@/services/grant-request.service';

interface GrantApprovalDialogProps {
  request: GrantRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: 'approve' | 'reject';
}

export function GrantApprovalDialog({
  request,
  open,
  onOpenChange,
  action,
}: GrantApprovalDialogProps) {
  const queryClient = useQueryClient();
  const [rejectionReason, setRejectionReason] = useState('');

  const reviewMutation = useMutation({
    mutationFn: async (data: { action: 'APPROVE' | 'REJECT'; reason?: string }) => {
      // @ts-expect-error - ReviewGrantRequestInput esperado pelo backend
      return grantRequestService.review(request?.id as string, {
        status: data.action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
        reason: data.reason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grant-requests'] });
      toast.success(
        action === 'approve'
          ? 'Solicitação aprovada com sucesso!'
          : 'Solicitação rejeitada'
      );
      onOpenChange(false);
      setRejectionReason('');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = () => {
    if (action === 'reject' && !rejectionReason.trim()) {
      toast.error('Por favor, forneça um motivo para a rejeição');
      return;
    }

    reviewMutation.mutate({
      action: action === 'approve' ? 'APPROVE' : 'REJECT',
      reason: action === 'reject' ? rejectionReason : undefined,
    });
  };

  if (!request) return null;

  const isApprove = action === 'approve';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isApprove ? (
              <>
                <Check className="h-5 w-5 text-success-main" />
                Aprovar Solicitação de Acesso
              </>
            ) : (
              <>
                <X className="h-5 w-5 text-error-main" />
                Rejeitar Solicitação de Acesso
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isApprove
              ? 'Revise os detalhes antes de aprovar o acesso temporário.'
              : 'Forneça um motivo claro para a rejeição.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Informações do Solicitante */}
          <div className="rounded-lg border border-border-main bg-background-secondary p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-main/10">
                <User className="h-5 w-5 text-primary-main" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-text-primary">{request.requester.name}</p>
                <p className="text-sm text-text-secondary">{request.requester.email}</p>
                <Badge variant="outline" className="mt-1">
                  {request.requester.role}
                </Badge>
              </div>
            </div>
          </div>

          {/* Detalhes do Acesso */}
          <div className="space-y-3">
            {request.capability && (
              <div className="flex items-start gap-2">
                <Shield className="mt-0.5 h-4 w-4 text-text-tertiary" />
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {request.capability.description}
                  </p>
                  <p className="text-xs text-text-tertiary font-mono">
                    {request.capability.code}
                  </p>
                </div>
              </div>
            )}

            {request.space && (
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary-main" />
                <p className="text-sm text-text-secondary">
                  Space: <span className="font-medium">{request.space.name}</span>
                </p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-text-tertiary" />
              <p className="text-sm text-text-secondary">
                Duração: <span className="font-medium">{request.requestedDuration} dias</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-text-tertiary" />
              <p className="text-sm text-text-secondary">
                Solicitado{' '}
                {formatDistanceToNow(new Date(request.createdAt), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>

          {/* Justificativa */}
          <div className="rounded-lg border border-border-main bg-background-tertiary p-4">
            <p className="mb-2 text-sm font-medium text-text-primary">Justificativa:</p>
            <p className="text-sm text-text-secondary leading-relaxed">
              {request.justification}
            </p>
          </div>

          {/* Campo de Motivo de Rejeição */}
          {!isApprove && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">
                Motivo da Rejeição *
              </label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explique por que esta solicitação está sendo rejeitada..."
                className="min-h-[100px] resize-none"
                required
              />
              <p className="text-xs text-text-tertiary">
                Este motivo será enviado ao solicitante.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={reviewMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={reviewMutation.isPending}
            className={
              isApprove
                ? 'bg-success-main hover:bg-success-dark'
                : 'bg-error-main hover:bg-error-dark'
            }
          >
            {reviewMutation.isPending ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : isApprove ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Aprovar Acesso
              </>
            ) : (
              <>
                <X className="mr-2 h-4 w-4" />
                Rejeitar Solicitação
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
