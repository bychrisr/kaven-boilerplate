'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="mb-6 rounded-full bg-red-50 p-6">
        <AlertTriangle className="h-12 w-12 text-red-600" />
      </div>
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">
        Algo deu errado! (500)
      </h1>
      <p className="mb-8 max-w-md text-gray-500">
        Encontramos um erro inesperado ao processar sua solicitação. Nossos engenheiros já foram notificados.
      </p>
      <div className="flex gap-4">
        <Button onClick={reset} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Tentar novamente
        </Button>
      </div>
      
      {process.env.NODE_ENV === 'development' && (
         <div className="mt-8 max-w-lg rounded-lg border border-red-200 bg-red-50 p-4 text-left">
           <p className="font-mono text-sm text-red-800 break-all">
             {error.message || 'Erro desconhecido'}
           </p>
           {error.digest && (
             <p className="mt-2 text-xs text-red-600">Digest: {error.digest}</p>
           )}
         </div>
      )}
    </div>
  );
}
