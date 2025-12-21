'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('SUPER_ADMIN' | 'TENANT_ADMIN' | 'USER')[];
}

export function AuthGuard({ children, allowedRoles }: Readonly<AuthGuardProps>) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Verificar localStorage diretamente para hidratação inicial se necessário
    // Mas o Zustand persist deve lidar com isso.
    // Vamos confiar no isAuthenticated do store, mas verificar se houve falha de hidratação.
    
    const checkAuth = () => {
      // Se não autenticado
      if (!isAuthenticated) {
        // Tentar recuperar do localStorage caso o store tenha perdido (ex: refresh)
        const token = localStorage.getItem('accessToken');
        const userData = localStorage.getItem('user');
        
        if (!token || !userData) {
             const returnUrl = encodeURIComponent(pathname);
             router.replace(`/login?returnUrl=${returnUrl}`);
             return;
        }
      }

      // Se autenticado, verificar roles
      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        router.replace('/unauthorized'); // Criar página 403 depois
        return;
      }

      setIsChecking(false);
    };

    // Pequeno timeout para permitir hidratação do Zustand
    // ou usar onRehydrateStorage do persist
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);

  }, [isAuthenticated, user, router, pathname, allowedRoles]);

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary-main" />
      </div>
    );
  }

  return <>{children}</>;
}
