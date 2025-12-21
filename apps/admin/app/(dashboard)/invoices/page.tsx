'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useInvoices, InvoiceStatus } from '@/hooks/use-invoices';
import {
  Plus,
  FileText,
  Send,
  Eye,
  Pencil,
  Trash2,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  LucideIcon,
  Building2,
  User,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusConfig: Record<InvoiceStatus, { label: string; color: string; icon: LucideIcon }> = {
  PAID: { label: 'Pago', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  PENDING: { label: 'Pendente', color: 'bg-amber-100 text-amber-700', icon: Clock },
  OVERDUE: { label: 'Vencido', color: 'bg-rose-100 text-rose-700', icon: AlertCircle },
  DRAFT: { label: 'Rascunho', color: 'bg-gray-100 text-gray-700', icon: FileText },
  CANCELED: { label: 'Cancelado', color: 'bg-slate-100 text-slate-700', icon: XCircle },
};

export default function InvoicesPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | ''>('');
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  const { invoices, isLoading, pagination, sendInvoice } = useInvoices({ 
    page, 
    limit: 10,
    status: statusFilter || undefined
  });

  const handleSendEmail = async (id: string) => {
    if (confirm('Deseja enviar a fatura por e-mail para o cliente?')) {
      setSendingId(id);
      try {
        await sendInvoice.mutateAsync(id);
      } finally {
        setSendingId(null);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta fatura?')) {
      // TODO: Implement delete mutation
      console.log('Delete invoice:', id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Faturas</h1>
          <p className="text-sm text-gray-500">
            Gerencie cobranças e pagamentos recebidos
          </p>
        </div>
        <Link
          href="/invoices/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-main px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          Nova Fatura
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as InvoiceStatus | '')}
            className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
          >
            <option value="">Todos os status</option>
            <option value="PAID">Pago</option>
            <option value="PENDING">Pendente</option>
            <option value="OVERDUE">Vencido</option>
            <option value="DRAFT">Rascunho</option>
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
                <th className="px-6 py-3">Valor</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Vencimento</th>
                <th className="px-6 py-3">Emitido em</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-main border-t-transparent"></div>
                      Carregando faturas...
                    </div>
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Nenhuma fatura encontrada.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => {
                  const status = statusConfig[invoice.status];
                  const StatusIcon = status.icon;

                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 truncate w-32" title={invoice.id}>
                              #{invoice.id.slice(0, 8)}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-gray-500">
                                {invoice.tenant?.name || 'Cliente Desconhecido'}
                              </p>
                              {/* Badge de tipo */}
                              <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                                invoice.subscriptionId 
                                  ? 'bg-blue-100 text-blue-700' 
                                  : 'bg-purple-100 text-purple-700'
                              }`}>
                                {invoice.subscriptionId ? (
                                  <>
                                    <Building2 className="h-3 w-3" />
                                    Tenant
                                  </>
                                ) : (
                                  <>
                                    <User className="h-3 w-3" />
                                    User
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: invoice.currency,
                        }).format(invoice.amountDue)}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {format(new Date(invoice.dueDate), "d 'de' MMM, yyyy", { locale: ptBR })}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {format(new Date(invoice.createdAt), "d/MM/yyyy", { locale: ptBR })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleSendEmail(invoice.id)}
                            disabled={sendingId === invoice.id}
                            className="p-2 text-gray-400 hover:text-primary-main transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Enviar por Email"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                          
                          {/* Dropdown Menu */}
                          <div className="relative">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === invoice.id ? null : invoice.id)}
                              className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                              title="Ações"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            
                            {openMenuId === invoice.id && (
                              <>
                                {/* Backdrop para fechar o menu */}
                                <div 
                                  className="fixed inset-0 z-10" 
                                  onClick={() => setOpenMenuId(null)}
                                />
                                
                                {/* Menu dropdown */}
                                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                                  <div className="py-1">
                                    <Link
                                      href={`/invoices/${invoice.id}`}
                                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      onClick={() => setOpenMenuId(null)}
                                    >
                                      <Eye className="h-4 w-4" />
                                      Visualizar
                                    </Link>
                                    <Link
                                      href={`/invoices/${invoice.id}/edit`}
                                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      onClick={() => setOpenMenuId(null)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                      Editar
                                    </Link>
                                    <button
                                      onClick={() => {
                                        setOpenMenuId(null);
                                        handleDelete(invoice.id);
                                      }}
                                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Excluir
                                    </button>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
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
