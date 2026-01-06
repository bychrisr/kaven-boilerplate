'use client';

import { useQuery } from '@tanstack/react-query';
import { observabilityApi } from '@/lib/api/observability';
import { Activity, TrendingUp, AlertTriangle, Gauge } from 'lucide-react';

interface GoldenSignalCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: typeof Activity;
  trend?: 'up' | 'down' | 'neutral';
  color: string;
}

function GoldenSignalCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color,
}: Readonly<GoldenSignalCardProps>) {
  const trendColors = {
    up: 'text-emerald-600',
    down: 'text-rose-600',
    neutral: 'text-gray-500',
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className={`rounded-full p-3`} style={{ backgroundColor: `${color}15` }}>
          <Icon className="h-6 w-6" style={{ color }} />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {subtitle && (
          <p className={`mt-1 text-sm ${trend ? trendColors[trend] : 'text-gray-500'}`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export function GoldenSignals() {
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
            <div className="h-20 animate-pulse rounded bg-gray-50" />
          </div>
        ))}
      </div>
    );
  }

  const { goldenSignals } = data;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Golden Signals</h2>
        <p className="text-sm text-gray-500">
          Métricas essenciais de saúde do sistema (Google SRE)
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <GoldenSignalCard
          title="Latency (p95)"
          value={`${goldenSignals.latency.p95}ms`}
          subtitle={`p50: ${goldenSignals.latency.p50}ms | p99: ${goldenSignals.latency.p99}ms`}
          icon={Activity}
          color="#00B8D9"
        />
        <GoldenSignalCard
          title="Traffic"
          value={goldenSignals.traffic.requestsPerSecond.toFixed(2)}
          subtitle={`${goldenSignals.traffic.totalRequests.toLocaleString()} total requests`}
          icon={TrendingUp}
          color="#22C55E"
        />
        <GoldenSignalCard
          title="Errors"
          value={`${goldenSignals.errors.errorRate}%`}
          subtitle={`${goldenSignals.errors.errorRequests} failed requests`}
          icon={AlertTriangle}
          color="#FF5630"
          trend={goldenSignals.errors.errorRate > 1 ? 'up' : 'neutral'}
        />
        <GoldenSignalCard
          title="Saturation"
          value={`${goldenSignals.saturation.memoryUsagePercent}%`}
          subtitle={`CPU: ${goldenSignals.saturation.cpuUsagePercent}%`}
          icon={Gauge}
          color="#8E33FF"
        />
      </div>
    </div>
  );
}
