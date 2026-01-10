'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const t = useTranslations('Common.errors');

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background text-foreground overflow-hidden p-6">
       
       {/* Background Effects */}
       <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
       <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
       
       <div className="relative z-10 max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          
          <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center ring-1 ring-border shadow-inner">
            <FileQuestion className="h-10 w-10 text-muted-foreground opacity-50" />
          </div>

          <div className="space-y-2">
            <h1 className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
              404
            </h1>
            <h2 className="text-2xl font-semibold tracking-tight">
              {t('notFoundTitle')}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('notFoundDescription')}
            </p>
          </div>

          <Button asChild size="lg" className="h-11 px-8 shadow-lg shadow-primary/20">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('notFoundBack')}
            </Link>
          </Button>

       </div>
    </div>
  );
}
