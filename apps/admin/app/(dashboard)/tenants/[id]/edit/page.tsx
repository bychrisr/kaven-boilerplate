'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTenants } from '@/hooks/use-tenants';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

const updateTenantSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  slug: z.string()
    .min(2, 'Slug deve ter pelo menos 2 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  domain: z.string().optional().or(z.literal('')),
  active: z.boolean(),
});

type UpdateTenantFormData = z.infer<typeof updateTenantSchema>;

export default function EditTenantPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { tenants, isLoading: isLoadingTenants, updateTenant } = useTenants();
  
  const tenant = tenants?.find((t) => t.id === params.id);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateTenantFormData>({
    resolver: zodResolver(updateTenantSchema),
  });

  useEffect(() => {
    if (tenant) {
      reset({
        name: tenant.name,
        slug: tenant.slug,
        domain: tenant.domain || '',
        active: tenant.active,
      });
    }
  }, [tenant, reset]);

  const onSubmit = async (data: UpdateTenantFormData) => {
    try {
      await updateTenant.mutateAsync({
        id: params.id,
        data: {
          ...data,
          domain: data.domain || undefined,
        },
      });
      router.push('/tenants');
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoadingTenants) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-main" />
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Tenant não encontrado</h1>
        <Link
          href="/tenants"
          className="text-primary-main hover:underline"
        >
          Voltar para listagem
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/tenants"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Tenant</h1>
          <p className="text-sm text-gray-500">
            Atualize as informações de {tenant.name}
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Name */}
            <div className="col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Organização *
              </label>
              <input
                id="name"
                type="text"
                {...register('name')}
                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${
                  errors.name
                    ? 'border-error-main focus:border-error-main focus:ring-error-light/50'
                    : 'border-gray-300 focus:border-primary-main focus:ring-primary-main/50'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-error-main">{errors.name.message}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                Slug (URL Identifier) *
              </label>
              <div className="flex items-center">
                <span className="inline-flex items-center px-3 py-2 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  /
                </span>
                <input
                  id="slug"
                  type="text"
                  {...register('slug')}
                  className={`flex-1 w-full rounded-r-lg border px-4 py-2 focus:outline-none focus:ring-2 ${
                    errors.slug
                      ? 'border-error-main focus:border-error-main focus:ring-error-light/50'
                      : 'border-gray-300 focus:border-primary-main focus:ring-primary-main/50'
                  }`}
                />
              </div>
              {errors.slug && (
                <p className="mt-1 text-sm text-error-main">{errors.slug.message}</p>
              )}
            </div>

            {/* Domain */}
            <div>
              <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
                Domínio Personalizado (Opcional)
              </label>
              <input
                id="domain"
                type="text"
                {...register('domain')}
                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${
                  errors.domain
                    ? 'border-error-main focus:border-error-main focus:ring-error-light/50'
                    : 'border-gray-300 focus:border-primary-main focus:ring-primary-main/50'
                }`}
              />
              {errors.domain && (
                <p className="mt-1 text-sm text-error-main">{errors.domain.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('active')}
                  className="h-4 w-4 rounded border-gray-300 text-primary-main focus:ring-primary-main"
                />
                <span className="text-sm font-medium text-gray-700">Tenant Ativo</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Link
              href="/tenants"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={updateTenant.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-main rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {updateTenant.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
