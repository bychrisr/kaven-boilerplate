'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Check,
  X,
  Clock,
  User,
  Shield,
  Calendar,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { GrantApprovalDialog } from '@/components/grants/grant-approval-dialog';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { grantRequestService } from '@/services/grant-request.service';
import { GrantRequest } from '@/services/grant-request.service';

// Interface local removida em favor da importada do serviço

export default function ApprovalsPage() {
  const [selectedRequest, setSelectedRequest] = useState<GrantRequest | null>(null);
  const [dialogAction, setDialogAction] = useState<'approve' | 'reject'>('approve');
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: requests, isLoading, error } = useQuery<GrantRequest[]>({
    queryKey: ['grant-requests', 'pending'],
    queryFn: async () => {
      return grantRequestService.listPending();
    },
  });

  const handleApprove = (request: GrantRequest) => {
    setSelectedRequest(request);
    setDialogAction('approve');
    setDialogOpen(true);
  };

  const handleReject = (request: GrantRequest) => {
    setSelectedRequest(request);
    setDialogAction('reject');
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary-main" />
          <p className="mt-2 text-sm text-text-secondary">Carregando solicitações...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-error-main" />
          <p className="mt-2 text-sm text-text-primary">Erro ao carregar solicitações</p>
          <p className="text-xs text-text-tertiary">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  const pendingRequests = requests || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Aprovações Pendentes</h1>
        <p className="text-sm text-text-secondary">
          Revise e aprove solicitações de acesso temporário
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning-main/10">
              <Clock className="h-5 w-5 text-warning-main" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{pendingRequests.length}</p>
              <p className="text-xs text-text-secondary">Pendentes</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Requests List */}
      {pendingRequests.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Check className="mx-auto h-12 w-12 text-success-main" />
            <h3 className="mt-4 text-lg font-semibold text-text-primary">
              Nenhuma solicitação pendente
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              Todas as solicitações foram processadas
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <Card key={request.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-4">
                {/* Left: Request Info */}
                <div className="flex-1 space-y-4">
                  {/* Requester */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-main/10">
                      <User className="h-5 w-5 text-primary-main" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">{request.requester.name}</p>
                      <p className="text-sm text-text-secondary">{request.requester.email}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline">{request.requester.role}</Badge>
                        <span className="text-xs text-text-tertiary">
                          {formatDistanceToNow(new Date(request.createdAt), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Capability & Space */}
                  <div className="space-y-2 rounded-lg bg-background-secondary p-3">
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

                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                      {request.space && (
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-primary-main" />
                          <span>{request.space.name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{request.requestedDuration} dias</span>
                      </div>
                      <Badge
                        variant={
                          request.accessLevel === 'READ_WRITE' ? 'default' : 'secondary'
                        }
                      >
                        {request.accessLevel === 'READ_WRITE' ? 'Leitura/Escrita' : 'Somente Leitura'}
                      </Badge>
                    </div>
                  </div>

                  {/* Justification */}
                  <div className="rounded-lg border border-border-main bg-background-tertiary p-3">
                    <p className="text-xs font-medium text-text-tertiary mb-1">
                      Justificativa:
                    </p>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {request.justification}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => handleApprove(request)}
                    className="bg-success-main hover:bg-success-dark"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Aprovar
                  </Button>
                  <Button
                    onClick={() => handleReject(request)}
                    variant="outline"
                    className="border-error-main text-error-main hover:bg-error-main/10"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Rejeitar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Approval Dialog */}
      <GrantApprovalDialog
        request={selectedRequest}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        action={dialogAction}
      />
    </div>
  );
}
