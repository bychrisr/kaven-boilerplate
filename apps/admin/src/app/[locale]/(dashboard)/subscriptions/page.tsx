'use client';

import { useSubscriptions } from '@/hooks/use-subscriptions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function SubscriptionsPage() {
  const { data: subscriptions, isLoading } = useSubscriptions();

  if (isLoading) {
    return <div className="flex items-center justify-center h-96"><div className="text-muted-foreground">Carregando assinaturas...</div></div>;
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'default';
      case 'TRIALING': return 'secondary';
      case 'PAST_DUE': return 'destructive';
      case 'CANCELED': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Ativa';
      case 'TRIALING': return 'Trial';
      case 'PAST_DUE': return 'Atrasada';
      case 'CANCELED': return 'Cancelada';
      case 'EXPIRED': return 'Expirada';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assinaturas</h1>
        <p className="text-muted-foreground mt-2">Visualize todas as assinaturas ativas no sistema</p>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Intervalo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Período Atual</TableHead>
              <TableHead>Criado em</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions?.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">Nenhuma assinatura encontrada.</TableCell></TableRow>
            ) : (
              subscriptions?.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell className="font-medium">{subscription.tenant.name}</TableCell>
                  <TableCell>{subscription.plan.name}</TableCell>
                  <TableCell>{subscription.price?.interval || '-'}</TableCell>
                  <TableCell>
                    {subscription.price ? `R$ ${subscription.price.amount.toFixed(2)}` : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(subscription.status)}>
                      {getStatusLabel(subscription.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {subscription.currentPeriodStart && subscription.currentPeriodEnd ? (
                      <div>
                        {format(new Date(subscription.currentPeriodStart), 'dd/MM/yy', { locale: ptBR })}
                        {' - '}
                        {format(new Date(subscription.currentPeriodEnd), 'dd/MM/yy', { locale: ptBR })}
                      </div>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(subscription.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
