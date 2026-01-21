'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useTransition } from 'react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleCreate = (newLocale: string) => {
    // Current path: /en/saas-settings -> /pt/saas-settings
    // We need to replace the locale segment.
    // However, standard next/navigation pathname includes the locale if using standard setup?
    // With next-intl middleware, it usually does.
    // Let's assume simple string manipulation for now if next-intl navigation isn't fully set up with typed routes.
    
    // Actually, properly we should use:
    // import {usePathname, useRouter} from '@/i18n/navigation';
    // But we haven't created that yet.
    
    // For now, let's just do a hard window location change or simple replacement string logic 
    // to avoid complex typed routing setup for this iteration.
    
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    startTransition(() => {
        router.replace(newPath);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant={locale === 'en' ? 'contained' : 'outlined'}
        size="sm"
        onClick={() => handleCreate('en')}
        disabled={isPending}
      >
        🇺🇸 EN
      </Button>
      <Button 
        variant={locale === 'pt' ? 'contained' : 'outlined'}
        size="sm"
        onClick={() => handleCreate('pt')}
        disabled={isPending}
      >
        🇧🇷 PT
      </Button>
    </div>
  );
}
