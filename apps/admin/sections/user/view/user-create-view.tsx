'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useCreateUser } from '@/hooks/use-users';
import { Upload, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/radix-select';
import { Switch } from '@/components/ui/switch';
import { Breadcrumbs, BreadcrumbItem } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const userSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  phone: z.string().optional(),
  role: z.enum(['USER', 'TENANT_ADMIN']),
  status: z.enum(['ACTIVE', 'PENDING']).default('ACTIVE'),
  emailVerified: z.boolean().default(false),
  // Optional fields from reference
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: UserFormData) => {
    try {
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
          <div className="p-6 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
            {/* Left Column: Avatar Upload */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  {avatarPreview ? (
                    <AvatarImage src={avatarPreview} alt="Avatar preview" />
                  ) : (
                    <AvatarFallback className="bg-muted text-muted-foreground text-3xl">
                      <Upload className="h-12 w-12" />
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>

              <div className="w-full">
                <label
                  htmlFor="avatar-upload"
                  className="flex items-center justify-center gap-2 cursor-pointer rounded-lg border-2 border-dashed border-border/60 bg-muted/30 px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/50"
                >
                  <Upload className="h-4 w-4" />
                  Upload photo
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <p className="mt-2 text-xs text-center text-muted-foreground">
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br />
                  max size of 3.1 MB
                </p>
              </div>

              {/* Email Verified Toggle */}
              <div className="w-full mt-4 p-4 rounded-lg bg-muted/30 border border-border/40">
                <div className="flex items-center justify-between">
                  <div>
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

            {/* Right Column: Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">
                  Address
                </label>
                <Input
                  {...register('address')}
                  id="address"
                  placeholder="123 Main St"
                  className="bg-transparent"
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

              {/* Password */}
              <div className="md:col-span-2">
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
