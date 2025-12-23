'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/logo';
import { TextField } from '@/components/ui/text-field';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    terms: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      router.replace('/');
    } else {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return null;
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthColors = [
    'bg-gray-300',
    'bg-error-main',
    'bg-warning-main',
    'bg-success-light',
    'bg-success-main',
  ];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.terms) {
      toast.error('You must accept the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        toast.success('Account created! Please check your email to verify.');
        router.push('/verify-email');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Logo size="large" className="justify-center" />

      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Get started absolutely free</h1>
        <p className="text-gray-600">Create your account to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          id="name"
          type="text"
          label="Full name"
          placeholder="John Doe"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          fullWidth
        />

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

        <div>
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

          {formData.password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded ${
                      level <= passwordStrength ? strengthColors[passwordStrength] : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-600">
                Password strength: <span className="font-medium">{strengthLabels[passwordStrength]}</span>
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
              className="h-4 w-4 mt-0.5 text-primary-main border-gray-300 rounded focus:ring-primary-main"
            />
            <span className="ml-2 text-sm text-gray-700">
              I agree to the{' '}
              <Link href="/terms" className="text-primary-main hover:text-primary-dark">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary-main hover:text-primary-dark">
                Privacy Policy
              </Link>
            </span>
          </label>
        </div>

        <Button type="submit" variant="contained" color="primary" loading={loading} fullWidth size="lg">
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-primary-main hover:text-primary-dark font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
