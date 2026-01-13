'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTenant, useTenants } from '@/hooks/use-tenants';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Breadcrumbs, BreadcrumbItem } from '@/components/breadcrumbs';
import { Loader2, Save, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TenantUsersList } from './tenant-users-list';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const tenantFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  slug: z.string().min(2, { message: 'Slug must be at least 2 characters.' }),
  domain: z.string().optional(),
});

type TenantFormValues = z.infer<typeof tenantFormSchema>;

interface TenantDetailViewProps {
  id: string;
}

export function TenantDetailView({ id }: TenantDetailViewProps) {
  const router = useRouter();
  const { data: tenant, isLoading, error } = useTenant(id);
  const { updateTenant, deleteTenant } = useTenants();
  
  const [activeTab, setActiveTab] = useState('overview');

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      domain: '',
    },
  });

  // Update form values when tenant data loads
  useEffect(() => {
    if (tenant) {
      form.reset({
        name: tenant.name,
        slug: tenant.slug,
        domain: tenant.domain || '',
      });
    }
  }, [tenant, form]);

  const onSubmit = (data: TenantFormValues) => {
    updateTenant.mutate({ id, data });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) {
        deleteTenant.mutate(id, {
            onSuccess: () => {
                router.push('/tenants');
            }
        });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <div className="text-lg font-medium text-destructive">
          Error loading tenant
        </div>
        <Button onClick={() => router.push('/tenants')}>
          Back to Tenants
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {tenant.name}
            </h1>
            <Badge variant={tenant.status === 'ACTIVE' ? 'default' : 'secondary'}>
              {tenant.status}
            </Badge>
          </div>
          <div className="mt-2">
            <Breadcrumbs>
              <BreadcrumbItem>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link href="/tenants">Tenants</Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <span className="text-foreground">{tenant.name}</span>
              </BreadcrumbItem>
            </Breadcrumbs>
          </div>
        </div>
        <div className="flex gap-2">
          {activeTab === 'overview' && (
            <Button onClick={form.handleSubmit(onSubmit)} disabled={updateTenant.isPending}>
              {updateTenant.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {!updateTenant.isPending && <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tenant Information</CardTitle>
              <CardDescription>
                Basic information about the tenant workspace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Tenant Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Acme Corp" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Slug (URL Identifier)</FormLabel>
                            <FormControl>
                                <Input placeholder="acme" {...field} />
                            </FormControl>
                            <FormDescription>
                                Unique identifier used in URLs.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                     <FormField
                        control={form.control}
                        name="domain"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Custom Domain</FormLabel>
                            <FormControl>
                                <Input placeholder="app.acme.com" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage users who have access to this tenant.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TenantUsersList tenantId={id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>
                Destructive actions for this tenant.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-destructive/50 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-medium text-destructive">Delete Tenant</h4>
                        <p className="text-sm text-muted-foreground">
                            Permanently delete this tenant and all associated data. This action cannot be undone.
                        </p>
                    </div>
                     <Button 
                        variant="destructive" 
                        onClick={handleDelete}
                        disabled={deleteTenant.isPending}
                     >
                        {deleteTenant.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        Delete Tenant
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
