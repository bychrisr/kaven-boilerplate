'use client';

import { MoreVertical, Pencil, Trash2, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import Link from 'next/link';
import { useTenants } from '@/hooks/use-tenants';
import { toast } from 'sonner';

// Tenant type from API
interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string | null;
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  createdAt: string;
  _count?: {
    users: number;
  };
}

type TenantTableRowProps = {
  row: Tenant;
  selected: boolean;
  onSelectRow: () => void;
};

export function TenantTableRow({ row, selected, onSelectRow }: TenantTableRowProps) {
  const { id, name, slug, domain, status, createdAt, _count } = row;
  const { deleteTenant } = useTenants();
  
  const usersCount = _count?.users ?? 0;

  const handleDelete = () => {
    deleteTenant.mutate(id, {
        onSuccess: () => {
            // Toast is handled by the hook usually, but we can add extra if needed
        }
    });
  };

  return (
    <TableRow data-state={selected ? 'selected' : undefined} aria-checked={selected} className="hover:bg-transparent">
      <TableCell className="w-[40px] pl-4 py-4">
        <Checkbox checked={selected} onCheckedChange={onSelectRow} />
      </TableCell>

      <TableCell className="py-4 px-4">
        <div className="flex flex-col">
          <Link href={`/tenants/${id}`} className="hover:underline cursor-pointer">
            <span className="text-sm font-semibold text-foreground">{name}</span>
          </Link>
          <span className="text-xs text-muted-foreground">{slug}</span>
        </div>
      </TableCell>

      <TableCell className="whitespace-nowrap py-4 px-4 text-sm font-medium">
        {domain || '—'}
      </TableCell>

      <TableCell className="whitespace-nowrap py-4 px-4">
        <Badge
          variant="secondary"
          className="rounded-[6px] font-medium bg-muted-foreground/10 text-muted-foreground hover:bg-muted-foreground/20"
        >
          <Users className="h-3 w-3 mr-1" />
          {usersCount}
        </Badge>
      </TableCell>

      <TableCell className="py-4 px-4">
        <Badge
          variant="secondary"
          className={cn(
             "rounded-[6px] font-bold capitalize",
             status === 'ACTIVE'
              ? 'bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25'
              : status === 'SUSPENDED'
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25'
              : 'bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500/25'
          )}
        >
          {status.toLowerCase()}
        </Badge>
      </TableCell>

      <TableCell className="whitespace-nowrap py-4 px-4 text-sm text-muted-foreground">
        {format(new Date(createdAt), 'MMM dd, yyyy')}
      </TableCell>

      <TableCell align="right" className="py-4 px-4 pr-4">
        <div className="flex items-center justify-end gap-1">
            <Link href={`/tenants/${id}`}>
              <Tooltip content="Quick edit" position="top">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Tooltip>
            </Link>
 
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/tenants/${id}`}>
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={handleDelete}
                disabled={deleteTenant.isPending}
              >
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
