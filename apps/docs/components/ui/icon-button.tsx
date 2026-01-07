import * as React from 'react';
import { cn } from '@/lib/utils';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Color
   * @default 'default'
   */
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  /**
   * Edge
   */
  edge?: 'start' | 'end' | false;
  children: React.ReactNode;
}

const sizeClasses = {
  sm: 'size-8 text-lg',
  md: 'size-10 text-xl',
  lg: 'size-12 text-2xl',
};

const colorClasses = {
  default: 'text-text-primary hover:bg-action-hover',
  primary: 'text-primary-main hover:bg-primary-main/10',
  secondary: 'text-secondary-main hover:bg-secondary-main/10',
  success: 'text-success-main hover:bg-success-main/10',
  error: 'text-error-main hover:bg-error-main/10',
  info: 'text-info-main hover:bg-info-main/10',
  warning: 'text-warning-main hover:bg-warning-main/10',
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size = 'md', color = 'default', edge = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'inline-flex items-center justify-center rounded-full transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          sizeClasses[size],
          colorClasses[color],
          edge === 'start' && '-ml-2',
          edge === 'end' && '-mr-2',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
