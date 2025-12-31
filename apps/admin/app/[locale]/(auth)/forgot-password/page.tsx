// 🎨 UI: Forgot Password Page (Dark Glassmorphism)
'use client';

import { useState } from 'react';
import { TextField } from '@/components/ui/text-field';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function ForgotPasswordPage() {
  const t = useTranslations('Auth.forgotPassword');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('http://localhost:8000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      setSuccess(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
     <div className="bg-card rounded-2xl p-8 shadow-2xl border border-border text-center max-w-md w-full mx-auto">
        <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
           <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
           </svg>
        </div>

        <h3 className="text-2xl font-bold text-card-foreground mb-2">{t('successTitle')}</h3>
        <p className="text-muted-foreground mb-8">
          {t.rich('successDescription', {
            email: () => <span className="text-foreground font-medium">{email}</span>
          })}
        </p>

        <Button variant="contained" color="primary" fullWidth size="lg" asChild className="mb-4">
            <Link href="/login">{t('backToLogin')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-8 shadow-2xl border border-border max-w-md w-full mx-auto">
      <div className="text-center mb-8">
        <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        </div>

        <h3 className="text-2xl font-bold text-card-foreground mb-2">{t('title')}</h3>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <TextField
          id="email"
          type="email"
          label={t('emailLabel')}
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          labelClassName="text-muted-foreground"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          loading={loading}
          fullWidth
          size="lg"
          className="h-12 text-md font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
        >
          {t('submit')}
        </Button>

        <Button variant="text" className="w-full text-muted-foreground hover:text-foreground" asChild>
          <Link href="/login" className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('backToSignIn')}
          </Link>
        </Button>
      </form>
    </div>
  );
}
