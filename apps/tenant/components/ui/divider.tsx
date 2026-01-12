import * as React from 'react';
import { cn } from '@/lib/utils';

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  /**
   * Orientation
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Text content
   */
  children?: React.ReactNode;
  /**
   * Text alignment
   * @default 'center'
   */
  textAlign?: 'left' | 'center' | 'right';
  /**
   * Variant
   * @default 'fullWidth'
   */
  variant?: 'fullWidth' | 'inset' | 'middle';
  /**
   * Light color
   */
  light?: boolean;
}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  (
    {
      className,
      orientation = 'horizontal',
      children,
      textAlign = 'center',
      variant = 'fullWidth',
      light = false,
      ...props
    },
    ref
  ) => {
    if (children && orientation === 'horizontal') {
      return (
        <div
          className={cn(
            'flex items-center gap-4 text-sm text-text-secondary',
            {
              'my-4': variant === 'fullWidth',
              'my-4 mx-4': variant === 'inset',
              'my-4 mx-8': variant === 'middle',
            },
            className
          )}
        >
          {textAlign !== 'left' && (
            <hr
              className={cn(
                'flex-1 border-0 border-t',
                light ? 'border-gray-200' : 'border-divider'
              )}
            />
          )}
          <span className="shrink-0">{children}</span>
          {textAlign !== 'right' && (
            <hr
              className={cn(
                'flex-1 border-0 border-t',
                light ? 'border-gray-200' : 'border-divider'
              )}
            />
          )}
        </div>
      );
    }

    if (orientation === 'vertical') {
      return (
        <hr
          ref={ref}
          className={cn(
            'border-0 border-l',
            light ? 'border-gray-200' : 'border-divider',
            'h-full',
            className
          )}
          {...props}
        />
      );
    }

    return (
      <hr
        ref={ref}
        className={cn(
          'border-0 border-t',
          light ? 'border-gray-200' : 'border-divider',
          {
            'my-4': variant === 'fullWidth',
            'my-4 mx-4': variant === 'inset',
            'my-4 mx-8': variant === 'middle',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';
