'use client';

import { useTranslations } from 'next-intl';
import { Settings, Clock } from 'lucide-react';

export default function MaintenancePage() {
  const t = useTranslations('Maintenance');

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background text-foreground overflow-hidden p-6">
      
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-warning-main/10 blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-warning-main/5 blur-[120px] pointer-events-none animate-pulse-slow delay-1000" />
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-noise"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />

      <div className="relative z-10 max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
        
        {/* Icon with Ring */}
        <div className="mx-auto w-24 h-24 rounded-full bg-warning-main/10 flex items-center justify-center relative ring-1 ring-warning-main/20 shadow-xl shadow-warning-main/10">
          <div className="absolute inset-0 rounded-full border border-warning-main/20 animate-[spin_10s_linear_infinite]" />
          <Settings className="w-10 h-10 text-warning-main animate-spin-slow transition-transform" />
        </div>

        {/* Text */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-card/40 backdrop-blur-md border border-border p-6 rounded-xl shadow-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-background/50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-muted-foreground" />
             </div>
             <div className="text-left">
               <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                 {t('estimatedTime')}
               </div>
               <div className="text-sm font-bold">2 hours</div>
             </div>
          </div>
          <div className="h-8 w-[1px] bg-border" />
          <div className="text-xs font-medium text-warning-main bg-warning-main/10 px-3 py-1 rounded-full border border-warning-main/20">
            {t('backOnline')}
          </div>
        </div>

      </div>
    </div>
  );
}
