'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTenants } from '@/hooks/use-tenants';
import { Save } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Breadcrumbs, BreadcrumbItem } from '@/components/breadcrumbs';
import { Loader2 } from 'lucide-react';

const createTenantSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  domain: z.string().optional().or(z.literal('')),
});

type CreateTenantFormData = z.infer<typeof createTenantSchema>;

export default function CreateTenantPage() {
  const t = useTranslations('Tenants');
  const tCommon = useTranslations('Common');
  const router = useRouter();
  const { createTenant } = useTenants();

  const form = useForm<CreateTenantFormData>({
    resolver: zodResolver(createTenantSchema),
    defaultValues: {
      name: '',
      slug: '',
      domain: '',
    },
  });




  const onSubmit = async (data: CreateTenantFormData) => {
    try {
      await createTenant.mutateAsync({
        name: data.name,
        slug: data.slug,
        domain: data.domain || undefined,
      });
      router.push('/tenants');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{t('createPage.title')}</h1>
          <div className="text-muted-foreground">
            <Breadcrumbs>
              <BreadcrumbItem>
                <Link href="/dashboard">{tCommon('dashboard')}</Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link href="/tenants">{t('title')}</Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <span className="text-foreground">{t('createPage.title')}</span>
              </BreadcrumbItem>
            </Breadcrumbs>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('createPage.title')}</CardTitle>
          <CardDescription>{t('createPage.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormLabel>{t('createPage.form.name')}</FormLabel>
                      <FormControl>
                        <Input 
                            placeholder={t('createPage.form.namePlaceholder')} 
                            {...field} 
                            onChange={(e) => {
                                field.onChange(e);
                                
                                // Enhanced Slug Generation Logic
                                const newName = e.target.value;
                                const currentSlug = form.getValues('slug');
                                const expectedSlug = field.value
                                    ?.toLowerCase()
                                    .replaceAll(/[^a-z0-9]+/g, '-')
                                    .replaceAll(/(^-+)|(-+$)/g, '');
                                
                                // If the current slug matches what we would expect from the *previous* name, 
                                // OR if it's empty, update it.
                                // Basically: only update if the user hasn't likely manually diverged the slug.
                                if (!currentSlug || currentSlug === expectedSlug) {
                                     const newSlug = newName
                                        .toLowerCase()
                                        .replaceAll(/[^a-z0-9]+/g, '-')
                                        .replaceAll(/(^-+)|(-+$)/g, '');
                                     form.setValue('slug', newSlug);
                                }
                            }}
                        />
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
                         <div className="relative flex items-center">
                            <span className="absolute left-3 text-muted-foreground text-sm">/</span>
                            <Input placeholder={t('createPage.form.slugPlaceholder')} {...field} className="pl-6" />
                         </div>
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
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormLabel>{t('createPage.form.domain')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('createPage.form.domainPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-end gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.push('/tenants')}
                >
                  {t('createPage.form.cancel')}
                </Button>
                <Button type="submit" disabled={createTenant.isPending}>
                  {createTenant.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                      <Save className="mr-2 h-4 w-4" />
                  )}
                  {createTenant.isPending ? t('createPage.form.creating') : t('createPage.form.create')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
