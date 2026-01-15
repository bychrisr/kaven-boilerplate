/**
 * Settings Page
 * Now using sections architecture pattern
 */

import { SettingsView } from '@/sections/settings';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Settings' });

  return {
    title: t('title'),
  };
}

export default function SettingsPage() {
  return <SettingsView />;
}
