'use client';

import { useQuery } from '@tanstack/react-query';
import { observabilityApi } from '@/lib/api/observability';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Observabilidade</h1>
        <p className="text-muted-foreground">Monitoramento de sistema e auditoria de segurança.</p>
      </div>

      <Tabs defaultValue="system" className="space-y-4">
        <TabsList>
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="audit">Auditoria</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsChart
              title="Uptime (s)"
              value={stats?.uptime.toFixed(0) ?? 0}
              icon={Activity}
              data={[{ time: 'now', value: stats?.uptime ?? 0 }]}
              color="#22c55e"
              loading={statsLoading}
            />
            <StatsChart
              title="Requests / seg"
              value={stats?.http.requestsPerSecond.toFixed(2) ?? 0}
              icon={Server}
              data={history.requests}
              color="#3b82f6"
              loading={statsLoading}
            />
            <StatsChart
              title="Memória (MB)"
              value={`${(stats?.system.memory.rss ? stats.system.memory.rss / 1024 / 1024 : 0).toFixed(0)} MB`}
              icon={Cpu}
              data={history.memory}
              color="#a855f7"
              loading={statsLoading}
            />
            <StatsChart
              title="Erros HTTP"
              value={stats?.http.errorRequests ?? 0}
              icon={AlertTriangle}
              data={history.errors}
              color="#ef4444"
              loading={statsLoading}
            />
          </div>
        </TabsContent>

        <TabsContent value="audit">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5" /> Logs de Auditoria
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <AuditLogTable />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
