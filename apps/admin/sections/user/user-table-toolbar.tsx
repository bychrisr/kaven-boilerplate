
'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border-b border-border bg-card">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={filterName}
          onChange={(e) => onFilterName(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex gap-2">
        {/* Role Filter - Placeholder for now until we have a Dropdown or Popover with Checkboxes */}
        {/* For MVP Mock, simple select styled as standard input or just a button filter */}
        <select
           value={filterRole}
           onChange={(e) => onFilterRole(e.target.value)}
           className="h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="all">Role: All</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
          <option value="MANAGER">Manager</option>
          <option value="VIEWER">Viewer</option>
        </select>
      </div>
    </div>
  );
}
