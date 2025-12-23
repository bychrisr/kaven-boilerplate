'use client';

import { ReactNode } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { QueryProvider } from '@/providers/query-provider';
import { ToastProvider } from '@/providers/toast-provider';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useSidebar } from '@/hooks/use-sidebar';
import { cn } from '@/lib/utils';

function DashboardLayoutInner({ children }: { children: ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F9FAFB]">
      <Sidebar />

      <div
        className={cn(
          'flex flex-1 flex-col overflow-hidden transition-all duration-300',
          isCollapsed ? 'ml-[72px]' : 'ml-[280px]'
        )}
      >
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Breadcrumbs>
              <span>Dashboard</span>
            </Breadcrumbs>
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
      </AuthGuard>
    </QueryProvider>
  );
}
