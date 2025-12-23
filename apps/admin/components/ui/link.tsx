import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Variant
   * @default 'body1'
   */
  variant?: 'body1' | 'body2' | 'caption' | 'button' | 'inherit';
  /**
   * Color
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'inherit' | 'error' | 'success' | 'warning' | 'info';
  /**
   * Underline
   * @default 'hover'
   */
  underline?: 'none' | 'hover' | 'always';
  children: React.ReactNode;
}

const variantClasses = {
  body1: 'text-base',
  body2: 'text-sm',
  caption: 'text-xs',
  button: 'text-sm font-medium uppercase tracking-wide',
  inherit: '',
};

const colorClasses = {
  primary: 'text-primary-main hover:text-primary-dark',
  secondary: 'text-secondary-main hover:text-secondary-dark',
  inherit: 'text-inherit',
  error: 'text-error-main hover:text-error-dark',
  success: 'text-success-main hover:text-success-dark',
  warning: 'text-warning-main hover:text-warning-dark',
  info: 'text-info-main hover:text-info-dark',
};

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    { className, variant = 'body1', color = 'primary', underline = 'hover', children, ...props },
    ref
  ) => {
    return (
      <a
        ref={ref}
        className={cn(
          'cursor-pointer transition-colors',
          variantClasses[variant],
          colorClasses[color],
          underline === 'none' && 'no-underline',
          underline === 'hover' && 'no-underline hover:underline',
          underline === 'always' && 'underline',
          className
        )}
        {...props}
      >
        {children}
      </a>
    );
  }
);

Link.displayName = 'Link';
