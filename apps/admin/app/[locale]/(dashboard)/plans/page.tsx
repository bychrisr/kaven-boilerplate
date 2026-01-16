import { getTranslations } from 'next-intl/server';
import PlansView from './plans-view';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Plans' });

  return {
    title: t('title'),
  };
}

export default function PlansPage() {
  return <PlansView />;
}
