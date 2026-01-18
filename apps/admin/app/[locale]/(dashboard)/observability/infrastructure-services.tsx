'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { observabilityApi } from '@/lib/api/observability';
import { Database, Server } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { InfoTooltip } from '@/components/ui/info-tooltip';

export function InfrastructureServices() {
  const t = useTranslations('Observability.infrastructure');
  
  const { data, isLoading } = useQuery({
    queryKey: ['infrastructure-services'],
    queryFn: observabilityApi.getInfrastructure,
    refetchInterval: 10000,
    retry: false
  });

  if (isLoading || !data) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
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
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-600';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'database':
        return Database;
      case 'cache':
        return Server;
      default:
        return Server;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'healthy':
        return t('healthy');
      case 'degraded':
        return t('degraded');
      case 'unhealthy':
        return t('unhealthy');
      default:
        return status;
    }
  };



  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {data.map(service => (
          <StatCard
            key={service.name}
            variant="outline"
            title={service.name}
            value={getStatusLabel(service.status)}
            subtitle={`${t('latency')}: ${service.latency}ms | ${t('successRate')}: ${service.successRate}%`}
            icon={getIcon(service.type)}
            iconClassName={getStatusColor(service.status)}
            menuAction={
              <InfoTooltip 
                content={`${t('latencyTooltip')} | ${t('successRateTooltip')}`} 
              />
            }
          />
        ))}
      </div>
    </div>
  );
}
