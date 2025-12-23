'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  ShoppingCart,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useSidebar } from '@/hooks/use-sidebar';
import { SidebarItem } from '@/components/sidebar/sidebar-item';
import { SidebarSection } from '@/components/sidebar/sidebar-section';

const overviewNav = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Usuários', href: '/users', icon: Users },
  { name: 'Tenants', href: '/tenants', icon: Building2 },
];

const managementNav = [
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Pedidos', href: '/orders', icon: ShoppingCart },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const { isCollapsed, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-[#1C252E] border-r border-[#F4F6F8]',
        'transition-all duration-300 ease-in-out z-40',
        isCollapsed ? 'w-[72px]' : 'w-[280px]'
      )}
    >
      {/* Header com Logo + Toggle */}
      <div className="h-[72px] flex items-center justify-between px-4 border-b border-white/5">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#1877F2]">Kaven</span>
          </Link>
        )}
        <button
          onClick={toggle}
          className={cn(
            'p-2 rounded-[8px] hover:bg-white/5 transition-colors',
            'text-[#919EAB]',
            isCollapsed && 'mx-auto'
          )}
          aria-label={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Sections */}
      <nav className="px-2 py-4 overflow-y-auto h-[calc(100%-72px)]">
        {/* OVERVIEW Section */}
        <SidebarSection title="OVERVIEW" collapsed={isCollapsed}>
          {overviewNav.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.name}
              href={item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </SidebarSection>

        {/* MANAGEMENT Section */}
        <SidebarSection title="MANAGEMENT" collapsed={isCollapsed}>
          {managementNav.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.name}
              href={item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </SidebarSection>
      </nav>
    </aside>
  );
}
