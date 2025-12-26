/**
 * Password Strength Indicator Component
 * Reusable component for password validation with visual feedback
 */

'use client';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export function PasswordStrengthIndicator({ password, className = '' }: PasswordStrengthIndicatorProps) {
  const getPasswordStrength = (pwd: string): number => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const strength = getPasswordStrength(password);
  
  const strengthColors = [
    'bg-muted',
    'bg-destructive',
    'bg-yellow-500',
    'bg-green-400',
    'bg-green-600',
  ];
  
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  if (!password) return null;

  return (
    <div className={className}>
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded transition-colors ${
              level <= strength ? strengthColors[strength] : 'bg-muted'
            }`}
          />
        ))}
      </div>
      {strength > 0 && (
        <p className="text-xs text-muted-foreground">
          Password strength: <span className="font-medium">{strengthLabels[strength]}</span>
        </p>
      )}
    </div>
  );
}

/**
 * Password validation helper
 * Returns validation error message or null if valid
 */
export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
}

/**
 * Strong password validation (for better security)
 * Returns validation error message or null if valid
 */
export function validateStrongPassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  return null;
}
