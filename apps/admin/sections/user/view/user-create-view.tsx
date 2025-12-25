'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useCreateUser } from '@/hooks/use-users';
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

const userSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  phone: z.string().optional(),
  role: z.enum(['USER', 'TENANT_ADMIN']),
  status: z.enum(['ACTIVE', 'PENDING']).default('ACTIVE'),
  emailVerified: z.boolean().default(false),
  // Optional address fields for future invoices/billing
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  zipcode: z.string().optional(),
  company: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export function UserCreateView() {
  const router = useRouter();
  const { mutate: createUser, isPending } = useCreateUser();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'USER',
      status: 'ACTIVE',
      emailVerified: false,
    },
  });

  const emailVerified = watch('emailVerified');
  const addressValue = watch('address') || '';

  const handleAvatarChange = (file: File | null, preview: string) => {
    setAvatarFile(file);
    setAvatarPreview(preview);
  };

  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    // Auto-fill address fields from Google Places
    const addressComponents = place.address_components || [];
    
    let city = '';
    let state = '';
    let country = '';
    let zipcode = '';

    addressComponents.forEach((component) => {
      const types = component.types;
      
      if (types.includes('locality')) {
        city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        state = component.long_name;
      } else if (types.includes('country')) {
        country = component.long_name;
      } else if (types.includes('postal_code')) {
        zipcode = component.long_name;
      }
    });

    // Update form fields
    if (city) setValue('city', city);
    if (state) setValue('state', state);
    if (country) setValue('country', country);
    if (zipcode) setValue('zipcode', zipcode);
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      // TODO: Upload avatar file to storage if avatarFile exists
      createUser(
        {
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone,
          role: data.role,
          status: data.status,
          tenantId: 'create-own', // Creates own tenant
        },
        {
          onSuccess: () => {
            router.push('/users');
          },
        }
      );
    } catch {
      // Error handled by hook with toast
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Create a new user</h1>
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
              <BreadcrumbItem current>Create</BreadcrumbItem>
            </Breadcrumbs>
          </div>
        </div>
      </div>

      <Card className="!p-0 !gap-0 block overflow-hidden border-none shadow-md bg-card dark:bg-[#212B36]">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* 2 Independent Columns Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left Column: Avatar + Email Verified */}
            <div className="p-6 border-r border-border/40">
              <div className="flex flex-col gap-6">
                {/* Avatar Upload with Drag & Drop + Crop */}
                <AvatarUpload value={avatarPreview} onChange={handleAvatarChange} />

                {/* Email Verified Toggle */}
                <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">Email verified</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Disabling this will automatically send the user a verification email
                      </p>
                    </div>
                    <Switch
                      checked={emailVerified}
                      onCheckedChange={(checked) => setValue('emailVerified', checked)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Form Fields */}
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Full name
                  </label>
                  <Input
                    {...register('name')}
                    id="name"
                    placeholder="John Doe"
                    className="bg-transparent"
                  />
                  {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
                </div>

                {/* Email address */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email address
                  </label>
                  <Input
                    {...register('email')}
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="bg-transparent"
                  />
                  {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
                </div>

                {/* Phone number */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone number
                  </label>
                  <Input
                    {...register('phone')}
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="bg-transparent"
                  />
                </div>

                {/* Country */}
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-foreground mb-2">
                    Country
                  </label>
                  <Input
                    {...register('country')}
                    id="country"
                    placeholder="United States"
                    className="bg-transparent"
                  />
                </div>

                {/* State/Region */}
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-foreground mb-2">
                    State/Region
                  </label>
                  <Input
                    {...register('state')}
                    id="state"
                    placeholder="California"
                    className="bg-transparent"
                  />
                </div>

                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">
                    City
                  </label>
                  <Input
                    {...register('city')}
                    id="city"
                    placeholder="San Francisco"
                    className="bg-transparent"
                  />
                </div>

                {/* Address with Autocomplete */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">
                    Address
                  </label>
                  <AddressAutocomplete
                    value={addressValue}
                    onChange={(value) => setValue('address', value)}
                    onPlaceSelected={handlePlaceSelected}
                    placeholder="123 Main St"
                    className="bg-transparent"
                    id="address"
                  />
                </div>

                {/* Zip/code */}
                <div>
                  <label htmlFor="zipcode" className="block text-sm font-medium text-foreground mb-2">
                    Zip/code
                  </label>
                  <Input
                    {...register('zipcode')}
                    id="zipcode"
                    placeholder="94102"
                    className="bg-transparent"
                  />
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                    Company
                  </label>
                  <Input
                    {...register('company')}
                    id="company"
                    placeholder="Acme Inc."
                    className="bg-transparent"
                  />
                </div>

                {/* Role */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-foreground mb-2">
                    Role
                  </label>
                  <Select
                    value={watch('role')}
                    onValueChange={(value) => setValue('role', value as 'USER' | 'TENANT_ADMIN')}
                  >
                    <SelectTrigger className="bg-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="TENANT_ADMIN">Tenant Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Password - Full width */}
                <div className="sm:col-span-2">
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <Input
                    {...register('password')}
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-transparent"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/users')}
              disabled={isSubmitting || isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting || isPending}
              className="min-w-[140px]"
            >
              {isSubmitting || isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create user'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
