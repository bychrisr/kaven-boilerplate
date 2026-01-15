/**
 * Users Page
 * Now using sections architecture pattern
 * Simple page that just imports and renders UserView
 */

import { UserView } from '@/sections/user';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Users' });

  return {
    title: t('title'),
  };
}

export default function UsersPage() {
  return <UserView />;
}
