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
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  {
    name: 'Users',
    icon: Users,
    children: [
      { name: 'List', href: '/users' },
      { name: 'Create', href: '/users/create' },
      { name: 'Cards', href: '/users/cards' }
    ]
  },
  { name: 'Tenants', href: '/tenants', icon: Building2, role: 'SUPER_ADMIN' },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings }
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
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
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const isExpanded = expandedItems.includes(item.name);
            const Icon = item.icon;

            if (item.children) {
              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleExpand(item.name)}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary-main text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </button>
                  {isExpanded && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
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
                  isActive
                    ? 'bg-primary-main text-white'
                    : 'text-gray-700 hover:bg-gray-100'
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
