'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { observabilityApi } from '@/lib/api/observability';
import { Activity, Database, Zap, TrendingUp } from 'lucide-react';

interface NodeMetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: typeof Activity;
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
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold uppercase tracking-wider text-foreground">{title}</p>
        <div className={`rounded-full p-3 ${statusColors[status]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}

export function NodeJsMetrics() {
  const t = useTranslations('Observability.nodejsMetrics');
  const { data, isLoading } = useQuery({
    queryKey: ['advanced-metrics'],
    queryFn: observabilityApi.getAdvancedMetrics,
    refetchInterval: 2000,
  });

  if (isLoading || !data) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  const { nodejs } = data;

  const getMemoryStatus = (usedMB: number, totalMB: number): 'good' | 'warning' | 'critical' => {
    const percentage = (usedMB / totalMB) * 100;
    if (percentage < 70) return 'good';
    if (percentage < 85) return 'warning';
    return 'critical';
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <NodeMetricCard
          title={t('eventLoopLag')}
          value={`${nodejs.eventLoopLag.toFixed(2)}ms`}
          subtitle={t('eventLoopLagDesc')}
          icon={Activity}
          status={nodejs.eventLoopLag < 10 ? 'good' : nodejs.eventLoopLag < 50 ? 'warning' : 'critical'}
        />
        <NodeMetricCard
          title={t('memoryHeap')}
          value={`${nodejs.memoryHeap.usedMB.toFixed(0)}MB`}
          subtitle={t('memoryHeapDesc', { total: nodejs.memoryHeap.totalMB.toFixed(0) })}
          icon={Database}
          status={getMemoryStatus(nodejs.memoryHeap.usedMB, nodejs.memoryHeap.totalMB)}
        />
        <NodeMetricCard
          title={t('activeHandles')}
          value={nodejs.activeHandles.toString()}
          subtitle={t('activeHandlesDesc')}
          icon={Zap}
          status={nodejs.activeHandles < 100 ? 'good' : nodejs.activeHandles < 200 ? 'warning' : 'critical'}
        />
        <NodeMetricCard
          title={t('activeRequests')}
          value={nodejs.activeRequests.toString()}
          subtitle={t('activeRequestsDesc')}
          icon={TrendingUp}
          status={nodejs.activeRequests < 10 ? 'good' : nodejs.activeRequests < 50 ? 'warning' : 'critical'}
        />
      </div>
    </div>
  );
}
