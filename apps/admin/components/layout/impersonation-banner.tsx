import { useImpersonation } from '@/hooks/use-impersonation';
import { Button } from '@/components/ui/button';
import { AlertCircle, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export function ImpersonationBanner() {
  const t = useTranslations('Security.impersonation');
  const { isActive, session, stopImpersonation } = useImpersonation();

  if (!isActive) return null;

  return (
    <div className={cn(
      "w-full bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2 flex items-center justify-between animate-in slide-in-from-top duration-300 z-50",
      "backdrop-blur-md"
    )}>
      <div className="flex items-center gap-3">
        <div className="bg-yellow-500 rounded-full p-1">
          <AlertCircle className="w-4 h-4 text-white" />
        </div>
        <div className="text-sm">
          <span className="font-medium text-yellow-500 uppercase text-[10px] tracking-wider mr-2">{t('banner_title')}</span>
          <span className="text-foreground/80">
            {t('viewing_as')} <span className="font-bold text-foreground">{session?.impersonated?.name || session?.impersonated?.email}</span>
          </span>
          <span className="hidden md:inline text-foreground/40 text-xs ml-2">
            ({session?.impersonated?.email})
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => stopImpersonation.mutate()}
        disabled={stopImpersonation.isPending}
        className="h-8 border-yellow-500/50 hover:bg-yellow-500 hover:text-white transition-all gap-2"
      >
        <LogOut className="w-4 h-4" />
        {t('exit')}
      </Button>
    </div>
  );
}
