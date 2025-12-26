'use client';

import { useState } from 'react';
import { useUsers, useUserStats, useDeleteUser } from '@/hooks/use-users';

import { UserTableRow } from '../user-table-row';
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
  { value: 'pending', label: 'Pending' },
  { value: 'banned', label: 'Banned' },
  { value: 'rejected', label: 'Rejected' },
];

export function UserView() {
  // Filters
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Pagination (0-indexed for UI, 1-indexed for API)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selected, setSelected] = useState<string[]>([]);

  // API Hooks
  const { data, isLoading, error } = useUsers({
    page: page + 1, // API uses 1-indexed
    limit: rowsPerPage,
    search: filterName || undefined,
    status: filterStatus !== 'all' ? filterStatus.toUpperCase() : undefined,
  });

  const { data: stats } = useUserStats();
  const { mutate: deleteUser } = useDeleteUser();

  // Extract data from API response
  const users = data?.users ?? [];
  const totalUsers = data?.pagination.total ?? 0;

  // Filter handlers
  const handleFilterName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(e.target.value);
    setPage(0);
  };

  const handleFilterStatus = (value: string) => {
    setFilterStatus(value);
    setPage(0);
  };
  
  const getStatusCount = (status: string) => {
    // When viewing 'all', show total from current filtered results
    if (status === 'all') return totalUsers;
    
    // When a specific status is selected, show its filtered total
    if (status.toUpperCase() === filterStatus.toUpperCase()) {
      return totalUsers;
    }
    
    // For other statuses, use global stats as fallback
    if (!stats) return 0;
    return stats[status as keyof typeof stats] ?? 0;
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
    
    // Delete each selected user
    selected.forEach((id) => {
      deleteUser(id);
    });
    
    setSelected([]);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">All Users</h1>
          <div className="mt-2">
            <Breadcrumbs>
              <BreadcrumbItem>
                <Link href="/dashboard" className="transition-colors hover:text-foreground">
                  Dashboard
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link href="#" className="transition-colors hover:text-foreground">
                  User
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem current>List</BreadcrumbItem>
            </Breadcrumbs>
          </div>
        </div>
        <Button 
          variant="contained"
          color="primary"
          size="lg"
          className="h-12 text-md font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
        >
          <Plus className="mr-2 h-4 w-4" />
          New User
        </Button>
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
                {STATUS_OPTIONS.map((tab) => {
                  const count = getStatusCount(tab.value);
                  const isActive = filterStatus === tab.value;
                  
                  // Badge configuration by status
                  const badgeStyles: Record<string, { active: string; inactive: string }> = {
                    all: {
                      active: "bg-foreground text-background font-bold",
                      inactive: "bg-muted-foreground/20 text-muted-foreground"
                    },
                    active: {
                      active: "bg-emerald-500 text-white dark:text-gray-900 font-bold",
                      inactive: "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400"
                    },
                    pending: {
                      active: "bg-amber-500 text-white dark:text-gray-900 font-bold",
                      inactive: "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    },
                    banned: {
                      active: "bg-red-500 text-white dark:text-gray-900 font-bold",
                      inactive: "bg-red-500/15 text-red-600 dark:text-red-400"
                    },
                    rejected: {
                      active: "bg-slate-500 text-white dark:text-gray-900 font-bold",
                      inactive: "bg-slate-500/15 text-slate-600 dark:text-slate-400"
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
                      placeholder="Search..."
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
                            checked={users.length > 0 && selected.length === users.length}
                            onCheckedChange={(checked: boolean | 'indeterminate') => handleSelectAll(checked === true)}
                          />
                          <span className="text-sm font-semibold text-foreground">
                            {selected.length} selected
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleDeleteSelected}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </TableHead>
                  </TableRow>
                ) : (
                  <TableRow className="border-b border-dashed border-border/50 hover:bg-transparent">
                    <TableHead className="w-[40px] pl-4 h-16 font-semibold bg-transparent first:rounded-tl-none text-foreground dark:text-white">
                      <Checkbox 
                        checked={users.length > 0 && selected.length === users.length}
                        onCheckedChange={(checked: boolean | 'indeterminate') => handleSelectAll(checked === true)}
                      />
                    </TableHead>
                    <TableHead className="px-4 h-16 font-semibold bg-transparent text-foreground dark:text-white">Name</TableHead>
                    <TableHead className="px-4 h-16 font-semibold bg-transparent text-foreground dark:text-white">Phone Number</TableHead>
                    <TableHead className="px-4 h-16 font-semibold bg-transparent text-foreground dark:text-white">Tenant</TableHead>
                    <TableHead className="px-4 h-16 font-semibold bg-transparent text-foreground dark:text-white">Role</TableHead>
                    <TableHead className="px-4 h-16 font-semibold bg-transparent text-foreground dark:text-white">Status</TableHead>
                    <TableHead className="px-4 h-16 font-semibold bg-transparent text-right last:rounded-tr-none"></TableHead>
                  </TableRow>
                )}
              </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-destructive font-medium">Erro ao carregar usuários</p>
                      <p className="text-sm text-muted-foreground">Tente novamente mais tarde</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-muted-foreground font-medium">Nenhum usuário encontrado</p>
                      <p className="text-sm text-muted-foreground">Tente ajustar os filtros de busca</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <UserTableRow
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
        <div className="flex items-center justify-end p-4 border-t border-border/40">
            <div className="flex items-center gap-6 lg:gap-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-muted-foreground">Rows per page</p>
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
                {totalUsers > 0 ? (
                  `${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, totalUsers)} of ${totalUsers}`
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
                  disabled={(page + 1) * rowsPerPage >= totalUsers}
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
