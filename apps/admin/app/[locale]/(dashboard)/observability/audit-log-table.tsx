'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { observabilityApi } from '@/lib/api/observability';
import { format } from 'date-fns';
import { useState } from 'react';
import { Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// getActionBadgeVariant removed (unused)

// Helper para cores de badges (usando cores semânticas do design system)
function getActionBadgeClasses(action: string): string {
  if (action.includes('delete') || action.includes('failed')) 
    return 'bg-error-lighter text-error-main border border-error-light';
  if (action.includes('create') || action.includes('success'))
    return 'bg-success-lighter text-success-main border border-success-light';
  if (action.includes('update')) 
    return 'bg-info-lighter text-info-main border border-info-light';
  return 'bg-muted text-muted-foreground border border-border';
}

export function AuditLogTable() {
  const t = useTranslations('AuditLogs');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', page],
    queryFn: () => observabilityApi.getAuditLogs({ page, limit: 10 }),
    refetchInterval: 3000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t('table.columns.dateTime')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t('table.columns.action')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t('table.columns.actor')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t('table.columns.entity')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t('table.columns.details')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {data?.logs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getActionBadgeClasses(log.action)}`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {log.user?.name || log.userId}
                      </span>
                      <span className="text-xs text-muted-foreground">{log.user?.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {log.entity}{' '}
                    <span className="text-xs text-muted-foreground">({log.entityId.slice(0, 8)}...)</span>
                  </td>
                  <td className="px-6 py-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                          <Eye className="h-4 w-4" />
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t('table.detailsModal.title')}</DialogTitle>
                          <DialogDescription>{t('table.detailsModal.idLabel')}: {log.id}</DialogDescription>
                        </DialogHeader>
                        <div className="mt-4">
                          <pre className="rounded-lg border border-border bg-muted p-4 text-xs overflow-auto">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
              {data?.logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-muted-foreground">
                    {t('table.empty')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="rounded px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t('pagination.previous')}
        </button>
        <span className="text-sm text-muted-foreground">
          {t('pagination.pageOf', { page, total: data?.pagination.totalPages || 1 })}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!data || page >= (data.pagination.totalPages || 1)}
          className="rounded px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t('pagination.next')}
        </button>
      </div>
    </div>
  );
}
