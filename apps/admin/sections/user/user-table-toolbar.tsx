/**
 * User Table Toolbar
 * Filters and search for users table
 */

'use client';

import { Search } from 'lucide-react';

type UserTableToolbarProps = {
  filterName: string;
  onFilterName: (value: string) => void;
  filterRole: string;
  onFilterRole: (value: string) => void;
  filterStatus: string;
  onFilterStatus: (value: string) => void;
};

export function UserTableToolbar({
  filterName,
  onFilterName,
  filterRole,
  onFilterRole,
  filterStatus,
  onFilterStatus,
}: UserTableToolbarProps) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={filterName}
              onChange={(e) => onFilterName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Role Filter */}
        <select
          value={filterRole}
          onChange={(e) => onFilterRole(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todas as funções</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">Usuário</option>
          <option value="MANAGER">Gerente</option>
          <option value="VIEWER">Visualizador</option>
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => onFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos os status</option>
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
          <option value="pending">Pendente</option>
          <option value="suspended">Suspenso</option>
        </select>
      </div>
    </div>
  );
}
