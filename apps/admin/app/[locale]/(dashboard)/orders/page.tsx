'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useOrders, OrderStatus } from '@/hooks/use-orders';
import {
  ShoppingBag,
  MoreVertical,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  RotateCcw,
  LucideIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: LucideIcon }> = {
  COMPLETED: { label: 'Concluído', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  PROCESSING: { label: 'Processando', color: 'bg-blue-100 text-blue-700', icon: Loader2 },
  PENDING: { label: 'Pendente', color: 'bg-amber-100 text-amber-700', icon: Clock },
  REFUNDED: { label: 'Reembolsado', color: 'bg-purple-100 text-purple-700', icon: RotateCcw },
  CANCELED: { label: 'Cancelado', color: 'bg-slate-100 text-slate-700', icon: XCircle },
};

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');

  const { orders, isLoading, pagination } = useOrders({
    page,
    limit: 10,
    status: statusFilter || undefined,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-sm text-gray-500">Acompanhe os pedidos realizados no sistema</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
            className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
          >
            <option value="">Todos os status</option>
            <option value="COMPLETED">Concluído</option>
            <option value="PROCESSING">Processando</option>
            <option value="PENDING">Pendente</option>
            <option value="REFUNDED">Reembolsado</option>
            <option value="CANCELED">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
              <tr>
                <th className="px-6 py-3">ID / Cliente</th>
                <th className="px-6 py-3">Valor Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Data</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-main border-t-transparent"></div>
                      Carregando pedidos...
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const status = statusConfig[order.status];
                  const StatusIcon = status.icon;

                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                            <ShoppingBag className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 truncate w-32" title={order.id}>
                              #{order.id.slice(0, 8)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order.tenant?.name || 'Cliente Desconhecido'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: order.currency,
                        }).format(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}
                        >
                          <StatusIcon
                            className={`h-3.5 w-3.5 ${order.status === 'PROCESSING' ? 'animate-spin' : ''}`}
                          />
                          {status.label}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {format(new Date(order.createdAt), "d 'de' MMM, yyyy HH:mm", {
                          locale: ptBR,
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/orders/${order.id}`}
                            className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                            title="Detalhes"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-6 py-4">
            <span className="text-sm text-gray-500">
              Página {pagination.page} de {pagination.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                disabled={page === pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
