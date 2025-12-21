'use client';

import { useOrder } from '@/hooks/use-orders';
import { OrderStatus } from '@/hooks/use-orders';
import { ArrowLeft, Loader2, ShoppingBag, Calendar, Building2, CreditCard, CheckCircle2, AlertCircle, Clock, XCircle, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: any }> = {
  COMPLETED: { label: 'Concluído', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  PROCESSING: { label: 'Processando', color: 'bg-blue-100 text-blue-700', icon: Loader2 },
  PENDING: { label: 'Pendente', color: 'bg-amber-100 text-amber-700', icon: Clock },
  REFUNDED: { label: 'Reembolsado', color: 'bg-purple-100 text-purple-700', icon: RotateCcw },
  CANCELED: { label: 'Cancelado', color: 'bg-slate-100 text-slate-700', icon: XCircle },
};

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { data: order, isLoading, error } = useOrder(params.id);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-main" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Pedido não encontrado</h1>
        <p className="text-gray-500">O pedido solicitado não existe ou foi removido.</p>
        <Link
          href="/orders"
          className="text-primary-main hover:underline"
        >
          Voltar para listagem
        </Link>
      </div>
    );
  }

  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/orders"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Pedido #{order.id.slice(0, 8)}</h1>
              <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
                <StatusIcon className={`h-3.5 w-3.5 ${order.status === 'PROCESSING' ? 'animate-spin' : ''}`} />
                {status.label}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Realizado em {format(new Date(order.createdAt), "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-gray-500" />
              Resumo do Pedido
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Valor Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: order.currency,
                  }).format(order.totalAmount)}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Atualizado em
                </p>
                <p className="text-base text-gray-900">
                  {format(new Date(order.updatedAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>

            {order.items && order.items.length > 0 ? (
               <div className="mt-6">
                 <h4 className="text-sm font-medium text-gray-900 mb-3">Itens</h4>
                 <div className="divide-y border rounded-lg overflow-hidden">
                   {order.items.map((item: any, index: number) => (
                     <div key={index} className="p-4 bg-gray-50 flex justify-between items-center text-sm">
                        <span>{item.name || `Item #${index + 1}`}</span>
                        <span className="font-medium">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: order.currency }).format(item.price || 0)}
                        </span>
                     </div>
                   ))}
                 </div>
               </div>
            ) : (
                <div className="mt-8 p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <p className="text-gray-500 text-sm">Detalhes dos itens não disponíveis.</p>
                </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Client Info */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Cliente
            </h3>
            {order.tenant ? (
              <div className="space-y-3">
                 <div>
                  <p className="text-sm text-gray-400">Nome</p>
                  <p className="font-medium text-gray-900">{order.tenant.name}</p>
                 </div>
                 {/* ID is tenantId */}
                 <div>
                  <p className="text-sm text-gray-400">ID do Tenant</p>
                  <p className="text-xs font-mono bg-gray-100 p-1 rounded inline-block text-gray-600">
                    {order.tenantId}
                  </p>
                 </div>
              </div>
            ) : (
                 <div className="space-y-3">
                    <p className="text-sm text-gray-500 italic">Informações do cliente indisponíveis.</p>
                     <div>
                      <p className="text-sm text-gray-400">ID do Cliente</p>
                      <p className="text-xs font-mono bg-gray-100 p-1 rounded inline-block text-gray-600">
                        {order.customerId || '-'}
                      </p>
                     </div>
                 </div>
            )}
            
            <div className="mt-6 pt-4 border-t">
              <Link
                href="/tenants"
                className="text-sm text-primary-main hover:underline flex items-center gap-1"
              >
                Ver todos clientes →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
