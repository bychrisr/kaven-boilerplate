/**
 * Password Validator Component
 * Production-ready password validation for SaaS applications
 * 
 * Features:
 * - Real-time validation with 5 security requirements
 * - Visual strength indicator (5 levels)
 * - Client-side validation (no API latency)
 * - Accessible with ARIA labels
 * - Only shows when password has value
 */

'use client';

import { CheckCircle, XCircle } from 'lucide-react';

interface PasswordRequirements {
  length: boolean;
  lowercase: boolean;
  uppercase: boolean;
  number: boolean;
  special: boolean;
}

interface PasswordValidatorProps {
  password: string;
  className?: string;
}

export function PasswordValidator({ 
  password, 
  className = '' 
}: PasswordValidatorProps) {
  // Don't show if password is empty
  if (!password) return null;

  const validateRequirements = (pwd: string): PasswordRequirements => {
    return {
      length: pwd.length >= 8,
      lowercase: /[a-z]/.test(pwd),
      uppercase: /[A-Z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
    };
  };

  const getPasswordStrength = (pwd: string): { score: number; label: string; color: string } => {
    const requirements = validateRequirements(pwd);
    let score = 0;
    
    if (requirements.length) score++;
    if (requirements.lowercase) score++;
    if (requirements.uppercase) score++;
    if (requirements.number) score++;
    if (requirements.special) score++;

    const levels = [
      { label: 'Very Weak', color: 'bg-red-500' },
      { label: 'Weak', color: 'bg-orange-500' },
      { label: 'Fair', color: 'bg-yellow-500' },
      { label: 'Good', color: 'bg-blue-500' },
      { label: 'Strong', color: 'bg-green-500' },
    ];

    return {
      score,
      label: levels[score - 1]?.label || 'Very Weak',
      color: levels[score - 1]?.color || 'bg-red-500',
    };
  };

  const requirements = validateRequirements(password);
  const strength = getPasswordStrength(password);

  const getRequirementIcon = (isValid: boolean) => {
    if (isValid) {
      return <CheckCircle className="w-4 h-4 text-green-500" aria-label="Requirement met" />;
    }
    return <XCircle className="w-4 h-4 text-red-500" aria-label="Requirement not met" />;
  };

  return (
    <div className={`space-y-3 ${className}`} role="status" aria-live="polite">
      {/* Password Strength Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Password Strength
          </span>
          <span 
            className={`text-sm font-medium ${
              strength.score <= 2 ? 'text-red-600 dark:text-red-400' :
              strength.score <= 3 ? 'text-yellow-600 dark:text-yellow-400' :
              'text-green-600 dark:text-green-400'
            }`}
            aria-label={`Password strength: ${strength.label}`}
          >
            {strength.label}
          </span>
        </div>
        <div className="flex space-x-1" role="progressbar" aria-valuenow={strength.score} aria-valuemin={0} aria-valuemax={5}>
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`h-2 w-full rounded transition-all duration-300 ${
                level <= strength.score
                  ? strength.color
                  : 'bg-muted'
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">
          Requirements
        </h4>
        <div className="space-y-1 text-sm">
          <div className="flex items-center space-x-2">
            {getRequirementIcon(requirements.length)}
            <span className={requirements.length ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
              At least 8 characters
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {getRequirementIcon(requirements.lowercase)}
            <span className={requirements.lowercase ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
              One lowercase letter
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {getRequirementIcon(requirements.uppercase)}
            <span className={requirements.uppercase ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
              One uppercase letter
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {getRequirementIcon(requirements.number)}
            <span className={requirements.number ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
              One number
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {getRequirementIcon(requirements.special)}
            <span className={requirements.special ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
              One special character
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Password validation for Zod schema
 * Enforces all security requirements
 */
export function validatePasswordRequirements(password: string): string | true {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character';
  return true;
}

/**
 * Zod regex for password validation
 * Use this in your schema for comprehensive validation
 */
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]+$/;

/**
 * Password validation error message
 */
export const PASSWORD_ERROR_MESSAGE = 'Password must contain at least: 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character';
