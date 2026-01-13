'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Save, Loader2, Building2, Settings, UploadCloud, Blocks } from 'lucide-react';
import { Breadcrumbs, BreadcrumbItem } from '@/components/breadcrumbs';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { SaasSettingsGeneral } from '../saas-settings-general';
import { SaasSettingsBranding } from '../saas-settings-branding';
import { SaasSettingsSeo } from '../saas-settings-seo';
import { SaasSettingsIntegrations } from '../saas-settings-integrations';

interface SaasSettingsViewProps {
    isSaving: boolean;
}

export function SaasSettingsView({ isSaving }: SaasSettingsViewProps) {
  const t = useTranslations('PlatformSettings');
  const tCommon = useTranslations('Common');
  const { formState: { isDirty } } = useFormContext();
  const [activeTab, setActiveTab] = useState('general');

  const tabTriggerClass = cn(
    "relative h-14 rounded-none bg-transparent px-0 pb-3 pt-3 font-semibold text-muted-foreground shadow-none transition-none cursor-pointer",
    "!bg-transparent !shadow-none !border-0 hover:text-foreground mx-4 first:ml-0",
    "data-[state=active]:!bg-transparent data-[state=active]:!shadow-none data-[state=active]:!text-foreground data-[state=active]:!border-none",
    "dark:data-[state=active]:!bg-transparent dark:data-[state=active]:!border-none",
    "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 data-[state=active]:after:scale-x-100"
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('title')}</h1>
          <div className="mt-2">
            <Breadcrumbs>
              <BreadcrumbItem>
                <Link href="/dashboard" className="transition-colors hover:text-foreground">
                  {tCommon('dashboard')}
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem current>{t('title')}</BreadcrumbItem>
            </Breadcrumbs>
          </div>
        </div>
        
        {/* Actions - Global Save for all tabs */}
        <div className="flex gap-2 items-center">
            <Button 
                onClick={() => {}} // Form submission is handled by form wrapper, this just triggers submit type
                type="submit"
                disabled={isSaving || !isDirty}
            >
                {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Save className="mr-2 h-4 w-4" />
                )}
                {isSaving ? t('actions.saving') : t('actions.save')}
            </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8 w-full">
         <div className="flex flex-col md:flex-row items-center w-full border-b border-border/40 gap-4 mb-8">
            <TabsList className="bg-transparent p-0 h-auto gap-0 justify-start px-0 w-full flex-nowrap overflow-x-auto border-b-0 no-scrollbar">
              <TabsTrigger value="general" className={tabTriggerClass}>
                <Building2 className="mr-2 h-4 w-4" />
                {t('tabs.general')}
              </TabsTrigger>
              <TabsTrigger value="branding" className={tabTriggerClass}>
                <Settings className="mr-2 h-4 w-4" />
                {t('tabs.branding')}
              </TabsTrigger>
              <TabsTrigger value="seo" className={tabTriggerClass}>
                <UploadCloud className="mr-2 h-4 w-4" />
                {t('tabs.seo')}
              </TabsTrigger>
              <TabsTrigger value="integrations" className={tabTriggerClass}>
                <Blocks className="mr-2 h-4 w-4" />
                {t('tabs.integrations')}
              </TabsTrigger>
            </TabsList>
         </div>

        <TabsContent value="general" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
          <SaasSettingsGeneral />
        </TabsContent>

        <TabsContent value="branding" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
          <SaasSettingsBranding />
        </TabsContent>

        <TabsContent value="seo" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
            <SaasSettingsSeo />
        </TabsContent>

        <TabsContent value="integrations" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
            <SaasSettingsIntegrations />
        </TabsContent>
      </Tabs>
    </div>
  );
}
