'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('SUPER_ADMIN' | 'TENANT_ADMIN' | 'USER')[];
}

/**
 * AuthGuard - Estilo Axisor
 * Aguarda isInitialized ao invés de isHydrated
 */
export function AuthGuard({ children, allowedRoles }: Readonly<AuthGuardProps>) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading, isInitialized } = useAuthStore();
  const [forceInitialized, setForceInitialized] = useState(false);

  console.log('🔐 AUTH GUARD - State:', {
    isAuthenticated,
    isLoading,
    isInitialized,
    forceInitialized,
    userExists: !!user,
  });

  useEffect(() => {
    // ✅ AXISOR STYLE: Safety Timeout para garantir inicialização
    const timeout = setTimeout(() => {
      if (!isInitialized && !forceInitialized) {
        console.log('⏰ AUTH GUARD - Timeout reached, forcing initialization check...');
        
        // Check localStorage directly
        const token = localStorage.getItem('access_token');
        console.log('🔍 AUTH GUARD - Direct Token Check:', token ? 'EXISTS' : 'MISSING');
        
        if (!token) {
           console.log('🔧 AUTH GUARD - No token found, forcing logout state');
           useAuthStore.setState({ 
             isAuthenticated: false, 
             isInitialized: true,
             isLoading: false 
           });
        } else {
           console.log('🔧 AUTH GUARD - Token found but store stuck, forcing rehydration');
           useAuthStore.persist.rehydrate();
        }
        setForceInitialized(true);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isInitialized, forceInitialized]);

  useEffect(() => {
    // Se ainda não inicializou e não forçou, aguardar
    if (!isInitialized && !forceInitialized) {
      console.log('⏳ AUTH GUARD - Not initialized, waiting...');
      return;
    }

    // Verificar autenticação
    if (!isAuthenticated) {
      console.log('❌ AUTH GUARD - Not authenticated, redirecting to login');
      const returnUrl = encodeURIComponent(pathname);
      router.push(`/login?returnUrl=${returnUrl}`);
      return;
    }

    // Verificar roles se especificado (RBAC)
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      console.log('❌ AUTH GUARD - Insufficient permissions, redirecting to unauthorized');
      router.push('/unauthorized');
      return;
    }

    console.log('✅ AUTH GUARD - User authenticated and authorized');
  }, [isInitialized, forceInitialized, isAuthenticated, user, router, pathname, allowedRoles]);

  // ✅ AXISOR STYLE: Mostrar loading enquanto não inicializado ou carregando
  if ((!isInitialized && !forceInitialized) || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-main mx-auto mb-4" />
          <p className="text-sm text-gray-600">
            {!isInitialized && !forceInitialized ? 'Verificando autenticação...' : 'Carregando...'}
          </p>
        </div>
      </div>
    );
  }

  // Não renderizar se não autenticado
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
