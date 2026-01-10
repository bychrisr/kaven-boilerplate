'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { observabilityApi } from '@/lib/api/observability';
import { Activity, Database, Zap, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { InfoTooltip } from '@/components/ui/info-tooltip';

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

  const getStatusColor = (status: 'good' | 'warning' | 'critical') => {
    if (status === 'critical') return 'bg-red-100 dark:bg-red-900/20 text-red-600';
    if (status === 'warning') return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600';
    return 'bg-green-100 dark:bg-green-900/20 text-green-600';
  };



  const eventLoopStatus = nodejs.eventLoopLag < 10 ? 'good' : nodejs.eventLoopLag < 50 ? 'warning' : 'critical';
  const memoryStatus = getMemoryStatus(nodejs.memoryHeap.usedMB, nodejs.memoryHeap.totalMB);
  const handlesStatus = nodejs.activeHandles < 100 ? 'good' : nodejs.activeHandles < 200 ? 'warning' : 'critical';
  const requestsStatus = nodejs.activeRequests < 10 ? 'good' : nodejs.activeRequests < 50 ? 'warning' : 'critical';

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          variant="outline"
          title={t('eventLoopLag')}
          value={`${nodejs.eventLoopLag.toFixed(2)}ms`}
          subtitle={t('eventLoopLagDesc')}
          icon={Activity}
          iconClassName={getStatusColor(eventLoopStatus)}
          menuAction={<InfoTooltip content={t('eventLoopLagTooltip')} />}
        />
        <StatCard
          variant="outline"
          title={t('memoryHeap')}
          value={`${nodejs.memoryHeap.usedMB.toFixed(0)}MB`}
          subtitle={t('memoryHeapDesc', { total: nodejs.memoryHeap.totalMB.toFixed(0) })}
          icon={Database}
          iconClassName={getStatusColor(memoryStatus)}
          menuAction={<InfoTooltip content={t('memoryHeapTooltip')} />}
        />
        <StatCard
          variant="outline"
          title={t('activeHandles')}
          value={nodejs.activeHandles.toString()}
          subtitle={t('activeHandlesDesc')}
          icon={Zap}
          iconClassName={getStatusColor(handlesStatus)}
          menuAction={<InfoTooltip content={t('activeHandlesTooltip')} />}
        />
        <StatCard
          variant="outline"
          title={t('activeRequests')}
          value={nodejs.activeRequests.toString()}
          subtitle={t('activeRequestsDesc')}
          icon={TrendingUp}
          iconClassName={getStatusColor(requestsStatus)}
          menuAction={<InfoTooltip content={t('activeRequestsTooltip')} />}
        />
      </div>
    </div>
  );
}
