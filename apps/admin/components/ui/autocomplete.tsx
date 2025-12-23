import * as React from 'react';
import { X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AutocompleteOption<T = unknown> {
  label: string;
  value: T;
}

export interface AutocompleteProps<T = unknown>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue'> {
  /**
   * Options array
   */
  options: AutocompleteOption<T>[];
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
  onChange?: (value: T | null) => void;
  /**
   * Label
   */
  label?: string;
  /**
   * Placeholder
   */
  placeholder?: string;
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
   * Full width
   */
  fullWidth?: boolean;
  /**
   * Multiple selection
   */
  multiple?: boolean;
  /**
   * Free solo (allow custom values)
   */
  freeSolo?: boolean;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * No options text
   */
  noOptionsText?: string;
}

export function Autocomplete<T = unknown>({
  options,
  value,
  defaultValue,
  onChange,
  label,
  placeholder = 'Search...',
  error = false,
  errorMessage,
  helperText,
  fullWidth = false,
  multiple = false,
  freeSolo = false,
  loading = false,
  noOptionsText = 'No options',
  disabled,
  className,
  ...props
}: AutocompleteProps<T>) {
  const [internalValue, setInternalValue] = React.useState<T | null>(defaultValue ?? null);
  const [inputValue, setInputValue] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const currentValue = value ?? internalValue;

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const selectedOption = options.find((opt) => opt.value === currentValue);

  const handleSelect = (option: AutocompleteOption<T>) => {
    setInternalValue(option.value);
    setInputValue(option.label);
    onChange?.(option.value);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setInternalValue(null);
    setInputValue('');
    onChange?.(null);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOptions[highlightedIndex]) {
        handleSelect(filteredOptions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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

  React.useEffect(() => {
    if (selectedOption && !inputValue) {
      setInputValue(selectedOption.label);
    }
  }, [selectedOption, inputValue]);

  return (
    <div className={cn('relative', fullWidth && 'w-full', className)} ref={containerRef}>
      {label && (
        <label className={cn('block text-sm font-medium mb-1.5', error ? 'text-error-main' : 'text-text-primary')}>
          {label}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full h-9 px-4 pr-10 text-base border-2 rounded-md transition-all',
            'focus:outline-none focus:ring-2 focus:ring-primary-main/20',
            error ? 'border-error-main' : 'border-gray-300 hover:border-gray-400',
            disabled && 'opacity-50 cursor-not-allowed',
            isOpen && 'border-primary-main'
          )}
          {...props}
        />

        {inputValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-dropdown w-full mt-1 bg-background-paper border border-divider rounded-md shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="px-4 py-2 text-sm text-text-secondary">Loading...</div>
          ) : filteredOptions.length === 0 ? (
            <div className="px-4 py-2 text-sm text-text-secondary">{noOptionsText}</div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                role="option"
                aria-selected={option.value === currentValue}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={cn(
                  'flex items-center justify-between px-4 py-2 cursor-pointer transition-colors',
                  'hover:bg-action-hover',
                  highlightedIndex === index && 'bg-action-hover',
                  option.value === currentValue && 'bg-action-selected'
                )}
              >
                <span>{option.label}</span>
                {option.value === currentValue && <Check className="size-4 text-primary-main" />}
              </div>
            ))
          )}
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

Autocomplete.displayName = 'Autocomplete';
