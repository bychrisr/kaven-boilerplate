/**
 * Settings View (Main Container)
 * Main container for the Settings page with tabs navigation
 */

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Palette, Bell, User, Shield } from 'lucide-react';
import { Breadcrumbs, BreadcrumbItem } from '@/components/breadcrumbs';
import Link from 'next/link';
import { SettingsGeneral } from '../settings-general';
import { SettingsTheme } from '../settings-theme';
import { SettingsNotifications } from '../settings-notifications';
import { SettingsSecurity } from '../settings-security';

export function SettingsView() {
  const t = useTranslations('Settings');
  const tCommon = useTranslations('Common');
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <SettingsIcon className="h-8 w-8" />
          {t('title')}
        </h1>
        <div className="mt-2 mb-4">
          <Breadcrumbs>
            <BreadcrumbItem>
              <Link href="/dashboard" className="transition-colors hover:text-foreground">
                {tCommon('dashboard')}
              </Link>
            </BreadcrumbItem>
            <BreadcrumbItem current>{t('title')}</BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          {t('subtitle')}
        </p>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="general">
            <User className="h-4 w-4 mr-2" />
            {t('tabs.general')}
          </TabsTrigger>
          <TabsTrigger value="theme">
            <Palette className="h-4 w-4 mr-2" />
            {t('tabs.theme')}
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            {t('tabs.security')}
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            {t('tabs.notifications')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <SettingsGeneral />
        </TabsContent>

        <TabsContent value="theme">
          <SettingsTheme />
        </TabsContent>

        <TabsContent value="security">
          <SettingsSecurity />
        </TabsContent>

        <TabsContent value="notifications">
          <SettingsNotifications />
        </TabsContent>
      </Tabs>
    </div>
  );
}
