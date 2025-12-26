'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useCreateUser } from '@/hooks/use-users';
import { Loader2, Eye, EyeOff } from 'lucide-react';
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
import { PasswordValidator, PASSWORD_REGEX, PASSWORD_ERROR_MESSAGE } from '@/components/password-validator';
import { cn } from '@/lib/utils';

const userSchema = z.object({
  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .refine((val) => val.trim().split(/\s+/).length >= 2, {
      message: 'Please enter your full name (first and last name)',
    }),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(PASSWORD_REGEX, PASSWORD_ERROR_MESSAGE),
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
  const [isAddressAutoFilled, setIsAddressAutoFilled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    mode: 'onBlur', // Valida quando campo perde foco
    reValidateMode: 'onChange', // Re-valida em tempo real após primeira validação
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

  const handlePlaceSelected = (data: { address: string; city: string; state: string; country: string; zipcode: string }) => {
    // Auto-fill address fields from Google Places
    setValue('city', data.city, { shouldValidate: true, shouldTouch: true });
    setValue('state', data.state, { shouldValidate: true, shouldTouch: true });
    setValue('country', data.country, { shouldValidate: true, shouldTouch: true });
    setValue('zipcode', data.zipcode, { shouldValidate: true, shouldTouch: true });
    setIsAddressAutoFilled(true);
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
                      onChange={(e) => setValue('emailVerified', e.target.checked)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Form Fields */}
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full name - Full width */}
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Full name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    {...register('name')}
                    id="name"
                    placeholder="John Doe"
                    className={cn(
                      "bg-transparent transition-colors",
                      errors.name && touchedFields.name && "border-red-500 focus:border-red-500",
                      !errors.name && touchedFields.name && watch('name') && "border-green-500 focus:border-green-500"
                    )}
                    aria-invalid={errors.name ? "true" : "false"}
                  />
                  {errors.name && <p className="mt-1 text-sm text-destructive" role="alert">{errors.name.message}</p>}
                </div>

                {/* Email address */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email address <span className="text-destructive">*</span>
                  </label>
                  <Input
                    {...register('email')}
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    autoComplete="off"
                    className={cn(
                      "bg-transparent transition-colors",
                      errors.email && touchedFields.email && "border-red-500 focus:border-red-500",
                      !errors.email && touchedFields.email && watch('email') && "border-green-500 focus:border-green-500"
                    )}
                    aria-invalid={errors.email ? "true" : "false"}
                  />
                  {errors.email && <p className="mt-1 text-sm text-destructive" role="alert">{errors.email.message}</p>}
                </div>

                {/* Phone number */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone number
                  </label>
                  <PhoneInput
                    value={watch('phone') || ''}
                    onChange={(value) => setValue('phone', value)}
                    placeholder="Enter phone number"
                    id="phone"
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
                    <SelectTrigger className="bg-transparent h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="TENANT_ADMIN">Tenant Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Password - Full width with eye toggle */}
                <div className="sm:col-span-2">
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                    Password <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      {...register('password')}
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className={cn(
                        "bg-transparent pr-10 transition-colors",
                        errors.password && touchedFields.password && "border-red-500 focus:border-red-500",
                        !errors.password && touchedFields.password && watch('password') && "border-green-500 focus:border-green-500"
                      )}
                      aria-invalid={errors.password ? "true" : "false"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <PasswordStrengthIndicator password={watch('password') || ''} className="mt-2" />
                  {errors.password && (
                    <p className="mt-1 text-sm text-destructive" role="alert">{errors.password.message}</p>
                  )}
                </div>

                {/* Address with Autocomplete - Full width */}
                <div className="sm:col-span-2">
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

                {/* City - Auto-filled, disabled when autocomplete used */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">
                    City
                  </label>
                  <Input
                    {...register('city')}
                    id="city"
                    placeholder="San Francisco"
                    className="bg-transparent"
                    disabled={isAddressAutoFilled}
                  />
                </div>

                {/* State/Region - Auto-filled, disabled when autocomplete used */}
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-foreground mb-2">
                    State/Region
                  </label>
                  <Input
                    {...register('state')}
                    id="state"
                    placeholder="California"
                    className="bg-transparent"
                    disabled={isAddressAutoFilled}
                  />
                </div>

                {/* Country - Auto-filled, disabled when autocomplete used */}
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-foreground mb-2">
                    Country
                  </label>
                  <Input
                    {...register('country')}
                    id="country"
                    placeholder="United States"
                    className="bg-transparent"
                    disabled={isAddressAutoFilled}
                  />
                </div>

                {/* Zip/code - Auto-filled, disabled when autocomplete used */}
                <div>
                  <label htmlFor="zipcode" className="block text-sm font-medium text-foreground mb-2">
                    Zip/code
                  </label>
                  <Input
                    {...register('zipcode')}
                    id="zipcode"
                    placeholder="94102"
                    className="bg-transparent"
                    disabled={isAddressAutoFilled}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => router.push('/users')}
              disabled={isSubmitting || isPending}
              className="h-12"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="lg"
              disabled={isSubmitting || isPending}
              className="min-w-[140px] h-12"
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
