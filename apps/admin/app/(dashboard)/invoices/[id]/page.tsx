'use client';

import { useInvoice } from '@/hooks/use-invoices';
import { useInvoices, InvoiceStatus } from '@/hooks/use-invoices';
import { ArrowLeft, Send, Download, Loader2, FileText, Calendar, Building2, CreditCard, CheckCircle2, AlertCircle, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusConfig: Record<InvoiceStatus, { label: string; color: string; icon: any }> = {
  PAID: { label: 'Pago', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  PENDING: { label: 'Pendente', color: 'bg-amber-100 text-amber-700', icon: Clock },
  OVERDUE: { label: 'Vencido', color: 'bg-rose-100 text-rose-700', icon: AlertCircle },
  DRAFT: { label: 'Rascunho', color: 'bg-gray-100 text-gray-700', icon: FileText },
  CANCELED: { label: 'Cancelado', color: 'bg-slate-100 text-slate-700', icon: XCircle },
};

export default function InvoiceDetailsPage({ params }: { params: { id: string } }) {
  const { data: invoice, isLoading, error } = useInvoice(params.id);
  const { sendInvoice } = useInvoices(); // Getting mutations

  const handleSendEmail = async () => {
    if (confirm('Deseja reenviar a fatura por e-mail para o cliente?')) {
      await sendInvoice.mutateAsync(params.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-main" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Fatura não encontrada</h1>
        <p className="text-gray-500">A fatura solicitada não existe ou foi removida.</p>
        <Link
          href="/invoices"
          className="text-primary-main hover:underline"
        >
          Voltar para listagem
        </Link>
      </div>
    );
  }

  const status = statusConfig[invoice.status];
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/invoices"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Fatura #{invoice.id.slice(0, 8)}</h1>
              <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
                <StatusIcon className="h-3.5 w-3.5" />
                {status.label}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Emitida em {format(new Date(invoice.createdAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
             disabled={sendInvoice.isPending}
             onClick={handleSendEmail}
             className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-offset-2 disabled:opacity-50"
          >
             <Send className="h-4 w-4" />
             {sendInvoice.isPending ? 'Enviando...' : 'Reenviar Email'}
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary-main px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-offset-2">
            <Download className="h-4 w-4" />
            Baixar PDF
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Detalhes da Cobrança</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Valor Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: invoice.currency,
                  }).format(invoice.amountDue)}
                </p>
              </div>
              
               <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Valor Pago</p>
                <p className="text-xl font-semibold text-emerald-600">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: invoice.currency,
                  }).format(invoice.amountPaid)}
                </p>
              </div>

               <div>
                <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Data de Vencimento
                </p>
                <p className="text-base text-gray-900">
                  {format(new Date(invoice.dueDate), "dd/MM/yyyy", { locale: ptBR })}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  Data de Pagamento
                </p>
                <p className="text-base text-gray-900">
                  {invoice.paidAt 
                    ? format(new Date(invoice.paidAt), "dd/MM/yyyy HH:mm", { locale: ptBR }) 
                    : '-'}
                </p>
              </div>
            </div>
            
             {invoice.metadata && Object.keys(invoice.metadata).length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <p className="text-sm font-medium text-gray-500 mb-2">Metadados</p>
                <pre className="bg-gray-50 p-3 rounded-md text-xs text-gray-700 overflow-x-auto">
                  {JSON.stringify(invoice.metadata, null, 2)}
                </pre>
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
            {invoice.tenant ? (
              <div className="space-y-3">
                 <div>
                  <p className="text-sm text-gray-400">Nome</p>
                  <p className="font-medium text-gray-900">{invoice.tenant.name}</p>
                 </div>
                 {/* ID is tenantId */}
                 <div>
                  <p className="text-sm text-gray-400">ID do Tenant</p>
                  <p className="text-xs font-mono bg-gray-100 p-1 rounded inline-block text-gray-600">
                    {invoice.tenantId}
                  </p>
                 </div>
              </div>
            ) : (
                <p className="text-sm text-gray-500 italic">Informações do cliente indisponíveis.</p>
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
          
           {/* Payment Info */}
           <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Pagamento
            </h3>
            <div className="space-y-3">
               <div>
                  <p className="text-sm text-gray-400">ID da Assinatura</p>
                  <p className="text-sm text-gray-900 break-all">
                    {invoice.subscriptionId || '-'}
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
