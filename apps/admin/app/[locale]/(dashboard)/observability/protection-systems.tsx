'use client';

import { useQuery } from '@tanstack/react-query';
import { observabilityApi } from '@/lib/api/observability';
import { StatCard } from '@/components/ui/stat-card';
import { Shield, Zap, TrendingDown, Activity } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { InfoTooltip } from '@/components/ui/info-tooltip';

export function ProtectionSystems() {
  const t = useTranslations('Observability.protection');
  const { data: cacheMetrics, isLoading: isLoadingCache } = useQuery({
    queryKey: ['cache-metrics'],
    queryFn: observabilityApi.getCacheMetrics,
    refetchInterval: 10000,
  });

  const { data: rateLimitMetrics, isLoading: isLoadingRateLimit } = useQuery({
    queryKey: ['rate-limit-metrics'],
    queryFn: observabilityApi.getRateLimitMetrics,
    refetchInterval: 10000,
  });

  if (isLoadingCache || isLoadingRateLimit) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-card animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const cacheHitRate = cacheMetrics?.hitRate || 0;
  const cacheMissRate = cacheMetrics?.missRate || 0;
  const violationRate = rateLimitMetrics?.violationRate || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">{t('title')}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('description')}
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Cache Hit Rate */}
        <StatCard
          title={t('cacheHitRate')}
          value={`${cacheHitRate.toFixed(1)}%`}
          icon={Shield}
          trend={cacheHitRate > 80 ? 5 : cacheHitRate > 60 ? 0 : -5}
          subtitle={`${cacheMetrics?.hitCount || 0} hits / ${cacheMetrics?.total || 0} total`}
          variant="outline"
          iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-500"
          tooltip={t('cacheHitRateTooltip')}
        />

        {/* Cache Miss Rate */}
        <StatCard
          title={t('cacheMissRate')}
          value={`${cacheMissRate.toFixed(1)}%`}
          icon={TrendingDown}
          trend={cacheMissRate < 20 ? 5 : cacheMissRate < 40 ? 0 : -5}
          subtitle={`${cacheMetrics?.missCount || 0} misses`}
          variant="outline"
          iconClassName="bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-500"
          tooltip={t('cacheMissRateTooltip')}
        />

        {/* Rate Limit Violations */}
        <StatCard
          title={t('rateLimitViolations')}
          value={rateLimitMetrics?.violations || 0}
          icon={Zap}
          trend={violationRate < 1 ? 5 : violationRate < 5 ? 0 : -5}
          subtitle={`${violationRate.toFixed(2)}% violation rate`}
          variant="outline"
          iconClassName="bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-500"
          tooltip={t('rateLimitViolationsTooltip')}
        />
      </div>

      {/* Cache Configuration */}
      <div className="rounded-2xl bg-card p-6 shadow-xl border border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-bold text-foreground">{t('cacheConfig')}</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{t('status')}</p>
            <p className="text-lg font-bold text-foreground">
              {cacheMetrics?.enabled ? (
                <span className="text-green-500">Enabled</span>
              ) : (
                <span className="text-red-500">Disabled</span>
              )}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-sm text-muted-foreground">{t('ttl')}</p>
              <InfoTooltip content={t('ttlTooltip')} />
            </div>
            <p className="text-lg font-bold text-foreground">{cacheMetrics?.ttl || 0}s</p>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-sm text-muted-foreground">{t('strategy')}</p>
              <InfoTooltip content={t('strategyTooltip')} />
            </div>
            <p className="text-lg font-bold text-foreground">{cacheMetrics?.strategy || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('totalRequests')}</p>
            <p className="text-lg font-bold text-foreground">{rateLimitMetrics?.totalRequests || 0}</p>
          </div>
        </div>
      </div>

      {/* Top Violators Table */}
      {rateLimitMetrics?.topViolators && rateLimitMetrics.topViolators.length > 0 && (
        <div className="rounded-2xl bg-card p-6 shadow-xl border border-border/50">
          <div className="flex items-center gap-2 mb-4">
             <h3 className="text-lg font-bold text-foreground">{t('topViolators')}</h3>
             <InfoTooltip content={t('topViolatorsTooltip')} />
          </div>
         
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border/50">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Violations
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 bg-card">
                {rateLimitMetrics.topViolators.map((violator) => (
                  <tr key={violator.ip} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-foreground">{violator.ip}</td>
                    <td className="px-6 py-4 text-sm font-bold text-right text-red-500">
                      {violator.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
