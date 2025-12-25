'use client';

import { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/header';
import { QueryProvider } from '@/providers/query-provider';
import { ToastProvider } from '@/providers/toast-provider';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useSidebar } from '@/hooks/use-sidebar';
import { ThemeConfigurator } from '@/components/settings/theme-configurator';
import { SettingsDrawer } from '@/components/settings/settings-drawer';
import { cn } from '@/lib/utils';

/**
 * Dashboard Layout Inner Component
 * 
 * Componente interno que gerencia o layout visual do dashboard.
 * Usa hooks do Zustand para acessar estado de tema e sidebar.
 */
function DashboardLayoutInner({ children }: { children: ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div 
      className={cn(
        "flex h-screen overflow-hidden transition-colors duration-300",
        "bg-background text-foreground"
      )}
    >
      <Sidebar />

      <div
        className={cn(
          'flex flex-1 flex-col overflow-hidden transition-all duration-300',
          isCollapsed ? 'lg:ml-[88px]' : 'lg:ml-[280px]'
        )}
      >
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="mt-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

/**
 * Dashboard Layout Client Component
 * 
 * Este componente encapsula todos os providers e lógica de estado
 * necessários para o dashboard funcionar. Foi separado do layout
 * principal para permitir que o layout pai seja um Server Component.
 * 
 * Providers incluídos:
 * - QueryProvider: TanStack Query para cache e data fetching
 * - AuthGuard: Proteção de rotas e verificação de autenticação
 * - ToastProvider: Notificações toast (Sonner)
 * - ThemeConfigurator: Configurador avançado de tema
 * - SettingsDrawer: Drawer de configurações
 * 
 * @see /docs/design-system/architecture.md - Padrão Server/Client Wrapper
 */
export function DashboardLayoutClient({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthGuard>
        <DashboardLayoutInner>{children}</DashboardLayoutInner>
        <ToastProvider />
        {/* Advanced Customization Engine */}
        <ThemeConfigurator />
        <SettingsDrawer />
      </AuthGuard>
    </QueryProvider>
  );
}
