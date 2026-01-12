import * as React from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Variant
   * @default 'circular'
   */
  variant?: 'circular' | 'extended';
  /**
   * Size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Color
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  /**
   * Icon
   */
  icon?: React.ReactNode;
  /**
   * Label (for extended variant)
   */
  label?: string;
  children?: React.ReactNode;
}

const sizeClasses = {
  sm: 'size-10',
  md: 'size-14',
  lg: 'size-16',
};

const colorClasses = {
  primary: 'bg-primary-main hover:bg-primary-dark text-white',
  secondary: 'bg-secondary-main hover:bg-secondary-dark text-white',
  success: 'bg-success-main hover:bg-success-dark text-white',
  error: 'bg-error-main hover:bg-error-dark text-white',
  info: 'bg-info-main hover:bg-info-dark text-white',
  warning: 'bg-warning-main hover:bg-warning-dark text-gray-900',
};

export const Fab = React.forwardRef<HTMLButtonElement, FabProps>(
  (
    {
      className,
      variant = 'circular',
      size = 'md',
      color = 'primary',
      icon = <Plus className="size-6" />,
      label,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium shadow-lg transition-all',
          'hover:shadow-xl active:shadow-md',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variant === 'circular' && 'rounded-full',
          variant === 'extended' && 'rounded-full px-6 h-12',
          variant === 'circular' && sizeClasses[size],
          colorClasses[color],
          className
        )}
        {...props}
      >
        {icon}
        {variant === 'extended' && (label || children)}
      </button>
    );
  }
);

Fab.displayName = 'Fab';
