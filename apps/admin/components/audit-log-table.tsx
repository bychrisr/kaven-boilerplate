'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { observabilityApi } from '@/lib/api/observability';
import { format } from 'date-fns';
import { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Helper for badge colors
function getBadgeVariant(action: string): "default" | "secondary" | "destructive" | "outline" {
  if (action.includes('delete') || action.includes('failed')) return 'destructive';
  if (action.includes('create') || action.includes('success')) return 'default'; // Success usually maps to default/primary or specific class
  if (action.includes('update')) return 'secondary';
  return 'outline';
}

function getBadgeClassName(action: string): string {
  if (action.includes('create') || action.includes('success')) return 'bg-emerald-500 hover:bg-emerald-600 border-transparent text-white';
  if (action.includes('update')) return 'bg-blue-500 hover:bg-blue-600 border-transparent text-white';
  return '';
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
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[180px]">{t('table.columns.dateTime')}</TableHead>
              <TableHead>{t('table.columns.action')}</TableHead>
              <TableHead>{t('table.columns.actor')}</TableHead>
              <TableHead>{t('table.columns.entity')}</TableHead>
              <TableHead className="w-[100px] text-right">{t('table.columns.details')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium text-muted-foreground">
                  {format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={getBadgeVariant(log.action)}
                    className={cn("capitalize", getBadgeClassName(log.action))}
                  >
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {log.user?.name || log.userId}
                    </span>
                    <span className="text-xs text-muted-foreground">{log.user?.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-foreground">{log.entity}</span>
                    <span className="text-xs text-muted-foreground font-mono">ID: {log.entityId.slice(0, 8)}...</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('table.detailsModal.title')}</DialogTitle>
                        <DialogDescription>{t('table.detailsModal.idLabel')}: {log.id}</DialogDescription>
                      </DialogHeader>
                      <div className="mt-4">
                        <pre className="rounded-lg border border-border bg-muted p-4 text-xs overflow-auto font-mono">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
            {(!data?.logs || data.logs.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  {t('table.empty')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end border-t border-border pt-4 px-2">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {t('pagination.pageOf', { page, total: data?.pagination.totalPages || 1 })}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={!data || page >= (data.pagination.totalPages || 1)}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
