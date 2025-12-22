import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const alertVariants = cva(
  'relative w-full rounded-lg p-4 flex items-start gap-3 [&>svg]:size-5 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        filled: '',
        outlined: 'border-2 bg-transparent',
        standard: 'border-l-4',
      },
      severity: {
        success: '',
        info: '',
        warning: '',
        error: '',
      },
    },
    compoundVariants: [
      // Filled variants
      {
        variant: 'filled',
        severity: 'success',
        className: 'bg-success-main text-white [&>svg]:text-white',
      },
      {
        variant: 'filled',
        severity: 'info',
        className: 'bg-info-main text-white [&>svg]:text-white',
      },
      {
        variant: 'filled',
        severity: 'warning',
        className: 'bg-warning-main text-gray-900 [&>svg]:text-gray-900',
      },
      {
        variant: 'filled',
        severity: 'error',
        className: 'bg-error-main text-white [&>svg]:text-white',
      },
      // Outlined variants
      {
        variant: 'outlined',
        severity: 'success',
        className: 'border-success-main text-success-darker [&>svg]:text-success-main',
      },
      {
        variant: 'outlined',
        severity: 'info',
        className: 'border-info-main text-info-darker [&>svg]:text-info-main',
      },
      {
        variant: 'outlined',
        severity: 'warning',
        className: 'border-warning-main text-warning-darker [&>svg]:text-warning-main',
      },
      {
        variant: 'outlined',
        severity: 'error',
        className: 'border-error-main text-error-darker [&>svg]:text-error-main',
      },
      // Standard variants
      {
        variant: 'standard',
        severity: 'success',
        className: 'bg-success-lighter border-success-main text-success-darker [&>svg]:text-success-main',
      },
      {
        variant: 'standard',
        severity: 'info',
        className: 'bg-info-lighter border-info-main text-info-darker [&>svg]:text-info-main',
      },
      {
        variant: 'standard',
        severity: 'warning',
        className: 'bg-warning-lighter border-warning-main text-warning-darker [&>svg]:text-warning-main',
      },
      {
        variant: 'standard',
        severity: 'error',
        className: 'bg-error-lighter border-error-main text-error-darker [&>svg]:text-error-main',
      },
    ],
    defaultVariants: {
      variant: 'standard',
      severity: 'info',
    },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  /**
   * Alert title
   */
  title?: string;
  /**
   * Custom icon
   */
  icon?: React.ReactNode;
  /**
   * Show close button
   */
  closable?: boolean;
  /**
   * Callback when close button is clicked
   */
  onClose?: () => void;
  /**
   * Action buttons
   */
  action?: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = 'standard',
      severity = 'info',
      title,
      icon,
      closable = false,
      onClose,
      action,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant, severity }), className)}
        {...props}
      >
        {icon && <div className="mt-0.5">{icon}</div>}
        
        <div className="flex-1 min-w-0">
          {title && (
            <h5 className="font-semibold mb-1 text-sm">
              {title}
            </h5>
          )}
          <div className="text-sm leading-relaxed">
            {children}
          </div>
          {action && (
            <div className="mt-3">
              {action}
            </div>
          )}
        </div>

        {closable && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Close alert"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export { Alert, alertVariants };
