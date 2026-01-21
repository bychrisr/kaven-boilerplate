
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/radix-select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
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
  
  // Space Selection
  const [selectedSpaceIds, setSelectedSpaceIds] = useState<string[]>([]);

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
      return res.data.tenants;
    },
    enabled: currentUser?.role === 'SUPER_ADMIN',
  });

  // Calculate effective Tenant ID for fetching spaces
  const effectiveTenantId = currentUser?.role === 'SUPER_ADMIN' 
    ? (tenantId || null) 
    : currentUser?.tenantId;

  // Fetch spaces for the selected/current tenant
  const { data: spaces, isLoading: isLoadingSpaces } = useQuery({
    queryKey: ['tenant-spaces', effectiveTenantId],
    queryFn: async () => {
      if (!effectiveTenantId) return [];
      const res = await api.get(`/api/tenants/${effectiveTenantId}/spaces`);
      return res.data; // Expected: Space[]
    },
    // Only fetch if we have a valid tenant context and user is not inviting a SUPER_ADMIN (who has no tenant)
    enabled: !!effectiveTenantId && role !== 'SUPER_ADMIN',
  });

  const handleTenantChange = (val: string) => {
    setTenantId(val);
    setSelectedSpaceIds([]); // Reset spaces when tenant changes
  };

  const inviteMutation = useMutation({
    mutationFn: async (data: { email: string; role: string; tenantId?: string; spaceIds?: string[] }) => {
      const response = await api.post('/api/users/invites', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success(t('inviteSuccess'));
      resetForm();
      onClose();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message || t('inviteError');
      toast.error(msg);
    },
  });

  const resetForm = () => {
    setEmail('');
    setRole('MEMBER');
    setTenantId('');
    setSelectedSpaceIds([]);
  };

  const handleSpaceToggle = (spaceId: string) => {
    setSelectedSpaceIds(prev => 
      prev.includes(spaceId) 
        ? prev.filter(id => id !== spaceId)
        : [...prev, spaceId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (role === 'SUPER_ADMIN') {
        // Super admin invite
        inviteMutation.mutate({ email, role });
    } else {
        // Tenant invite logic
        const targetTenantId = effectiveTenantId;
        
        if (!targetTenantId) {
             toast.error(currentUser?.role === 'SUPER_ADMIN' ? 'Please select a tenant' : 'Error: Unknown tenant context');
             return;
        }

        inviteMutation.mutate({ 
          email, 
          role, 
          tenantId: targetTenantId,
          spaceIds: selectedSpaceIds 
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
        if (!val) resetForm();
        onClose();
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('inviteUser')}</DialogTitle>
          <DialogDescription>
            {t('inviteDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('emailLabel')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="colleague@company.com"
            />
          </div>

          <div className="space-y-2">
            <Label>{t('roleLabel')}</Label>
            <Select
              value={role}
              onValueChange={(val: string) => setRole(val as 'SUPER_ADMIN' | 'ADMIN' | 'MEMBER')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                 {currentUser?.role === 'SUPER_ADMIN' && (
                   <SelectItem value="SUPER_ADMIN">Platform Admin (Global)</SelectItem>
                 )}
                <SelectItem value="ADMIN">{t('roleAdmin')}</SelectItem>
                <SelectItem value="MEMBER">{t('roleMember')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tenant Selection for Super Admin inviting non-Super Admin */}
          {currentUser?.role === 'SUPER_ADMIN' && role !== 'SUPER_ADMIN' && (
             <div className="space-y-2">
              <Label>Tenant</Label>
              <Select
                value={tenantId}
                onValueChange={handleTenantChange} 
              >
                <SelectTrigger>
                    <SelectValue placeholder="Select a tenant..." />
                </SelectTrigger>
                <SelectContent>
                    {tenants?.map((tenant: { id: string; name: string }) => (
                        <SelectItem key={tenant.id} value={tenant.id}>
                            {tenant.name}
                        </SelectItem>
                    ))}
                </SelectContent>
              </Select>
             </div>
          )}

          {/* Space Selection (If not Super Admin role) */}
          {role !== 'SUPER_ADMIN' && effectiveTenantId && (
            <div className="space-y-3 pt-2">
                <Label className="text-sm font-medium">Assign Spaces (Optional)</Label>
                {isLoadingSpaces ? (
                     <div className="text-xs text-muted-foreground">Loading spaces...</div>
                ) : spaces?.length === 0 ? (
                    <div className="text-xs text-muted-foreground italic">No spaces found for this tenant.</div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 p-3 border rounded-md bg-muted/20 max-h-[150px] overflow-y-auto">
                        {spaces?.map((space: { id: string; name: string }) => (
                            <div key={space.id} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={`space-${space.id}`} 
                                    checked={selectedSpaceIds.includes(space.id)}
                                    onCheckedChange={() => handleSpaceToggle(space.id)}
                                />
                                <label 
                                    htmlFor={`space-${space.id}`} 
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    {space.name}
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
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
