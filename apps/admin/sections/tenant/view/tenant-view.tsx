'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useTenants, useTenantStats } from '@/hooks/use-tenants';
import { TenantTableRow } from '../tenant-table-row';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Loader2, Search } from 'lucide-react';
import { Breadcrumbs, BreadcrumbItem } from '@/components/breadcrumbs';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/radix-select';
import { cn } from '@/lib/utils';

// ----------------------------------------------------------------------

export function TenantView() {
  const t = useTranslations('Tenants');
  const tCommon = useTranslations('Common');
  
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);

  // API Hooks
  const { tenants, pagination, isLoading } = useTenants({
    page: page + 1, // API uses 1-indexed
    limit: rowsPerPage,
    search: filterName || undefined,
    status: filterStatus !== 'all' ? filterStatus.toUpperCase() : undefined,
  });

  const { data: stats } = useTenantStats();

  const totalTenants = pagination?.total ?? 0;

  const statusCounts = useMemo(() => {
    if (!stats) return { all: 0, active: 0, suspended: 0, deleted: 0 };
    return {
      all: stats.total,
      active: stats.active,
      suspended: stats.suspended,
      deleted: stats.deleted,
    };
  }, [stats]);

  const getStatusCount = (status: string) => {
    return statusCounts[status as keyof typeof statusCounts] ?? 0;
  };

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
    setPage(0);
  };

  const handleFilterStatus = (value: string) => {
    setFilterStatus(value);
    setPage(0);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelected(tenants.map((row) => row.id));
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
    // TODO: Implement bulk delete
    setSelected([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('title')}</h1>
          <div className="mt-2">
            <Breadcrumbs>
              <BreadcrumbItem>
                <Link href="/dashboard" className="transition-colors hover:text-foreground">
                  {tCommon('dashboard')}
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link href="#" className="transition-colors hover:text-foreground">
                  {t('title')}
                </Link>
              </BreadcrumbItem>
            </Breadcrumbs>
          </div>
        </div>
        <Link href="/tenants/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {t('create')}
          </Button>
        </Link>
      </div>

      <Card className="!p-0 !gap-0 block overflow-hidden border-none shadow-md bg-card dark:bg-[#212B36]">
        {/* Status Tabs */}
        <div className="p-0 pb-0">
          <Tabs 
            defaultValue="all" 
            value={filterStatus} 
            onValueChange={handleFilterStatus}
            className="w-full"
          >
            <div className="flex flex-col md:flex-row items-center w-full border-b border-border/40 gap-4">
              <TabsList className="bg-transparent p-0 h-auto gap-8 justify-start px-4 w-auto flex-none border-b-0">
                {[
                  { value: 'all', label: t('filters.all') },
                  { value: 'active', label: t('filters.active') },
                  { value: 'suspended', label: t('filters.suspended') },
                ].map((tab) => {
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
                      <span className="capitalize">{tab.label}</span>
                      <Badge className={badgeClass}>
                        {count}
                      </Badge>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              
              <div className="flex-1 w-full px-4 md:px-0 md:pr-4 py-2 md:py-0">
                 <div className="relative w-full">
                    <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('filters.search')}
                      value={filterName}
                      onChange={handleFilterName}
                      className="w-full bg-transparent border-none focus-visible:ring-0 pl-9 placeholder:text-muted-foreground h-10"
                    />
                 </div>
              </div>
            </div>
          </Tabs>
        </div>

        {/* Table */}
        <div className="relative mx-0 rounded-none border-none text-card-foreground shadow-none bg-transparent overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              {selected.length > 0 ? (
                <TableRow className="bg-primary/10 hover:bg-primary/10">
                  <TableHead colSpan={7} className="h-16 px-4">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-4">
                        <Checkbox 
                          checked={tenants.length > 0 && selected.length === tenants.length}
                          onCheckedChange={(checked: boolean | 'indeterminate') => handleSelectAll(checked === true)}
                        />
                        <span className="text-sm font-semibold text-foreground">
                          {selected.length} {t('table.selected')}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDeleteSelected}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t('table.delete')}
                      </Button>
                    </div>
                  </TableHead>
                </TableRow>
              ) : (
                <TableRow className="border-b border-dashed border-border/50 hover:bg-transparent">
                  <TableHead className="w-[40px] pl-4 h-16 font-semibold bg-transparent first:rounded-tl-none text-foreground dark:text-white">
                    <Checkbox 
                      checked={tenants.length > 0 && selected.length === tenants.length}
                      onCheckedChange={(checked: boolean | 'indeterminate') => handleSelectAll(checked === true)}
                    />
                  </TableHead>
                  <TableHead className="px-4 h-16 font-semibold bg-transparent text-foreground dark:text-white">{t('table.headers.name')}</TableHead>
                  <TableHead className="px-4 h-16 font-semibold bg-transparent text-foreground dark:text-white">{t('table.headers.domain')}</TableHead>
                  <TableHead className="px-4 h-16 font-semibold bg-transparent text-foreground dark:text-white text-center">{t('table.headers.users')}</TableHead>
                  <TableHead className="px-4 h-16 font-semibold bg-transparent text-foreground dark:text-white">{t('table.headers.status')}</TableHead>
                  <TableHead className="px-4 h-16 font-semibold bg-transparent text-foreground dark:text-white">{t('table.headers.created')}</TableHead>
                  <TableHead className="px-4 h-16 font-semibold bg-transparent text-right last:rounded-tr-none"></TableHead>
                </TableRow>
              )}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : tenants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-muted-foreground font-medium">{t('table.empty')}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                tenants.map((row) => (
                  <TenantTableRow
                    key={row.id}
                    row={row}
                    selected={selected.includes(row.id)}
                    onSelectRow={() => handleSelectRow(row.id)}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end p-4 border-t border-border/40">
          <div className="flex items-center gap-6 lg:gap-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-muted-foreground">{t('table.rowsPerPage')}</p>
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
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium text-muted-foreground">
              {totalTenants > 0 ? (
                `${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, totalTenants)} of ${totalTenants}`
              ) : (
                "0-0 of 0"
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <span className="sr-only">Go to previous page</span>
                {'<'}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage((p) => p + 1)}
                disabled={(page + 1) * rowsPerPage >= totalTenants}
              >
                <span className="sr-only">Go to next page</span>
                {'>'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
