
'use client';

import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { GoldenSignals } from './golden-signals';
import { NodeJsMetrics } from './nodejs-metrics';
import { HardwareMetrics } from './hardware-metrics';
import { InfrastructureServices } from './infrastructure-services';
import { ExternalAPIs } from './external-apis';
import { AlertsPanel } from './alerts-panel';
import { ProtectionSystems } from './protection-systems';
import { DiagnosticTools } from './diagnostic-tools';
import { Activity, Server, Database, Globe, Bell, Shield, Wrench } from 'lucide-react';
import { Breadcrumbs, BreadcrumbItem } from '@/components/breadcrumbs';
import Link from 'next/link';

export default function ObservabilityPage() {
  const t = useTranslations('Observability');

  const tabTriggerClass = cn(
    "relative h-14 rounded-none bg-transparent px-0 pb-3 pt-3 font-semibold text-muted-foreground shadow-none transition-none cursor-pointer",
    "!bg-transparent !shadow-none !border-0 hover:text-foreground mx-4 first:ml-0",
    "data-[state=active]:!bg-transparent data-[state=active]:!shadow-none data-[state=active]:!text-foreground data-[state=active]:!border-none",
    "dark:data-[state=active]:!bg-transparent dark:data-[state=active]:!border-none",
    "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 data-[state=active]:after:scale-x-100"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('title')}</h1>
        <div className="mt-2 mb-4">
            <Breadcrumbs>
                <BreadcrumbItem>
                    <Link href="/dashboard" className="transition-colors hover:text-foreground">
                        Dashboard
                    </Link>
                </BreadcrumbItem>
                <BreadcrumbItem current>{t('title')}</BreadcrumbItem>
            </Breadcrumbs>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('description')}
        </p>
      </div>

      <Card className="!p-0 !gap-0 block overflow-hidden border-none shadow-md bg-card/50 backdrop-blur-sm dark:bg-[#212B36]/50">
        <Tabs defaultValue="metrics" className="w-full">
            <div className="flex flex-col md:flex-row items-center w-full border-b border-border/40 gap-4">
                <TabsList className="bg-transparent p-0 h-auto gap-0 justify-start px-4 w-full flex-nowrap overflow-x-auto border-b-0 no-scrollbar">
                    <TabsTrigger value="metrics" className={tabTriggerClass}>
                        <Activity className="mr-2 h-4 w-4" />
                        {t('tabs.metrics')}
                    </TabsTrigger>
                    <TabsTrigger value="hardware" className={tabTriggerClass}>
                        <Server className="mr-2 h-4 w-4" />
                        {t('tabs.hardware')}
                    </TabsTrigger>
                    <TabsTrigger value="infrastructure" className={tabTriggerClass}>
                        <Database className="mr-2 h-4 w-4" />
                        {t('tabs.infrastructure')}
                    </TabsTrigger>
                    <TabsTrigger value="external" className={tabTriggerClass}>
                        <Globe className="mr-2 h-4 w-4" />
                        {t('tabs.external')}
                    </TabsTrigger>
                    <TabsTrigger value="alerts" className={tabTriggerClass}>
                        <Bell className="mr-2 h-4 w-4" />
                        {t('tabs.alerts')}
                    </TabsTrigger>
                    <TabsTrigger value="protection" className={tabTriggerClass}>
                        <Shield className="mr-2 h-4 w-4" />
                        {t('tabs.protection')}
                    </TabsTrigger>
                    <TabsTrigger value="diagnostics" className={tabTriggerClass}>
                        <Wrench className="mr-2 h-4 w-4" />
                        {t('tabs.diagnostics')}
                    </TabsTrigger>
                </TabsList>
            </div>

            <div className="p-6">
                <TabsContent value="metrics" className="space-y-8 mt-0 focus-visible:ring-0 focus-visible:outline-none">
                <GoldenSignals />
                <NodeJsMetrics />
                </TabsContent>

                <TabsContent value="hardware" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                <HardwareMetrics />
                </TabsContent>

                <TabsContent value="infrastructure" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                <InfrastructureServices />
                </TabsContent>

                <TabsContent value="external" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                <ExternalAPIs />
                </TabsContent>

                <TabsContent value="alerts" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                <AlertsPanel />
                </TabsContent>

                <TabsContent value="protection" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                <ProtectionSystems />
                </TabsContent>

                <TabsContent value="diagnostics" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                <DiagnosticTools />
                </TabsContent>
            </div>
        </Tabs>
      </Card>
    </div>
  );
}

