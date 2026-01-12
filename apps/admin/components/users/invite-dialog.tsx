
'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectOption } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface InviteUserDialogProps {
  open: boolean;
  onClose: () => void;
}

export function InviteUserDialog({ open, onClose }: InviteUserDialogProps) {
  const t = useTranslations('Users');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'MEMBER'>('MEMBER');

  const inviteMutation = useMutation({
    mutationFn: async (data: { email: string; role: string }) => {
      const response = await api.post('/api/users/invites', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success(t('inviteSuccess'));
      setEmail('');
      setRole('MEMBER');
      onClose();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message || t('inviteError');
      toast.error(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    inviteMutation.mutate({ email, role });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('inviteUser')}</DialogTitle>
          <DialogDescription>
            {t('inviteDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('emailLabel')}</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="colleague@company.com"
            />
          </div>

          <div className="space-y-2">
            <Select
              label={t('roleLabel')}
              value={role}
              onChange={(val) => setRole(val as 'ADMIN' | 'MEMBER')}
              fullWidth
            >
              <SelectOption value="MEMBER">{t('roleMember')}</SelectOption>
              <SelectOption value="ADMIN">{t('roleAdmin')}</SelectOption>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={inviteMutation.isPending}>
              {inviteMutation.isPending ? t('sending') : t('sendInvite')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
