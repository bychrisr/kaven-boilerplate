/**
 * Tenant View (Main Container)
 * Main container for the Tenants page
 */

'use client';

import { useState } from 'react';
import { MOCK_TENANTS } from '@/lib/mock';
import { TenantCard } from '../tenant-card';
import { TenantTableToolbar } from '../tenant-table-toolbar';
import { Plus } from 'lucide-react';

export function TenantView() {
  const [filterName, setFilterName] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter tenants
  const filteredTenants = MOCK_TENANTS.filter((tenant) => {
    const matchesName = tenant.name.toLowerCase().includes(filterName.toLowerCase()) ||
                       tenant.domain.toLowerCase().includes(filterName.toLowerCase());
    const matchesPlan = filterPlan === 'all' || tenant.plan === filterPlan;
    const matchesStatus = filterStatus === 'all' || tenant.status === filterStatus;
    
    return matchesName && matchesPlan && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tenants</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gerencie todos os tenants do sistema
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-5 w-5" />
          Novo Tenant
        </button>
      </div>

      {/* Toolbar */}
      <TenantTableToolbar
        filterName={filterName}
        onFilterName={setFilterName}
        filterPlan={filterPlan}
        onFilterPlan={setFilterPlan}
        filterStatus={filterStatus}
        onFilterStatus={setFilterStatus}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTenants.map((tenant) => (
            <TenantCard key={tenant.id} tenant={tenant} />
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plano
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuários
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                        <div className="text-sm text-gray-500">{tenant.domain}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {tenant.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {tenant.usersCount} usuários
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        tenant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {tenant.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                        Ver detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredTenants.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border">
          <p className="text-gray-500">Nenhum tenant encontrado</p>
        </div>
      )}

      {/* Stats */}
      <div className="text-sm text-gray-700">
        Mostrando <span className="font-medium">{filteredTenants.length}</span> de{' '}
        <span className="font-medium">{MOCK_TENANTS.length}</span> tenants
      </div>
    </div>
  );
}
