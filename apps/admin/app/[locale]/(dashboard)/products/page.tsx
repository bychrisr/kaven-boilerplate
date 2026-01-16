import { getTranslations } from 'next-intl/server';
import ProductsView from './products-view';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Products' });

  return {
    title: t('title'),
  };
}

export default function ProductsPage() {
  return <ProductsView />;
}
