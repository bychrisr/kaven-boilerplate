'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { observabilityApi } from '@/lib/api/observability';
import { Database, Server, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

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

  const getStatusBorder = (status: string): string => {
    switch (status) {
      case 'healthy':
        return 'border-success-light bg-success-lighter/50';
      case 'degraded':
        return 'border-warning-light bg-warning-lighter/50';
      case 'unhealthy':
        return 'border-error-light bg-error-lighter/50';
      default:
        return 'border-border bg-card';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-success-main" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-warning-main" />;
      case 'unhealthy':
        return <XCircle className="h-5 w-5 text-error-main" />;
      default:
        return null;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'database':
        return <Database className="h-6 w-6 text-primary" />;
      case 'cache':
        return <Server className="h-6 w-6 text-info-main" />;
      default:
        return <Server className="h-6 w-6 text-muted-foreground" />;
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
          <div
            key={service.name}
            className={`rounded-lg border p-4 ${getStatusBorder(service.status)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getIcon(service.type)}
                <div>
                  <h3 className="font-medium text-foreground">{service.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{service.type}</p>
                </div>
              </div>
              {getStatusIcon(service.status)}
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">{t('latency')}:</span>
                <span className="ml-2 font-medium text-foreground">{service.latency}ms</span>
              </div>
              <div>
                <span className="text-muted-foreground">{t('successRate')}:</span>
                <span className="ml-2 font-medium text-foreground">{service.successRate}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
