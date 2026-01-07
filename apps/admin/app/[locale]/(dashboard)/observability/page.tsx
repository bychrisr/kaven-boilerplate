'use client';

import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GoldenSignals } from './golden-signals';
import { NodeJsMetrics } from './nodejs-metrics';
import { HardwareMetrics } from './hardware-metrics';
import { InfrastructureServices } from './infrastructure-services';
import { ExternalAPIs } from './external-apis';
import { AlertsPanel } from './alerts-panel';
import { Activity, Server, Database, Globe, Bell } from 'lucide-react';

export default function ObservabilityPage() {
  const t = useTranslations('Observability');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('description')}
        </p>
      </div>

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="border-b border-border bg-transparent p-0">
          <TabsTrigger
            value="metrics"
            className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
          >
            <Activity className="mr-2 h-4 w-4" />
            {t('tabs.metrics')}
          </TabsTrigger>
          <TabsTrigger
            value="hardware"
            className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
          >
            <Server className="mr-2 h-4 w-4" />
            {t('tabs.hardware')}
          </TabsTrigger>
          <TabsTrigger
            value="infrastructure"
            className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
          >
            <Database className="mr-2 h-4 w-4" />
            {t('tabs.infrastructure')}
          </TabsTrigger>
          <TabsTrigger
            value="external"
            className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
          >
            <Globe className="mr-2 h-4 w-4" />
            {t('tabs.external')}
          </TabsTrigger>
          <TabsTrigger
            value="alerts"
            className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
          >
            <Bell className="mr-2 h-4 w-4" />
            {t('tabs.alerts')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-8">
          <GoldenSignals />
          <NodeJsMetrics />
        </TabsContent>

        <TabsContent value="hardware">
          <HardwareMetrics />
        </TabsContent>

        <TabsContent value="infrastructure">
          <InfrastructureServices />
        </TabsContent>

        <TabsContent value="external">
          <ExternalAPIs />
        </TabsContent>

        <TabsContent value="alerts">
          <AlertsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
