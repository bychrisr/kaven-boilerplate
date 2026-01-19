import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { IntegrationsView } from './integrations-view';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'PlatformSettings' });

  return {
    title: `${t('integrations.title')} - Platform Settings`,
  };
}

export default function IntegrationsPage() {
  return <IntegrationsView />;
}
