
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [tenantName, setTenantName] = useState('');

  // Validate token on mount
  useEffect(() => {
    if (!token) return;

    fetch(`/api/users/invites/${token}/validate`)
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setIsValidToken(true);
          setEmail(data.email);
          setTenantName(data.tenant);
        } else {
          setIsValidToken(false);
          toast.error(data.error || 'Invalid or expired invite link');
        }
      })
      .catch(() => {
          setIsValidToken(false);
          toast.error('Failed to validate invite');
      });
  }, [token]);

  const signupMutation = useMutation({
    mutationFn: async (data: { name: string; password: string }) => {
      const res = await fetch(`/api/users/invites/${token}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to create account');
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success('Account created! Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    },
    onError: (error) => {
        toast.error(error.message);
    }
  });

  if (!token) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-destructive">Invalid Link</h1>
                <p className="text-muted-foreground">No invite token provided.</p>
            </div>
        </div>
    );
  }

  if (isValidToken === null) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Validating invite...</span>
        </div>
    );
  }

  if (isValidToken === false) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-destructive">Invalid or Expired Invite</h1>
                <p className="text-muted-foreground">Please ask for a new invitation.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-lg">
        <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Complete Your Signup</h1>
            <p className="mt-2 text-sm text-muted-foreground">
                Join <strong>{tenantName}</strong> on Kaven
            </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            signupMutation.mutate({ name, password });
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
             <label className="text-sm font-medium">Email</label>
             <Input value={email} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
             <label className="text-sm font-medium">Full Name</label>
             <Input
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
          </div>

          <div className="space-y-2">
             <label className="text-sm font-medium">Password</label>
             <Input
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
          </div>

          <Button type="submit" className="w-full" disabled={signupMutation.isPending}>
            {signupMutation.isPending ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </div>
    </div>
  );
}
