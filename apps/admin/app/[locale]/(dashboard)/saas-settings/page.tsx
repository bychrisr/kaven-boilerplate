import { getTranslations } from 'next-intl/server';
import PlatformSettingsView from './saas-settings-view';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PlatformSettings' });

  return {
    title: t('title'),
  };
}

export default function PlatformSettingsPage() {
  return <PlatformSettingsView />;
}
