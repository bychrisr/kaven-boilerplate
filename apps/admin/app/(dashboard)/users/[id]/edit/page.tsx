'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { useUser, useUpdateUser } from '@/hooks/use-users';
import { useTenants } from '@/hooks/use-tenants';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

const userSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  role: z.enum(['USER', 'TENANT_ADMIN', 'SUPER_ADMIN']),
  tenantId: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const { data: user, isLoading } = useUser(userId);
  const updateUser = useUpdateUser(userId);
  const { tenants, isLoading: isLoadingTenants } = useTenants();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  // Populate form when user data loads
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UserFormData) => {
    try {
      await updateUser.mutateAsync(data);
      router.push('/users');
    } catch {
      // Error já tratado no hook com toast
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-800">Usuário não encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/users" className="rounded-lg p-2 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Usuário</h1>
          <p className="mt-1 text-sm text-gray-500">
            Atualize os dados do usuário
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nome completo
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Permissão
            </label>
            <select
              {...register('role')}
              id="role"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={user.role === 'SUPER_ADMIN'}
            >
              <option value="USER">Usuário</option>
              <option value="TENANT_ADMIN">Administrador</option>
            </select>
            {user.role === 'SUPER_ADMIN' && (
              <p className="mt-1 text-sm text-gray-500">
                SUPER_ADMIN não pode ser editado
              </p>
            )}
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          {/* Tenant Selection */}
          <div>
            <label
              htmlFor="tenantId"
              className="block text-sm font-medium text-gray-700"
            >
              Tenant
            </label>
            {isLoadingTenants ? (
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando tenants...
              </div>
            ) : (
              <select
                {...register('tenantId')}
                id="tenantId"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Sem tenant (SUPER_ADMIN)</option>
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

          {/* Info */}
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> A senha não pode ser alterada por aqui. O
              usuário deve usar a função &quot;Esqueci minha senha&quot; para redefini-la.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t pt-6">
            <Link
              href="/users"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || updateUser.isPending}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting || updateUser.isPending
                ? 'Salvando...'
                : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
