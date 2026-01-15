import { getTranslations } from 'next-intl/server';
import CurrenciesView from './currencies-view';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Currencies' });

  return {
    title: t('title'),
  };
}

export default function CurrenciesPage() {
  return <CurrenciesView />;
}
