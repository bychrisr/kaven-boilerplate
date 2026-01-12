/**
 * Tenant Table Toolbar
 * Filters and view toggle for tenants
 */

'use client';

import { Search, Grid, List } from 'lucide-react';

type TenantTableToolbarProps = {
  filterName: string;
  onFilterName: (value: string) => void;
  filterPlan: string;
  onFilterPlan: (value: string) => void;
  filterStatus: string;
  onFilterStatus: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
};

export function TenantTableToolbar({
  filterName,
  onFilterName,
  filterPlan,
  onFilterPlan,
  filterStatus,
  onFilterStatus,
  viewMode,
  onViewModeChange,
}: TenantTableToolbarProps) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou domínio..."
              value={filterName}
              onChange={(e) => onFilterName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Plan Filter */}
        <select
          value={filterPlan}
          onChange={(e) => onFilterPlan(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos os planos</option>
          <option value="free">Free</option>
          <option value="basic">Basic</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
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

        {/* View Toggle */}
        <div className="flex gap-1 border border-gray-300 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded ${
              viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Grid view"
          >
            <Grid className="h-5 w-5" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded ${
              viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="List view"
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
