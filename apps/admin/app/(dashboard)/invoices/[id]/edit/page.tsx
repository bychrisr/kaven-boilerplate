'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useInvoice, useInvoices } from '@/hooks/use-invoices';
import { useTenants } from '@/hooks/use-tenants';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

const editInvoiceSchema = z.object({
  tenantId: z.string().min(1, 'Selecione um tenant/cliente'),
  amountDue: z.coerce.number().min(0.01, 'O valor deve ser maior que zero'),
  dueDate: z.string().min(1, 'Data de vencimento é obrigatória'),
  status: z.enum(['DRAFT', 'PENDING', 'PAID', 'OVERDUE', 'CANCELED']),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

type EditInvoiceFormData = z.infer<typeof editInvoiceSchema>;

export default function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: invoice, isLoading: isLoadingInvoice } = useInvoice(id);
  const { updateInvoice } = useInvoices();
  const { tenants, isLoading: isLoadingTenants } = useTenants();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditInvoiceFormData>({
    resolver: zodResolver(editInvoiceSchema),
  });

  useEffect(() => {
    if (invoice) {
      reset({
        tenantId: invoice.tenantId,
        amountDue: invoice.amountDue,
        dueDate: new Date(invoice.dueDate).toISOString().split('T')[0],
        status: invoice.status,
        metadata: invoice.metadata,
      });
    }
  }, [invoice, reset]);

  const onSubmit = async (data: EditInvoiceFormData) => {
    try {
      await updateInvoice.mutateAsync({
        id,
        data: {
          tenantId: data.tenantId,
          amountDue: Number(data.amountDue),
          dueDate: new Date(data.dueDate),
          status: data.status,
          currency: 'BRL',
          metadata: data.metadata,
        },
      });
      router.push(`/invoices/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoadingInvoice) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-main" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Fatura não encontrada</p>
        <Link href="/invoices" className="text-primary-main hover:underline mt-4 inline-block">
          Voltar para faturas
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/invoices/${id}`}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Fatura</h1>
          <p className="text-sm text-gray-500">
            Atualize os dados da fatura #{invoice.id.slice(0, 8)}
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Tenant Selection */}
            <div className="col-span-2">
              <label htmlFor="tenantId" className="block text-sm font-medium text-gray-700 mb-1">
                Cliente / Tenant *
              </label>
              {isLoadingTenants ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Carregando clientes...
                </div>
              ) : (
                <select
                  id="tenantId"
                  {...register('tenantId')}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
                >
                  <option value="">Selecione um cliente</option>
                  {tenants.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </option>
                  ))}
                </select>
              )}
              {errors.tenantId && (
                <p className="mt-1 text-sm text-red-600">{errors.tenantId.message}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amountDue" className="block text-sm font-medium text-gray-700 mb-1">
                Valor (R$) *
              </label>
              <input
                id="amountDue"
                type="number"
                step="0.01"
                {...register('amountDue')}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
                placeholder="0.00"
              />
              {errors.amountDue && (
                <p className="mt-1 text-sm text-red-600">{errors.amountDue.message}</p>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Data de Vencimento *
              </label>
              <input
                id="dueDate"
                type="date"
                {...register('dueDate')}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="col-span-2">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                {...register('status')}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
              >
                <option value="DRAFT">Rascunho</option>
                <option value="PENDING">Pendente</option>
                <option value="PAID">Pago</option>
                <option value="OVERDUE">Vencido</option>
                <option value="CANCELED">Cancelado</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={updateInvoice.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-main px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateInvoice.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </button>
            <Link
              href={`/invoices/${id}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
