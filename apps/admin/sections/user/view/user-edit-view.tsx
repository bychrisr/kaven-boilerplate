'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useUser, useUpdateUser, useDeleteUser } from '@/hooks/use-users';
import { useTenants } from '@/hooks/use-tenants';
import { Loader2, Trash2, LayoutDashboard, Shield, Save } from 'lucide-react';
import Link from 'next/link';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/radix-select';
import { Switch } from '@/components/ui/switch';
import { Breadcrumbs, BreadcrumbItem } from '@/components/breadcrumbs';
import { AvatarUpload } from '@/components/avatar-upload';
import { AddressAutocomplete } from '@/components/address-autocomplete';
import { PhoneInput, isPhoneValid } from '@/components/phone-input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { CONFIG } from '@/lib/config';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const baseSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().optional(),
  role: z.enum(['USER', 'TENANT_ADMIN', 'SUPER_ADMIN']),
  status: z.enum(['ACTIVE', 'PENDING', 'BANNED', 'REJECTED']),
  emailVerified: z.boolean(),
  tenantId: z.string().optional().nullable(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  zipcode: z.string().optional(),
  company: z.string().optional(),
});

type UserFormData = z.infer<typeof baseSchema>;

const getUserSchema = (t: (key: string) => string) => baseSchema.extend({
  name: z.string().min(3, { message: t('validation.nameMin') }),
  email: z.string().email({ message: t('validation.emailInvalid') }),
  phone: z.string().optional().refine(val => !val || isPhoneValid(val), {
    message: t('validation.phoneInvalid')
  }),
});

interface UserEditViewProps {
  userId: string;
}

