'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TextField } from '@/components/ui/text-field';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
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

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!token) {
      toast.error('Invalid reset token');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      if (response.ok) {
        toast.success('Password reset successfully!');
        router.push('/login');
      } else {
        toast.error('Password reset failed');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#212B36] rounded-2xl p-8 shadow-2xl border border-gray-700/50 max-w-md w-full mx-auto">
      <div className="text-center mb-8">
        <div className="mx-auto w-20 h-20 bg-[#161C24] rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-primary-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Reset your password</h3>
        <p className="text-gray-400">Enter your new password below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <TextField
            id="password"
            type={showPassword ? 'text' : 'password'}
            label="New Password"
            placeholder="6+ characters"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            fullWidth
            className="bg-[#161C24] border-gray-700 text-white placeholder-gray-500 focus:border-primary-main focus:ring-primary-main/20"
            labelClassName="text-gray-400"
            endAdornment={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-gray-300 transition-colors"
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
                      level <= passwordStrength ? strengthColors[passwordStrength] : 'bg-[#161C24]'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-right text-gray-500">
                {strengthLabels[passwordStrength]}
              </p>
            </div>
          )}
        </div>

        <div>
          <TextField
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirm Password"
            placeholder="6+ characters"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            fullWidth
            className="bg-[#161C24] border-gray-700 text-white placeholder-gray-500 focus:border-primary-main focus:ring-primary-main/20"
            labelClassName="text-gray-400"
            error={!!(formData.confirmPassword && formData.password !== formData.confirmPassword)}
            errorMessage={
              formData.confirmPassword && formData.password !== formData.confirmPassword
                ? 'Passwords do not match'
                : undefined
            }
            endAdornment={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            }
          />
        </div>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          loading={loading}
          disabled={formData.password !== formData.confirmPassword}
          fullWidth
          size="lg"
          className="h-12 text-md font-bold shadow-lg shadow-primary-main/25 hover:shadow-primary-main/40 transition-all"
        >
          Reset Password
        </Button>

        <Button variant="text" className="w-full text-gray-400 hover:text-white mt-4" asChild>
          <Link href="/login" className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Return to sign in
          </Link>
        </Button>
      </form>
    </div>
  );
}
