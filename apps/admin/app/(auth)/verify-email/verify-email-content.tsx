'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// Alert removed (unused)
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
  return (
    <div className="bg-card rounded-2xl p-8 shadow-2xl border border-border max-w-md w-full mx-auto text-center">
      
      {status === 'verifying' && (
        <div>
           <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Verifying your email...</h2>
          <p className="text-muted-foreground">Please wait while we verify your email address</p>
        </div>
      )}
      
      {status === 'success' && (
        <div className="animate-fade-in">
           <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
               <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
               </svg>
            </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Email verified!</h2>
          <p className="text-muted-foreground mb-6">
             Your email has been successfully verified.
          </p>
          <p className="text-sm text-muted-foreground">Redirecting to login...</p>
        </div>
      )}
      
      {status === 'error' && (
        <div className="animate-fade-in">
           <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
               <svg className="w-10 h-10 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
           </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Verification failed</h2>
          <p className="text-muted-foreground mb-8">
            The verification link is invalid or has expired.
          </p>
          <Button variant="contained" color="primary" size="lg" fullWidth asChild className="mb-4">
            <Link href="/login">Go to Login</Link>
          </Button>

          <Button variant="text" className="w-full text-muted-foreground hover:text-foreground" asChild>
            <Link href="/login" className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Return to sign in
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
