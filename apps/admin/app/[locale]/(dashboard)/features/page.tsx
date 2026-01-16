import { getTranslations } from 'next-intl/server';
import FeaturesView from './features-view';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Features' });

  return {
    title: t('title'),
  };
}

export default function FeaturesPage() {
  return <FeaturesView />;
}
