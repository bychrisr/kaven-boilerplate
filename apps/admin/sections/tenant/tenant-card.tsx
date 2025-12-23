/**
 * Tenant Card Component
 * Card view for individual tenant
 */

'use client';

import { Building2, Users, Calendar, MoreVertical } from 'lucide-react';
import type { MockTenant } from '@/lib/mock';
import { fDate } from '@/lib/utils/format';

type TenantCardProps = {
  tenant: MockTenant;
};

const planColors = {
  free: 'bg-gray-100 text-gray-800',
  basic: 'bg-blue-100 text-blue-800',
  pro: 'bg-purple-100 text-purple-800',
  enterprise: 'bg-orange-100 text-orange-800',
};

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  suspended: 'bg-red-100 text-red-800',
};

export function TenantCard({ tenant }: TenantCardProps) {
  return (
    <div className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{tenant.name}</h3>
            <p className="text-sm text-gray-500">{tenant.domain}</p>
          </div>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded">
          <MoreVertical className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {/* Info */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>{tenant.usersCount} usuários</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Criado em {fDate(tenant.createdAt)}</span>
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2">
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            planColors[tenant.plan as keyof typeof planColors] || planColors.free
          }`}
        >
          {tenant.plan}
        </span>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            statusColors[tenant.status as keyof typeof statusColors] || statusColors.inactive
          }`}
        >
          {tenant.status}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-4 pt-4 border-t flex gap-2">
        <button className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          Ver detalhes
        </button>
        <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          Editar
        </button>
      </div>
    </div>
  );
}
