import { getTranslations } from 'next-intl/server';
import DashboardView from './dashboard-view';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Dashboard' });

  return {
    title: t('title', { name: 'Admin' }),
  };
}

export default function DashboardPage() {
  return <DashboardView />;
}
