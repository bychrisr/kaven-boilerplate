'use client';

import { CheckCircle, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('Common.passwordValidator');

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
      { label: t('levels.veryWeak'), color: 'bg-red-500' },
      { label: t('levels.weak'), color: 'bg-orange-500' },
      { label: t('levels.fair'), color: 'bg-yellow-500' },
      { label: t('levels.good'), color: 'bg-blue-500' },
      { label: t('levels.strong'), color: 'bg-green-500' },
    ];

    return {
      score,
      label: levels[score - 1]?.label || t('levels.veryWeak'),
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
            {t('strength')}
          </span>
          <span 
            className={`text-sm font-medium ${
              strength.score <= 2 ? 'text-red-600 dark:text-red-400' :
              strength.score <= 3 ? 'text-yellow-600 dark:text-yellow-400' :
              'text-green-600 dark:text-green-400'
            }`}
            aria-label={`${t('strength')}: ${strength.label}`}
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
          {t('requirements')}
        </h4>
        <div className="space-y-1 text-sm">
          <div className="flex items-center space-x-2">
            {getRequirementIcon(requirements.length)}
            <span className={requirements.length ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
              {t('checklist.length')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {getRequirementIcon(requirements.lowercase)}
            <span className={requirements.lowercase ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
              {t('checklist.lowercase')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {getRequirementIcon(requirements.uppercase)}
            <span className={requirements.uppercase ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
              {t('checklist.uppercase')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {getRequirementIcon(requirements.number)}
            <span className={requirements.number ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
              {t('checklist.number')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {getRequirementIcon(requirements.special)}
            <span className={requirements.special ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
              {t('checklist.special')}
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
export function validatePasswordRequirements(password: string, t: (key: string) => string): string | true {
  if (!password) return t('errors.required');
  if (password.length < 8) return t('checklist.length');
  if (!/[a-z]/.test(password)) return t('checklist.lowercase');
  if (!/[A-Z]/.test(password)) return t('checklist.uppercase');
  if (!/[0-9]/.test(password)) return t('checklist.number');
  if (!/[^A-Za-z0-9]/.test(password)) return t('checklist.special');
  return true;
}

/**
 * Zod regex for password validation
 * Use this in your schema for comprehensive validation
 */
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]+$/;
