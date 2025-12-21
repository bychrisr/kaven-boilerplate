'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useInvoices } from '@/hooks/use-invoices';
import { useTenants } from '@/hooks/use-tenants';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

const createInvoiceSchema = z.object({
  tenantId: z.string().min(1, 'Selecione um tenant/cliente'),
  amountDue: z.coerce.number().min(0.01, 'O valor deve ser maior que zero'),
  dueDate: z.string().min(1, 'Data de vencimento é obrigatória'),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

type CreateInvoiceFormData = z.infer<typeof createInvoiceSchema>;

export default function CreateInvoicePage() {
  const router = useRouter();
  const { createInvoice } = useInvoices();
  const { tenants, isLoading: isLoadingTenants } = useTenants();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      amountDue: 0,
    },
  });

  const onSubmit = async (data: CreateInvoiceFormData) => {
    try {
      await createInvoice.mutateAsync({
        tenantId: data.tenantId,
        amountDue: Number(data.amountDue),
        dueDate: new Date(data.dueDate),
        currency: 'BRL',
        metadata: data.metadata,
      });
      router.push('/invoices');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/invoices"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nova Fatura</h1>
          <p className="text-sm text-gray-500">
            Crie uma nova cobrança para um cliente
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
                  className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 bg-white ${
                    errors.tenantId
                      ? 'border-error-main focus:border-error-main focus:ring-error-light/50'
                      : 'border-gray-300 focus:border-primary-main focus:ring-primary-main/50'
                  }`}
                >
                  <option value="">Selecione um cliente</option>
                  {tenants?.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.name} ({tenant.slug})
                    </option>
                  ))}
                </select>
              )}
              {errors.tenantId && (
                <p className="mt-1 text-sm text-error-main">{errors.tenantId.message}</p>
              )}
              {tenants?.length === 0 && !isLoadingTenants && (
                <p className="mt-1 text-sm text-amber-600">
                  Nenhum tenant encontrado. <Link href="/tenants/create" className="underline font-medium">Crie um tenant primeiro</Link>.
                </p>
              )}
            </div>

            {/* Amount Due */}
            <div>
              <label htmlFor="amountDue" className="block text-sm font-medium text-gray-700 mb-1">
                Valor (BRL) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2 text-gray-500">R$</span>
                <input
                  id="amountDue"
                  type="number"
                  step="0.01"
                  min="0.01"
                  {...register('amountDue')}
                  className={`w-full rounded-lg border pl-10 pr-4 py-2 focus:outline-none focus:ring-2 ${
                    errors.amountDue
                      ? 'border-error-main focus:border-error-main focus:ring-error-light/50'
                      : 'border-gray-300 focus:border-primary-main focus:ring-primary-main/50'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.amountDue && (
                <p className="mt-1 text-sm text-error-main">{errors.amountDue.message}</p>
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
                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${
                  errors.dueDate
                    ? 'border-error-main focus:border-error-main focus:ring-error-light/50'
                    : 'border-gray-300 focus:border-primary-main focus:ring-primary-main/50'
                }`}
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-error-main">{errors.dueDate.message}</p>
              )}
            </div>

            <div className="col-span-2">
               <p className="text-xs text-gray-500">
                 * Campos obrigatórios. A fatura será gerada com status &quot;Rascunho&quot; ou &quot;Pendente&quot; dependendo da configuração.
               </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Link
              href="/invoices"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={createInvoice.isPending || isLoadingTenants}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-main rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {createInvoice.isPending ? 'Criando...' : 'Criar Fatura'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
