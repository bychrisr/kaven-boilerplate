'use client';

import { useQuery } from '@tanstack/react-query';
import { observabilityApi } from '@/lib/api/observability';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuditLogTable } from './audit-log-table';
import { StatsChart } from './stats-chart';
import { Activity, AlertTriangle, Cpu, Server, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

// Interface para pontos do gráfico
interface ChartDataPoint {
  time: string;
  value: number;
}

// Histórico acumulado
interface StatsHistory {
  requests: ChartDataPoint[];
  errors: ChartDataPoint[];
  memory: ChartDataPoint[];
}

export default function ObservabilityPage() {
  // Estado para histórico de métricas
  const [history, setHistory] = useState<StatsHistory>({
    requests: [],
    errors: [],
    memory: [],
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['system-stats'],
    queryFn: async () => {
      const data = await observabilityApi.getStats();
      
      // Atualiza histórico ao receber novos dados
      const now = new Date().toLocaleTimeString();
      setHistory(prev => ({
        requests: [...prev.requests.slice(-20), { time: now, value: data.http.requestsPerSecond }],
        errors: [...prev.errors.slice(-20), { time: now, value: data.http.errorRequests }],
        memory: [...prev.memory.slice(-20), { time: now, value: Math.round(data.system.memory.rss / 1024 / 1024) }],
      }));
      
      return data;
    },
    refetchInterval: 2000, 
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Observabilidade</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitoramento de sistema e auditoria de segurança
        </p>
      </div>

      <Tabs defaultValue="system" className="space-y-6">
        <TabsList className="border-b border-gray-200 bg-transparent p-0">
          <TabsTrigger 
            value="system"
            className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-500 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
          >
            Sistema
          </TabsTrigger>
          <TabsTrigger 
            value="audit"
            className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-500 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
          >
            Auditoria
          </TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsChart
              title="Uptime (s)"
              value={stats?.uptime.toFixed(0) ?? 0}
              icon={Activity}
              data={[{ time: 'now', value: stats?.uptime ?? 0 }]}
              color="#10B981"
              loading={statsLoading}
            />
            <StatsChart
              title="Requests / seg"
              value={stats?.http.requestsPerSecond.toFixed(2) ?? 0}
              icon={Server}
              data={history.requests}
              color="#3B82F6"
              loading={statsLoading}
            />
            <StatsChart
              title="Memória (MB)"
              value={`${(stats?.system.memory.rss ? stats.system.memory.rss / 1024 / 1024 : 0).toFixed(0)} MB`}
              icon={Cpu}
              data={history.memory}
              color="#8B5CF6"
              loading={statsLoading}
            />
            <StatsChart
              title="Erros HTTP"
              value={stats?.http.errorRequests ?? 0}
              icon={AlertTriangle}
              data={history.errors}
              color="#EF4444"
              loading={statsLoading}
            />
          </div>
        </TabsContent>

        <TabsContent value="audit">
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Logs de Auditoria</h3>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Histórico de ações críticas do sistema
              </p>
            </div>
            <div className="p-6">
              <AuditLogTable />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
