'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useUser, useUpdateUser, useDeleteUser } from '@/hooks/use-users';
import { useTenants } from '@/hooks/use-tenants';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/radix-select';
import { Switch } from '@/components/ui/switch';
import { Breadcrumbs, BreadcrumbItem } from '@/components/breadcrumbs';
import { AvatarUpload } from '@/components/avatar-upload';
import { AddressAutocomplete } from '@/components/address-autocomplete';
import { PhoneInput } from '@/components/phone-input';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';


const userSchema = z.object({
  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .refine((val) => val.trim().split(/\s+/).length >= 2, {
      message: 'Please enter your full name (first and last name)',
    }),
  email: z.string().email('Invalid email address'),
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

type UserFormData = z.infer<typeof userSchema>;

interface UserEditViewProps {
  userId: string;
}

export function UserEditView({ userId }: UserEditViewProps) {
  const router = useRouter();
  const { data: user, isLoading: isLoadingUser } = useUser(userId);
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser(userId);
  const { mutateAsync: deleteUser, isPending: isDeleting } = useDeleteUser();
  
  // Buscar todos os tenants para o select (o tenant do usuário já está na lista)
  const { tenants, isLoading: isLoadingTenants } = useTenants({ limit: 100 });

  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  

  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
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

  // Populate form when user data loads
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
      
      console.log('👤 [USER EDIT] User loaded:', { 
        userId: user.id, 
        hasAvatar: !!user.avatar, 
        avatarUrl: user.avatar 
      });
      
      if (user.avatar) {
        // Adiciona URL base do backend se não estiver presente
        const avatarUrl = user.avatar.startsWith('http') 
          ? user.avatar 
          : `http://localhost:8000${user.avatar}`;
        console.log('🖼️ [USER EDIT] Setting avatar preview:', avatarUrl);
        setAvatarPreview(avatarUrl);
      }
    } else {

    }
  }, [user, reset]);


  
  // Proteger tenantId: restaurar se foi limpo mas user.tenantId existe
  useEffect(() => {
    const currentTenantId = watch('tenantId');
    if (user?.tenantId && !currentTenantId) {
      setValue('tenantId', user.tenantId, { shouldValidate: false, shouldDirty: false });
    }
  }); // SEM DEPENDÊNCIAS - roda em todo render
  
  const emailVerified = watch('emailVerified');
  const status = watch('status');
  const addressValue = watch('address') || '';

  const handleAvatarChange = (file: File | null, preview: string) => {
    setAvatarFile(file);
    setAvatarPreview(preview);
    console.log('📸 Avatar changed:', { hasFile: !!file, preview: preview.substring(0, 50) });
  };

  const handlePlaceSelected = (data: { address: string; city: string; state: string; country: string; zipcode: string }) => {
    setValue('city', data.city, { shouldValidate: true, shouldTouch: true });
    setValue('state', data.state, { shouldValidate: true, shouldTouch: true });
    setValue('country', data.country, { shouldValidate: true, shouldTouch: true });
    setValue('zipcode', data.zipcode, { shouldValidate: true, shouldTouch: true });
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      console.log('💾 Submitting user update...', { hasAvatar: !!avatarFile });
      
      // Se tem avatar, fazer upload primeiro
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        
        console.log('📤 Uploading avatar...');
        try {
          const response = await api.post(`/api/users/${userId}/avatar`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log('✅ Avatar uploaded:', response.data);
          // Avatar URL já foi atualizado no banco pelo backend
        } catch (uploadError) {
          console.error('❌ Avatar upload failed:', uploadError);
          // Continuar com update mesmo se avatar falhar
        }
      }
      
      await updateUser({
        ...data,
        tenantId: data.tenantId === '' ? null : data.tenantId,
      });
      // toast already in hook
      router.push('/users');
    } catch (error) {
      console.error(error);
      // toast already in hook
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        router.push('/users');
      } catch (error) {
        console.error(error);
      }
    }
  };

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
        <p className="text-lg text-muted-foreground">User not found</p>
        <Button onClick={() => router.push('/users')}>Back to list</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit User</h1>
          <div className="mt-2">
            <Breadcrumbs>
              <BreadcrumbItem>
                <Link href="/dashboard" className="transition-colors hover:text-foreground">
                  Dashboard
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link href="/users" className="transition-colors hover:text-foreground">
                  User
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem current>{user.name}</BreadcrumbItem>
            </Breadcrumbs>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 bg-card border-none shadow-sm dark:bg-[#212B36]">
              {/* Avatar centralizado */}
              <div className="relative mb-4 flex justify-center">
                 <AvatarUpload value={avatarPreview} onChange={handleAvatarChange} />
              </div>

              {/* Status badge centralizado abaixo do avatar */}
              <div className="flex justify-center mb-6">
                <span className={cn(
                    "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                    user.status === 'ACTIVE' ? "bg-green-50 text-green-700 ring-green-600/20" : 
                    user.status === 'BANNED' ? "bg-red-50 text-red-700 ring-red-600/20" : 
                    "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                )}>
                    {user.status}
                </span>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/40">
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Banned</span>
                    <Switch
                      checked={status === 'BANNED'}
                      onChange={(e) => setValue('status', e.target.checked ? 'BANNED' : 'ACTIVE')}
                    />
                 </div>
                 <p className="text-xs text-muted-foreground">
                    Apply disable account
                 </p>

                 <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-medium text-foreground">Email verified</span>
                    <Switch
                      checked={emailVerified}
                      onChange={(e) => setValue('emailVerified', e.target.checked)}
                    />
                 </div>
                 <p className="text-xs text-muted-foreground">
                    Disabling this will automatically send the user a verification email
                 </p>
              </div>

               <div className="mt-8 flex justify-center">
                  <Button 
                    type="button" 
                    variant="destructive" 
                    className="w-full text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete user'}
                  </Button>
               </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="p-6 bg-card border-none shadow-sm dark:bg-[#212B36]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full name - 100% */}
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Full name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    {...register('name')}
                    id="name"
                    className={cn(
                      "bg-transparent transition-colors",
                      errors.name && "border-red-500 needs-attention"
                    )}
                  />
                   {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
                </div>

                {/* Email address - 50% */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email address <span className="text-destructive">*</span>
                  </label>
                  <Input
                    {...register('email')}
                    id="email"
                    type="email"
                    className={cn(
                      "bg-transparent transition-colors",
                      errors.email && "border-red-500"
                    )}
                  />
                  {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
                </div>

                {/* Phone number - 50% */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone number
                  </label>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <PhoneInput
                        value={field.value || ''}
                        onChange={field.onChange}
                        id="phone"
                      />
                    )}
                  />
                </div>

                {/* Tenant - 50% */}
                <div>
                  <label htmlFor="tenantId" className="block text-sm font-medium text-foreground mb-2">
                    Tenant
                  </label>
                  <Select
                    value={watch('tenantId') ?? undefined}
                    onValueChange={(value) => setValue('tenantId', value)}
                  >
                    <SelectTrigger className="bg-transparent h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingTenants ? (
                        <SelectItem value="loading" disabled>Loading tenants...</SelectItem>
                      ) : tenants.length === 0 ? (
                        <SelectItem value="empty" disabled>No tenants available</SelectItem>
                      ) : (
                        tenants.map((tenant) => (
                          <SelectItem key={tenant.id} value={tenant.id}>
                            {tenant.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Role - 50% */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-foreground mb-2">
                    Role
                  </label>
                  <Select
                    value={watch('role')}
                    onValueChange={(value) => setValue('role', value as 'USER' | 'TENANT_ADMIN' | 'SUPER_ADMIN')}
                    disabled={user?.role === 'SUPER_ADMIN'}
                  >
                    <SelectTrigger className="bg-transparent h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="TENANT_ADMIN">Tenant Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Address - 100% */}
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">
                    Address
                  </label>
                  <AddressAutocomplete
                    value={addressValue}
                    onChange={(value) => setValue('address', value)}
                    onPlaceSelected={handlePlaceSelected}
                    placeholder="908 Jack Locks"
                    className="bg-transparent"
                    id="address"
                  />
                </div>

                {/* City - 50% */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">
                    City
                  </label>
                  <Input
                    {...register('city')}
                    id="city"
                    placeholder="Rancho Cordova"
                    className="bg-transparent"
                    disabled
                  />
                </div>

                {/* State/Region - 50% */}
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-foreground mb-2">
                    State/Region
                  </label>
                  <Input
                    {...register('state')}
                    id="state"
                    placeholder="Virginia"
                    className="bg-transparent"
                    disabled
                  />
                </div>

                {/* Country - 50% */}
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-foreground mb-2">
                    Country
                  </label>
                  <Input
                    {...register('country')}
                    id="country"
                    placeholder="United States"
                    className="bg-transparent"
                    disabled
                  />
                </div>

                {/* Zip/code - 50% */}
                <div>
                  <label htmlFor="zipcode" className="block text-sm font-medium text-foreground mb-2">
                    Zip/code
                  </label>
                  <Input
                    {...register('zipcode')}
                    id="zipcode"
                    placeholder="85807"
                    className="bg-transparent"
                    disabled
                  />
                </div>

                {/* Company - 100% */}
                <div className="sm:col-span-2">
                  <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                    Company
                  </label>
                  <Input
                    {...register('company')}
                    id="company"
                    placeholder="Gleichner, Mueller and Tromp"
                    className="bg-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-8 pt-6">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="lg"
                  disabled={isSubmitting || isUpdating}
                  className="min-w-[140px] h-11"
                >
                    {isSubmitting || isUpdating ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                    </>
                    ) : (
                    'Save changes'
                    )}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
