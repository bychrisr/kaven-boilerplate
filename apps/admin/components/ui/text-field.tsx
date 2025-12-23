import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Variant style
   * @default 'outlined'
   */
  variant?: 'outlined' | 'filled' | 'standard';
  /**
   * Size of the input
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Label text
   */
  label?: string;
  /**
   * Helper text below input
   */
  helperText?: string;
  /**
   * Error state
   */
  error?: boolean;
  /**
   * Error message
   */
  errorMessage?: string;
  /**
   * Start adornment (icon or text)
   */
  startAdornment?: React.ReactNode;
  /**
   * End adornment (icon or text)
   */
  endAdornment?: React.ReactNode;
  /**
   * Multiline textarea
   */
  multiline?: boolean;
  /**
   * Number of rows for multiline
   */
  rows?: number;
  /**
   * Full width
   */
  fullWidth?: boolean;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      variant = 'outlined',
      size = 'md',
      label,
      helperText,
      error = false,
      errorMessage,
      startAdornment,
      endAdornment,
      multiline = false,
      rows = 3,
      fullWidth = false,
      className,
      disabled,
      required,
      id,
      ...props
    },
    ref
  ) => {
    // Generate ID unconditionally (React Hooks rule)
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const hasError = error || Boolean(errorMessage);
    const displayHelperText = errorMessage || helperText;

    const baseClasses = cn(
      'w-full transition-all duration-200 outline-none',
      'text-text-primary placeholder:text-text-disabled',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      {
        // Variant styles - Minimals tokens
        'border-2 rounded-[8px] bg-background': variant === 'outlined', // radius md
        'border-0 border-b-2 rounded-t-md bg-gray-100': variant === 'filled',
        'border-0 border-b-2 bg-transparent': variant === 'standard',
        // Size styles
        'px-3 py-2 text-sm': size === 'sm',
        'px-4 py-2.5 text-base': size === 'md',
        'px-5 py-3 text-lg': size === 'lg',
        // Error styles - Minimals error colors
        'border-[#FF5630] focus:border-[#FF5630] focus:ring-2 focus:ring-[rgba(255,86,48,0.24)]':
          hasError,
        // Normal state - Minimals grey.300 and primary focus
        'border-[#DFE3E8] focus:border-[#1877F2] focus:ring-2 focus:ring-[rgba(24,119,242,0.24)]':
          !hasError && variant === 'outlined',
        'border-gray-400 focus:border-primary-main': !hasError && variant !== 'outlined',
        // Adornment padding
        'pl-10': startAdornment && size === 'sm',
        'pl-12': startAdornment && size === 'md',
        'pl-14': startAdornment && size === 'lg',
        'pr-10': endAdornment && size === 'sm',
        'pr-12': endAdornment && size === 'md',
        'pr-14': endAdornment && size === 'lg',
      },
      className
    );

    const InputComponent = multiline ? 'textarea' : 'input';

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium',
              hasError ? 'text-error-main' : 'text-text-primary',
              disabled && 'opacity-50'
            )}
          >
            {label}
            {required && <span className="text-error-main ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {startAdornment && (
            <div
              className={cn(
                'absolute left-0 top-1/2 -translate-y-1/2 flex items-center text-text-secondary',
                {
                  'left-3': size === 'sm',
                  'left-4': size === 'md',
                  'left-5': size === 'lg',
                }
              )}
            >
              {startAdornment}
            </div>
          )}

          <InputComponent
            ref={ref as React.Ref<HTMLInputElement> & React.Ref<HTMLTextAreaElement>}
            id={inputId}
            className={baseClasses}
            disabled={disabled}
            required={required}
            rows={multiline ? rows : undefined}
            aria-invalid={hasError}
            aria-describedby={displayHelperText ? `${inputId}-helper` : undefined}
            {...(props as React.InputHTMLAttributes<HTMLInputElement> &
              React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />

          {endAdornment && (
            <div
              className={cn(
                'absolute right-0 top-1/2 -translate-y-1/2 flex items-center text-text-secondary',
                {
                  'right-3': size === 'sm',
                  'right-4': size === 'md',
                  'right-5': size === 'lg',
                }
              )}
            >
              {endAdornment}
            </div>
          )}
        </div>

        {displayHelperText && (
          <p
            id={`${inputId}-helper`}
            className={cn('text-xs', hasError ? 'text-error-main' : 'text-text-secondary')}
          >
            {displayHelperText}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export { TextField };
