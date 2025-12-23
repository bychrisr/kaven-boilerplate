'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuditLogTable } from './audit-log-table';
import { GoldenSignals } from './golden-signals';
import { NodeJsMetrics } from './nodejs-metrics';
import { ShieldCheck } from 'lucide-react';

export default function ObservabilityPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Observabilidade</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitoramento avançado baseado em padrões Prometheus/Grafana
        </p>
      </div>

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="border-b border-gray-200 bg-transparent p-0">
          <TabsTrigger
            value="metrics"
            className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-500 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
          >
            Métricas
          </TabsTrigger>
          <TabsTrigger
            value="audit"
            className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-500 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
          >
            Auditoria
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-8">
          {/* Golden Signals Section */}
          <GoldenSignals />

          {/* Node.js Metrics Section */}
          <NodeJsMetrics />
        </TabsContent>

        <TabsContent value="audit">
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Logs de Auditoria</h3>
              </div>
              <p className="mt-1 text-sm text-gray-500">Histórico de ações críticas do sistema</p>
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
