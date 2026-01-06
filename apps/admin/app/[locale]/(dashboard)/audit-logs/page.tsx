'use client';

import { useTranslations } from 'next-intl';
import { ShieldCheck } from 'lucide-react';
import { AuditLogTable } from '../observability/audit-log-table';

export default function AuditLogsPage() {
  const t = useTranslations('AuditLogs');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('description')}
        </p>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="border-b border-border p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">{t('sectionTitle')}</h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('sectionDescription')}
          </p>
        </div>
        <div className="p-6">
          <AuditLogTable />
        </div>
      </div>
    </div>
  );
}
