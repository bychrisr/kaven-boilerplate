import { getTranslations } from 'next-intl/server';
import AuditLogsView from './audit-logs-view';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AuditLogs' });

  return {
    title: t('title'),
  };
}

export default function AuditLogsPage() {
  return <AuditLogsView />;
}
