'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { observabilityApi } from '@/lib/api/observability';
import { CreditCard, Map, DollarSign } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { InfoTooltip } from '@/components/ui/info-tooltip';

export function ExternalAPIs() {
  const t = useTranslations('Observability.externalAPIs');
  
  const { data, isLoading } = useQuery({
    queryKey: ['external-apis'],
    queryFn: observabilityApi.getExternalAPIs,
    refetchInterval: 10000,
    retry: false
  });

  if (isLoading || !data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 dark:bg-green-900/20 text-green-600';
      case 'degraded':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600';
      case 'unhealthy':
        return 'bg-red-100 dark:bg-red-900/20 text-red-600';
      case 'not_configured':
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-600';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-600';
    }
  };

  const getIcon = (provider: string) => {
    switch (provider) {
      case 'stripe':
        return CreditCard;
      case 'google_maps':
        return Map;
      case 'pagbit':
        return DollarSign;
      default:
        return DollarSign;
    }
  };



  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map(api => (
          <StatCard
            key={api.name}
            variant="outline"
            title={api.name}
            value={api.status === 'not_configured' ? t('notConfigured') : api.status}
            subtitle={
              api.status !== 'not_configured' 
                ? `${t('latency')}: ${api.latency}ms | ${t('successRate')}: ${api.successRate}%`
                : api.provider.replace('_', ' ')
            }
            icon={getIcon(api.provider)}
            iconClassName={getStatusColor(api.status)}
            menuAction={
              <InfoTooltip 
                content={
                  api.status === 'not_configured' 
                    ? t('notConfiguredTooltip')
                    : `${t('latencyTooltip')} | ${t('successRateTooltip')}`
                } 
              />
            }
          />
        ))}
      </div>
    </div>
  );
}
