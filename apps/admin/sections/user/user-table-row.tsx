'use client';

import Link from 'next/link';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/tooltip';

// User type from API
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  status?: string;
  tenant?: {
    name: string;
  };
}

type UserTableRowProps = {
  row: User;
  selected: boolean;
  onSelectRow: () => void;
};

export function UserTableRow({ row, selected, onSelectRow }: UserTableRowProps) {
  const { name, email, role, status, phone, tenant } = row;
  
  // Generate initials for avatar
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <TableRow data-state={selected ? 'selected' : undefined} aria-checked={selected} className="hover:bg-transparent">
      <TableCell className="w-[40px] pl-4 py-4">
        <Checkbox checked={selected} onCheckedChange={onSelectRow} />
      </TableCell>

      <TableCell className="flex items-center gap-3 py-4 px-4">
        <Link href={`/users/${row.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Avatar>
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">{name}</span>
            <span className="text-xs text-muted-foreground">{email}</span>
          </div>
        </Link>
      </TableCell>

      <TableCell className="whitespace-nowrap py-4 px-4 text-sm font-medium">
        {phone || '-'}
      </TableCell>

      <TableCell className="whitespace-nowrap py-4 px-4 text-sm font-medium">
        {tenant?.name || '-'}
      </TableCell>

      <TableCell className="whitespace-nowrap py-4 px-4 text-sm font-medium">
        {role}
      </TableCell>

      <TableCell className="py-4 px-4">
        <Badge
          variant="secondary"
          className={cn(
             "rounded-[6px] font-bold capitalize",
             status?.toLowerCase() === 'active'
              ? 'bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25'
              : status?.toLowerCase() === 'pending'
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25'
              : status?.toLowerCase() === 'banned'
              ? 'bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500/25'
              : 'bg-slate-500/15 text-slate-600 dark:text-slate-400 hover:bg-slate-500/25'
          )}
        >
          {status?.toLowerCase() || 'unknown'}
        </Badge>
      </TableCell>

      <TableCell align="right" className="py-4 px-4 pr-4">
        <div className="flex items-center justify-end gap-1">
            <Tooltip title="Edit">
              <Link href={`/users/${row.id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}
