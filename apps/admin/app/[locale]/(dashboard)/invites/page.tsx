
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { api } from '@/lib/api';
import { Loader2, Copy, Trash2, Plus, Mail } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { InviteUserDialog } from '@/components/users/invite-dialog';

export default function InvitesPage() {
  const t = useTranslations('Invites');
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
      toast.success('Invite cancelled');
    },
    onError: () => {
      toast.error('Failed to cancel invite');
    },
  });

  const copyInviteLink = (token: string) => {
    const url = `${window.location.origin}/signup?token=${token}`;
    navigator.clipboard.writeText(url);
    toast.success('Invite link copied to clipboard');
  };

  const invites = data?.invites || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">{t('description')}</p>
        </div>
        <Button 
            className="flex items-center gap-2 shadow-lg" 
            onClick={() => setIsInviteOpen(true)}
        >
            <Plus className="h-4 w-4" />
            {t('create')}
        </Button>
      </div>

      <Card className="border-none shadow-md bg-card dark:bg-[#212B36] overflow-hidden">
        {isLoading ? (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        ) : (
            <Table>
                <TableHeader className="bg-muted/50">
                <TableRow>
                    <TableHead>{t('table.headers.email')}</TableHead>
                    <TableHead>{t('table.headers.role')}</TableHead>
                    <TableHead>{t('table.headers.tenant')}</TableHead>
                    <TableHead>Invited By</TableHead>
                    <TableHead>{t('table.headers.expiresAt')}</TableHead>
                    <TableHead className="text-right">{t('table.headers.actions')}</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {invites.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="h-48 text-center">
                            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                <Mail className="h-8 w-8 opacity-20" />
                                <p>{t('table.empty')}</p>
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
                        <TableRow key={invite.id}>
                        <TableCell className="font-medium">{invite.email}</TableCell>
                        <TableCell>
                            <Badge variant={
                            invite.role === 'SUPER_ADMIN' ? 'destructive' : 'secondary'
                            } className="uppercase text-[10px]">
                            {invite.role}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            {invite.tenant ? invite.tenant.name : (
                            <span className="text-muted-foreground italic">Kaven Platform</span>
                            )}
                        </TableCell>
                        <TableCell>{invite.invitedBy.name}</TableCell>
                        <TableCell>
                            {formatDistanceToNow(new Date(invite.expiresAt), {
                            addSuffix: true,
                            })}
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyInviteLink(invite.token)}
                                title="Copy Link"
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => cancelMutation.mutate(invite.id)}
                                disabled={cancelMutation.isPending}
                                title="Cancel Invite"
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
        )}
      </Card>

      <InviteUserDialog 
         open={isInviteOpen} 
         onClose={() => setIsInviteOpen(false)} 
      />
    </div>
  );
}
