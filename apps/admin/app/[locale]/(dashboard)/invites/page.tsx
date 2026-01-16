import { getTranslations } from 'next-intl/server';
import InvitesView from './invites-view';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Invites' });

  return {
    title: t('title'),
  };
}

export default function InvitesPage() {
  return <InvitesView />;
}
