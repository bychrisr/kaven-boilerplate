// 🎨 UI: Login Form (Dark Glassmorphism)
'use client';

import { useState } from 'react';
import { useRouter, Link } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Logo } from '@/components/logo';
import { TextField } from '@/components/ui/text-field';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth.store';
import { useTranslations } from 'next-intl';
import { api } from '@/lib/api';

export default function LoginForm() {
  const t = useTranslations('Auth.login');
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  
  const { login, clearError } = useAuthStore();

  const loginSchema = z.object({
    email: z.string().min(1, t('emailLabel') + ' is required').email('Invalid email address'),
    password: z.string().min(1, t('passwordLabel') + ' is required'),
  });
  
  type LoginFormData = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setGeneralError(null);
    clearError();

    console.log('🔄 LOGIN FORM - Starting login...');

    try {
      // Endpoint de login (Usando instância api configurada)
      const response = await api.post('/api/auth/login', {
        email: data.email,
        password: data.password,
      });

      console.log('✅ LOGIN FORM - Login successful, calling store.login()');
      
      // ✅ AXISOR STYLE: Login armazena no localStorage
      login(response.data.user, response.data.accessToken, response.data.refreshToken);
      
      toast.success(t('success'));
      
      console.log('✅ LOGIN FORM - Store updated, navigating...');
      
      // Navegar para destino
      const targetUrl = returnUrl ? decodeURIComponent(returnUrl) : '/dashboard';
      router.push(targetUrl);
      
      console.log('✅ LOGIN FORM - Navigation triggered to:', targetUrl);
    } catch (error) {
      // Erros de login são esperados (ex: senha errada), então usamos warn/log para não acionar o Error Overlay do Next.js
      console.warn('ℹ️ LOGIN FORM - Handled Error:', error);
      const axiosError = error as { response?: { data?: { message?: string, error?: string } } };
      // Backend envia { error: 'Mensagem' } ou { message: 'Mensagem' }
      const message = axiosError.response?.data?.error || axiosError.response?.data?.message || 'Erro ao fazer login. Tente novamente.';
      setGeneralError(message);
      toast.error(message);
    }
  };

  return (
    <div className="bg-card rounded-2xl p-8 shadow-2xl border border-border">
      <div className="mb-8">
        <Logo size="large" className="mb-6" />
        <h4 className="text-2xl font-bold text-card-foreground mb-2">{t('title')}</h4>
        <p className="text-muted-foreground text-sm">
          {t('subtitle')}{' '}
          <Link href="/register" className="text-primary hover:text-primary/80 font-semibold transition-colors">
            {t('getStarted')}
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {generalError && (
          <Alert 
            severity="error" 
            variant="filled" 
            className="mb-4"
            icon={<AlertCircle className="h-5 w-5" />}
          >
            {generalError}
          </Alert>
        )}

        <div className="space-y-5">
            <TextField
              id="email"
              type="email"
              label={t('emailLabel')}
              placeholder="demo@minimals.cc"
              error={!!errors.email}
              errorMessage={errors.email?.message}
              {...register('email')}
              fullWidth
            />

            <div className="space-y-1">
                <div className="flex items-center justify-between mb-1">
                    <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                        {t('forgotPassword')}
                    </Link>
                </div>
                <TextField
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  label={t('passwordLabel')}
                  placeholder="6+ characters"
                  error={!!errors.password}
                  errorMessage={errors.password?.message}
                  {...register('password')}
                  fullWidth
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
            </div>
        </div>

        <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            loading={isSubmitting} 
            fullWidth 
            size="lg"
            className="h-12 text-md font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
        >
          {t('submit')}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-3 bg-card text-muted-foreground font-bold">{t('or')}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button disabled type="button" className="flex items-center justify-center h-10 rounded-lg bg-background border border-border opacity-50 cursor-not-allowed transition-all">
             <svg className="w-5 h-5 grayscale" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.32-1.133 8.4-3.253 2.16-2.16 2.827-5.467 2.827-8.2 0-.8-.08-1.573-.24-2.32H12.48z" />
             </svg>
          </button>
          <button disabled type="button" className="flex items-center justify-center h-10 rounded-lg bg-background border border-border opacity-50 cursor-not-allowed transition-all">
            <svg className="w-5 h-5 text-muted-foreground grayscale" viewBox="0 0 24 24" fill="currentColor">
               <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </button>
          <button disabled type="button" className="flex items-center justify-center h-10 rounded-lg bg-background border border-border opacity-50 cursor-not-allowed transition-all">
            <svg className="w-5 h-5 text-[#1C9CEA] grayscale" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
