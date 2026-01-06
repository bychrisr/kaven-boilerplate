'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { observabilityApi } from '@/lib/api/observability';
import { Activity, TrendingUp, AlertTriangle, Gauge } from 'lucide-react';

interface GoldenSignalCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: typeof Activity;
  trend?: 'up' | 'down' | 'neutral';
  variant: 'info' | 'success' | 'error' | 'secondary';
}

function GoldenSignalCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant,
}: Readonly<GoldenSignalCardProps>) {
  const trendColors = {
    up: 'text-success-main',
    down: 'text-error-main',
    neutral: 'text-gray-500',
  };

  const variantStyles = {
    info: {
      bg: 'bg-info-lighter',
      text: 'text-info-main',
    },
    success: {
      bg: 'bg-success-lighter',
      text: 'text-success-main',
    },
    error: {
      bg: 'bg-error-lighter',
      text: 'text-error-main',
    },
    secondary: {
      bg: 'bg-secondary-lighter',
      text: 'text-secondary-main',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold uppercase tracking-wider text-foreground">{title}</p>
        <div className={`rounded-full p-3 ${styles.bg}`}>
          <Icon className={`h-6 w-6 ${styles.text}`} />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-3xl font-bold text-foreground">{value}</p>
        {subtitle && (
          <p className={`mt-1 text-sm ${trend ? trendColors[trend] : 'text-muted-foreground'}`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

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
        <GoldenSignalCard
          title={t('latency')}
          value={`${goldenSignals.latency.p95}ms`}
          subtitle={`p50: ${goldenSignals.latency.p50}ms | p99: ${goldenSignals.latency.p99}ms`}
          icon={Activity}
          variant="info"
        />
        <GoldenSignalCard
          title={t('traffic')}
          value={goldenSignals.traffic.requestsPerSecond.toFixed(2)}
          subtitle={`${goldenSignals.traffic.totalRequests.toLocaleString()} ${t('totalRequests')}`}
          icon={TrendingUp}
          variant="success"
        />
        <GoldenSignalCard
          title={t('errors')}
          value={`${goldenSignals.errors.errorRate}%`}
          subtitle={`${goldenSignals.errors.errorRequests} ${t('failedRequests')}`}
          icon={AlertTriangle}
          variant="error"
          trend={goldenSignals.errors.errorRate > 1 ? 'up' : 'neutral'}
        />
        <GoldenSignalCard
          title={t('saturation')}
          value={`${goldenSignals.saturation.memoryUsagePercent}%`}
          subtitle={`CPU: ${goldenSignals.saturation.cpuUsagePercent}%`}
          icon={Gauge}
          variant="secondary"
        />
      </div>
    </div>
  );
}
