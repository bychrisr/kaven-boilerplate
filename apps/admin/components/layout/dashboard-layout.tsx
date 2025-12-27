'use client';

import { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';
import { useSidebar } from '@/hooks/use-sidebar';
import { useUIStore } from '@/stores/ui.store';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isCollapsed } = useSidebar();
  const { toggleSidebar } = useUIStore();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div 
        className={cn(
            "transition-all duration-300 ease-in-out min-h-screen flex flex-col",
            isCollapsed ? "lg:ml-[88px]" : "lg:ml-[280px]"
        )}
      >
        {/* Top Navbar */}
        <Navbar onMenuClick={toggleSidebar} />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-hidden">
            {children}
        </main>
      </div>
    </div>
  );
}
