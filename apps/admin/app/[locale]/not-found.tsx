import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="mb-6 rounded-full bg-blue-50 p-6">
        <FileQuestion className="h-12 w-12 text-blue-600" />
      </div>
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">
        Página não encontrada (404)
      </h1>
      <p className="mb-8 max-w-md text-gray-500">
        Ops! A página que você está procurando não existe ou foi movida. Verifique a URL ou volte para o início.
      </p>
      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link href="/dashboard">Voltar ao Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
