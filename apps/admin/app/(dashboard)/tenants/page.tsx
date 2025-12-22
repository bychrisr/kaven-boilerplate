'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTenants } from '@/hooks/use-tenants';
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Building2,
  Globe,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import {
  Typography,
  Button,
  TextField,
  Chip,
  IconButton,
  Skeleton,
} from '@/components';

type Tenant = {
  id: string;
  name: string;
  slug: string;
  domain?: string | null;
  status: string;
  createdAt: string;
};

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

  const columns = [
    {
      key: 'name',
      label: 'Nome / Slug',
      render: (tenant: Tenant) => (
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary-light/10 text-primary-main">
            <Building2 className="size-5" />
          </div>
          <div>
            <Typography variant="body2" className="font-medium">
              {tenant.name}
            </Typography>
            <Typography variant="caption" color="secondary">
              @{tenant.slug}
            </Typography>
          </div>
        </div>
      ),
    },
    {
      key: 'domain',
      label: 'Domínio',
      render: (tenant: Tenant) =>
        tenant.domain ? (
          <div className="flex items-center gap-2">
            <Globe className="size-4" />
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
          <Typography variant="body2" color="secondary">
            -
          </Typography>
        ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (tenant: Tenant) => {
        const statusLabel = tenant.status === 'ACTIVE' ? 'Ativo' : tenant.status === 'SUSPENDED' ? 'Suspenso' : 'Inativo';
        return (
          <Chip
            label={statusLabel}
            color={tenant.status === 'ACTIVE' ? 'success' : 'default'}
            size="sm"
          />
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Criado em',
      render: (tenant: Tenant) => (
        <Typography variant="body2" color="secondary">
          {format(new Date(tenant.createdAt), "d 'de' MMM, yyyy", { locale: ptBR })}
        </Typography>
      ),
    },
    {
      key: 'actions',
      label: 'Ações',
      align: 'right' as const,
      render: (tenant: Tenant) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/tenants/${tenant.id}`}>
            <IconButton size="sm" aria-label="Ver detalhes">
              <Eye className="size-4" />
            </IconButton>
          </Link>
          <Link href={`/tenants/${tenant.id}/edit`}>
            <IconButton size="sm" aria-label="Editar">
              <Pencil className="size-4" />
            </IconButton>
          </Link>
          <IconButton
            size="sm"
            color="error"
            onClick={() => handleDelete(tenant.id, tenant.name)}
            aria-label="Excluir"
          >
            <Trash2 className="size-4" />
          </IconButton>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="rectangular" height={40} />
        <Skeleton variant="rectangular" height={400} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography variant="h4">Tenants</Typography>
          <Typography variant="body2" color="secondary">
            Gerencie as organizações e clientes do sistema
          </Typography>
        </div>
        <Link href="/tenants/create">
          <Button variant="contained" color="primary" startIcon={<Plus className="size-4" />}>
            Novo Tenant
          </Button>
        </Link>
      </div>

      <TextField
        placeholder="Buscar tenants por nome ou slug..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
      />

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 ${
                      col.align === 'right' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {!filteredTenants || filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-gray-500">
                    {searchTerm ? `Nenhum tenant encontrado para "${searchTerm}"` : 'Nenhum tenant cadastrado.'}
                  </td>
                </tr>
              ) : (
                filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-gray-50">
                    {columns.map((col) => (
                      <td key={col.key} className={`px-6 py-4 ${col.align === 'right' ? 'text-right' : ''}`}>
                        {col.render(tenant)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-modal flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <Typography variant="h6" className="mb-4">Excluir Tenant</Typography>
            <Typography className="mb-6">
              Tem certeza que deseja excluir o tenant &quot;{tenantToDelete?.name}&quot;? Esta ação removerá todos os dados
              associados e não pode ser desfeita.
            </Typography>
            <div className="flex justify-end gap-3">
              <Button onClick={() => setDeleteModalOpen(false)}>Cancelar</Button>
              <Button variant="contained" color="error" onClick={confirmDelete} disabled={deleteTenant.isPending}>
                {deleteTenant.isPending ? 'Excluindo...' : 'Excluir'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
