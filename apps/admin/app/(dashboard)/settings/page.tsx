'use client';

import * as React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ThemeCustomizer } from '@/components/settings/theme-customizer';
import { Settings as SettingsIcon, Palette, Bell, User } from 'lucide-react';

export default function SettingsPage() {
  const [showCustomizer, setShowCustomizer] = React.useState(false);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="size-8" />
          Configurações
        </h1>
        <p className="text-text-secondary mt-1">
          Gerencie as configurações do sistema e personalize sua experiência
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">
            <User className="size-4 mr-2" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="theme">
            <Palette className="size-4 mr-2" />
            Tema
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="size-4 mr-2" />
            Notificações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="bg-background-paper rounded-lg border border-divider p-6">
            <h2 className="text-xl font-semibold mb-4">Configurações Gerais</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="app-name" className="block text-sm font-medium mb-1">
                  Nome da Aplicação
                </label>
                <input
                  id="app-name"
                  type="text"
                  defaultValue="Kaven Admin"
                  className="w-full px-3 py-2 border border-divider rounded focus:outline-none focus:ring-2 focus:ring-primary-main/20"
                />
              </div>
              <div>
                <label htmlFor="language" className="block text-sm font-medium mb-1">
                  Idioma
                </label>
                <select
                  id="language"
                  className="w-full px-3 py-2 border border-divider rounded focus:outline-none focus:ring-2 focus:ring-primary-main/20"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                </select>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="theme">
          <div className="bg-background-paper rounded-lg border border-divider p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Personalização do Tema</h2>
                <p className="text-sm text-text-secondary mt-1">
                  Customize cores, fontes e estilos do sistema
                </p>
              </div>
              <button
                onClick={() => setShowCustomizer(true)}
                className="px-4 py-2 bg-primary-main text-white rounded hover:bg-primary-dark transition-colors"
              >
                Abrir Customizador
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 border border-divider rounded">
                <h3 className="font-medium mb-2">Modo Claro</h3>
                <div className="h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded" />
              </div>
              <div className="p-4 border border-divider rounded">
                <h3 className="font-medium mb-2">Modo Escuro</h3>
                <div className="h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded" />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="bg-background-paper rounded-lg border border-divider p-6">
            <h2 className="text-xl font-semibold mb-4">Preferências de Notificação</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Notificações por Email</div>
                  <div className="text-sm text-text-secondary">Receber atualizações por email</div>
                </div>
                <label htmlFor="email-notifications" className="relative inline-flex items-center cursor-pointer">
                  <input id="email-notifications" type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-main/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-main"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Notificações Push</div>
                  <div className="text-sm text-text-secondary">Receber notificações no navegador</div>
                </div>
                <label htmlFor="push-notifications" className="relative inline-flex items-center cursor-pointer">
                  <input id="push-notifications" type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-main/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-main"></div>
                </label>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <ThemeCustomizer open={showCustomizer} onClose={() => setShowCustomizer(false)} />
    </div>
  );
}
