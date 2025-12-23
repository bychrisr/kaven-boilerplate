'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/logo';
import { TextField } from '@/components/ui/text-field';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth.store';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
  const [isChecking, setIsChecking] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const { setAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(returnUrl ? decodeURIComponent(returnUrl) : '/');
    } else {
      setIsChecking(false);
    }
  }, [router, isAuthenticated, returnUrl]);

  if (isChecking) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAuth(data.user, data.accessToken, data.refreshToken);
        toast.success('Login successful!');
        router.refresh();
        router.push(returnUrl ? decodeURIComponent(returnUrl) : '/');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Logo size="large" className="justify-center" />
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in to Kaven</h1>
        <p className="text-gray-600">Enter your details below</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          id="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          fullWidth
        />

        <TextField
          id="password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          fullWidth
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          }
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.remember}
              onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
              className="h-4 w-4 text-primary-main border-gray-300 rounded focus:ring-primary-main"
            />
            <span className="ml-2 text-sm text-gray-700">Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-sm text-primary-main hover:text-primary-dark">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="contained" color="primary" loading={loading} fullWidth size="lg">
          Sign In
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">OR</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button variant="outlined" fullWidth disabled>
            Sign in with Google
          </Button>
          <Button variant="outlined" fullWidth disabled>
            Sign in with GitHub
          </Button>
        </div>
      </form>

      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-primary-main hover:text-primary-dark font-medium">
          Get started
        </Link>
      </p>
    </div>
  );
}
