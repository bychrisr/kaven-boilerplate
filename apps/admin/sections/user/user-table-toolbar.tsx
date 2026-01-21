'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import { ExportButton } from '@/components/extra/export-button';

type UserTableToolbarProps = {
  filterName: string;
  onFilterName: (value: string) => void;
  filterRole: string;
  onFilterRole: (value: string) => void;
};

export function UserTableToolbar({
  filterName,
  onFilterName,
  filterRole,
  onFilterRole,
}: UserTableToolbarProps) {
  const t = useTranslations('User.table');
  const tUser = useTranslations('User.edit');

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border-b border-border bg-card">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('search')}
          value={filterName}
          onChange={(e) => onFilterName(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex gap-2">
        <select
           value={filterRole}
           onChange={(e) => onFilterRole(e.target.value)}
           className="h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="all">{t('roleAll')}</option>
          <option value="SUPER_ADMIN">{tUser('roles.SUPER_ADMIN')}</option>
          <option value="TENANT_ADMIN">{tUser('roles.TENANT_ADMIN')}</option>
          <option value="USER">{tUser('roles.USER')}</option>
        </select>
        
        <ExportButton 
          endpoint={`/api/export/users?role=${filterRole}&search=${filterName}`}
          capability="users.export"
          filename={`users-export-${new Date().toISOString().split('T')[0]}.csv`}
        />
      </div>
    </div>
  );
}
