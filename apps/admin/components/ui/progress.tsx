import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LinearProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Progress value (0-100)
   */
  value?: number;
  /**
   * Variant
   */
  variant?: 'determinate' | 'indeterminate' | 'buffer' | 'query';
  /**
   * Buffer value for buffer variant
   */
  valueBuffer?: number;
  /**
   * Color
   */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

const colorClasses = {
  primary: 'bg-primary-main',
  secondary: 'bg-secondary-main',
  success: 'bg-success-main',
  warning: 'bg-warning-main',
  error: 'bg-error-main',
  info: 'bg-info-main',
};

export const LinearProgress = React.forwardRef<HTMLDivElement, LinearProgressProps>(
  (
    {
      className,
      value = 0,
      variant = 'determinate',
      valueBuffer = 100,
      color = 'primary',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={variant === 'determinate' ? value : undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn('relative h-1 w-full overflow-hidden rounded-full bg-gray-200', className)}
        {...props}
      >
        {variant === 'indeterminate' && (
          <div
            className={cn(
              'absolute h-full w-full origin-left animate-[progress-indeterminate_2s_ease-in-out_infinite]',
              colorClasses[color]
            )}
            style={{
              animationTimingFunction: 'cubic-bezier(0.65, 0.815, 0.735, 0.395)',
            }}
          />
        )}

        {variant === 'determinate' && (
          <div
            className={cn('h-full transition-all duration-300', colorClasses[color])}
            style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          />
        )}

        {variant === 'buffer' && (
          <>
            <div
              className="absolute h-full bg-gray-300 transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, valueBuffer))}%` }}
            />
            <div
              className={cn('absolute h-full transition-all duration-300', colorClasses[color])}
              style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
            />
          </>
        )}
      </div>
    );
  }
);

LinearProgress.displayName = 'LinearProgress';

export interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Progress value (0-100)
   */
  value?: number;
  /**
   * Variant
   */
  variant?: 'determinate' | 'indeterminate';
  /**
   * Size in pixels
   */
  size?: number;
  /**
   * Thickness (stroke width)
   */
  thickness?: number;
  /**
   * Color
   */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

const strokeColorClasses = {
  primary: 'stroke-primary-main',
  secondary: 'stroke-secondary-main',
  success: 'stroke-success-main',
  warning: 'stroke-warning-main',
  error: 'stroke-error-main',
  info: 'stroke-info-main',
};

export const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  (
    {
      className,
      value = 0,
      variant = 'indeterminate',
      size = 40,
      thickness = 3.6,
      color = 'primary',
      ...props
    },
    ref
  ) => {
    const circumference = 2 * Math.PI * ((size - thickness) / 2);
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={variant === 'determinate' ? value : undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn('inline-block', className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          className={cn(variant === 'indeterminate' && 'animate-spin')}
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            className="stroke-gray-200"
            cx={size / 2}
            cy={size / 2}
            r={(size - thickness) / 2}
            fill="none"
            strokeWidth={thickness}
          />
          <circle
            className={cn(strokeColorClasses[color], 'transition-all duration-300')}
            cx={size / 2}
            cy={size / 2}
            r={(size - thickness) / 2}
            fill="none"
            strokeWidth={thickness}
            strokeDasharray={circumference}
            strokeDashoffset={variant === 'determinate' ? strokeDashoffset : circumference * 0.25}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
      </div>
    );
  }
);

CircularProgress.displayName = 'CircularProgress';
