'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Clock, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ComingSoonPage() {
  const t = useTranslations('ComingSoon');
  const [timeLeft, setTimeLeft] = useState({
    days: 14,
    hours: 8,
    minutes: 45,
    seconds: 12
  });

  // Dynamic Countdown Logic
  useEffect(() => {
    // Set launch date to 14 days from now on first load
    // In a real app, this would be a fixed timestamp
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 14);

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(interval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background text-foreground overflow-hidden p-6">
      
      {/* Background Effects (Match Dashboard) */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] pointer-events-none animate-pulse-slow delay-1000" />
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-noise"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />

      <div className="relative z-10 max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-700 slide-in-from-bottom-4">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
          <Clock className="w-4 h-4" />
          <span>{t('badge')}</span>
        </div>

        {/* Hero Text */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Interactive Card */}
        <div className="bg-card/30 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl ring-1 ring-white/5 mx-auto max-w-md">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
              <Mail className="w-4 h-4 text-primary" />
              {t('notify.label')}
            </div>
            
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder={t('notify.placeholder')} 
                className="bg-background/50 border-white/10 focus:border-primary/50 h-11"
              />
              <Button size="lg" className="shrink-0 font-semibold shadow-lg shadow-primary/20 h-11 px-6">
                {t('notify.button')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground text-left">
              {t('notify.disclaimer')}
            </p>
          </div>
        </div>

        {/* Footer Info (Dynamic Countdown) */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center opacity-60">
           {[
             { label: t('countdown.days'), value: String(timeLeft.days).padStart(2, '0') },
             { label: t('countdown.hours'), value: String(timeLeft.hours).padStart(2, '0') },
             { label: t('countdown.minutes'), value: String(timeLeft.minutes).padStart(2, '0') },
             { label: t('countdown.seconds'), value: String(timeLeft.seconds).padStart(2, '0') },
           ].map((item) => (
             <div key={item.label} className="space-y-1">
               <div className="text-2xl font-bold font-mono suppress-hydration-warning" suppressHydrationWarning>
                 {item.value}
               </div>
               <div className="text-xs uppercase tracking-wider">{item.label}</div>
             </div>
           ))}
        </div>

      </div>
    </div>
  );
}
