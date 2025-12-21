'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useInvoices, InvoiceStatus, useInvoices as useInvoicesHook } from '@/hooks/use-invoices';
import {
  Plus,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

// Avatar color generator
const getAvatarColor = (name: string) => {
  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-cyan-500',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// Status badge styles
const statusStyles: Record<InvoiceStatus, string> = {
  PAID: 'bg-emerald-100 text-emerald-700',
  PENDING: 'bg-amber-100 text-amber-700',
  OVERDUE: 'bg-rose-100 text-rose-700',
  DRAFT: 'bg-gray-100 text-gray-700',
  CANCELED: 'bg-slate-100 text-slate-700',
};

const statusLabels: Record<InvoiceStatus, string> = {
  PAID: 'Paid',
  PENDING: 'Pending',
  OVERDUE: 'Overdue',
  DRAFT: 'Draft',
  CANCELED: 'Canceled',
};

export default function InvoicesPage() {
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');

  const { invoices, isLoading, pagination, deleteInvoice } = useInvoices({
    page,
    limit,
    status: statusFilter || undefined,
  });

  // Calculate stats
  const stats = useMemo(() => {
    if (!invoices) return [];

    const allInvoices = invoices; // In real app, fetch all for stats
    
    const calculateTotal = (status?: InvoiceStatus) => {
      const filtered = status 
        ? allInvoices.filter(inv => inv.status === status)
        : allInvoices;
      
      return {
        count: filtered.length,
        amount: filtered.reduce((sum, inv) => sum + Number(inv.amountDue), 0),
      };
    };

    return [
      {
        label: 'Total',
        ...calculateTotal(),
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        icon: FileText,
      },
      {
        label: 'Paid',
        ...calculateTotal('PAID'),
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        icon: CheckCircle2,
      },
      {
        label: 'Pending',
        ...calculateTotal('PENDING'),
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
        icon: Clock,
      },
      {
        label: 'Overdue',
        ...calculateTotal('OVERDUE'),
        bgColor: 'bg-rose-50',
        textColor: 'text-rose-700',
        icon: AlertCircle,
      },
      {
        label: 'Draft',
        ...calculateTotal('DRAFT'),
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-700',
        icon: FileText,
      },
    ];
  }, [invoices]);

  // Tabs with counts
  const tabs = useMemo(() => {
    if (!invoices) return [];
    
    return [
      { label: 'All', count: stats[0]?.count || 0, value: null },
      { label: 'Paid', count: stats[1]?.count || 0, value: 'PAID' as InvoiceStatus },
      { label: 'Pending', count: stats[2]?.count || 0, value: 'PENDING' as InvoiceStatus },
      { label: 'Overdue', count: stats[3]?.count || 0, value: 'OVERDUE' as InvoiceStatus },
      { label: 'Draft', count: stats[4]?.count || 0, value: 'DRAFT' as InvoiceStatus },
    ];
  }, [stats, invoices]);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta fatura?')) {
      try {
        await deleteInvoice.mutateAsync(id);
        toast.success('Fatura excluída com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir fatura');
      }
    }
  };

  // Filtered invoices by search
  const filteredInvoices = useMemo(() => {
    if (!searchQuery) return invoices;
    
    return invoices.filter(invoice => 
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.tenant?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [invoices, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your invoices and billing</p>
        </div>
        <Link
          href="/invoices/create"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Invoice
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className={`rounded-full p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-xs text-gray-400">{stat.count} invoices</p>
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">
              ${stat.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setStatusFilter(tab.value)}
              className={`border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                statusFilter === tab.value
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {tab.label}{' '}
              <span className={statusFilter === tab.value ? 'text-blue-600' : 'text-gray-400'}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search customer or invoice number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Create
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Due
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                    No invoices found
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium text-white ${getAvatarColor(
                            invoice.tenant?.name || 'U'
                          )}`}
                        >
                          {(invoice.tenant?.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {invoice.tenant?.name || 'Unknown'}
                          </p>
                          <p className="text-xs text-gray-500">INV-{invoice.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">
                          {format(new Date(invoice.createdAt), 'dd MMM yyyy', { locale: ptBR })}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(invoice.createdAt), 'HH:mm', { locale: ptBR })} pm
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">
                          {format(new Date(invoice.dueDate), 'dd MMM yyyy', { locale: ptBR })}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(invoice.dueDate), 'HH:mm', { locale: ptBR })} am
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        ${Number(invoice.amountDue).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          statusStyles[invoice.status]
                        }`}
                      >
                        {statusLabels[invoice.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/invoices/${invoice.id}`}
                          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/invoices/${invoice.id}/edit`}
                          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(invoice.id)}
                          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && filteredInvoices.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Rows per page:</span>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {(page - 1) * limit + 1}-{Math.min(page * limit, pagination?.total || 0)} of{' '}
                {pagination?.total || 0}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= (pagination?.totalPages || 1)}
                  className="rounded p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
