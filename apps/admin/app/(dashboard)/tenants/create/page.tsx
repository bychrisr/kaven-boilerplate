'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTenants } from '@/hooks/use-tenants';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

const createTenantSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  slug: z.string()
    .min(2, 'Slug deve ter pelo menos 2 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  domain: z.string().optional().or(z.literal('')),
});

type CreateTenantFormData = z.infer<typeof createTenantSchema>;

export default function CreateTenantPage() {
  const router = useRouter();
  const { createTenant } = useTenants();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(createTenantSchema),
    defaultValues: {
      domain: '',
    },
  });

  // Auto-generate slug from name if slug is empty
  // eslint-disable-next-line react-hooks/incompatible-library
  const name = watch('name');
  const slug = watch('slug');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setValue('name', newName);
    
    // Only auto-generate if slug hasn't been manually edited or is empty
    if (!slug || slug === name?.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replaceAll(/(^-+)|(-+$)/g, '')) {
      const newSlug = newName
        .toLowerCase()
        .replaceAll(/[^a-z0-9]+/g, '-')
        .replaceAll(/(^-+)|(-+$)/g, '');
      setValue('slug', newSlug);
    }
  };

  const onSubmit = async (data: CreateTenantFormData) => {
    try {
      await createTenant.mutateAsync({
        name: data.name,
        slug: data.slug,
        domain: data.domain || undefined, // Send undefined if empty string
      });
      router.push('/tenants');
    } catch (error) {
      // Error handled by hook
      console.error(error);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Novo Tenant</h1>
          <p className="text-sm text-gray-500">
            Cadastre uma nova organização no sistema
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
                onChange={handleNameChange}
                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${
                  errors.name
                    ? 'border-error-main focus:border-error-main focus:ring-error-light/50'
                    : 'border-gray-300 focus:border-primary-main focus:ring-primary-main/50'
                }`}
                placeholder="Ex: Acme Corporation"
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
                  placeholder="acme-corp"
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
                placeholder="app.acme.com"
              />
              {errors.domain && (
                <p className="mt-1 text-sm text-error-main">{errors.domain.message}</p>
              )}
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
              disabled={createTenant.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-main rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {createTenant.isPending ? 'Criando...' : 'Criar Tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
