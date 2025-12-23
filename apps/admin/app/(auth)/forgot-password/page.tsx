'use client';

import { useState } from 'react';
import { Logo } from '@/components/logo';
import Link from 'next/link';

export default function ForgotPasswordPage() {
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
      setSuccess(true); // Always show success to prevent email enumeration
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <Logo size="large" className="justify-center" />

        <div className="bg-success-lighter border border-success-main rounded-lg p-6">
          <div className="h-12 w-12 bg-success-main rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="h-6 w-6 text-white"
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
          <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
          <p className="text-gray-600">
            If an account exists for {email}, we&apos;ve sent a password reset link.
          </p>
        </div>

        <Link
          href="/login"
          className="inline-block text-primary-main hover:text-primary-dark font-medium"
        >
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Logo size="large" className="justify-center" />

      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot your password?</h1>
        <p className="text-gray-600">
          Enter your email address and we&apos;ll send you a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent"
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-main text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <Link
          href="/login"
          className="block text-center text-sm text-primary-main hover:text-primary-dark"
        >
          Back to Sign In
        </Link>
      </form>
    </div>
  );
}
