'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, UserPlus } from 'lucide-react';
import { useUsers, useUpdateUserMutation } from '@/hooks/use-users';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDebounce } from '@/hooks/use-debounce';

interface AddUserToTenantDialogProps {
  tenantId: string;
}

export function AddUserToTenantDialog({ tenantId }: AddUserToTenantDialogProps) {
  const t = useTranslations('Tenants.addUserDialog');
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  // Busca usuários para associar
  const { data, isLoading } = useUsers({
    page: 1,
    limit: 10,
    search: debouncedSearch,
  });

  const { mutate: updateUser, isPending: isUpdating } = useUpdateUserMutation();

  const handleAddUser = (userId: string) => {
    updateUser(
      { id: userId, data: { tenantId } },
      {
        onSuccess: () => {
          setOpen(false);
          setSearch('');
        },
      }
    );
  };

  const users = data?.users ?? [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          {t('trigger')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {t('description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="h-[300px] overflow-y-auto border rounded-md p-2 custom-scrollbar">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : users.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-muted-foreground gap-2">
                <p>{t('noUsers')}</p>
                <p className="text-xs">{t('searchTip')}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {users.map((user) => {
                  const isAlreadyInTenant = user.tenantId === tenantId;
                  const isInAnotherTenant = user.tenantId && user.tenantId !== tenantId;

                  return (
                    <div 
                      key={user.id} 
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border transition-colors"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || undefined} />
                          <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col truncate">
                          <span className="text-sm font-medium truncate">{user.name}</span>
                          <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                        </div>
                      </div>

                      {isAlreadyInTenant ? (
                        <span className="text-xs text-muted-foreground italic px-3">{t('status.current')}</span>
                      ) : (
                        <Button
                          size="sm"
                          variant={isInAnotherTenant ? "outline" : "default"}
                          disabled={isUpdating}
                          onClick={() => handleAddUser(user.id)}
                        >
                           {isInAnotherTenant ? t('actions.move') : t('actions.add')}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
