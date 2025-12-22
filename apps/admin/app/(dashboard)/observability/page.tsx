'use client';

import { useQuery } from '@tanstack/react-query';
import { observabilityApi, SystemStats } from '@/lib/api/observability';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Server, AlertTriangle, ShieldCheck } from 'lucide-react';
import { AuditLogTable } from './audit-log-table';

export default function ObservabilityPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['system-stats'],
    queryFn: observabilityApi.getStats,
    refetchInterval: 2000, // Refresh a cada 2s (Real-time feel)
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <Activity className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats ? 'Online' : '...'}</div>
                <p className="text-xs text-muted-foreground">
                  Uptime: {stats ? (stats.uptime / 3600).toFixed(2) : '-'} horas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Requisições</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.http.totalRequests || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.http.requestsPerSecond || 0} req/s
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uso de Memória</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats ? (stats.system.memory.rss / 1024 / 1024).toFixed(0) : 0} MB
                </div>
                <p className="text-xs text-muted-foreground">RSS</p>
              </CardContent>
            </Card>

             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Erros HTTP</CardTitle>
                <AlertTriangle className={stats?.http.errorRate ? 'text-red-500 h-4 w-4' : 'text-muted-foreground h-4 w-4'} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.http.errorRequests || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Taxa: {(stats?.http.errorRate || 0) * 100}%
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
             <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Visão Geral</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                     <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                        Gráficos históricos virão aqui (Prometheus/Grafana iframe)
                     </div>
                  </CardContent>
             </Card>
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
