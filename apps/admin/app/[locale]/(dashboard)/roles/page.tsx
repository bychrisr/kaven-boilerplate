'use client';

import { useState } from 'react';
import { useSpaces } from '@/hooks/use-spaces';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { RolesList } from '@/components/roles/roles-list';
import { RoleForm } from '@/components/roles/role-form';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useRole, Role } from '@/hooks/use-roles';
import { Skeleton } from '@/components/ui/skeleton';

export default function RolesPage() {
  const { currentSpace } = useSpaces();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  // Fetch editing role details only when needed
  const { data: editingRole, isLoading: isLoadingRole } = useRole(editingRoleId || '');

  const handleCreate = () => {
    setEditingRoleId(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (roleId: string) => {
    setEditingRoleId(roleId);
    setIsSheetOpen(true);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) setEditingRoleId(null);
  };

  const onSuccess = () => {
    setIsSheetOpen(false);
    setEditingRoleId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestão de Roles</h2>
          <p className="text-muted-foreground">
            Gerencie as roles e permissões para o espaço {currentSpace?.name || '...'}.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Role
        </Button>
      </div>

      {!currentSpace ? (
        <div className="flex items-center justify-center p-8">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <RolesList onEdit={handleEdit} />
      )}

      <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingRoleId ? 'Editar Role' : 'Criar Nova Role'}</SheetTitle>
            <SheetDescription>
              {editingRoleId 
                ? 'Atualize as informações e permissões da role.' 
                : 'Defina o nome, descrição e atribua capabilities para a nova role.'}
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6">
            {editingRoleId && isLoadingRole ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <RoleForm 
                initialData={editingRoleId ? (editingRole as Role) : undefined}
                onSuccess={onSuccess}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
