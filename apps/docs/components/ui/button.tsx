import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '../../lib/utils';

/**
 * Button Component (Minimals Design System)
 * - Radius: 8px (md)
 * - Shadow: z8 for contained variant
 * - Typography: 14px bold (font-bold)
 * - Colors: 5-tone system
 */
const buttonVariants = cva(
  // Minimals base styles
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] text-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        // Contained variants (filled background) - Minimals shadow z8
        contained: 'shadow-[0_8px_16px_0_rgba(145,158,171,0.08)]',
        // Outlined variants (border only)
        outlined: 'border-2 bg-transparent shadow-none',
        // Text variants (no background or border)
        text: 'shadow-none',
        // Soft variants (light background)
        soft: 'shadow-none',
        // Legacy variants for compatibility
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 shadow-sm',
        outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      color: {
        primary: '',
        secondary: '',
        success: '',
        warning: '',
        error: '',
        info: '',
        inherit: '',
      },
      size: {
        xs: 'h-7 px-2.5 text-xs gap-1.5 rounded',
        sm: 'h-8 px-3 text-sm gap-1.5 rounded-md',
        md: 'h-9 px-4 text-sm gap-2 rounded-md',
        lg: 'h-10 px-6 text-base gap-2 rounded-md',
        xl: 'h-12 px-8 text-base gap-2.5 rounded-lg',
        // Icon sizes
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
        'icon-xl': 'size-12',
        // Legacy
        default: 'h-9 px-4 py-2',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    compoundVariants: [
      // Contained + Primary
      {
        variant: 'contained',
        color: 'primary',
        className:
          'bg-primary-main text-white hover:bg-primary-dark focus-visible:ring-primary-main/30',
      },
      // Contained + Secondary
      {
        variant: 'contained',
        color: 'secondary',
        className:
          'bg-secondary-main text-white hover:bg-secondary-dark focus-visible:ring-secondary-main/30',
      },
      // Contained + Success
      {
        variant: 'contained',
        color: 'success',
        className:
          'bg-success-main text-white hover:bg-success-dark focus-visible:ring-success-main/30',
      },
      // Contained + Warning
      {
        variant: 'contained',
        color: 'warning',
        className:
          'bg-warning-main text-gray-900 hover:bg-warning-dark focus-visible:ring-warning-main/30',
      },
      // Contained + Error
      {
        variant: 'contained',
        color: 'error',
        className: 'bg-error-main text-white hover:bg-error-dark focus-visible:ring-error-main/30',
      },
      // Contained + Info
      {
        variant: 'contained',
        color: 'info',
        className: 'bg-info-main text-white hover:bg-info-dark focus-visible:ring-info-main/30',
      },
      // Outlined + Primary
      {
        variant: 'outlined',
        color: 'primary',
        className:
          'border-primary-main text-primary-main hover:bg-primary-main/8 focus-visible:ring-primary-main/30',
      },
      // Outlined + Secondary
      {
        variant: 'outlined',
        color: 'secondary',
        className:
          'border-secondary-main text-secondary-main hover:bg-secondary-main/8 focus-visible:ring-secondary-main/30',
      },
      // Outlined + Success
      {
        variant: 'outlined',
        color: 'success',
        className:
          'border-success-main text-success-main hover:bg-success-main/8 focus-visible:ring-success-main/30',
      },
      // Outlined + Warning
      {
        variant: 'outlined',
        color: 'warning',
        className:
          'border-warning-main text-warning-main hover:bg-warning-main/8 focus-visible:ring-warning-main/30',
      },
      // Outlined + Error
      {
        variant: 'outlined',
        color: 'error',
        className:
          'border-error-main text-error-main hover:bg-error-main/8 focus-visible:ring-error-main/30',
      },
      // Outlined + Info
      {
        variant: 'outlined',
        color: 'info',
        className:
          'border-info-main text-info-main hover:bg-info-main/8 focus-visible:ring-info-main/30',
      },
      // Text + Primary
      {
        variant: 'text',
        color: 'primary',
        className: 'text-primary-main hover:bg-primary-main/8 focus-visible:ring-primary-main/30',
      },
      // Text + Secondary
      {
        variant: 'text',
        color: 'secondary',
        className:
          'text-secondary-main hover:bg-secondary-main/8 focus-visible:ring-secondary-main/30',
      },
      // Text + Success
      {
        variant: 'text',
        color: 'success',
        className: 'text-success-main hover:bg-success-main/8 focus-visible:ring-success-main/30',
      },
      // Text + Warning
      {
        variant: 'text',
        color: 'warning',
        className: 'text-warning-main hover:bg-warning-main/8 focus-visible:ring-warning-main/30',
      },
      // Text + Error
      {
        variant: 'text',
        color: 'error',
        className: 'text-error-main hover:bg-error-main/8 focus-visible:ring-error-main/30',
      },
      // Text + Info
      {
        variant: 'text',
        color: 'info',
        className: 'text-info-main hover:bg-info-main/8 focus-visible:ring-info-main/30',
      },
      // Soft + Primary
      {
        variant: 'soft',
        color: 'primary',
        className:
          'bg-primary-lighter text-primary-darker hover:bg-primary-light focus-visible:ring-primary-main/30',
      },
      // Soft + Secondary
      {
        variant: 'soft',
        color: 'secondary',
        className:
          'bg-secondary-lighter text-secondary-darker hover:bg-secondary-light focus-visible:ring-secondary-main/30',
      },
      // Soft + Success
      {
        variant: 'soft',
        color: 'success',
        className:
          'bg-success-lighter text-success-darker hover:bg-success-light focus-visible:ring-success-main/30',
      },
      // Soft + Warning
      {
        variant: 'soft',
        color: 'warning',
        className:
          'bg-warning-lighter text-warning-darker hover:bg-warning-light focus-visible:ring-warning-main/30',
      },
      // Soft + Error
      {
        variant: 'soft',
        color: 'error',
        className:
          'bg-error-lighter text-error-darker hover:bg-error-light focus-visible:ring-error-main/30',
      },
      // Soft + Info
      {
        variant: 'soft',
        color: 'info',
        className:
          'bg-info-lighter text-info-darker hover:bg-info-light focus-visible:ring-info-main/30',
      },
    ],
    defaultVariants: {
      variant: 'contained',
      color: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /**
   * Show loading spinner
   */
  loading?: boolean;
  /**
   * Icon to show at the start
   */
  startIcon?: React.ReactNode;
  /**
   * Icon to show at the end
   */
  endIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'contained',
      color = 'primary',
      size = 'md',
      fullWidth,
      asChild = false,
      loading = false,
      startIcon,
      endIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        data-slot="button"
        data-variant={variant}
        data-color={color ?? undefined}
        data-size={size}
        className={cn(buttonVariants({ variant, color, size, fullWidth, className }))}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" />}
        {!loading && startIcon}
        {children}
        {!loading && endIcon}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
