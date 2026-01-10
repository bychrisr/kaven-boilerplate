'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('Common.errors');

  useEffect(() => {
    // Log exception context
    console.error('[Global Error Boundary]:', error);
  }, [error]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background text-foreground overflow-hidden p-6">
      
      {/* Background Effects (Red/Error theme) */}
      <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-error-main/10 blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 max-w-lg w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        
        {/* Icon */}
        <div className="mx-auto w-24 h-24 rounded-full bg-error-main/10 flex items-center justify-center ring-1 ring-error-main/20 shadow-xl shadow-error-main/10">
          <AlertTriangle className="h-10 w-10 text-error-main" />
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">
            {t('errorTitle')}
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            {t('errorDescription')}
          </p>
        </div>

        {/* Dev Details (Only in Dev) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-left bg-card/50 border border-error-main/20 rounded-lg p-4 font-mono text-xs overflow-auto max-h-48 text-error-main/80">
             <p className="font-bold mb-1">Error Debug Info:</p>
             <p>{error.message || 'Unknown error'}</p>
             {error.digest && <p className="mt-1 opacity-70">Digest: {error.digest}</p>}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" asChild size="lg" className="h-11">
             <Link href="/dashboard">
               <Home className="w-4 h-4 mr-2" />
               {t('notFoundBack')}
             </Link>
          </Button>
          
          <Button onClick={reset} size="lg" className="h-11 shadow-lg shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('errorRetry')}
          </Button>
        </div>

      </div>
    </div>
  );
}
