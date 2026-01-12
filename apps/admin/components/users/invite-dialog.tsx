
'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
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
  const [role, setRole] = useState<'SUPER_ADMIN' | 'ADMIN' | 'MEMBER'>('MEMBER');
  const [tenantId, setTenantId] = useState<string>('');

  // Fetch current user to determine permissions
  const { data: currentUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const res = await api.get('/api/users/me');
      return res.data;
    },
  });

  // Fetch tenants (only if SUPER_ADMIN)
  const { data: tenants } = useQuery({
    queryKey: ['tenants-list'],
    queryFn: async () => {
      const res = await api.get('/api/tenants');
      return res.data;
    },
    enabled: currentUser?.role === 'SUPER_ADMIN',
  });

  const inviteMutation = useMutation({
    mutationFn: async (data: { email: string; role: string; tenantId?: string }) => {
      const response = await api.post('/api/users/invites', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success(t('inviteSuccess'));
      setEmail('');
      setRole('MEMBER');
      setTenantId('');
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

    if (role === 'SUPER_ADMIN') {
        // Super admin doesn't need tenantId
        inviteMutation.mutate({ email, role });
    } else {
        // ADMIN and MEMBER need tenantId
        // If current user is SUPER_ADMIN, they MUST select a tenant
        if (currentUser?.role === 'SUPER_ADMIN' && !tenantId) {
            toast.error(t('selectTenantRequired'));
            return;
        }

        // If current user is ADMIN, tenantId is inferred by backend from their session, 
        // OR we can pass it explicitly if we have it in currentUser context.
        // For safety, let's pass it if we selected it (Super Admin) or if we are Admin (inferred).
        // Actually, Controller expects tenantId for ADMIN/MEMBER.
        // So if I am ADMIN, I should pass my tenantId? 
        // The Controller checks: if (currentUser.tenantId !== tenantId) error.
        // So Frontend MUST pass tenantId.
        
        const targetTenantId = currentUser?.role === 'SUPER_ADMIN' ? tenantId : currentUser?.tenantId;
        
        if (!targetTenantId) {
             toast.error('Error: Unknown tenant context');
             return;
        }

        inviteMutation.mutate({ email, role, tenantId: targetTenantId });
    }
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
            <label className="text-sm font-medium mb-1.5 block">{t('roleLabel')}</label>
            <Select<'SUPER_ADMIN' | 'ADMIN' | 'MEMBER'>
              value={role}
              onChange={(val) => setRole(val)}
            >
               {currentUser?.role === 'SUPER_ADMIN' && (
                 <SelectOption value="SUPER_ADMIN">Platform Admin (Global)</SelectOption>
               )}
              <SelectOption value="ADMIN">{t('roleAdmin')}</SelectOption>
              <SelectOption value="MEMBER">{t('roleMember')}</SelectOption>
            </Select>
          </div>

          {/* Tenant Selection for Super Admin inviting non-Super Admin */}
          {currentUser?.role === 'SUPER_ADMIN' && role !== 'SUPER_ADMIN' && (
             <div className="space-y-2">
              <label className="text-sm font-medium mb-1.5 block">Tenant</label>
              <Select
                value={tenantId}
                onChange={setTenantId}
                placeholder="Select a tenant..."
              >
                {tenants?.data?.map((tenant: { id: string; name: string }) => (
                    <SelectOption key={tenant.id} value={tenant.id}>
                        {tenant.name}
                    </SelectOption>
                ))}
              </Select>
             </div>
          )}

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
