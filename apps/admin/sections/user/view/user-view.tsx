/**
 * User View (Main Container)
 * Inspired by Minimals.cc sections pattern
 * This is the main container for the Users page
 */

'use client';

import { useState } from 'react';
import { MOCK_USERS } from '@/lib/mock';
import { UserTableToolbar } from '../user-table-toolbar';
import { UserTableRow } from '../user-table-row';

export function UserView() {
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter users
  const filteredUsers = MOCK_USERS.filter((user) => {
    const matchesName = user.name.toLowerCase().includes(filterName.toLowerCase()) ||
                       user.email.toLowerCase().includes(filterName.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesName && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
        <p className="mt-2 text-sm text-gray-600">
          Gerencie todos os usuários do sistema
        </p>
      </div>

      {/* Toolbar */}
      <UserTableToolbar
        filterName={filterName}
        onFilterName={setFilterName}
        filterRole={filterRole}
        onFilterRole={setFilterRole}
        filterStatus={filterStatus}
        onFilterStatus={setFilterStatus}
      />

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Função
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
              {filteredUsers.map((user) => (
                <UserTableRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum usuário encontrado</p>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{filteredUsers.length}</span> de{' '}
            <span className="font-medium">{MOCK_USERS.length}</span> usuários
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
              Anterior
            </button>
            <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
