import { ReactNode } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { QueryProvider } from '@/providers/query-provider';
import { ToastProvider } from '@/providers/toast-provider';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />
        
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              <Breadcrumbs />
              <div className="mt-6">{children}</div>
            </div>
          </main>
        </div>
      </div>
      
      <ToastProvider />
    </QueryProvider>
  );
}
