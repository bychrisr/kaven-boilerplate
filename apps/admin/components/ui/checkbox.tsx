import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Checked state
   */
  checked?: boolean;
  /**
   * Indeterminate state
   */
  indeterminate?: boolean;
  /**
   * Size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Color
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  /**
   * Label
   */
  label?: string;
}

const sizeClasses = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
};

const colorClasses = {
  primary: 'checked:bg-primary-main checked:border-primary-main',
  secondary: 'checked:bg-secondary-main checked:border-secondary-main',
  success: 'checked:bg-success-main checked:border-success-main',
  warning: 'checked:bg-warning-main checked:border-warning-main',
  error: 'checked:bg-error-main checked:border-error-main',
  info: 'checked:bg-info-main checked:border-info-main',
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      checked,
      indeterminate = false,
      size = 'md',
      color = 'primary',
      label,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    // Always call useId unconditionally (React Hooks rule)
    const generatedId = React.useId();
    const inputId = id || `checkbox-${generatedId}`;

    React.useImperativeHandle(ref, () => inputRef.current!);

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const checkboxElement = (
      <div className="relative inline-flex items-center">
        <input
          ref={inputRef}
          type="checkbox"
          id={inputId}
          checked={checked}
          disabled={disabled}
          className={cn(
            'appearance-none border-2 border-gray-300 rounded transition-all cursor-pointer',
            'focus-visible:ring-2 focus-visible:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            sizeClasses[size],
            colorClasses[color],
            className
          )}
          {...props}
        />
        {(checked || indeterminate) && (
          <Check
            className={cn(
              'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white pointer-events-none',
              size === 'sm' && 'size-3',
              size === 'md' && 'size-3.5',
              size === 'lg' && 'size-4'
            )}
          />
        )}
      </div>
    );

    if (!label) {
      return checkboxElement;
    }

    return (
      <label
        htmlFor={inputId}
        className={cn(
          'inline-flex items-center gap-2 cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {checkboxElement}
        <span className="text-sm text-text-primary">{label}</span>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
