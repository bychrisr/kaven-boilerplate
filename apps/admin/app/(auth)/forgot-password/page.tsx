'use client';

import { useState } from 'react';
import { Logo } from '@/components/logo';
import { TextField } from '@/components/ui/text-field';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
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

        <Alert severity="success" title="Check your email">
          If an account exists for {email}, we&apos;ve sent a password reset link.
        </Alert>

        <Button variant="text" color="primary" asChild>
          <Link href="/login">Back to Sign In</Link>
        </Button>
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
        <TextField
          id="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          loading={loading}
          fullWidth
          size="lg"
        >
          Send Reset Link
        </Button>

        <Button variant="text" color="primary" fullWidth asChild>
          <Link href="/login">Back to Sign In</Link>
        </Button>
      </form>
    </div>
  );
}
