import { getTranslations } from 'next-intl/server';
import DocsView from '@/sections/docs/view/docs-view';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Docs' });

  return {
    title: t('title'),
    description: 'Interactive documentation and showcase of Minimals Design System components',
  };
}

export default function DocsPage() {
  return <DocsView />;
}
