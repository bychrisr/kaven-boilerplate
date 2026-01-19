'use client';

import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmailIntegrationList } from './email-integration-list';
import { HealthCheckConfig } from './health-check-config';

export function IntegrationsView() {
  const t = useTranslations('PlatformSettings.integrations');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-2">{t('description')}</p>
      </div>

      <Tabs defaultValue="email" className="w-full">
        <TabsList>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="config">Automatic Health Check</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="mt-6">
          <EmailIntegrationList />
        </TabsContent>

        <TabsContent value="config" className="mt-6">
          <HealthCheckConfig />
        </TabsContent>
      </Tabs>
    </div>
  );
}
