'use client';

import { use } from 'react';
import Link from 'next/link';
import { useTenant } from '@/hooks/use-tenants';
import { useUsers } from '@/hooks/use-users';
import {
  ChevronLeft,
  Pencil,
  Building2,
  Globe,
  Calendar,
  CheckCircle2,
  XCircle,
  Mail,
  User as UserIcon,
  Shield,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function TenantDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: tenant, isLoading: isLoadingTenant } = useTenant(id);
  const { data: usersData, isLoading: isLoadingUsers } = useUsers({
    tenantId: id,
    limit: 100, // Listar todos ou muitos
  });

  const users = usersData?.users || [];

  if (isLoadingTenant) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-main" />
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Tenant não encontrado</h2>
        <Link href="/tenants" className="text-primary-main hover:underline">
          Voltar para listagem
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/tenants"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{tenant.name}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-medium">@{tenant.slug}</span>
              <span>•</span>
              <span>ID: {tenant.id}</span>
            </div>
          </div>
        </div>

        <Link
          href={`/tenants/${tenant.id}/edit`}
          className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-main transition-all shadow-sm"
        >
          <Pencil className="h-4 w-4" />
          Editar Tenant
        </Link>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Status Card */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Building2 className="h-5 w-5" />
            </div>
            <h3 className="font-medium text-gray-900">Status & Domínio</h3>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Status Atual</p>
              <div
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  tenant.status === 'ACTIVE'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tenant.status === 'ACTIVE' ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Ativo
                  </>
                ) : (
                  <>
                    <XCircle className="h-3.5 w-3.5" />
                    {tenant.status === 'SUSPENDED' ? 'Suspenso' : 'Inativo'}
                  </>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Domínio Personalizado</p>
              {tenant.domain ? (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <a
                    href={`https://${tenant.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary-main hover:underline"
                  >
                    {tenant.domain}
                  </a>
                </div>
              ) : (
                <span className="text-sm text-gray-400 italic">Não configurado</span>
              )}
            </div>
          </div>
        </div>

        {/* Brand Card */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="font-medium text-gray-900">Identidade</h3>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Nome da Organização</p>
              <p className="text-sm font-medium text-gray-900">{tenant.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Slug (Identificador)</p>
              <code className="text-sm bg-gray-50 px-2 py-1 rounded text-gray-700">
                {tenant.slug}
              </code>
            </div>
          </div>
        </div>

        {/* Meta Card */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="font-medium text-gray-900">Metadados</h3>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Data de Criação</p>
              <p className="text-sm text-gray-700">
                {format(new Date(tenant.createdAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
              <p className="text-xs text-gray-400">
                às {format(new Date(tenant.createdAt), 'HH:mm', { locale: ptBR })}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Última Atualização</p>
              <p className="text-sm text-gray-700">
                {format(new Date(tenant.updatedAt), "d 'de' MMM, yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-gray-400" />
            Usuários do Tenant
            <span className="ml-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              {users.length}
            </span>
          </h2>

          <Link
            href="/users/create"
            className="text-sm font-medium text-primary-main hover:text-primary-dark hover:underline"
          >
            Adicionar novo usuário
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {(() => {
            if (isLoadingUsers) {
              return (
                <div className="flex h-32 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              );
            }

            if (users.length === 0) {
              return (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="rounded-full bg-gray-50 p-3 mb-3">
                    <UserIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-900 font-medium">Nenhum usuário encontrado</p>
                  <p className="text-sm text-gray-500 max-w-sm mt-1">
                    Este tenant ainda não possui usuários associados.
                  </p>
                </div>
              );
            }

            return (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-55 text-gray-600 font-medium border-b">
                    <tr>
                      <th className="px-6 py-3">Usuário</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Função</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Cadastrado em</th>
                      <th className="px-6 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-xs">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            {user.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5 text-gray-400" />
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              user.role === 'TENANT_ADMIN'
                                ? 'bg-purple-50 text-purple-700'
                                : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            {user.role === 'TENANT_ADMIN' ? 'Admin' : 'Usuário'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              user.status === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {user.status === 'ACTIVE' ? 'Ativo' : user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {format(new Date(user.createdAt), 'd MMM, yyyy', { locale: ptBR })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/users/${user.id}`}
                            className="text-primary-main hover:underline font-medium text-xs"
                          >
                            Ver Perfil
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
