'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const chipVariants = cva(
  'inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition-all',
  {
    variants: {
      variant: {
        filled: '',
        outlined: 'border-2 bg-transparent',
        soft: '',
      },
      color: {
        default: '',
        primary: '',
        secondary: '',
        success: '',
        warning: '',
        error: '',
        info: '',
      },
      size: {
        sm: 'h-6 px-2 text-xs',
        md: 'h-7 px-2.5 text-sm',
        lg: 'h-8 px-3 text-sm',
      },
    },
    compoundVariants: [
      // Filled variants
      { variant: 'filled', color: 'default', className: 'bg-gray-600 text-white' },
      { variant: 'filled', color: 'primary', className: 'bg-primary-main text-white' },
      { variant: 'filled', color: 'secondary', className: 'bg-secondary-main text-white' },
      { variant: 'filled', color: 'success', className: 'bg-success-main text-white' },
      { variant: 'filled', color: 'warning', className: 'bg-warning-main text-gray-900' },
      { variant: 'filled', color: 'error', className: 'bg-error-main text-white' },
      { variant: 'filled', color: 'info', className: 'bg-info-main text-white' },
      // Outlined variants
      { variant: 'outlined', color: 'default', className: 'border-gray-600 text-gray-600' },
      { variant: 'outlined', color: 'primary', className: 'border-primary-main text-primary-main' },
      {
        variant: 'outlined',
        color: 'secondary',
        className: 'border-secondary-main text-secondary-main',
      },
      { variant: 'outlined', color: 'success', className: 'border-success-main text-success-main' },
      { variant: 'outlined', color: 'warning', className: 'border-warning-main text-warning-main' },
      { variant: 'outlined', color: 'error', className: 'border-error-main text-error-main' },
      { variant: 'outlined', color: 'info', className: 'border-info-main text-info-main' },
      // Soft variants
      { variant: 'soft', color: 'default', className: 'bg-gray-200 text-gray-800' },
      { variant: 'soft', color: 'primary', className: 'bg-primary-lighter text-primary-darker' },
      {
        variant: 'soft',
        color: 'secondary',
        className: 'bg-secondary-lighter text-secondary-darker',
      },
      { variant: 'soft', color: 'success', className: 'bg-success-lighter text-success-darker' },
      { variant: 'soft', color: 'warning', className: 'bg-warning-lighter text-warning-darker' },
      { variant: 'soft', color: 'error', className: 'bg-error-lighter text-error-darker' },
      { variant: 'soft', color: 'info', className: 'bg-info-lighter text-info-darker' },
    ],
    defaultVariants: {
      variant: 'filled',
      color: 'default',
      size: 'md',
    },
  }
);

export interface ChipProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>, VariantProps<typeof chipVariants> {
  /**
   * Avatar or icon at the start
   */
  avatar?: React.ReactNode;
  /**
   * Icon at the start
   */
  icon?: React.ReactNode;
  /**
   * Label text
   */
  label?: string;
  /**
   * Deletable chip
   */
  onDelete?: () => void;
  /**
   * Clickable chip
   */
  onClick?: () => void;
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      className,
      variant = 'filled',
      color = 'default',
      size = 'md',
      avatar,
      icon,
      label,
      onDelete,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const isClickable = Boolean(onClick);
    const isDeletable = Boolean(onDelete);

    return (
      <div
        ref={ref}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onClick={onClick}
        className={cn(
          chipVariants({ variant, color, size }),
          isClickable && 'cursor-pointer hover:opacity-80',
          className
        )}
        {...props}
      >
        {avatar && <div className="shrink-0 -ml-1">{avatar}</div>}
        {icon && <div className="shrink-0">{icon}</div>}
        <span className="truncate">{label || children}</span>
        {isDeletable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="shrink-0 -mr-1 hover:opacity-70 transition-opacity"
            aria-label="Delete"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
    );
  }
);

Chip.displayName = 'Chip';

export { Chip, chipVariants };
