import * as React from 'react';
import { cn } from '@/lib/utils';

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Value
   */
  value: string;
  /**
   * Size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Color
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  /**
   * Label
   */
  label?: string;
}

const sizeClasses = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
};

const colorClasses = {
  primary: 'checked:bg-primary-main checked:border-primary-main',
  secondary: 'checked:bg-secondary-main checked:border-secondary-main',
  success: 'checked:bg-success-main checked:border-success-main',
  warning: 'checked:bg-warning-main checked:border-warning-main',
  error: 'checked:bg-error-main checked:border-error-main',
  info: 'checked:bg-info-main checked:border-info-main',
};

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      className,
      value,
      size = 'md',
      color = 'primary',
      label,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    // Always call useId unconditionally (React Hooks rule)
    const generatedId = React.useId();
    const inputId = id || `radio-${value}-${generatedId}`;

    const radioElement = (
      <div className="relative inline-flex items-center">
        <input
          ref={ref}
          type="radio"
          id={inputId}
          value={value}
          disabled={disabled}
          className={cn(
            'appearance-none border-2 border-gray-300 rounded-full transition-all cursor-pointer',
            'focus-visible:ring-2 focus-visible:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'checked:border-4',
            sizeClasses[size],
            colorClasses[color],
            className
          )}
          {...props}
        />
      </div>
    );

    if (!label) {
      return radioElement;
    }

    return (
      <label
        htmlFor={inputId}
        className={cn(
          'inline-flex items-center gap-2 cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {radioElement}
        <span className="text-sm text-text-primary">{label}</span>
      </label>
    );
  }
);

Radio.displayName = 'Radio';

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "onScroll"> {
  /**
   * Selected value
   */
  value?: string;
  /**
   * Default value
   */
  defaultValue?: string;
  /**
   * Callback when value changes
   */
  onChange?: (value: string) => void;
  /**
   * Name for radio group
   */
  name: string;
  /**
   * Direction
   * @default 'column'
   */
  row?: boolean;
  children: React.ReactNode;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      className,
      value,
      defaultValue,
      onChange,
      name,
      row = false,
      children,
      ...props
    },
    ref
  ) => {
    const [selectedValue, setSelectedValue] = React.useState(defaultValue || '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setSelectedValue(newValue);
      onChange?.(newValue);
    };

    return (
      <div
        ref={ref}
        role="radiogroup"
        className={cn(
          'flex gap-3',
          row ? 'flex-row' : 'flex-col',
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement<RadioProps>(child) && child.type === Radio) {
            return React.cloneElement(child as React.ReactElement<RadioProps>, {
              name,
              checked: (value ?? selectedValue) === (child.props as RadioProps).value,
              onChange: handleChange,
            });
          }
          return child;
        })}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
