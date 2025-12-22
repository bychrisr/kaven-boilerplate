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
  TextField,
  Avatar,
  Chip,
  IconButton,
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
      render: (user: { id: string; name: string; email: string; phone?: string; tenant?: { name: string }; role: string; status: string }) => (
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
      render: (user: { phone?: string }) => (
        <Typography variant="body2" color="secondary">
          {user.phone || '-'}
        </Typography>
      ),
    },
    {
      key: 'tenant',
      label: 'Tenant',
      render: (user: { tenant?: { name: string } }) => (
        <Typography variant="body2" color="secondary">
          {user.tenant?.name || '-'}
        </Typography>
      ),
    },
    {
      key: 'role',
      label: 'Função',
      render: (user: { role: string }) => (
        <Chip
          label={roleConfig[user.role as keyof typeof roleConfig]?.label || user.role}
          color={roleConfig[user.role as keyof typeof roleConfig]?.color || 'default'}
          size="sm"
        />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (user: { status: string }) => (
        <Chip
          label={statusConfig[user.status as keyof typeof statusConfig]?.label || user.status}
          color={statusConfig[user.status as keyof typeof statusConfig]?.color || 'default'}
          size="sm"
        />
      ),
    },
    {
      key: 'actions',
      label: 'Ações',
      align: 'right' as const,
      render: (user: { id: string }) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/users/${user.id}`}>
            <IconButton size="sm" aria-label="Ver detalhes">
              <Eye className="size-4" />
            </IconButton>
          </Link>
          <Link href={`/users/${user.id}/edit`}>
            <IconButton size="sm" aria-label="Editar">
              <Pencil className="size-4" />
            </IconButton>
          </Link>
          <IconButton
            size="sm"
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
      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.value || 'all'}
              onClick={() => setStatusFilter(tab.value || 'all' === 'all' ? null : tab.value)}
              className={`border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                (statusFilter || 'all') === (tab.value || 'all')
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-48 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Todas as funções</option>
          <option value="USER">Usuário</option>
          <option value="TENANT_ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>

        <TextField
          placeholder="Buscar por nome ou email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startAdornment={<Eye className="size-4" />}
          className="flex-1"
        />
      </div>

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
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-gray-500">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    {columns.map((col) => (
                      <td key={col.key} className={`px-6 py-4 ${col.align === 'right' ? 'text-right' : ''}`}>
                        {col.render(user)}
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
            <Typography variant="h6" className="mb-4">Excluir Usuário</Typography>
            <Typography className="mb-6">
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </Typography>
            <div className="flex justify-end gap-3">
              <Button onClick={() => setDeleteModalOpen(false)}>Cancelar</Button>
              <Button
                variant="contained"
                color="error"
                onClick={confirmDelete}
                disabled={deleteUserMutation.isPending}
              >
                {deleteUserMutation.isPending ? 'Excluindo...' : 'Excluir'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
