'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { observabilityApi, type Alert, type AlertThreshold } from '@/lib/api/observability';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function AlertsPanel() {
  const t = useTranslations('Observability.alerts');
  
  const { data, isLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: observabilityApi.getAlerts,
    refetchInterval: 10000,
    retry: false
  });

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  const { active, thresholds } = data;

  const getSeverityBadge = (severity: string) => {
    const classes = {
      low: 'bg-info-lighter text-info-main border-info-light',
      medium: 'bg-warning-lighter text-warning-main border-warning-light',
      high: 'bg-error-lighter text-error-main border-error-light',
      critical: 'bg-error-darker text-error-lighter border-error-main'
    };

    const icons = {
      low: Info,
      medium: AlertTriangle,
      high: AlertTriangle,
      critical: XCircle
    };

    const Icon = icons[severity as keyof typeof icons] || Info;

    return (
      <Badge variant="outline" className={classes[severity as keyof typeof classes]}>
        <Icon className="mr-1 h-3 w-3" />
        {severity.toUpperCase()}
      </Badge>
    );
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Active Alerts */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{t('activeAlerts')}</h2>
            <p className="text-sm text-muted-foreground">{t('activeAlertsDescription')}</p>
          </div>
          <Badge variant="outline" className="bg-error-lighter text-error-main border-error-light">
            {active.length} {t('active')}
          </Badge>
        </div>

        {active.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-success-light bg-success-lighter/50 p-8">
            <CheckCircle className="h-12 w-12 text-success-main" />
            <p className="mt-2 text-sm font-medium text-success-main">{t('noActiveAlerts')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {active.map(alert => (
              <div
                key={alert.id}
                className="rounded-lg border border-error-light bg-error-lighter/50 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {getSeverityBadge(alert.severity)}
                      <span className="text-sm text-muted-foreground">
                        {formatTimestamp(alert.timestamp)}
                      </span>
                    </div>
                    <p className="mt-2 font-medium text-foreground">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Configured Thresholds */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">{t('thresholds')}</h2>
          <p className="text-sm text-muted-foreground">{t('thresholdsDescription')}</p>
        </div>

        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  {t('table.name')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  {t('table.metric')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  {t('table.threshold')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  {t('table.severity')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  {t('table.status')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {thresholds.map(threshold => (
                <tr key={threshold.id} className="bg-card">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {threshold.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {threshold.metric}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {threshold.operator} {threshold.value}%
                  </td>
                  <td className="px-4 py-3">
                    {getSeverityBadge(threshold.severity)}
                  </td>
                  <td className="px-4 py-3">
                    {threshold.enabled ? (
                      <Badge variant="outline" className="bg-success-lighter text-success-main border-success-light">
                        {t('enabled')}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
                        {t('disabled')}
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
