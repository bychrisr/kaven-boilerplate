'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/logo';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setStatus('success');
          setTimeout(() => router.push('/login'), 3000);
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="space-y-6 text-center">
      <Logo size="large" className="justify-center" />
      
      {status === 'verifying' && (
        <div>
          <div className="h-16 w-16 border-4 border-primary-main border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying your email...</h2>
          <p className="text-gray-600">Please wait while we verify your email address</p>
        </div>
      )}
      
      {status === 'success' && (
        <div className="space-y-4">
          <Alert severity="success" title="Email verified!">
            Your email has been successfully verified.
          </Alert>
          <p className="text-sm text-gray-500">Redirecting to login in 3 seconds...</p>
        </div>
      )}
      
      {status === 'error' && (
        <div className="space-y-4">
          <Alert severity="error" title="Verification failed">
            The verification link is invalid or has expired.
          </Alert>
          <Button variant="contained" color="primary" asChild>
            <Link href="/login">Go to Login</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
