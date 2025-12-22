'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useUsers, useUserStats, useDeleteUser } from '@/hooks/use-users';
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react';

import {
  Typography,
  Button,
  Tabs,
  TextField,
  Select,
  DataTable,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  Skeleton,
} from '@/components';

// Status and role mappings
const statusConfig = {
  ACTIVE: { label: 'Ativo', color: 'success' as const },
  PENDING: { label: 'Pendente', color: 'warning' as const },
  BANNED: { label: 'Banido', color: 'error' as const },
  REJECTED: { label: 'Rejeitado', color: 'default' as const },
};

const roleConfig = {
  USER: { label: 'Usuário', color: 'primary' as const },
  TENANT_ADMIN: { label: 'Admin', color: 'secondary' as const },
  SUPER_ADMIN: { label: 'Super Admin', color: 'info' as const },
};

export default function UsersPage() {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const { data: usersData, isLoading } = useUsers({ page, limit });
  const { data: statsData } = useUserStats();
  const deleteUserMutation = useDeleteUser();

  const users = useMemo(() => usersData?.users || [], [usersData]);
  const pagination = useMemo(() => usersData?.pagination, [usersData]);

  // Tabs with counts
  const tabs = useMemo(() => {
    if (!statsData) return [];
    
    return [
      { label: `Todos (${statsData.total})`, value: null },
      { label: `Ativo (${statsData.active})`, value: 'ACTIVE' },
      { label: `Pendente (${statsData.pending})`, value: 'PENDING' },
      { label: `Banido (${statsData.banned})`, value: 'BANNED' },
      { label: `Rejeitado (${statsData.rejected})`, value: 'REJECTED' },
    ];
  }, [statsData]);

  const handleDelete = (id: string) => {
    setUserToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUserMutation.mutateAsync(userToDelete);
      setDeleteModalOpen(false);
      setUserToDelete(null);
    } catch {
      // Error handled by mutation hook
    }
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    
    let filtered = users;

    if (statusFilter) {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [users, statusFilter, roleFilter, searchQuery]);

  // DataTable columns
  const columns = [
    {
      key: 'name',
      label: 'Nome',
      render: (user: any) => (
        <div className="flex items-center gap-3">
          <Avatar size="md" alt={user.name}>
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <Typography variant="body2" className="font-medium">
              {user.name}
            </Typography>
            <Typography variant="caption" color="secondary">
              {user.email}
            </Typography>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Telefone',
      render: (user: any) => (
        <Typography variant="body2" color="secondary">
          {user.phone || '-'}
        </Typography>
      ),
    },
    {
      key: 'tenant',
      label: 'Tenant',
      render: (user: any) => (
        <Typography variant="body2" color="secondary">
          {user.tenant?.name || '-'}
        </Typography>
      ),
    },
    {
      key: 'role',
      label: 'Função',
      render: (user: any) => (
        <Chip
          label={roleConfig[user.role as keyof typeof roleConfig]?.label || user.role}
          color={roleConfig[user.role as keyof typeof roleConfig]?.color || 'default'}
          size="small"
        />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (user: any) => (
        <Chip
          label={statusConfig[user.status as keyof typeof statusConfig]?.label || user.status}
          color={statusConfig[user.status as keyof typeof statusConfig]?.color || 'default'}
          size="small"
        />
      ),
    },
    {
      key: 'actions',
      label: 'Ações',
      align: 'right' as const,
      render: (user: any) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/users/${user.id}`}>
            <IconButton size="small" aria-label="Ver detalhes">
              <Eye className="size-4" />
            </IconButton>
          </Link>
          <Link href={`/users/${user.id}/edit`}>
            <IconButton size="small" aria-label="Editar">
              <Pencil className="size-4" />
            </IconButton>
          </Link>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(user.id)}
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <Typography variant="h4">Lista de Usuários</Typography>
        <Link href="/users/create">
          <Button variant="contained" color="primary" startIcon={<Plus className="size-4" />}>
            Adicionar Usuário
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs value={statusFilter || 'all'} onChange={(value) => setStatusFilter(value === 'all' ? null : value)}>
        <Tabs.List>
          {tabs.map((tab) => (
            <Tabs.Trigger key={tab.value || 'all'} value={tab.value || 'all'}>
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          placeholder="Função"
          className="w-48"
        >
          <option value="">Todas as funções</option>
          <option value="USER">Usuário</option>
          <option value="TENANT_ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </Select>

        <TextField
          placeholder="Buscar por nome ou email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startAdornment={<Eye className="size-4" />}
          className="flex-1"
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        pagination={{
          page,
          pageSize: limit,
          total: pagination?.total || 0,
          onPageChange: setPage,
          onPageSizeChange: setLimit,
        }}
        emptyMessage="Nenhum usuário encontrado"
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Dialog.Title>Excluir Usuário</Dialog.Title>
        <Dialog.Content>
          <Typography>
            Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
          </Typography>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onClick={() => setDeleteModalOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmDelete}
            disabled={deleteUserMutation.isPending}
          >
            {deleteUserMutation.isPending ? 'Excluindo...' : 'Excluir'}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </div>
  );
}
