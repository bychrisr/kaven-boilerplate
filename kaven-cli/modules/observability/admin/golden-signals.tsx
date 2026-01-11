'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { observabilityApi } from '@/lib/api/observability';
import { Activity, TrendingUp, AlertTriangle, Gauge } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { InfoTooltip } from '@/components/ui/info-tooltip';

export function GoldenSignals() {
  const t = useTranslations('Observability.goldenSignals');
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

  const { goldenSignals } = data;



  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('description')}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          variant="outline"
          title={t('latency')}
          value={`${goldenSignals.latency.p95}ms`}
          subtitle={`p50: ${goldenSignals.latency.p50}ms | p99: ${goldenSignals.latency.p99}ms`}
          icon={Activity}
          iconClassName="bg-blue-100 dark:bg-blue-900/20 text-blue-600"
          menuAction={<InfoTooltip content={t('latencyTooltip')} />}
        />
        <StatCard
          variant="outline"
          title={t('traffic')}
          value={goldenSignals.traffic.requestsPerSecond.toFixed(2)}
          subtitle={`${goldenSignals.traffic.totalRequests.toLocaleString()} ${t('totalRequests')}`}
          icon={TrendingUp}
          iconClassName="bg-green-100 dark:bg-green-900/20 text-green-600"
          menuAction={<InfoTooltip content={t('trafficTooltip')} />}
        />
        <StatCard
          variant="outline"
          title={t('errors')}
          value={`${goldenSignals.errors.errorRate}%`}
          subtitle={`${goldenSignals.errors.errorRequests} ${t('failedRequests')}`}
          icon={AlertTriangle}
          iconClassName={`${goldenSignals.errors.errorRate > 1 ? 'bg-red-100 dark:bg-red-900/20 text-red-600' : 'bg-green-100 dark:bg-green-900/20 text-green-600'}`}
          menuAction={<InfoTooltip content={t('errorsTooltip')} />}
        />
        <StatCard
          variant="outline"
          title={t('saturation')}
          value={`${goldenSignals.saturation.memoryUsagePercent}%`}
          subtitle={`CPU: ${goldenSignals.saturation.cpuUsagePercent}%`}
          icon={Gauge}
          iconClassName={`${goldenSignals.saturation.memoryUsagePercent > 80 ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600' : 'bg-purple-100 dark:bg-purple-900/20 text-purple-600'}`}
          menuAction={<InfoTooltip content={t('saturationTooltip')} />}
        />
      </div>
    </div>
  );
}
