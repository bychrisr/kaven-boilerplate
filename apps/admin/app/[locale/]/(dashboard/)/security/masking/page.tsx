import { getTranslations } from 'next-intl/server';
import { MaskingView } from './masking-view';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Security.masking' });
  return {
    title: `Kaven - ${t('title')}`,
  };
}

export default function MaskingPage() {
  return <MaskingView />;
}
