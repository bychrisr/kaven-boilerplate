'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function Logo({
  size = 'medium',
  className,
}: {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState('Kaven');

  useEffect(() => {
    async function loadLogo() {
      try {
        const res = await fetch('/api/settings/platform');
        if (res.ok) {
          const data = await res.json();
          setLogoUrl(data.logoUrl || null);
          setCompanyName(data.companyName || 'Kaven');
        }
      } catch (error) {
        console.error('Failed to load logo:', error);
      }
    }
    loadLogo();
  }, []);

  const sizes = {
    small: 'h-6',
    medium: 'h-8',
    large: 'h-12',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img 
          src={logoUrl} 
          alt={companyName}
          className={cn(sizes[size], 'object-contain')}
        />
      ) : (
        <svg
          className={cn(sizes[size], 'text-primary-main')}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 2L2 9L16 16L30 9L16 2Z" fill="currentColor" fillOpacity="0.24" />
          <path d="M2 23L16 30L30 23V9L16 16L2 9V23Z" fill="currentColor" />
        </svg>
      )}
      {size !== 'small' && <span className="font-bold text-xl text-foreground">{companyName}</span>}
    </div>
  );
}
