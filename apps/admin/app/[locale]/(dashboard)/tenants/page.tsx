/**
 * Tenants Page
 * Now using sections architecture pattern
 */

import { TenantView } from '@/sections/tenant';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Tenants' });

  return {
    title: t('title'),
  };
}

export default function TenantsPage() {
  return <TenantView />;
}
