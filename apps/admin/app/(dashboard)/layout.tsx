'use client';

import { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/header';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { QueryProvider } from '@/providers/query-provider';
import { ToastProvider } from '@/providers/toast-provider';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useSidebar } from '@/hooks/use-sidebar';
import { useSettings } from '@/stores/settings.store';
import { ThemeConfigurator } from '@/components/settings/theme-configurator';
import { SettingsDrawer } from '@/components/settings/settings-drawer';
import { cn } from '@/lib/utils';

function DashboardLayoutInner({ children }: { children: ReactNode }) {
  const { theme } = useSettings();
  const { isCollapsed } = useSidebar();

  return (
    <div 
      className={cn(
        "flex h-screen overflow-hidden transition-colors duration-300",
        theme === 'dark' ? "bg-[#1C252E] text-white" : "bg-[#F9FAFB] text-gray-900"
      )}
    >
      <Sidebar />

      <div
        className={cn(
          'flex flex-1 flex-col overflow-hidden transition-all duration-300',
          isCollapsed ? 'ml-[88px]' : 'ml-[280px]'
        )}
      >
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Breadcrumbs removed per user request */}
            <div className="mt-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
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
