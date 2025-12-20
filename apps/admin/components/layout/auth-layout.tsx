import { ReactNode } from 'react';
import { Logo } from '@/components/logo';

interface AuthLayoutProps {
  children: ReactNode;
  illustration?: ReactNode;
  variant?: 'classic' | 'illustration' | 'cover';
}

export function AuthLayout({ children, illustration, variant = 'classic' }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration (hidden on mobile) */}
      {variant !== 'classic' && (
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-main to-primary-dark items-center justify-center p-12">
          {illustration || (
            <div className="text-white text-center">
              <Logo size="large" className="mb-6 justify-center" />
              <h2 className="text-4xl font-bold mb-4">Bem-vindo ao Kaven</h2>
              <p className="text-xl opacity-90">
                Multi-tenant SaaS Boilerplate
              </p>
            </div>
          )}
        </div>
      )}

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
