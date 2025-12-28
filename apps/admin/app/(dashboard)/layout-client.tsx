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
import { Scrollbar } from '@/components/scrollbar/scrollbar';
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
        "flex h-screen overflow-hidden transition-colors duration-300 relative",
        "bg-background text-foreground"
      )}
    >
      {/* Background Gradients/Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      
      {/* Noise Texture */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} 
      />

      <Sidebar />

      <div
        className={cn(
          'flex flex-1 flex-col overflow-hidden transition-all duration-300 relative z-10',
          isCollapsed ? 'lg:ml-[88px]' : 'lg:ml-[280px]'
        )}
      >
        <Header />

        <main className="flex-1 relative overflow-hidden">
          <Scrollbar className="h-full p-4 md:p-6">
            <div className="mx-auto max-w-7xl">{children}</div>
          </Scrollbar>
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