export function UserEditView({ userId }: UserEditViewProps) {
  const router = useRouter();
  const t = useTranslations('User.edit');
  const tCommon = useTranslations('Common');
  
  const { data: user, isLoading: isLoadingUser } = useUser(userId);
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser(userId);
  const { mutateAsync: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { tenants, isLoading: isLoadingTenants } = useTenants({ limit: 100 });

  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const form = useForm<UserFormData>({
    resolver: zodResolver(getUserSchema(t)),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'USER',
      status: 'ACTIVE',
      emailVerified: false,
      tenantId: '',
      country: '',
      state: '',
      city: '',
      address: '',
      zipcode: '',
      company: '',
    },
  });

  const {
      reset,
      setValue,
      watch,
      control,
      handleSubmit,
      formState: { isSubmitting, isDirty, errors }
  } = form;

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        status: user.status || 'ACTIVE',
        emailVerified: user.emailVerified || false,
        tenantId: user.tenantId || '',
        country: user.country || '',
        state: user.state || '',
        city: user.city || '',
        address: user.address || '',
        zipcode: user.zipcode || '',
        company: user.company || '',
      });
      
      if (user.avatar) {
        const avatarUrl = user.avatar.startsWith('http') 
          ? user.avatar 
          : `${CONFIG.serverUrl}${user.avatar}`;
        setAvatarPreview(avatarUrl);
      }
    }
  }, [user, reset]);

  const emailVerified = watch('emailVerified');
  const status = watch('status');

  const handleAvatarChange = (file: File | null, preview: string) => {
    setAvatarFile(file);
    setAvatarPreview(preview);
  };

  const handlePlaceSelected = (data: { address: string; city: string; state: string; country: string; zipcode: string }) => {
    setValue('city', data.city, { shouldValidate: true, shouldTouch: true, shouldDirty: true });
    setValue('state', data.state, { shouldValidate: true, shouldTouch: true, shouldDirty: true });
    setValue('country', data.country, { shouldValidate: true, shouldTouch: true, shouldDirty: true });
    setValue('zipcode', data.zipcode, { shouldValidate: true, shouldTouch: true, shouldDirty: true });
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        try {
          await api.post(`/api/users/${userId}/avatar`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } catch (error) {
          console.error('Avatar upload failed:', error);
        }
      }
      
      await updateUser({
        ...data,
        tenantId: data.tenantId === '' ? null : data.tenantId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (confirm(t('messages.deleteConfirm'))) {
      try {
        await deleteUser(userId);
        router.push('/users');
      } catch (error) {
        console.error(error);
      }
    }
  };

  const tabTriggerClass = cn(
    "relative h-14 rounded-none bg-transparent px-0 pb-3 pt-3 font-semibold text-muted-foreground shadow-none transition-none cursor-pointer",
    "!bg-transparent !shadow-none !border-0 hover:text-foreground mx-4 first:ml-0",
    "data-[state=active]:!bg-transparent data-[state=active]:!shadow-none data-[state=active]:!text-foreground data-[state=active]:!border-none",
    "dark:data-[state=active]:!bg-transparent dark:data-[state=active]:!border-none",
    "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 data-[state=active]:after:scale-x-100"
  );

  const cardClass = "bg-card border-none shadow-md overflow-hidden relative dark:bg-[#212B36]";

  if (isLoadingUser) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <p className="text-lg text-muted-foreground">{t('notFound')}</p>
        <Button onClick={() => router.push('/users')}>{t('backToList')}</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                <Link href="/users" className="transition-colors hover:text-foreground">
                    {tCommon('users')}
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem current>{user.name}</BreadcrumbItem>
            </Breadcrumbs>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Button
              type="submit"
              form="user-form"
              variant="default" 
              disabled={isSubmitting || isUpdating || (!isDirty && !avatarFile)}
              className="gap-2"
            >
              {(isSubmitting || isUpdating) ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                  <Save className="h-4 w-4" />
              )}
              {isSubmitting || isUpdating ? t('buttons.saving') : t('buttons.save')}
            </Button>
        </div>
      </div>

      <Form {...form}>
        <form id="user-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Avatar & Controls (Glass Style) */}
            <div className="lg:col-span-1 space-y-6">
                <Card className={cn("p-6", cardClass)}>
                    <div className="absolute top-0 right-0 p-4 z-10">
                        <span className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase",
                            user.status === 'ACTIVE' ? "bg-emerald-500/15 text-emerald-500" : 
                            user.status === 'BANNED' ? "bg-red-500/15 text-red-500" : 
                            "bg-amber-500/15 text-amber-500"
                        )}>
                            {t(`statuses.${user.status}`)}
                        </span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                        <div className="mb-6 mt-4">
                            <AvatarUpload value={avatarPreview} onChange={handleAvatarChange} />
                        </div>
                        
                        <div className="w-full space-y-4 pt-6 border-t border-border/40">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-foreground">{t('labels.banned')}</span>
                                <Switch
                                checked={status === 'BANNED'}
                                onChange={(e) => setValue('status', e.target.checked ? 'BANNED' : 'ACTIVE', { shouldDirty: true })}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-0">
                                {t('hints.disableAccount')}
                            </p>

                            <div className="flex items-center justify-between pt-2">
                                <span className="text-sm font-medium text-foreground">{t('labels.emailVerified')}</span>
                                <Switch
                                checked={emailVerified}
                                onChange={(e) => setValue('emailVerified', e.target.checked, { shouldDirty: true })}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-0">
                                {t('hints.emailVerification')}
                            </p>
                        </div>
                        
                        <div className="mt-8 w-full">
                            <Button 
                                type="button" 
                                variant="destructive" 
                                className="w-full bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600 dark:bg-red-500/20 dark:hover:bg-red-500/30 dark:text-red-400"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {isDeleting ? t('buttons.deleting') : t('buttons.delete')}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Right Column: Tabs inside unified Card */}
            <div className="lg:col-span-2">
                 <Card className={cardClass}>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="px-6 border-b border-border/40">
                            <TabsList className="bg-transparent p-0 h-auto gap-0 justify-start px-0 w-full flex-nowrap overflow-x-auto border-b-0 no-scrollbar">
                                <TabsTrigger value="overview" className={tabTriggerClass}>
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    {t('tabs.overview')}
                                </TabsTrigger>
                                <TabsTrigger value="security" className={tabTriggerClass}>
                                    <Shield className="mr-2 h-4 w-4" />
                                    {t('tabs.security')}
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="p-6">
                            <TabsContent value="overview" className="mt-0 space-y-6 focus-visible:outline-none focus-visible:ring-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Full Name */}
                                    <FormField
                                        control={control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel>{t('labels.fullName')}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Email */}
                                    <FormField
                                        control={control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('labels.email')}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="email" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Phone */}
                                    <FormField
                                        control={control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('labels.phoneNumber')}</FormLabel>
                                                <FormControl>
                                                    <PhoneInput
                                                        value={field.value || ''}
                                                        onChange={field.onChange}
                                                        id="phone"
                                                        error={errors.phone?.message}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Tenant */}
                                    <FormField
                                        control={control}
                                        name="tenantId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('labels.tenant')}</FormLabel>
                                                <Select
                                                    value={field.value ?? undefined}
                                                    onValueChange={field.onChange}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t('placeholders.selectTenant')} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {isLoadingTenants ? (
                                                            <SelectItem value="loading" disabled>{tCommon('loading')}</SelectItem>
                                                        ) : (
                                                            tenants.map((tenant) => (
                                                                <SelectItem key={tenant.id} value={tenant.id}>
                                                                    {tenant.name}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Role */}
                                    <FormField
                                        control={control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('labels.role')}</FormLabel>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    disabled={user?.role === 'SUPER_ADMIN'}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="USER">{t('roles.USER')}</SelectItem>
                                                        <SelectItem value="TENANT_ADMIN">{t('roles.TENANT_ADMIN')}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Address */}
                                    <FormField
                                        control={control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel>{t('labels.address')}</FormLabel>
                                                <FormControl>
                                                    <AddressAutocomplete
                                                        value={field.value || ''}
                                                        onChange={field.onChange}
                                                        onPlaceSelected={handlePlaceSelected}
                                                        placeholder={t('placeholders.searchAddress')}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* City */}
                                    <FormField
                                        control={control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('labels.city')}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    {/* State */}
                                    <FormField
                                        control={control}
                                        name="state"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('labels.state')}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Country */}
                                    <FormField
                                        control={control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('labels.country')}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Zipcode */}
                                    <FormField
                                        control={control}
                                        name="zipcode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('labels.zipcode')}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Company */}
                                    <FormField
                                        control={control}
                                        name="company"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel>{t('labels.company')}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="security" className="mt-0 space-y-6">
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Shield className="h-12 w-12 text-muted-foreground/50 mb-4" />
                                    <h3 className="text-lg font-semibold text-foreground">{t('sections.security.title')}</h3>
                                    <p className="text-muted-foreground text-sm max-w-sm mt-2">
                                        {t('sections.security.description')}
                                    </p>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                 </Card>
            </div>
            </div>
        </form>
      </Form>
    </div>
  );
}
