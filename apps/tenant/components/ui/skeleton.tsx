import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Variant
   * @default 'rectangular'
   */
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  /**
   * Width
   */
  width?: number | string;
  /**
   * Height
   */
  height?: number | string;
  /**
   * Animation
   * @default 'pulse'
   */
  animation?: 'pulse' | 'wave' | false;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    { className, variant = 'rectangular', width, height, animation = 'pulse', style, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-gray-200 dark:bg-gray-700',
          {
            'rounded-full': variant === 'circular',
            'rounded-md': variant === 'rounded',
            'rounded-sm': variant === 'rectangular',
            'rounded h-4': variant === 'text',
            'animate-pulse': animation === 'pulse',
            'animate-shimmer': animation === 'wave',
          },
          className
        )}
        style={{
          width,
          height: variant === 'text' ? undefined : height,
          ...style,
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
