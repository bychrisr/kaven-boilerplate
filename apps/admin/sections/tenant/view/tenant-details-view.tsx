'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

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
import { Loader2, Save, Trash2, LayoutDashboard, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
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
  idOrSlug: string;
}

export function TenantDetailView({ idOrSlug }: TenantDetailViewProps) {
  const t = useTranslations('Tenants');
  const tCommon = useTranslations('Common');
  const router = useRouter();
  const { data: tenant, isLoading, error } = useTenant(idOrSlug);
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
    // We use the ID from the loaded tenant data, or fallback to the slug if for some reason tenant is missing (unlikely)
    // But updateTenant mutation likely expects the UUID if the backend endpoint is strictly /:id (but we updated backend to support slug too).
    // To be safe and consistent, we can use idOrSlug for the mutation call since backend supports it.
    updateTenant.mutate({ id: idOrSlug, data }, {
      onSuccess: (updatedTenant) => {
        // Reset form with new values to clear isDirty state
        form.reset({
          name: updatedTenant.name,
          slug: updatedTenant.slug,
          domain: updatedTenant.domain || '',
        });
        
        // If slug changed, we should probably redirect or update URL, but getting complicated. 
        // For now let's assume simple update.
      }
    });
  };

  const handleDelete = () => {
    if (confirm(t('detailsPage.dangerZone.confirmDelete'))) {
        deleteTenant.mutate(idOrSlug, {
            onSuccess: () => {
                router.push('/tenants');
            }
        });
    }
  };

  const tabTriggerClass = cn(
    "relative h-14 rounded-none bg-transparent px-0 pb-3 pt-3 font-semibold text-muted-foreground shadow-none transition-none cursor-pointer",
    "!bg-transparent !shadow-none !border-0 hover:text-foreground mx-4 first:ml-0",
    "data-[state=active]:!bg-transparent data-[state=active]:!shadow-none data-[state=active]:!text-foreground data-[state=active]:!border-none",
    "dark:data-[state=active]:!bg-transparent dark:data-[state=active]:!border-none",
    "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 data-[state=active]:after:scale-x-100"
  );

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
          {t('table.error')}
        </div>
        <Button onClick={() => router.push('/tenants')}>
          {t('detailsPage.backToTenants')}
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
            <h1 className="text-3xl font-bold tracking-tight">
              {tenant.name}
            </h1>
            <Badge variant={tenant.status === 'ACTIVE' ? 'default' : 'secondary'}>
              {tenant.status}
            </Badge>
          </div>
          <div className="mt-2">
            <Breadcrumbs>
              <BreadcrumbItem>
                <Link href="/dashboard">{tCommon('dashboard')}</Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link href="/tenants">{t('title')}</Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <span className="text-foreground">{tenant.name}</span>
              </BreadcrumbItem>
            </Breadcrumbs>
          </div>
        </div>
        <div className="flex gap-2">
          {activeTab === 'overview' && (
            <Button 
              onClick={form.handleSubmit(onSubmit)} 
              disabled={!form.formState.isDirty || updateTenant.isPending}
            >
              {updateTenant.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {!updateTenant.isPending && <Save className="mr-2 h-4 w-4" />}
              {updateTenant.isPending ? t('detailsPage.saving') : t('detailsPage.save')}
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row items-center w-full border-b border-border/40 gap-4 mb-6">
          <TabsList className="bg-transparent p-0 h-auto gap-0 justify-start px-0 w-full flex-nowrap overflow-x-auto border-b-0 no-scrollbar">
            <TabsTrigger value="overview" className={tabTriggerClass}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              {t('detailsPage.tabs.overview')}
            </TabsTrigger>
            <TabsTrigger value="users" className={tabTriggerClass}>
              <Users className="mr-2 h-4 w-4" />
              {t('detailsPage.tabs.users')}
            </TabsTrigger>
            <TabsTrigger value="settings" className={tabTriggerClass}>
              <Settings className="mr-2 h-4 w-4" />
              {t('detailsPage.tabs.settings')}
            </TabsTrigger>
          </TabsList>
        </div>


        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('detailsPage.overview.title')}</CardTitle>
              <CardDescription>
                {t('detailsPage.overview.description')}
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
                            <FormLabel>{t('createPage.form.name')}</FormLabel>
                            <FormControl>
                                <Input placeholder={t('createPage.form.namePlaceholder')} {...field} />
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
                            <FormLabel>{t('createPage.form.slug')}</FormLabel>
                            <FormControl>
                                <Input placeholder={t('createPage.form.slugPlaceholder')} {...field} />
                            </FormControl>
                            <FormDescription>
                                {t('createPage.form.slugDescription')}
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
                            <FormLabel>{t('createPage.form.domain')}</FormLabel>
                            <FormControl>
                                <Input placeholder={t('createPage.form.domainPlaceholder')} {...field} />
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
              <CardTitle>{t('detailsPage.users.title')}</CardTitle>
              <CardDescription>
                {t('detailsPage.users.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TenantUsersList tenantId={tenant.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('detailsPage.dangerZone.title')}</CardTitle>
              <CardDescription>
                {t('detailsPage.dangerZone.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-destructive/50 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-medium text-destructive">{t('detailsPage.dangerZone.deleteTitle')}</h4>
                        <p className="text-sm text-muted-foreground">
                            {t('detailsPage.dangerZone.deleteDescription')}
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
                        {t('detailsPage.dangerZone.deleteButton')}
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
