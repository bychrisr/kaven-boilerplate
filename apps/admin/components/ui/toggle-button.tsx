import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const toggleButtonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all border-2',
  {
    variants: {
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-5 text-lg',
      },
      color: {
        standard: '',
        primary: '',
        secondary: '',
        success: '',
        error: '',
        info: '',
        warning: '',
      },
    },
    defaultVariants: {
      size: 'md',
      color: 'standard',
    },
  }
);

export interface ToggleButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    VariantProps<typeof toggleButtonVariants> {
  /**
   * Selected state
   */
  selected?: boolean;
  /**
   * Value
   */
  value: string | number;
}

const colorClasses = {
  standard: {
    default: 'border-gray-300 text-text-primary hover:bg-action-hover',
    selected: 'border-primary-main bg-primary-main/10 text-primary-main',
  },
  primary: {
    default: 'border-primary-main text-primary-main hover:bg-primary-main/10',
    selected: 'border-primary-main bg-primary-main text-white',
  },
  secondary: {
    default: 'border-secondary-main text-secondary-main hover:bg-secondary-main/10',
    selected: 'border-secondary-main bg-secondary-main text-white',
  },
  success: {
    default: 'border-success-main text-success-main hover:bg-success-main/10',
    selected: 'border-success-main bg-success-main text-white',
  },
  error: {
    default: 'border-error-main text-error-main hover:bg-error-main/10',
    selected: 'border-error-main bg-error-main text-white',
  },
  info: {
    default: 'border-info-main text-info-main hover:bg-info-main/10',
    selected: 'border-info-main bg-info-main text-white',
  },
  warning: {
    default: 'border-warning-main text-warning-main hover:bg-warning-main/10',
    selected: 'border-warning-main bg-warning-main text-gray-900',
  },
};

export const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  ({ className, size = 'md', color = 'standard', selected = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={selected}
        className={cn(
          toggleButtonVariants({ size }),
          color && colorClasses[color]?.[selected ? 'selected' : 'default'],
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ToggleButton.displayName = 'ToggleButton';

export interface ToggleButtonGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * Selected value(s)
   */
  value?: string | number | (string | number)[];
  /**
   * Callback when value changes
   */
  onChange?: (value: string | number | (string | number)[]) => void;
  /**
   * Allow multiple selection
   */
  exclusive?: boolean;
  /**
   * Size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Color
   */
  color?: 'standard' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  /**
   * Orientation
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Full width
   */
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const ToggleButtonGroup = React.forwardRef<HTMLDivElement, ToggleButtonGroupProps>(
  (
    {
      className,
      value,
      onChange,
      exclusive = true,
      size = 'md',
      color = 'standard',
      orientation = 'horizontal',
      fullWidth = false,
      children,
      ...props
    },
    ref
  ) => {
    const handleClick = (buttonValue: string | number) => {
      if (!onChange) return;

      if (exclusive) {
        onChange(buttonValue);
      } else {
        const currentValues = Array.isArray(value) ? value : value ? [value] : [];
        const newValues = currentValues.includes(buttonValue)
          ? currentValues.filter((v) => v !== buttonValue)
          : [...currentValues, buttonValue];
        onChange(newValues);
      }
    };

    const isSelected = (buttonValue: string | number) => {
      if (Array.isArray(value)) {
        return value.includes(buttonValue);
      }
      return value === buttonValue;
    };

    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          'inline-flex',
          orientation === 'horizontal' ? 'flex-row' : 'flex-col',
          fullWidth && 'w-full',
          orientation === 'horizontal' && '[&>button]:rounded-none [&>button:first-child]:rounded-l-md [&>button:last-child]:rounded-r-md [&>button:not(:first-child)]:-ml-0.5',
          orientation === 'vertical' && '[&>button]:rounded-none [&>button:first-child]:rounded-t-md [&>button:last-child]:rounded-b-md [&>button:not(:first-child)]:-mt-0.5',
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement<ToggleButtonProps>(child) && child.type === ToggleButton) {
            return React.cloneElement(child as React.ReactElement<ToggleButtonProps>, {
              size,
              color,
              selected: isSelected((child.props as ToggleButtonProps).value),
              onClick: () => handleClick((child.props as ToggleButtonProps).value),
            });
          }
          return child;
        })}
      </div>
    );
  }
);

ToggleButtonGroup.displayName = 'ToggleButtonGroup';
