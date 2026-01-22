'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectOption } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Play, Loader2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { healthCheckConfigApi, type HealthCheckConfig } from '@/lib/api/health-check-config';
import { useTranslations } from 'next-intl';

export function HealthCheckConfig() {
  const t = useTranslations('EmailIntegrations.healthCheckConfig');
  const queryClient = useQueryClient();

  // Buscar configuração
  const { data: config, isLoading } = useQuery({
    queryKey: ['health-check-config'],
    queryFn: healthCheckConfigApi.getConfig,
  });

  // Mutation para atualizar
  const updateMutation = useMutation({
    mutationFn: healthCheckConfigApi.updateConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-check-config'] });
      toast.success(t('updateSuccess'));
    },
    onError: () => {
      toast.error(t('updateError'));
    },
  });

  // Mutation para executar agora
  const runNowMutation = useMutation({
    mutationFn: healthCheckConfigApi.runNow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-check-config'] });
      queryClient.invalidateQueries({ queryKey: ['email-integrations'] });
      toast.success(t('runNowSuccess'));
    },
    onError: () => {
      toast.error(t('runNowError'));
    },
  });

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateMutation.mutate({ enabled: event.target.checked });
  };

  const handleFrequencyChange = (frequency: HealthCheckConfig['frequency']) => {
    updateMutation.mutate({ frequency });
  };

  const handleRunNow = () => {
    runNowMutation.mutate();
  };

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-muted rounded-lg" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {t('title')}
        </CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-medium">{t('enabled')}</label>
            <p className="text-sm text-muted-foreground">{t('enabledDescription')}</p>
          </div>
          <Switch
            checked={config?.enabled || false}
            onChange={handleToggle}
            disabled={updateMutation.isPending}
          />
        </div>

        {/* Frequency Select */}
        {config?.enabled && (
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('frequency')}</label>
            <Select
              value={config.frequency}
              onChange={handleFrequencyChange}
              disabled={updateMutation.isPending}
              fullWidth
            >
              <SelectOption value="15m">{t('frequencies.15m')}</SelectOption>
              <SelectOption value="30m">{t('frequencies.30m')}</SelectOption>
              <SelectOption value="1h">{t('frequencies.1h')}</SelectOption>
              <SelectOption value="6h">{t('frequencies.6h')}</SelectOption>
              <SelectOption value="12h">{t('frequencies.12h')}</SelectOption>
              <SelectOption value="24h">{t('frequencies.24h')}</SelectOption>
            </Select>
          </div>
        )}

        {/* Last/Next Run */}
        {config?.enabled && (
          <div className="rounded-lg border bg-muted/50 p-4 space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t('lastRun')}:</span>
              <span className="font-medium">
                {config.lastRun
                  ? new Date(config.lastRun).toLocaleString()
                  : t('never')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t('nextRun')}:</span>
              <span className="font-medium">
                {config.nextRun
                  ? new Date(config.nextRun).toLocaleString()
                  : t('notScheduled')}
              </span>
            </div>
          </div>
        )}

        {/* Run Now Button */}
        <Button
          type="button"
          onClick={handleRunNow}
          disabled={runNowMutation.isPending}
          className="w-full"
          variant="outline"
        >
          {runNowMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('running')}
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              {t('runNow')}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
