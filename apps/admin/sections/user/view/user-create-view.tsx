'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCreateUser } from '@/hooks/use-users';
import { useTenants } from '@/hooks/use-tenants';
import { Loader2, Eye, EyeOff, Plus } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from '@/components/ui/radix-select';
import { Switch } from '@/components/ui/switch';
import { Breadcrumbs, BreadcrumbItem } from '@/components/breadcrumbs';
import { AvatarUpload } from '@/components/avatar-upload';
import { AddressAutocomplete, PlaceData } from '@/components/address-autocomplete';
import { PhoneInput, isPhoneValid } from '@/components/phone-input';
import { PasswordValidator, PASSWORD_REGEX } from '@/components/password-validator';
import { cn } from '@/lib/utils';

const userSchema = (t: (key: string) => string, tUser: (key: string) => string) => z.object({
  name: z.string()
    .min(3, tUser('validation.nameMin'))
    .refine((val) => val.trim().split(/\s+/).length >= 2, {
      message: tUser('create.validation.fullName'),
    }),
  email: z.string().email(tUser('validation.emailInvalid')),
  password: z.string()
    .min(8, t('passwordValidator.checklist.length'))
    .regex(PASSWORD_REGEX, t('passwordValidator.errors.invalid')),
  phone: z.string().optional().refine(val => !val || isPhoneValid(val), {
    message: tUser('validation.phoneInvalid')
  }),
  role: z.enum(['USER', 'TENANT_ADMIN']),
  status: z.enum(['ACTIVE', 'PENDING', 'BANNED']),
  emailVerified: z.boolean(),
  tenantId: z.string().min(1, tUser('create.validation.tenantRequired')),
  // Optional address fields for future invoices/billing
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  zipcode: z.string().optional(),
  company: z.string().optional(),
});

type UserFormData = z.infer<ReturnType<typeof userSchema>>;

