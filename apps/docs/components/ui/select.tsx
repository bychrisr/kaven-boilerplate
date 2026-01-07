'use client';

import * as React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectProps<T = string> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /**
   * Selected value
   */
  value?: T;
  /**
   * Default value
   */
  defaultValue?: T;
  /**
   * Callback when value changes
   */
  onChange?: (value: T) => void;
  /**
   * Placeholder
   */
  placeholder?: string;
  /**
   * Label
   */
  label?: string;
  /**
   * Error state
   */
  error?: boolean;
  /**
   * Error message
   */
  errorMessage?: string;
  /**
   * Helper text
   */
  helperText?: string;
  /**
   * Disabled
   */
  disabled?: boolean;
  /**
   * Full width
   */
  fullWidth?: boolean;
  /**
   * Size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Children (SelectOption components)
   */
  children: React.ReactNode;
}

export function Select<T = string>({
  value,
  defaultValue,
  onChange,
  placeholder = 'Select...',
  label,
  error = false,
  errorMessage,
  helperText,
  disabled = false,
  fullWidth = false,
  size = 'md',
  className,
  children,
  ...props
}: SelectProps<T>) {
  const [internalValue, setInternalValue] = React.useState<T | undefined>(defaultValue);
  const [isOpen, setIsOpen] = React.useState(false);
  const selectRef = React.useRef<HTMLDivElement>(null);

  const currentValue = value ?? internalValue;

  const options = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<SelectOptionProps<T>> =>
      React.isValidElement(child) && child.type === SelectOption
  );

  const selectedOption = options.find((option) => option.props.value === currentValue);

  const handleSelect = (newValue: T) => {
    setInternalValue(newValue);
    onChange?.(newValue);
    setIsOpen(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  return (
    <div className={cn('relative', fullWidth && 'w-full', className)} ref={selectRef} {...props}>
      {label && (
        <label
          className={cn(
            'block text-sm font-medium mb-1.5',
            error ? 'text-error-main' : 'text-text-primary'
          )}
        >
          {label}
        </label>
      )}

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!disabled) setIsOpen(!isOpen);
          }
        }}
        className={cn(
          'flex items-center justify-between w-full border-2 rounded-md transition-all cursor-pointer',
          'bg-[var(--background-paper)] text-[var(--text-primary)]',
          'focus:outline-none focus:ring-2 focus:ring-primary-main/20',
          sizeClasses[size],
          error ? 'border-error-main' : 'border-gray-700 hover:border-gray-600',
          disabled && 'opacity-50 cursor-not-allowed',
          isOpen && 'border-primary-main'
        )}
      >
        <span className={cn(!selectedOption && 'text-[var(--text-disabled)]')}>
          {selectedOption?.props.children || placeholder}
        </span>
        <ChevronDown className={cn('size-4 transition-transform text-[var(--text-secondary)]', isOpen && 'rotate-180')} />
      </div>

      {isOpen && (
        <div className="absolute z-dropdown w-full mt-1 bg-[var(--background-paper)] border border-[var(--divider)] rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option, index) => (
            <div
              key={index}
              role="option"
              aria-selected={option.props.value === currentValue}
              onClick={() => handleSelect(option.props.value)}
              className={cn(
                'flex items-center justify-between px-4 py-2 cursor-pointer transition-colors text-[var(--text-primary)]',
                'hover:bg-[var(--action-hover)]',
                option.props.value === currentValue && 'bg-[var(--action-selected)]'
              )}
            >
              <span>{option.props.children}</span>
              {option.props.value === currentValue && (
                <Check className="size-4 text-primary-main" />
              )}
            </div>
          ))}
        </div>
      )}

      {(errorMessage || helperText) && (
        <p className={cn('text-xs mt-1.5', error ? 'text-error-main' : 'text-text-secondary')}>
          {errorMessage || helperText}
        </p>
      )}
    </div>
  );
}

Select.displayName = 'Select';

export interface SelectOptionProps<T = string> {
  value: T;
  children: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SelectOption<T = string>(_props: SelectOptionProps<T>) {
  return null;
}

SelectOption.displayName = 'SelectOption';
