'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ShieldCheck } from 'lucide-react';
import { AuditLogTable } from '@/components/audit-log-table';
import { Breadcrumbs, BreadcrumbItem } from '@/components/breadcrumbs';

export default function AuditLogsPage() {
  const t = useTranslations('AuditLogs');
  const tCommon = useTranslations('Common');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
           <ShieldCheck className="h-8 w-8" />
           {t('title')}
        </h1>
        <div className="mt-2 mb-4">
          <Breadcrumbs>
             <BreadcrumbItem>
               <Link href="/dashboard" className="transition-colors hover:text-foreground">
                 {tCommon('dashboard')}
               </Link>
             </BreadcrumbItem>
             <BreadcrumbItem current>{t('title')}</BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('description')}
        </p>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="border-b border-border p-6">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">{t('sectionTitle')}</h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('sectionDescription')}
          </p>
        </div>
        <div className="p-0">
          <AuditLogTable />
        </div>
      </div>
    </div>
  );
}
