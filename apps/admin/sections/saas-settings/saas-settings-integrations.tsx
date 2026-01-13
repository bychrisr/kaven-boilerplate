'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Blocks } from 'lucide-react';

export function SaasSettingsIntegrations() {
  const t = useTranslations('PlatformSettings');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Blocks className="h-5 w-5 text-primary" />
            {t('integrations.title')}
        </CardTitle>
        <CardDescription>
            {t('integrations.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
        {t('integrations.comingSoon')}
      </CardContent>
    </Card>
  );
}
