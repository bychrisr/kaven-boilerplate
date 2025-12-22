/**
 * User Table Row
 * Individual row component for users table
 */

'use client';

import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import type { MockUser } from '@/lib/mock';
import { fDate } from '@/lib/utils/format';

type UserTableRowProps = {
  user: MockUser;
};

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  suspended: 'bg-red-100 text-red-800',
};

const roleLabels = {
  ADMIN: 'Admin',
  USER: 'Usuário',
  MANAGER: 'Gerente',
  VIEWER: 'Visualizador',
};

export function UserTableRow({ user }: UserTableRowProps) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* User Info */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-10 w-10 rounded-full"
          />
          <div>
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>

      {/* Company */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{user.company}</div>
      </td>

      {/* Role */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {roleLabels[user.role as keyof typeof roleLabels] || user.role}
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            statusColors[user.status as keyof typeof statusColors] || statusColors.inactive
          }`}
        >
          {user.status}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center gap-2">
          <button
            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
            title="Excluir"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded"
            title="Mais opções"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
