'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { Loader2, Copy, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function InvitesPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Pending Invites</h1>
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
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Invited By</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {invites.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                            No pending invites found
                        </TableCell>
                    </TableRow>
                ) : (
                    invites.map((invite: any) => (
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
    </div>
  );
}
