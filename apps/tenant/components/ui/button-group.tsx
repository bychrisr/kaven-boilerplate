import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonGroupVariants = cva('inline-flex', {
  variants: {
    variant: {
      contained: '',
      outlined: '',
      text: '',
    },
    color: {
      primary: '',
      secondary: '',
      success: '',
      error: '',
      info: '',
      warning: '',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    },
  },
  defaultVariants: {
    variant: 'outlined',
    color: 'primary',
    size: 'md',
    orientation: 'horizontal',
  },
});

export interface ButtonGroupProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof buttonGroupVariants> {
  /**
   * Disable elevation
   */
  disableElevation?: boolean;
  /**
   * Full width
   */
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      className,
      variant = 'outlined',
      color = 'primary',
      size = 'md',
      orientation = 'horizontal',
      disableElevation = false,
      fullWidth = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          buttonGroupVariants({ variant, color, size, orientation }),
          fullWidth && 'w-full',
          !disableElevation && variant === 'contained' && 'shadow-sm',
          orientation === 'horizontal' &&
            '[&>button]:rounded-none [&>button:first-child]:rounded-l-md [&>button:last-child]:rounded-r-md',
          orientation === 'vertical' &&
            '[&>button]:rounded-none [&>button:first-child]:rounded-t-md [&>button:last-child]:rounded-b-md',
          orientation === 'horizontal' &&
            variant === 'outlined' &&
            '[&>button:not(:first-child)]:-ml-px',
          orientation === 'vertical' &&
            variant === 'outlined' &&
            '[&>button:not(:first-child)]:-mt-px',
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(
              child as React.ReactElement<{
                variant?: string | null;
                color?: string | null;
                size?: string | null;
                orientation?: string | null;
              }>,
              {
                variant,
                color,
                size,
              }
            );
          }
          return child;
        })}
      </div>
    );
  }
);

ButtonGroup.displayName = 'ButtonGroup';
