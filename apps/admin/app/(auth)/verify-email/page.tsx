'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/logo';

export default function VerifyEmailPage() {
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
        <div className="bg-success-lighter border border-success-main rounded-lg p-6">
          <div className="h-16 w-16 bg-success-main rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Email verified!</h2>
          <p className="text-gray-600 mb-4">Your email has been successfully verified.</p>
          <p className="text-sm text-gray-500">Redirecting to login in 3 seconds...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-error-lighter border border-error-main rounded-lg p-6">
          <div className="h-16 w-16 bg-error-main rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification failed</h2>
          <p className="text-gray-600 mb-4">The verification link is invalid or has expired.</p>
          <button
            onClick={() => router.push('/login')}
            className="inline-block bg-primary-main text-white py-2 px-6 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
}
