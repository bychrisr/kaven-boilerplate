'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function HealthCheckConfig() {
  const t = useTranslations('PlatformSettings.integrations.automaticHealthCheck');

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">{t('title')}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t('description')}</p>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground">Configuration coming soon...</p>
      </CardContent>
    </Card>
  );
}
