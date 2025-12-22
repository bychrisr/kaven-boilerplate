/**
 * Settings View (Main Container)
 * Main container for the Settings page with tabs navigation
 */

'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Palette, Bell, User, Shield } from 'lucide-react';
import { SettingsGeneral } from '../settings-general';
import { SettingsTheme } from '../settings-theme';
import { SettingsNotifications } from '../settings-notifications';
import { SettingsSecurity } from '../settings-security';

export function SettingsView() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <SettingsIcon className="h-8 w-8" />
          Configurações
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Gerencie as configurações do sistema e personalize sua experiência
        </p>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="general">
            <User className="h-4 w-4 mr-2" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="theme">
            <Palette className="h-4 w-4 mr-2" />
            Tema
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notificações
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
