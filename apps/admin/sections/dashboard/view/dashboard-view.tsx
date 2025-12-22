/**
 * Dashboard View (Main Container)
 * Main container for the Dashboard page
 */

'use client';

import { DashboardWidgetSummary } from '../dashboard-widget-summary';
import { DashboardCurrentVisits } from '../dashboard-current-visits';
import { Users, Building2, DollarSign, TrendingUp } from 'lucide-react';

export function DashboardView() {
  // Mock data - replace with real data from API
  const kpiData = [
    {
      title: 'Total de Usuários',
      value: '1,234',
      change: '+12.5%',
      trend: 'up' as const,
      icon: Users,
      color: 'blue' as const,
    },
    {
      title: 'Tenants Ativos',
      value: '892',
      change: '+8.2%',
      trend: 'up' as const,
      icon: Building2,
      color: 'green' as const,
    },
    {
      title: 'Receita Total',
      value: 'R$ 45.231',
      change: '+23.1%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'purple' as const,
    },
    {
      title: 'Taxa de Crescimento',
      value: '18.2%',
      change: '-2.4%',
      trend: 'down' as const,
      icon: TrendingUp,
      color: 'orange' as const,
    },
  ];

  const visitData = [
    { label: 'Desktop', value: 4344 },
    { label: 'Mobile', value: 2435 },
    { label: 'Tablet', value: 1443 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Visão geral do sistema
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi) => (
          <DashboardWidgetSummary
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            trend={kpi.trend}
            icon={kpi.icon}
            color={kpi.color}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Visits */}
        <div className="lg:col-span-1">
          <DashboardCurrentVisits data={visitData} />
        </div>

        {/* Placeholder for more charts */}
        <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Crescimento de Usuários (30 dias)</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-sm text-gray-500">
              Gráfico será implementado com ApexCharts ou Recharts
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Atividade Recente</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 pb-4 border-b last:border-0">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Novo usuário cadastrado
                </p>
                <p className="text-xs text-gray-500">Há 2 horas</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
