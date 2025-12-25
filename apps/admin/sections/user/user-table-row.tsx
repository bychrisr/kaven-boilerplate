
'use client';

import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import type { MockUser } from '@/lib/mock';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/tooltip';

type UserTableRowProps = {
  row: MockUser;
  selected: boolean;
  onSelectRow: () => void;
};

export function UserTableRow({ row, selected, onSelectRow }: UserTableRowProps) {
  const { name, email, avatar, company, role, status, phone } = row;

  return (
    <TableRow data-state={selected ? 'selected' : undefined} aria-checked={selected} className="hover:bg-transparent">
      <TableCell className="w-[40px] pl-4 py-4">
        <Checkbox checked={selected} onCheckedChange={onSelectRow} />
      </TableCell>

      <TableCell className="flex items-center gap-3 py-4 px-4">
        <Avatar>
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">{name}</span>
          <span className="text-xs text-muted-foreground">{email}</span>
        </div>
      </TableCell>

      <TableCell className="whitespace-nowrap py-4 px-4 text-sm font-medium">{phone}</TableCell>

      <TableCell className="whitespace-nowrap py-4 px-4 text-sm font-medium">{company}</TableCell>

      <TableCell className="whitespace-nowrap py-4 px-4 text-sm font-medium">{role}</TableCell>

      <TableCell className="py-4 px-4">
        <Badge
          variant="secondary"
          className={cn(
             "rounded-[6px] font-bold capitalize",
             status === 'active'
              ? 'bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25'
              : status === 'pending'
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25'
              : status === 'banned'
              ? 'bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500/25'
              : 'bg-slate-500/15 text-slate-600 dark:text-slate-400 hover:bg-slate-500/25'
          )}
        >
          {status}
        </Badge>
      </TableCell>

      <TableCell align="right" className="py-4 px-4 pr-4">
        <div className="flex items-center justify-end gap-1">
            <Tooltip title="Quick edit">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <Pencil className="h-4 w-4" />
              </Button>
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
