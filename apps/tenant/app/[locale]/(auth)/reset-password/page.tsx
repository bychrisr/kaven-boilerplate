
'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const mutation = useMutation({
    mutationFn: async (data: { password: string }) => {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: data.password }),
      });
      
      if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to reset password');
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success('Password reset successfully');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    },
    onError: (error) => {
        toast.error(error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
    }

    if (!token) {
        toast.error('Invalid token');
        return;
    }

    mutation.mutate({ password });
  };

  if (!token) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-destructive">Invalid Link</h1>
                <p className="text-muted-foreground">No reset token provided.</p>
                <Link href="/login" className="mt-4 inline-block text-primary hover:underline">
                    Back to login
                </Link>
            </div>
        </div>
      );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-lg">
        <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
            <p className="mt-2 text-sm text-muted-foreground">
                Enter your new password below.
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                />
            </div>
            
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
                {mutation.isPending ? 'Resetting...' : 'Reset Password'}
            </Button>
        </form>
      </div>
    </div>
  );
}
