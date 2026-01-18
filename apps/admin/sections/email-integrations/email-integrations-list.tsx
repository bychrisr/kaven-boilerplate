'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Blocks, Inbox } from 'lucide-react';
import { emailIntegrationsApi } from '@/lib/api/email-integrations';
import { EmailIntegrationCard } from './email-integration-card';
import { EmailIntegrationDialog } from './email-integration-dialog';

export function EmailIntegrationsList() {
  const t = useTranslations('EmailIntegrations');

  const { data: integrations, isLoading } = useQuery({
    queryKey: ['email-integrations'],
    queryFn: emailIntegrationsApi.list,
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/5 pb-8">
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            {t('title')}
          </h3>
          <p className="text-sm text-muted-foreground max-w-2xl">
            {t('description')}
          </p>
        </div>
        <EmailIntegrationDialog mode="create" />
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-4 p-6 border rounded-xl bg-card/50">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <div className="space-y-2 mt-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : integrations && integrations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrations.map((integration) => (
              <EmailIntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl bg-muted/5">
            <div className="p-4 rounded-full bg-background border shadow-sm mb-4">
              <Inbox className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-medium mb-2">{t('emptyState')}</h3>
            <p className="text-sm text-muted-foreground mb-8 max-w-md">
              {t('emptyStateDescription')}
            </p>
            <EmailIntegrationDialog mode="create" />
          </div>
        )}
      </div>
    </div>
  );
}
