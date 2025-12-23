'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import {
  Home,
  Users,
  Building2,
  ShoppingCart,
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
  Activity,
  LucideIcon,
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavigationChild {
  name: string;
  href: string;
  external?: boolean;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  role?: string;
  children?: NavigationChild[];
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  {
    name: 'Users',
    href: '/users', // Added base href for parent
    icon: Users,
    children: [
      { name: 'List', href: '/users' },
      { name: 'Create', href: '/users/create' },
      { name: 'Cards', href: '/users/cards' },
    ],
  },
  { name: 'Tenants', href: '/tenants', icon: Building2, role: 'SUPER_ADMIN' },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  {
    name: 'Monitoring',
    href: '#', // Placeholder
    icon: Activity,
    children: [
      { name: 'Grafana', href: 'http://localhost:3001', external: true },
      { name: 'Prometheus', href: 'http://localhost:9090', external: true },
      { name: 'System Health', href: '/dashboard/observability' },
      { name: 'Audit Logs', href: '/dashboard/observability?tab=audit' },
    ],
  },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ open, onClose }: Readonly<SidebarProps>) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <button
          type="button"
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden w-full h-full cursor-default focus:outline-none"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Logo size="medium" />
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || item.children?.some((child) => pathname === child.href);
            const isExpanded = expandedItems.includes(item.name);
            const Icon = item.icon;

            if (item.children) {
              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleExpand(item.name)}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                      isActive ? 'bg-primary-main text-white' : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </div>
                    <ChevronDown
                      className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-180')}
                    />
                  </button>
                  {isExpanded && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          target={child.external ? '_blank' : undefined}
                          rel={child.external ? 'noopener noreferrer' : undefined}
                          className={cn(
                            'block px-4 py-2 text-sm rounded-lg transition-colors',
                            pathname === child.href
                              ? 'bg-primary-light text-primary-dark'
                              : 'text-gray-600 hover:bg-gray-100'
                          )}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  isActive ? 'bg-primary-main text-white' : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
