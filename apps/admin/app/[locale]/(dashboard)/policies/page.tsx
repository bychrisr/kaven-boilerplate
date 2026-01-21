import { getTranslations } from 'next-intl/server';
import { PoliciesView } from './policies-view';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Policies' });
  return {
    title: `Kaven - ${t('title')}`,
  };
}

export default function PoliciesPage() {
  return <PoliciesView />;
}
