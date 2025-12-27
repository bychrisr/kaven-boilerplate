'use client';

import {
  MoreHorizontal,
  UserX,
  Shield,
  ShieldAlert
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useUpdateUserMutation } from '@/hooks/use-users';

// ----------------------------------------------------------------------

interface UserRow {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  status: string;
  avatar?: string | null;
  tenant?: { id: string; name: string } | null;
  createdAt: string;
}

interface Props {
  row: UserRow;
  selected: boolean;
  onSelectRow: () => void;
}

export function TenantUserTableRow({ row, selected, onSelectRow }: Props) {
  const { name, email, phone, role, status, avatar } = row;
  
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUserMutation();

  const handleRemoveFromTenant = () => {
    updateUser({ 
      id: row.id, 
      data: { tenantId: null } 
    });
  };

  const statusVariant = {
    ACTIVE: "default", 
    PENDING: "secondary",
    BANNED: "destructive",
    REJECTED: "outline"
  }[status] || "outline";

  return (
    <TableRow 
      data-state={selected ? 'selected' : undefined} 
      className="group transition-colors data-[state=selected]:bg-muted"
    >
      <TableCell className="w-[40px] pl-4">
        <Checkbox checked={selected} onCheckedChange={onSelectRow} />
      </TableCell>

      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={avatar || undefined} alt={name} />
            <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{name}</span>
            <span className="text-xs text-muted-foreground">{email}</span>
          </div>
        </div>
      </TableCell>

      <TableCell>{phone || '-'}</TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="font-normal text-xs">
              Current Tenant
           </Badge>
        </div>
      </TableCell>

      <TableCell>
        <span className="capitalize text-sm">{role.toLowerCase().replace('_', ' ')}</span>
      </TableCell>

      <TableCell>
         {/* @ts-ignore Badge variant type mismatch handling */}
        <Badge variant={statusVariant as "default" | "secondary" | "destructive" | "outline"}>{status}</Badge>
      </TableCell>

      <TableCell align="right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity data-[state=open]:opacity-100">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem 
              onClick={() => updateUser({ id: row.id, data: { role: 'TENANT_ADMIN' } })}
              disabled={isUpdating || role === 'TENANT_ADMIN'}
              className={role === 'TENANT_ADMIN' ? 'bg-muted' : ''}
            >
              <ShieldAlert className="mr-2 h-4 w-4" />
              Make Tenant Admin
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => updateUser({ id: row.id, data: { role: 'USER' } })}
              disabled={isUpdating || role === 'USER'}
              className={role === 'USER' ? 'bg-muted' : ''}
            >
              <Shield className="mr-2 h-4 w-4" />
              Make User
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={handleRemoveFromTenant}
              disabled={isUpdating}
            >
              <UserX className="mr-2 h-4 w-4" />
              Remove from Tenant
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
