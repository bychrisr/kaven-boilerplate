'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { observabilityApi } from '@/lib/api/observability';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { Activity, Play, RefreshCw, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { InfoTooltip } from '@/components/ui/info-tooltip';

export function DiagnosticTools() {
  const t = useTranslations('Observability.diagnostics');
  const [duration, setDuration] = useState(5);
  const queryClient = useQueryClient();

  const { data: sessions, isLoading: isLoadingSessions } = useQuery({
    queryKey: ['monitoring-sessions'],
    queryFn: observabilityApi.getMonitoringSessions,
    refetchInterval: 5000,
  });

  const { data: connectivity, isLoading: isLoadingConnectivity } = useQuery({
    queryKey: ['connectivity'],
    queryFn: observabilityApi.testConnectivity,
    refetchInterval: 30000,
  });

  const startMutation = useMutation({
    mutationFn: () => observabilityApi.startMonitoring(duration),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monitoring-sessions'] });
      // Toaster can be added here
      console.log(`Monitoring started for ${duration} minutes`);
    },
    onError: (error: Error) => {
      console.error('Failed to start monitoring:', error.message);
    },
  });

  const refreshMutation = useMutation({
    mutationFn: observabilityApi.forceRefresh,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hardware-metrics'] });
      // Toaster can be added here
      console.log('Metrics refreshed successfully');
    },
    onError: (error: Error) => {
      console.error('Failed to refresh metrics:', error.message);
    },
  });

  if (isLoadingSessions || isLoadingConnectivity) {
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

  const activeSessions = sessions?.active || 0;
  const totalSessions = sessions?.total || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">{t('title')}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('description')}
        </p>
      </div>

      {/* Monitoring Sessions Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          title={t('activeSessions')}
          value={activeSessions}
          icon={Activity}
          subtitle={`${totalSessions} ${t('completedSessions').toLowerCase()}`}
          variant="outline"
          iconClassName="bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-500"
          tooltip={t('activeSessionsTooltip')}
        />

        <StatCard
          title={t('completedSessions')}
          value={totalSessions - activeSessions}
          icon={CheckCircle2}
          subtitle={t('completedSessionsTooltip')}
          variant="outline"
          iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-500"
          tooltip={t('completedSessionsTooltip')}
        />

        <StatCard
          title={t('avgDuration')}
          value={`${duration}${t('minutesShort')}`}
          icon={Clock}
          subtitle={t('avgDurationTooltip')}
          variant="outline"
          iconClassName="bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-500"
          tooltip={t('avgDurationTooltip')}
        />
      </div>

      {/* Start Monitoring */}
      <div className="rounded-2xl bg-card p-6 shadow-xl border border-border/50">
        <div className="flex items-center gap-2 mb-4">
           <h3 className="text-lg font-bold text-foreground">{t('continuousMonitoring')}</h3>
           <InfoTooltip content={t('continuousMonitoringDesc')} />
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          {t('continuousMonitoringDesc')}
        </p>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-2">
              <label className="text-sm font-medium text-foreground block">
                {t('durationLabel')}
              </label>
              <InfoTooltip content={t('durationTooltip')} />
            </div>
            <input
              type="number"
              min="1"
              max="60"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button 
            onClick={() => startMutation.mutate()}
            disabled={startMutation.isPending}
            className="w-full md:w-auto"
          >
            {startMutation.isPending ? (
              <>
                <Activity className="mr-2 h-4 w-4 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                {t('startMonitoring')}
              </>
            )}
          </Button>
          <div className="flex items-center gap-1">
             <Button 
                variant="outline" 
                onClick={() => refreshMutation.mutate()}
                disabled={refreshMutation.isPending}
                className="w-full md:w-auto"
              >
                {refreshMutation.isPending ? (
                  <>
                    <Activity className="mr-2 h-4 w-4 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {t('forceRefresh')}
                  </>
                )}
              </Button>
              <InfoTooltip content={t('forceRefreshTooltip')} className="ml-1" />
          </div>
        </div>
      </div>

      {/* Active Sessions List */}
      {sessions?.sessions && sessions.sessions.length > 0 && (
        <div className="rounded-2xl bg-card p-6 shadow-xl border border-border/50">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-bold text-foreground">{t('monitoringSessionsList')}</h3>
             {/* reusing tooltip */}
          </div>
          <div className="space-y-3">
            {sessions.sessions.slice(0, 5).map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    session.status === 'active' ? 'bg-green-500 animate-pulse' :
                    session.status === 'completed' ? 'bg-blue-500' :
                    'bg-gray-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{t('session')} {session.id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.durationMinutes}min • {session.snapshotCount} {t('snapshots')}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  session.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-500' :
                  session.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-500' :
                  'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-500'
                }`}>
                  {session.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connectivity Status */}
      <div className="rounded-2xl bg-card p-6 shadow-xl border border-border/50">
        <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-bold text-foreground">{t('connectivityStatus')}</h3>
            <InfoTooltip content={t('connectivityStatusDesc')} />
        </div>
        
        <div className="space-y-3">
          {/* Database */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-3">
              {connectivity?.database.status === 'healthy' ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="font-medium text-foreground">Database (PostgreSQL)</span>
            </div>
            <div className="text-right">
              <span className={`text-sm font-bold ${
                connectivity?.database.status === 'healthy' ? 'text-green-500' : 'text-red-500'
              }`}>
                {connectivity?.database.status || 'unknown'}
              </span>
              <p className="text-xs text-muted-foreground">{connectivity?.database.latency || 0}ms</p>
            </div>
          </div>

          {/* Infrastructure Services */}
          {connectivity?.infrastructure && connectivity.infrastructure.map((service) => (
            <div key={service.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                {service.status === 'healthy' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium text-foreground">{service.name}</span>
              </div>
              <div className="text-right">
                <span className={`text-sm font-bold ${
                  service.status === 'healthy' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {service.status}
                </span>
                <p className="text-xs text-muted-foreground">{service.latency}ms</p>
              </div>
            </div>
          ))}

          {/* External APIs */}
          {connectivity?.externalAPIs && connectivity.externalAPIs.slice(0, 3).map((api) => (
            <div key={api.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                {api.status === 'healthy' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : api.status === 'not_configured' ? (
                  <Clock className="h-5 w-5 text-gray-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium text-foreground">{api.name}</span>
              </div>
              <div className="text-right">
                <span className={`text-sm font-bold ${
                  api.status === 'healthy' ? 'text-green-500' :
                  api.status === 'not_configured' ? 'text-gray-500' :
                  'text-red-500'
                }`}>
                  {api.status}
                </span>
                <p className="text-xs text-muted-foreground">{api.latency}ms</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
