'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, TestTube2, Edit, Trash2, Loader2, Info } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TooltipRoot,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface EmailIntegration {
  id: string;
  provider: 'RESEND' | 'SMTP' | 'POSTMARK';
  fromName: string;
  fromEmail: string;
  isActive: boolean;
  isPrimary: boolean;
  healthStatus: string | null;
  healthMessage: string | null;
  lastHealthCheck: string | null;
}

interface HealthStatusBadgeProps {
  status: string | null;
}

function HealthStatusBadge({ status }: HealthStatusBadgeProps) {
  const t = useTranslations('PlatformSettings.integrations.healthStatus');

  const config = {
    healthy: {
      variant: 'default' as const,
      className: 'bg-green-500 hover:bg-green-600',
      icon: '🟢',
      label: t('healthy'),
    },
    unhealthy: {
      variant: 'destructive' as const,
      className: '',
      icon: '🔴',
      label: t('unhealthy'),
    },
    unconfigured: {
      variant: 'secondary' as const,
      className: '',
      icon: '⚪',
      label: t('unconfigured'),
    },
  };

  const statusConfig = config[status as keyof typeof config] || config.unconfigured;

  return (
    <Badge variant={statusConfig.variant} className={statusConfig.className}>
      {statusConfig.icon} {statusConfig.label}
    </Badge>
  );
}

interface EmailIntegrationCardProps {
  integration: EmailIntegration;
}

export function EmailIntegrationCard({ integration }: EmailIntegrationCardProps) {
  const t = useTranslations('PlatformSettings.integrations');
  const queryClient = useQueryClient();
  const [isTesting, setIsTesting] = useState(false);

  const testConnection = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/settings/email/${id}/health`);
      if (!res.ok) throw new Error('Failed to test connection');
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['email-integrations'] });
      toast.success(data.healthy ? 'Connection successful!' : 'Connection failed', {
        description: data.message,
      });
    },
    onError: () => {
      toast.error('Failed to test connection');
    },
  });

  const handleTest = async () => {
    setIsTesting(true);
    try {
      await testConnection.mutateAsync(integration.id);
    } finally {
      setIsTesting(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{integration.provider}</h3>
              {integration.isPrimary && (
                <Badge variant="outline" className="text-xs">
                  Primary
                </Badge>
              )}
              {!integration.isActive && (
                <Badge variant="secondary" className="text-xs">
                  Inactive
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground mt-1">
              {integration.fromName} &lt;{integration.fromEmail}&gt;
            </p>

            <div className="flex items-center gap-2 mt-2">
              <HealthStatusBadge status={integration.healthStatus} />
              
              {integration.healthMessage && (
                <TooltipProvider>
                  <TooltipRoot>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{integration.healthMessage}</p>
                    </TooltipContent>
                  </TooltipRoot>
                </TooltipProvider>
              )}
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              {t('lastChecked')}: {formatDate(integration.lastHealthCheck)}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTest}
            disabled={isTesting}
          >
            {isTesting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <TestTube2 className="h-4 w-4" />
            )}
            <span className="ml-2">{t('testConnection')}</span>
          </Button>

          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
