'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Breadcrumbs, BreadcrumbItem } from '@/components/breadcrumbs';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { api } from '@/lib/api';
import { Loader2, Copy, Trash2, Plus, Mail } from 'lucide-react';
import { InviteUserDialog } from '@/components/users/invite-dialog';

export default function InvitesView() {
  const t = useTranslations('Invites');
  const tCommon = useTranslations('Common');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['pending-invites'],
    queryFn: async () => {
        const res = await api.get('/api/users/invites');
        return res.data;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (inviteId: string) => {
      const res = await api.delete(`/api/users/invites/${inviteId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-invites'] });
      toast.success(t('table.cancelSuccess'));
    },
    onError: () => {
      toast.error(t('table.cancelError'));
    },
  });

  const copyInviteLink = (token: string) => {
    const url = `${window.location.origin}/signup?token=${token}`;
    navigator.clipboard.writeText(url);
    toast.success(t('table.linkCopied'));
  };

  const invites = data?.invites || [];

  return (
    <div className="space-y-6">
      {/* Page Header - Seguindo padrão de Users */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('title')}</h1>
          <div className="mt-2">
            <Breadcrumbs>
              <BreadcrumbItem>
                <Link href="/dashboard" className="transition-colors hover:text-foreground">
                  {tCommon('dashboard')}
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link href="#" className="transition-colors hover:text-foreground">
                  {t('title')}
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem current>List</BreadcrumbItem>
            </Breadcrumbs>
          </div>
        </div>
        <Button 
          variant="contained"
          color="primary"
          size="md"
          onClick={() => setIsInviteOpen(true)}
        >
          <Plus className="h-4 w-4" />
          {t('create')}
        </Button>
      </div>

      {/* Card com tabela - Seguindo padrão de Users */}
      <Card className="!p-0 !gap-0 block overflow-hidden border-none shadow-md bg-card dark:bg-[#212B36]">
        <div className="relative mx-0 rounded-none border-none text-card-foreground shadow-none bg-transparent overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="border-b border-dashed border-border/50 hover:bg-transparent">
                <TableHead className="px-4 h-16 font-semibold bg-transparent text-foreground dark:text-white">{t('table.headers.email')}</TableHead>
                <TableHead className="px-4 h-16 font-semibold bg-transparent text-foreground dark:text-white">{t('table.headers.role')}</TableHead>
                <TableHead className="px-4 h-16 font-semibold bg-transparent text-foreground dark:text-white">{t('table.headers.tenant')}</TableHead>
                <TableHead className="px-4 h-16 font-semibold bg-transparent text-foreground dark:text-white">{t('table.headers.invitedBy')}</TableHead>
                <TableHead className="px-4 h-16 font-semibold bg-transparent text-foreground dark:text-white">{t('table.headers.expiresAt')}</TableHead>
                <TableHead className="px-4 h-16 font-semibold bg-transparent text-right">{t('table.headers.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : invites.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Mail className="h-12 w-12 text-muted-foreground/20" />
                      <p className="text-muted-foreground font-medium">{t('table.empty')}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                invites.map((invite: { 
                  id: string; 
                  email: string; 
                  role: string; 
                  token: string;
                  tenant?: { name: string };
                  invitedBy: { name: string };
                  expiresAt: string;
                }) => (
                  <TableRow key={invite.id} className="border-b border-dashed border-border/50">
                    <TableCell className="px-4 font-medium">{invite.email}</TableCell>
                    <TableCell className="px-4">
                      <Badge 
                        variant={invite.role === 'SUPER_ADMIN' ? 'destructive' : 'secondary'} 
                        className="uppercase text-[10px]"
                      >
                        {invite.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4">
                      {invite.tenant ? invite.tenant.name : (
                        <span className="text-muted-foreground italic">Kaven Platform</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4">{invite.invitedBy.name}</TableCell>
                    <TableCell className="px-4">
                      {formatDistanceToNow(new Date(invite.expiresAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell className="px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="md"
                          variant="outlined"
                          color="primary"
                          onClick={() => copyInviteLink(invite.token)}
                          title={t('table.copyLink')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="md"
                          variant="contained"
                          color="error"
                          onClick={() => cancelMutation.mutate(invite.id)}
                          disabled={cancelMutation.isPending}
                          title={t('table.cancelInvite')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <InviteUserDialog 
         open={isInviteOpen} 
         onClose={() => setIsInviteOpen(false)} 
      />
    </div>
  );
}
