import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Checked state
   */
  checked?: boolean;
  /**
   * Default checked
   */
  defaultChecked?: boolean;
  /**
   * Callback when changed
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * Size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Label
   */
  label?: string;
  /**
   * Label placement
   * @default 'end'
   */
  labelPlacement?: 'start' | 'end' | 'top' | 'bottom';
}

const sizeClasses = {
  sm: {
    track: 'w-9 h-5',
    thumb: 'size-4',
    translate: 'translate-x-4',
  },
  md: {
    track: 'w-11 h-6',
    thumb: 'size-5',
    translate: 'translate-x-5',
  },
  lg: {
    track: 'w-14 h-7',
    thumb: 'size-6',
    translate: 'translate-x-7',
  },
};

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      checked,
      defaultChecked,
      onChange,
      size = 'md',
      label,
      labelPlacement = 'end',
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    // Always call useId unconditionally (React Hooks rule)
    const generatedId = React.useId();
    const inputId = id || `switch-${generatedId}`;

    const switchElement = (
      <label
        htmlFor={inputId}
        className={cn(
          'relative inline-flex items-center cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />
        <div
          className={cn(
            'relative rounded-full transition-colors',
            sizeClasses[size].track,
            'bg-gray-600 peer-checked:bg-primary-main',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-primary-main/30'
          )}
        >
          <div
            className={cn(
              'absolute top-0.5 left-0.5 bg-white rounded-full transition-transform',
              sizeClasses[size].thumb,
              checked && sizeClasses[size].translate
            )}
          />
        </div>
      </label>
    );

    if (!label) {
      return switchElement;
    }

    return (
      <div
        className={cn(
          'inline-flex items-center gap-2',
          {
            'flex-row': labelPlacement === 'end',
            'flex-row-reverse': labelPlacement === 'start',
            'flex-col': labelPlacement === 'bottom',
            'flex-col-reverse': labelPlacement === 'top',
          },
          className
        )}
      >
        {switchElement}
        <span className="text-sm text-text-primary">{label}</span>
      </div>
    );
  }
);

Switch.displayName = 'Switch';
