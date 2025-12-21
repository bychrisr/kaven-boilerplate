'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTenants } from '@/hooks/use-tenants';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Building2,
  Globe,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';


export default function TenantsPage() {
  const { tenants, isLoading, deleteTenant } = useTenants();
  const [searchTerm, setSearchTerm] = useState('');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState<{ id: string; name: string } | null>(null);

  const filteredTenants = tenants?.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    setTenantToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!tenantToDelete) return;
    try {
      await deleteTenant.mutateAsync(tenantToDelete.id);
      setDeleteModalOpen(false);
      setTenantToDelete(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
          <p className="text-sm text-gray-500">
            Gerencie as organizações e clientes do sistema
          </p>
        </div>
        <Link
          href="/tenants/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-main px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          Novo Tenant
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center rounded-lg border bg-white p-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar tenants por nome ou slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-300 pl-10 py-2 text-sm focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
              <tr>
                <th className="px-6 py-3">Nome / Slug</th>
                <th className="px-6 py-3">Domínio</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Criado em</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(() => {
                if (isLoading) {
                  return (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        <div className="flex justify-center items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-main border-t-transparent"></div>
                          Carregando tenants...
                        </div>
                      </td>
                    </tr>
                  );
                }

                if (filteredTenants?.length === 0) {
                  return (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        {searchTerm ? `Nenhum tenant encontrado para "${searchTerm}"` : 'Nenhum tenant cadastrado.'}
                      </td>
                    </tr>
                  );
                }

                return filteredTenants?.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light/10 text-primary-main">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{tenant.name}</p>
                          <p className="text-xs text-gray-500">@{tenant.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {tenant.domain ? (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Globe className="h-4 w-4" />
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
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        tenant.status === 'ACTIVE'
                          ? 'bg-success-light/20 text-success-dark' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
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
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {format(new Date(tenant.createdAt), "d 'de' MMM, yyyy", { locale: ptBR })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/tenants/${tenant.id}/edit`}
                          className="p-2 text-gray-400 hover:text-primary-main transition-colors"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(tenant.id, tenant.name)}
                          className="p-2 text-gray-400 hover:text-error-main transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>


      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Tenant"
        message={`Tem certeza que deseja excluir o tenant "${tenantToDelete?.name}"? Esta ação removerá todos os dados associados e não pode ser desfeita.`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        variant="danger"
        isLoading={deleteTenant.isPending}
      />
    </div>
  );
}
