'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

const routeNames: Record<string, string> = {
  '/': 'Dashboard',
  '/users': 'Usuários',
  '/users/create': 'Criar Usuário',
  '/tenants': 'Tenants',
  '/invoices': 'Invoices',
  '/orders': 'Pedidos',
  '/settings': 'Configurações',
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600">
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-gray-900"
      >
        <Home className="h-4 w-4" />
        <span>Home</span>
      </Link>

      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join('/')}`;
        const name = routeNames[href] || path;
        const isLast = index === paths.length - 1;

        return (
          <div key={href} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
            {isLast ? (
              <span className="font-medium text-gray-900">{name}</span>
            ) : (
              <Link href={href} className="hover:text-gray-900">
                {name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
