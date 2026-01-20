'use client';

import { useRoles, useDeleteRole } from '@/hooks/use-roles';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Pencil, Trash2, Users, Shield } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useState } from 'react';

// Removing unused imports
// import Link from 'next/link';

interface RolesListProps {
  onEdit: (roleId: string) => void;
}

export function RolesList({ onEdit }: RolesListProps) {
  const { data: roles, isLoading } = useRoles();
  const deleteRole = useDeleteRole();
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!roles || roles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/10">
        <Shield className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="font-semibold text-lg">Nenhuma role encontrada</h3>
        <p className="text-muted-foreground text-sm max-w-sm mt-2">
          Crie roles personalizadas para definir permissões granulares para seus usuários.
        </p>
      </div>
    );
  }

  const handleDelete = async () => {
    if (roleToDelete) {
      await deleteRole.mutateAsync(roleToDelete);
      setRoleToDelete(null);
    }
  };

  return (
    <>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Usuários</TableHead>
              <TableHead>Permissões</TableHead>
              <TableHead>Atualizado em</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium flex items-center gap-2">
                      {role.name}
                      {role.isSystem && <Badge variant="secondary" className="text-[10px]">SYSTEM</Badge>}
                    </span>
                    {role.description && (
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {role.description}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {role._count?.users || 0}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {role.capabilities.length} capabilities
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(role.updatedAt), "d 'de' MMM, yyyy", { locale: ptBR })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit(role.id)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      {!role.isSystem && (
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600"
                          onClick={() => setRoleToDelete(role.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!roleToDelete} onOpenChange={(open) => !open && setRoleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a role
              e removerá as permissões de todos os usuários atribuídos a ela.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setRoleToDelete(null)} className="mt-2 sm:mt-0 bg-secondary text-secondary-foreground hover:bg-secondary/80">
              Cancelar
            </AlertDialogAction>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
