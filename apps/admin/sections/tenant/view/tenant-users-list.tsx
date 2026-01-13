'use client';

import { useState } from 'react';
import { useUsers, useDeleteUser } from '@/hooks/use-users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Loader2, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/radix-select';
import { AddUserToTenantDialog } from './add-user-to-tenant-dialog';
import { TenantUserTableRow } from './tenant-user-table-row';

interface TenantUsersListProps {
  tenantId: string;
}

import { useTranslations } from 'next-intl';

// ... (imports remain the same)

export function TenantUsersList({ tenantId }: TenantUsersListProps) {
  const t = useTranslations('Users');
  const [filterName, setFilterName] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  
  const { data, isLoading } = useUsers({
    page: page + 1,
    limit: rowsPerPage,
    search: filterName || undefined,
    tenantId: tenantId,
  });

  const { mutate: deleteUser } = useDeleteUser();

  const users = data?.users ?? [];
  const totalUsers = data?.pagination.total ?? 0;

  const handleFilterName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(e.target.value);
    setPage(0);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelected(users.map((user) => user.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectRow = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleDeleteSelected = () => {
    if (selected.length === 0) return;
    selected.forEach((id) => deleteUser(id));
    setSelected([]);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('filters.search')}
            value={filterName}
            onChange={handleFilterName}
            className="pl-9 bg-background"
          />
        </div>
        <AddUserToTenantDialog tenantId={tenantId} />
      </div>

      {/* Table */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            {selected.length > 0 ? (
              <TableRow className="bg-muted/50">
                <TableHead colSpan={7} className="h-12">
                   <div className="flex items-center gap-4">
                      <Checkbox 
                        checked={users.length > 0 && selected.length === users.length}
                        onCheckedChange={(checked: boolean | 'indeterminate') => handleSelectAll(checked === true)}
                      />
                      <span className="text-sm font-medium">{selected.length} {t('table.selected')}</span>
                       <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleDeleteSelected}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-auto"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t('table.delete')}
                        </Button>
                   </div>
                </TableHead>
              </TableRow>
            ) : (
               <TableRow>
                <TableHead className="w-[40px] pl-4">
                  <Checkbox 
                    checked={users.length > 0 && selected.length === users.length}
                    onCheckedChange={(checked: boolean | 'indeterminate') => handleSelectAll(checked === true)}
                  />
                </TableHead>
                <TableHead>{t('table.name')}</TableHead>
                <TableHead>{t('table.phoneNumber')}</TableHead>
                <TableHead>{t('table.tenant')}</TableHead>
                <TableHead>{t('table.role')}</TableHead>
                <TableHead>{t('table.status')}</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            )}
           
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  {t('table.noUsers')}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TenantUserTableRow
                  key={user.id}
                  row={user}
                  selected={selected.includes(user.id)}
                  onSelectRow={() => handleSelectRow(user.id)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
         <div className="flex items-center gap-2 text-sm text-muted-foreground mr-4">
            <span>{t('table.rowsPerPage')}</span>
            <Select
              value={String(rowsPerPage)}
              onValueChange={(value) => {
                setRowsPerPage(Number(value));
                setPage(0);
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
         </div>
         
         <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            {totalUsers > 0 ? (
              `${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, totalUsers)} ${t('table.ofLocal')} ${totalUsers}`
            ) : (
              "0-0"
            )}
         </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          {t('table.previousPage')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(p => p + 1)}
          disabled={(page + 1) * rowsPerPage >= totalUsers}
        >
          {t('table.nextPage')}
        </Button>
      </div>
    </div>
  );
}
