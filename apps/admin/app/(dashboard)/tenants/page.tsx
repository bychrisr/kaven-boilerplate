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
  DataTable,
  Chip,
  IconButton,
  Dialog,
  Skeleton,
} from '@/components';

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
      render: (tenant: any) => (
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
      render: (tenant: any) =>
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
      render: (tenant: any) => (
        <Chip
          label={tenant.status === 'ACTIVE' ? 'Ativo' : tenant.status === 'SUSPENDED' ? 'Suspenso' : 'Inativo'}
          color={tenant.status === 'ACTIVE' ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      key: 'createdAt',
      label: 'Criado em',
      render: (tenant: any) => (
        <Typography variant="body2" color="secondary">
          {format(new Date(tenant.createdAt), "d 'de' MMM, yyyy", { locale: ptBR })}
        </Typography>
      ),
    },
    {
      key: 'actions',
      label: 'Ações',
      align: 'right' as const,
      render: (tenant: any) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/tenants/${tenant.id}`}>
            <IconButton size="small" aria-label="Ver detalhes">
              <Eye className="size-4" />
            </IconButton>
          </Link>
          <Link href={`/tenants/${tenant.id}/edit`}>
            <IconButton size="small" aria-label="Editar">
              <Pencil className="size-4" />
            </IconButton>
          </Link>
          <IconButton
            size="small"
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

      <DataTable
        columns={columns}
        data={filteredTenants || []}
        emptyMessage={searchTerm ? `Nenhum tenant encontrado para "${searchTerm}"` : 'Nenhum tenant cadastrado.'}
      />

      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Dialog.Title>Excluir Tenant</Dialog.Title>
        <Dialog.Content>
          <Typography>
            Tem certeza que deseja excluir o tenant "{tenantToDelete?.name}"? Esta ação removerá todos os dados
            associados e não pode ser desfeita.
          </Typography>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onClick={() => setDeleteModalOpen(false)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={confirmDelete} disabled={deleteTenant.isPending}>
            {deleteTenant.isPending ? 'Excluindo...' : 'Excluir'}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </div>
  );
}
