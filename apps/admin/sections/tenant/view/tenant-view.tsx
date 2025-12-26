'use client';

import { useState, useMemo } from 'react';
import { useTenants } from '@/hooks/use-tenants';

import { TenantTableRow } from '../tenant-table-row';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow,
  TableCell
} from '@/components/ui/table';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Breadcrumbs, BreadcrumbItem } from '@/components/breadcrumbs';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/radix-select';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'deleted', label: 'Deleted' },
];

export function TenantView() {
  // Filters
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Pagination (0-indexed for UI, 1-indexed for API)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selected, setSelected] = useState<string[]>([]);

  // API Hooks
  const { tenants, pagination, isLoading, error } = useTenants({
    page: page + 1, // API uses 1-indexed
    limit: rowsPerPage,
    search: filterName || undefined,
    status: filterStatus !== 'all' ? filterStatus.toUpperCase() : undefined,
  });

  // Extract data from API response
  const totalTenants = pagination?.total ?? 0;

  // Filter handlers
  const handleFilterName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(e.target.value);
    setPage(0);
  };

  const handleFilterStatus = (value: string) => {
    setFilterStatus(value);
    setPage(0);
  };
  
  // Status counts (mocked for now - will need backend endpoint)
  const statusCounts = useMemo(() => {
    // TODO: Create useTenantStats() hook when backend endpoint is ready
    return {
      all: totalTenants,
      active: totalTenants,
      suspended: 0,
      deleted: 0,
    };
  }, [totalTenants]);
  
  const getStatusCount = (status: string) => {
    const isCurrentlySelected = (
      (status === 'all' && filterStatus === 'all') ||
      (status !== 'all' && status.toUpperCase() === filterStatus.toUpperCase())
    );
    
    if (isCurrentlySelected) {
      return totalTenants;
    }
    
    return statusCounts[status as keyof typeof statusCounts] ?? 0;
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelected(tenants.map((tenant) => tenant.id));
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
    
    // TODO: Implement bulk delete
    console.log('Delete selected:', selected);
    setSelected([]);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">All Tenants</h1>
          <div className="mt-2">
            <Breadcrumbs>
              <BreadcrumbItem>
                <Link href="/dashboard" className="transition-colors hover:text-foreground">
                  Dashboard
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link href="#" className="transition-colors hover:text-foreground">
                  Tenants
                </Link>
              </BreadcrumbItem>
            </Breadcrumbs>
          </div>
        </div>
        <Link href="/tenants/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Tenant
          </Button>
        </Link>
      </div>

      {/* Filters Card */}
      <Card className="p-6">
        <Tabs 
          value={filterStatus} 
          onValueChange={handleFilterStatus}
          className="w-full"
        >
          <div className="flex flex-col md:flex-row items-center w-full border-b border-border/40 gap-4">
            <TabsList className="bg-transparent p-0 h-auto gap-8 justify-start px-4 w-auto flex-none border-b-0">
              {STATUS_OPTIONS.map((tab) => {
                const count = getStatusCount(tab.value);
                const isActive = filterStatus === tab.value;
                
                const badgeStyles: Record<string, { active: string; inactive: string }> = {
                  all: {
                    active: "bg-foreground text-background font-bold",
                    inactive: "bg-muted-foreground/20 text-muted-foreground"
                  },
                  active: {
                    active: "bg-emerald-500 text-white dark:text-gray-900 font-bold",
                    inactive: "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400"
                  },
                  suspended: {
                    active: "bg-amber-500 text-white dark:text-gray-900 font-bold",
                    inactive: "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                  },
                  deleted: {
                    active: "bg-red-500 text-white dark:text-gray-900 font-bold",
                    inactive: "bg-red-500/15 text-red-600 dark:text-red-400"
                  }
                };

                const badgeClass = cn(
                  "ml-2 h-5 px-1.5 text-xs min-w-[20px] rounded-[6px] inline-flex items-center justify-center pointer-events-none",
                  isActive ? badgeStyles[tab.value]?.active : badgeStyles[tab.value]?.inactive
                );
                
                return (
                  <TabsTrigger 
                    key={tab.value} 
                    value={tab.value}
                    className={cn(
                        "relative h-14 rounded-none bg-transparent px-0 pb-3 pt-3 font-semibold text-muted-foreground shadow-none transition-none cursor-pointer",
                        "!bg-transparent !shadow-none !border-0 hover:text-foreground",
                        "data-[state=active]:!bg-transparent data-[state=active]:!shadow-none data-[state=active]:!text-foreground data-[state=active]:!border-none",
                        "dark:data-[state=active]:!bg-transparent dark:data-[state=active]:!border-none",
                        "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-foreground after:transition-transform after:duration-300 data-[state=active]:after:scale-x-100",
                        isActive && "text-foreground after:bg-primary"
                    )}
                  >
                    {tab.label}
                    <Badge className={badgeClass}>
                      {count}
                    </Badge>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Search and Filters */}
            <div className="flex items-center gap-3 ml-auto w-full md:w-auto px-4 pb-4 md:pb-0">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search tenants..."
                  value={filterName}
                  onChange={handleFilterName}
                  className="pl-9 bg-transparent"
                />
              </div>

              <Select value={String(rowsPerPage)} onValueChange={(value) => setRowsPerPage(Number(value))}>
                <SelectTrigger className="w-[100px] bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 rows</SelectItem>
                  <SelectItem value="10">10 rows</SelectItem>
                  <SelectItem value="25">25 rows</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Tabs>
      </Card>

      {/* Table Card */}
      <Card className="p-0 overflow-hidden">
        {/* Bulk Actions */}
        {selected.length > 0 && (
          <div className="flex items-center gap-3 px-6 py-3 bg-muted/50 border-b">
            <span className="text-sm text-muted-foreground">
              {selected.length} selected
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteSelected}
              className="ml-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[40px] pl-4">
                  <Checkbox
                    checked={selected.length === tenants.length && tenants.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="px-4">Name</TableHead>
                <TableHead className="px-4">Domain</TableHead>
                <TableHead className="px-4">Users</TableHead>
                <TableHead className="px-4">Status</TableHead>
                <TableHead className="px-4">Created</TableHead>
                <TableHead className="text-right px-4 pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : tenants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No tenants found.
                  </TableCell>
                </TableRow>
              ) : (
                tenants.map((tenant) => (
                  <TenantTableRow
                    key={tenant.id}
                    row={tenant}
                    selected={selected.includes(tenant.id)}
                    onSelectRow={() => handleSelectRow(tenant.id)}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{Math.min(page * rowsPerPage + 1, totalTenants)}</span> to{' '}
            <span className="font-medium">{Math.min((page + 1) * rowsPerPage, totalTenants)}</span> of{' '}
            <span className="font-medium">{totalTenants}</span> tenants
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={(page + 1) * rowsPerPage >= totalTenants}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