export function UserCreateView() {
  const router = useRouter();
  const t = useTranslations('Common');
  const tUser = useTranslations('User');
  const { mutate: createUser, isPending } = useCreateUser();
  const { tenants, isLoading: isLoadingTenants } = useTenants();

  const [avatarPreview, setAvatarPreview] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isAddressAutoFilled, setIsAddressAutoFilled] = useState(false);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema(t, tUser)),
    mode: 'onChange', // Valida em tempo real enquanto digita
    reValidateMode: 'onChange', // Re-valida em tempo real
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'USER',
      status: 'PENDING', // Changed from 'ACTIVE' to 'PENDING'
      emailVerified: false,
      tenantId: '', // Changed from empty string to empty string, but was 'create-own' in original onSubmit
      country: '',
      state: '',
      city: '',
      address: '',
      zipcode: '',
      company: '',
    },
  });

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors, touchedFields }
  } = form;

  const emailVerified = watch('emailVerified');
  const addressValue = watch('address') || '';

  const handleAvatarChange = (_file: File | null, preview: string) => {
    setAvatarPreview(preview);
  };

  const handlePlaceSelected = (data: PlaceData) => {
    // Auto-fill address fields from Google Places
    setValue('address', data.address, { shouldValidate: true, shouldTouch: true });
    setValue('city', data.city, { shouldValidate: true, shouldTouch: true });
    setValue('state', data.state, { shouldValidate: true, shouldTouch: true });
    setValue('country', data.country, { shouldValidate: true, shouldTouch: true });
    setValue('zipcode', data.zipcode, { shouldValidate: true, shouldTouch: true });
    setIsAddressAutoFilled(true);
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      await createUser( // Changed to await
        {
          ...data,
          status: data.emailVerified ? 'ACTIVE' : 'PENDING', // Updated status logic
        },
        {
          onSuccess: () => {
            router.push('/users');
          },
        }
      );
    } catch (error) {
      // Error handled by hook with toast
      console.error(error);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {tUser('create.title')}
          </h2>
          <Breadcrumbs>
            <BreadcrumbItem>
              <Link href="/dashboard" className="transition-colors hover:text-foreground">
                {t('dashboard')}
              </Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link href="/users" className="transition-colors hover:text-foreground">
                {t('users')}
              </Link>
            </BreadcrumbItem>
            <BreadcrumbItem current>{tUser('create.breadcrumb')}</BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href="/users">
              {tUser('create.buttons.cancel')}
            </Link>
          </Button>
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
                      <p className="text-sm font-semibold text-foreground">{tUser('edit.emailVerified')}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {tUser('edit.emailVerifiedDesc')}
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
                    {tUser('edit.fullName')} <span className="text-destructive">*</span>
                  </label>
                  <Input
                    {...register('name')}
                    id="name"
                    placeholder={tUser('create.placeholders.name')}
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
                    {tUser('edit.email')} <span className="text-destructive">*</span>
                  </label>
                  {/* Honeypot field to trick browser autocomplete */}
                  <input
                    type="email"
                    name="email_fake"
                    autoComplete="email"
                    tabIndex={-1}
                    style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }}
                    aria-hidden="true"
                  />
                  <Input
                    {...register('email')}
                    id="email"
                    type="email"
                    placeholder={tUser('create.placeholders.email')}
                    autoComplete="new-password"
                    data-form-type="other"
                    data-lpignore="true"
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
                    {tUser('edit.phone')}
                  </label>
                  <PhoneInput
                    value={watch('phone') || ''}
                    onChange={(value) => {
                      setValue('phone', value, { shouldValidate: true, shouldTouch: true });
                    }}
                    id="phone"
                    className={cn(
                      (watch('phone') ?? '').length >= 10 && "border-green-500"
                    )}
                    error={errors.phone?.message}
                  />
                </div>

                {/* Tenant - Required */}
                <div>
                  <label htmlFor="tenantId" className="block text-sm font-medium text-foreground mb-2">
                    {tUser('edit.tenant')} <span className="text-destructive">*</span>
                  </label>
                  <Select
                    value={watch('tenantId')}
                    onValueChange={(value) => setValue('tenantId', value, { shouldValidate: true, shouldTouch: true })}
                  >
                    <SelectTrigger 
                      id="tenantId"
                      className={cn(
                        "bg-transparent h-11 transition-colors",
                        errors.tenantId && "border-red-500"
                      )}
                    >
                      <SelectValue placeholder={tUser('edit.selectTenant')} />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Primeira opção: Create own tenant */}
                      <SelectItem value="create-own">
                        <div className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          <span>{tUser('create.placeholders.createTenant')}</span>
                        </div>
                      </SelectItem>
                      
                      <SelectSeparator />
                      
                      {/* Lista de tenants existentes */}
                      {isLoadingTenants ? (
                        <SelectItem value="loading" disabled>{t('addressInput.loading')}</SelectItem>
                      ) : tenants?.length === 0 ? (
                        <SelectItem value="empty" disabled>{tUser('create.placeholders.noTenants')}</SelectItem>
                      ) : (
                        tenants?.map((tenant) => (
                          <SelectItem key={tenant.id} value={tenant.id}>
                            {tenant.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.tenantId && (
                    <p className="mt-1 text-sm text-destructive" role="alert">
                      {errors.tenantId.message}
                    </p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-foreground mb-2">
                    {tUser('edit.role')}
                  </label>
                  <Select
                    value={watch('role')}
                    onValueChange={(value) => setValue('role', value as 'USER' | 'TENANT_ADMIN')}
                  >
                    <SelectTrigger className="bg-transparent h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">{tUser('roles.USER')}</SelectItem>
                      <SelectItem value="TENANT_ADMIN">{tUser('roles.TENANT_ADMIN')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Password - Full width with eye toggle */}
                <div className="sm:col-span-2">
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                    {tUser('edit.password')} <span className="text-destructive">*</span>
                  </label>
                  {/* Honeypot field to trick browser autocomplete */}
                  <input
                    type="password"
                    name="password_fake"
                    autoComplete="current-password"
                    tabIndex={-1}
                    style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }}
                    aria-hidden="true"
                  />
                  <div className="relative">
                    <Input
                      {...register('password')}
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={tUser('create.placeholders.password')}
                      autoComplete="new-password"
                      data-form-type="other"
                      data-lpignore="true"
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={(e) => {
                        setIsPasswordFocused(false);
                        register('password').onBlur(e);
                      }}
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
                  {/* Password Validator - Shows when focused or has errors */}
                  {(isPasswordFocused || errors.password) && (
                    <PasswordValidator password={watch('password') || ''} className="mt-2" />
                  )}
                </div>

                {/* Address with Autocomplete - Full width */}
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">
                    {tUser('edit.address')}
                  </label>
                  <AddressAutocomplete
                    value={addressValue}
                    onChange={(value) => setValue('address', value)}
                    onPlaceSelected={handlePlaceSelected}
                    placeholder={tUser('create.placeholders.address')}
                    className={cn(
                      "bg-transparent transition-colors",
                      addressValue && "border-green-500"
                    )}
                    id="address"
                  />
                </div>

                {/* City - Auto-filled, disabled when autocomplete used */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">
                    {tUser('edit.city')}
                  </label>
                  <Input
                    {...register('city')}
                    id="city"
                    placeholder={tUser('create.placeholders.city')}
                    className={cn(
                      "bg-transparent transition-colors",
                      watch('city') && "border-green-500"
                    )}
                    disabled={isAddressAutoFilled}
                  />
                </div>

                {/* State/Region - Auto-filled, disabled when autocomplete used */}
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-foreground mb-2">
                    {tUser('edit.state')}
                  </label>
                  <Input
                    {...register('state')}
                    id="state"
                    placeholder={tUser('create.placeholders.state')}
                    className={cn(
                      "bg-transparent transition-colors",
                      watch('state') && "border-green-500"
                    )}
                    disabled={isAddressAutoFilled}
                  />
                </div>

                {/* Country - Auto-filled, disabled when autocomplete used */}
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-foreground mb-2">
                    {tUser('edit.country')}
                  </label>
                  <Input
                    {...register('country')}
                    id="country"
                    placeholder={tUser('create.placeholders.country')}
                    className={cn(
                      "bg-transparent transition-colors",
                      watch('country') && "border-green-500"
                    )}
                    disabled={isAddressAutoFilled}
                  />
                </div>

                {/* Zip/code - Auto-filled, disabled when autocomplete used */}
                <div>
                  <label htmlFor="zipcode" className="block text-sm font-medium text-foreground mb-2">
                    {tUser('edit.zipcode')}
                  </label>
                  <Input
                    {...register('zipcode')}
                    id="zipcode"
                    placeholder={tUser('create.placeholders.zipcode')}
                    className={cn(
                      "bg-transparent transition-colors",
                      watch('zipcode') && "border-green-500"
                    )}
                    disabled={isAddressAutoFilled}
                  />
                </div>

                {/* Company - Optional */}
                <div className="sm:col-span-2">
                  <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                    {tUser('edit.company')}
                  </label>
                  <Input
                    {...register('company')}
                    id="company"
                    placeholder={tUser('create.placeholders.company')}
                    className={cn(
                      "bg-transparent transition-colors",
                      watch('company') && "border-green-500"
                    )}
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
              {tUser('create.buttons.cancel')}
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
                  {tUser('create.buttons.creating')}
                </>
              ) : (
                tUser('create.buttons.create')
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
