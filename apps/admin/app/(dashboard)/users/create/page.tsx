'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useCreateUser } from '@/hooks/use-users';
import { useTenants } from '@/hooks/use-tenants';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

const userSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  role: z.enum(['USER', 'TENANT_ADMIN']),
  tenantAssignment: z.enum(['create_own', 'existing']),
  tenantId: z.string().optional(),
}).refine(
  (data) => {
    if (data.tenantAssignment === 'existing') {
      return !!data.tenantId;
    }
    return true;
  },
  {
    message: 'Selecione um tenant',
    path: ['tenantId'],
  }
);

type UserFormData = z.infer<typeof userSchema>;

export default function CreateUserPage() {
  const router = useRouter();
  const createUser = useCreateUser();
  const { tenants, isLoading: isLoadingTenants } = useTenants();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'USER',
      tenantAssignment: 'create_own',
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const tenantAssignment = watch('tenantAssignment');

  const onSubmit = async (data: UserFormData) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role,
        password: data.password,
        role: data.role,
        tenantId:
          data.tenantAssignment === 'create_own'
            ? 'create-own'
            : data.tenantId === ''
              ? undefined
              : data.tenantId,
      };
      await createUser.mutateAsync(payload);
      router.push('/users');
    } catch {
      // Error já tratado no hook com toast
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/users"
          className="rounded-lg p-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Usuário</h1>
          <p className="mt-1 text-sm text-gray-500">
            Preencha os dados para criar um novo usuário
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
              placeholder="João Silva"
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
              placeholder="joao@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Telefone
            </label>
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="+55 11 99999-9999"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <input
              {...register('password')}
              type="password"
              id="password"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
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
            >
              <option value="USER">Usuário</option>
              <option value="TENANT_ADMIN">Administrador</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          {/* Tenant Assignment */}
          <div>
            <label
              htmlFor="tenantAssignment"
              className="block text-sm font-medium text-gray-700"
            >
              Associação de Tenant
            </label>
            <select
              {...register('tenantAssignment')}
              id="tenantAssignment"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="create_own">Criar tenant próprio (Camaleão)</option>
              <option value="existing">Associar a tenant existente</option>
            </select>
          </div>

          {/* Conditional: Tenant Selection */}
          {tenantAssignment === 'existing' && (
            <div>
              <label
                htmlFor="tenantId"
                className="block text-sm font-medium text-gray-700"
              >
                Selecione o Tenant
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
                  <option value="">Selecione um tenant</option>
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
          )}

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
              disabled={isSubmitting || createUser.isPending}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting || createUser.isPending ? 'Criando...' : 'Criar Usuário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
