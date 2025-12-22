import * as React from 'react';
import { cn } from '@/lib/utils';

export interface PaperProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Elevation
   * @default 1
   */
  elevation?: number;
  /**
   * Variant
   * @default 'elevation'
   */
  variant?: 'elevation' | 'outlined';
  /**
   * Square corners
   */
  square?: boolean;
  children: React.ReactNode;
}

export const Paper = React.forwardRef<HTMLDivElement, PaperProps>(
  ({ className, elevation = 1, variant = 'elevation', square = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-background-paper',
          !square && 'rounded-lg',
          variant === 'elevation' && elevation > 0 && `shadow-${elevation}`,
          variant === 'outlined' && 'border border-divider',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Paper.displayName = 'Paper';
