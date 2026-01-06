'use client';

import { useQuery } from '@tanstack/react-query';
import { observabilityApi } from '@/lib/api/observability';
import { Cpu, MemoryStick, Zap, Activity } from 'lucide-react';

interface NodeMetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: typeof Cpu;
  status?: 'good' | 'warning' | 'critical';
}

function NodeMetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  status = 'good',
}: Readonly<NodeMetricCardProps>) {
  const statusColors = {
    good: 'bg-success-lighter text-success-main',
    warning: 'bg-warning-lighter text-warning-main',
    critical: 'bg-error-lighter text-error-main',
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className={`rounded-full p-3 ${statusColors[status]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}

export function NodeJsMetrics() {
  const { data, isLoading } = useQuery({
    queryKey: ['advanced-metrics'],
    queryFn: observabilityApi.getAdvancedMetrics,
    refetchInterval: 2000,
  });

  if (isLoading || !data) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="h-16 animate-pulse rounded bg-gray-50" />
          </div>
        ))}
      </div>
    );
  }

  const { nodejs } = data;

  // Determina status do Event Loop Lag
  const getEventLoopStatus = (lag: number): 'good' | 'warning' | 'critical' => {
    if (lag < 10) return 'good';
    if (lag < 50) return 'warning';
    return 'critical';
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Node.js Metrics</h2>
        <p className="text-sm text-gray-500">Métricas específicas do runtime Node.js</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <NodeMetricCard
          title="Event Loop Lag"
          value={`${nodejs.eventLoopLag}ms`}
          subtitle="Atraso do event loop"
          icon={Zap}
          status={getEventLoopStatus(nodejs.eventLoopLag)}
        />
        <NodeMetricCard
          title="Memory Heap"
          value={`${nodejs.memoryHeap.usedMB}MB`}
          subtitle={`de ${nodejs.memoryHeap.totalMB}MB total`}
          icon={MemoryStick}
        />
        <NodeMetricCard
          title="Active Handles"
          value={nodejs.activeHandles}
          subtitle="File descriptors, sockets, etc"
          icon={Activity}
        />
        <NodeMetricCard
          title="Active Requests"
          value={nodejs.activeRequests}
          subtitle="Requisições em andamento"
          icon={Cpu}
        />
      </div>
    </div>
  );
}
