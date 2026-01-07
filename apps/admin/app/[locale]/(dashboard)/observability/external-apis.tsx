'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { observabilityApi } from '@/lib/api/observability';
import { CreditCard, Map, DollarSign, CheckCircle, AlertTriangle, XCircle, AlertCircle } from 'lucide-react';

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

  const getStatusBorder = (status: string): string => {
    switch (status) {
      case 'healthy':
        return 'border-success-light bg-success-lighter/50';
      case 'degraded':
        return 'border-warning-light bg-warning-lighter/50';
      case 'unhealthy':
        return 'border-error-light bg-error-lighter/50';
      case 'not_configured':
        return 'border-muted bg-muted/30';
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
      case 'not_configured':
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getIcon = (provider: string) => {
    switch (provider) {
      case 'stripe':
        return <CreditCard className="h-6 w-6 text-purple-500" />;
      case 'google_maps':
        return <Map className="h-6 w-6 text-blue-500" />;
      case 'pagbit':
        return <DollarSign className="h-6 w-6 text-green-500" />;
      default:
        return <DollarSign className="h-6 w-6 text-muted-foreground" />;
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
          <div
            key={api.name}
            className={`rounded-lg border p-4 ${getStatusBorder(api.status)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getIcon(api.provider)}
                <div>
                  <h3 className="font-medium text-foreground">{api.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{api.provider.replace('_', ' ')}</p>
                </div>
              </div>
              {getStatusIcon(api.status)}
            </div>
            
            {api.status !== 'not_configured' ? (
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">{t('latency')}:</span>
                  <span className="ml-2 font-medium text-foreground">{api.latency}ms</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t('successRate')}:</span>
                  <span className="ml-2 font-medium text-foreground">{api.successRate}%</span>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{t('notConfigured')}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
