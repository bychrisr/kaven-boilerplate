import { getTranslations } from 'next-intl/server';
import PricingView from './pricing-view';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Pricing' });

  return {
    title: t('title'),
  };
}

export default function PricingPage() {
  return <PricingView />;
}
