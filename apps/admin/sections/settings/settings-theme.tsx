/**
 * Settings Theme Tab
 * Theme customization settings
 */

'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ThemeCustomizer } from '@/components/settings/theme-customizer';

export function SettingsTheme() {
  const t = useTranslations('Settings');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('theme.title')}</CardTitle>
        <CardDescription>{t('theme.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ThemeCustomizer />
      </CardContent>
    </Card>
  );
}
