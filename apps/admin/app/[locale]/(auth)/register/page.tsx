'use client';

import { useState, useEffect } from 'react';
import { Link, useRouter } from '@/i18n/routing';
import { Logo } from '@/components/logo';
import { TextField } from '@/components/ui/text-field';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
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
    'bg-muted',
    'bg-destructive',
    'bg-yellow-500',
    'bg-green-400',
    'bg-green-600',
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
    <div className="bg-card rounded-2xl p-8 shadow-2xl border border-border">
      <div className="mb-8">
        <Logo size="large" className="mb-6" />
        <h4 className="text-2xl font-bold text-card-foreground mb-2">Get started absolutely free</h4>
        <p className="text-muted-foreground text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  id="firstName"
                  type="text"
                  label="First name"
                  placeholder="John"
                  value={formData.name.split(' ')[0] || ''}
                  onChange={(e) => {
                     const lastName = formData.name.split(' ').slice(1).join(' ');
                     setFormData({ ...formData, name: `${e.target.value} ${lastName}`.trim() });
                  }}
                  required
                  fullWidth
                />
                 <TextField
                  id="lastName"
                  type="text"
                  label="Last name"
                  placeholder="Doe"
                  value={formData.name.split(' ').slice(1).join(' ') || ''}
                  onChange={(e) => {
                     const firstName = formData.name.split(' ')[0];
                     setFormData({ ...formData, name: `${firstName} ${e.target.value}`.trim() });
                  }}
                  required
                  fullWidth
                />
            </div>

            <TextField
              id="email"
              type="email"
              label="Email address"
              placeholder="demo@minimals.cc"
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
                placeholder="6+ characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                fullWidth
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
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
                          level <= passwordStrength ? strengthColors[passwordStrength] : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-right text-muted-foreground">
                    {strengthLabels[passwordStrength]}
                  </p>
                </div>
              )}
            </div>
        </div>

        <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            loading={loading} 
            fullWidth 
            size="lg"
            className="h-12 text-md font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
        >
          Create account
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-3 bg-card text-muted-foreground font-bold">OR</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button disabled type="button" className="flex items-center justify-center h-10 rounded-lg bg-background border border-border opacity-50 cursor-not-allowed transition-all">
             <svg className="w-5 h-5 grayscale" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.32-1.133 8.4-3.253 2.16-2.16 2.827-5.467 2.827-8.2 0-.8-.08-1.573-.24-2.32H12.48z" />
             </svg>
          </button>
          <button disabled type="button" className="flex items-center justify-center h-10 rounded-lg bg-background border border-border opacity-50 cursor-not-allowed transition-all">
            <svg className="w-5 h-5 text-muted-foreground grayscale" viewBox="0 0 24 24" fill="currentColor">
               <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </button>
          <button disabled type="button" className="flex items-center justify-center h-10 rounded-lg bg-background border border-border opacity-50 cursor-not-allowed transition-all">
            <svg className="w-5 h-5 text-[#1C9CEA] grayscale" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </button>
        </div>

        <div className="text-center mt-6">
            <p className="text-xs text-muted-foreground">
                By signing up, I agree to{' '}
                <Link href="/terms" className="underline text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                </Link>.
            </p>
        </div>
      </form>
    </div>
  );
}
