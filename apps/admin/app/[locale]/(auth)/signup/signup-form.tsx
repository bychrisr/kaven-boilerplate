'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Logo } from '@/components/logo';
import { TextField } from '@/components/ui/text-field';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, Eye, EyeOff, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { api } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@/i18n/routing';

const getPasswordStrength = (password: string) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
};

const strengthColors = [
    'bg-muted',
    'bg-destructive',
    'bg-yellow-500', 
    'bg-green-400', 
    'bg-green-600'
];

// ... (keeping imports)

// ... (keeping constants)

export default function SignupForm() {
  const t = useTranslations('Auth.signup');
  const tCommon = useTranslations('Common');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(token ? null : false);
  const [tenantName, setTenantName] = useState('');
  const [email, setEmail] = useState('');

  // Validate token on mount
  useEffect(() => {
    if (!token) return;

    const validateToken = async () => {
        try {
            const { data } = await api.get(`/api/users/invites/${token}/validate`);
            if (data.valid) {
                setIsValidToken(true);
                setEmail(data.email);
                setTenantName(data.tenant);
            } else {
                setIsValidToken(false);
                toast.error(data.error || t('expiredLink'));
            }
        } catch (err) {
            console.error(err);
            setIsValidToken(false);
            toast.error(t('validationError'));
        }
    };

    void validateToken();
  }, [token, t]);

  const signupSchema = z.object({
    firstName: z.string().min(1, t('firstNameLabel') + ' is required'),
    lastName: z.string().min(1, t('lastNameLabel') + ' is required'),
    password: z.string()
      .min(8, tCommon('passwordValidator.errors.required'))
      .regex(/[A-Z]/, tCommon('passwordValidator.checklist.uppercase'))
      .regex(/[a-z]/, tCommon('passwordValidator.checklist.lowercase'))
      .regex(/[0-9]/, tCommon('passwordValidator.checklist.number'))
      .regex(/[^A-Za-z0-9]/, tCommon('passwordValidator.checklist.special')),
  });

  type SignupFormData = z.infer<typeof signupSchema>;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      password: '',
    },
  });

  const watchedPassword = useWatch({ control, name: 'password' });
  const passwordStrength = getPasswordStrength(watchedPassword || '');
  
  const getStrengthLabel = (score: number) => {
    if (score === 0) return '';
    // Map scores to translation keys explicitly to avoid dynamic type errors
    switch (score) {
        case 1: return tCommon('passwordValidator.levels.veryWeak');
        case 2: return tCommon('passwordValidator.levels.weak');
        case 3: return tCommon('passwordValidator.levels.fair');
        case 4: return tCommon('passwordValidator.levels.good');
        case 5: return tCommon('passwordValidator.levels.strong');
        default: return '';
    }
  };

  const signupMutation = useMutation({
    mutationFn: async (data: SignupFormData) => {
      const payload = {
          name: `${data.firstName} ${data.lastName}`.trim(),
          password: data.password
      };
      const res = await api.post(`/api/users/invites/${token}/accept`, payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success(t('success'));
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    },
    onError: (error: unknown) => {
        // Safe access to error message
        const axiosError = error as { response?: { data?: { error?: string } }; message?: string };
        const message = axiosError?.response?.data?.error || axiosError?.message || 'Error';
        toast.error(message);
    }
  });

  const onSubmit = (data: SignupFormData) => {
    signupMutation.mutate(data);
  };

  if (isValidToken === null) {
    return (
        <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <span className="text-muted-foreground">{t('validating')}</span>
        </div>
    );
  }

  if (isValidToken === false) {
    return (
        <div className="bg-card rounded-2xl p-8 shadow-2xl border border-border text-center max-w-sm mx-auto">
            <div className="flex justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <h1 className="text-xl font-bold text-card-foreground mb-2">{!token ? t('invalidLink') : t('expiredLink')}</h1>
            <p className="text-muted-foreground mb-6">{!token ? t('invalidLinkDesc') : t('expiredLinkDesc')}</p>
            <Button variant="outline" onClick={() => router.push('/login')}>
                Go to Login
            </Button>
        </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-8 shadow-2xl border border-border w-full max-w-md mx-auto">
      <div className="mb-8 text-left">
        <Logo size="large" className="mb-6" />
        <h4 className="text-2xl font-bold text-card-foreground mb-2">{t('title')}</h4>
        <p className="text-muted-foreground text-sm">
          {t('subtitle', { tenant: tenantName })}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <TextField
                  id="firstName"
                  type="text"
                  label={t('firstNameLabel')}
                  placeholder={t('firstNamePlaceholder')}
                  error={!!errors.firstName}
                  errorMessage={errors.firstName?.message}
                  {...register('firstName')}
                  autoComplete="given-name"
                  fullWidth
                />
                <TextField
                  id="lastName"
                  type="text"
                  label={t('lastNameLabel')}
                  placeholder={t('lastNamePlaceholder')}
                  error={!!errors.lastName}
                  errorMessage={errors.lastName?.message}
                  {...register('lastName')}
                  autoComplete="family-name"
                  fullWidth
                />
            </div>

            <TextField
              id="email"
              type="email"
              label={t('emailLabel')}
              value={email}
              disabled
              fullWidth
              className="opacity-70"
              autoComplete="username"
            />

            <div className="space-y-2">
                <TextField
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  label={t('passwordLabel')}
                  placeholder={t('passwordPlaceholder')}
                  error={!!errors.password}
                  errorMessage={errors.password?.message}
                  {...register('password')}
                  fullWidth
                  autoComplete="new-password"
                  endAdornment={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  }
                />
                
                {watchedPassword && (
                    <div className="space-y-3">
                        {/* Bars */}
                        <div className="space-y-1">
                            <div className="flex gap-1 h-1">
                                {[1, 2, 3, 4, 5].map((level) => (
                                    <div
                                        key={level}
                                        className={`flex-1 rounded-full transition-all duration-300 ${
                                            level <= passwordStrength ? strengthColors[passwordStrength - 1] || 'bg-red-500' : 'bg-muted'
                                        }`}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-right text-muted-foreground font-medium">
                                {getStrengthLabel(passwordStrength)}
                            </p>
                        </div>

                        {/* Checklist */}
                        <div className="space-y-1">
                            <PasswordRequirement label={tCommon('passwordValidator.checklist.length')} met={watchedPassword.length >= 8} />
                            <PasswordRequirement label={tCommon('passwordValidator.checklist.uppercase')} met={/[A-Z]/.test(watchedPassword)} />
                            <PasswordRequirement label={tCommon('passwordValidator.checklist.lowercase')} met={/[a-z]/.test(watchedPassword)} />
                            <PasswordRequirement label={tCommon('passwordValidator.checklist.number')} met={/[0-9]/.test(watchedPassword)} />
                            <PasswordRequirement label={tCommon('passwordValidator.checklist.special')} met={/[^A-Za-z0-9]/.test(watchedPassword)} />
                        </div>
                    </div>
                )}
            </div>
        </div>

        <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            loading={signupMutation.isPending} 
            fullWidth 
            size="lg"
            className="h-12 text-md font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
        >
          {t('submit')}
        </Button>
      </form>
    </div>
  );
}

function PasswordRequirement({ label, met }: { label: string; met: boolean }) {
    return (
        <div className={`flex items-center text-xs ${met ? 'text-green-500' : 'text-muted-foreground'}`}>
            {met ? <Check className="h-3 w-3 mr-1.5" /> : <div className="h-1 w-1 rounded-full bg-muted-foreground mr-2.5 ml-1" />}
            <span className={met ? 'font-medium' : ''}>{label}</span>
        </div>
    );
}
