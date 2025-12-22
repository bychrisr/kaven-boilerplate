import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Variant
   * @default 'filled'
   */
  variant?: 'filled' | 'outlined' | 'soft';
  /**
   * Color
   * @default 'default'
   */
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  /**
   * Size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Icon
   */
  icon?: React.ReactNode;
  /**
   * Removable
   */
  onRemove?: () => void;
  children: React.ReactNode;
}

const colorClasses = {
  filled: {
    default: 'bg-gray-500 text-white',
    primary: 'bg-primary-main text-white',
    secondary: 'bg-secondary-main text-white',
    success: 'bg-success-main text-white',
    error: 'bg-error-main text-white',
    warning: 'bg-warning-main text-gray-900',
    info: 'bg-info-main text-white',
  },
  outlined: {
    default: 'border-2 border-gray-500 text-gray-700',
    primary: 'border-2 border-primary-main text-primary-main',
    secondary: 'border-2 border-secondary-main text-secondary-main',
    success: 'border-2 border-success-main text-success-main',
    error: 'border-2 border-error-main text-error-main',
    warning: 'border-2 border-warning-main text-warning-main',
    info: 'border-2 border-info-main text-info-main',
  },
  soft: {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary-main/10 text-primary-main',
    secondary: 'bg-secondary-main/10 text-secondary-main',
    success: 'bg-success-main/10 text-success-main',
    error: 'bg-error-main/10 text-error-main',
    warning: 'bg-warning-main/10 text-warning-main',
    info: 'bg-info-main/10 text-info-main',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-2.5 py-1 gap-1.5',
  lg: 'text-base px-3 py-1.5 gap-2',
};

export const Label = React.forwardRef<HTMLSpanElement, LabelProps>(
  (
    {
      className,
      variant = 'filled',
      color = 'default',
      size = 'md',
      icon,
      onRemove,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full',
          sizeClasses[size],
          colorClasses[variant][color],
          className
        )}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 hover:opacity-70 transition-opacity"
            aria-label="Remover"
          >
            <X className="size-3" />
          </button>
        )}
      </span>
    );
  }
);

Label.displayName = 'Label';
