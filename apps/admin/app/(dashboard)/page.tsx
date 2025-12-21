'use client';

import { useUsers } from '@/hooks/use-users';
import { Users, DollarSign, FileText, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'USER';
  createdAt: string;
}

export default function DashboardPage() {
  const { data: usersData } = useUsers(1, 5);

  // Mock data para métricas (em produção, viriam de endpoints específicos)
  const metrics = {
    totalUsers: usersData?.pagination.total || 0,
    revenue: 12450.00,
    invoices: 23,
    orders: 45,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Visão geral do sistema
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {metrics.totalUsers}
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/users"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Ver todos →
            </Link>
          </div>
        </div>

        {/* Revenue */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receita Mensal</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                R$ {metrics.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+12.5% vs mês anterior</span>
          </div>
        </div>

        {/* Invoices */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Invoices Pendentes</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {metrics.invoices}
              </p>
            </div>
            <div className="rounded-full bg-yellow-100 p-3">
              <FileText className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/invoices"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Ver todas →
            </Link>
          </div>
        </div>

        {/* Orders */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pedidos do Mês</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {metrics.orders}
              </p>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <ShoppingCart className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/orders"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Ver todos →
            </Link>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900">Receita Mensal</h3>
          <p className="mt-1 text-sm text-gray-500">Últimos 6 meses</p>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Jul', value: 65 },
                { name: 'Ago', value: 78 },
                { name: 'Set', value: 82 },
                { name: 'Out', value: 90 },
                { name: 'Nov', value: 95 },
                { name: 'Dez', value: 100 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Users Growth Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900">Crescimento de Usuários</h3>
          <p className="mt-1 text-sm text-gray-500">Últimos 6 meses</p>
          <div className="mt-6 h-64">
             <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { name: 'Jul', value: 45 },
                { name: 'Ago', value: 52 },
                { name: 'Set', value: 68 },
                { name: 'Out', value: 75 },
                { name: 'Nov', value: 85 },
                { name: 'Dez', value: 100 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Usuários Recentes</h3>
              <p className="mt-1 text-sm text-gray-500">Últimos 5 usuários cadastrados</p>
            </div>
            <Link
              href="/users"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Ver todos
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Cadastrado em
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {usersData?.users.map((user: User) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        user.role === 'SUPER_ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'TENANT_ADMIN'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
