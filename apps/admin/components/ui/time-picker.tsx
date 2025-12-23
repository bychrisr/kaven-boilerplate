import * as React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TimePickerProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
> {
  /**
   * Selected time
   */
  value?: string; // Format: "HH:mm"
  /**
   * Default time
   */
  defaultValue?: string;
  /**
   * Callback when time changes
   */
  onChange?: (time: string) => void;
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
   * 24-hour format
   * @default true
   */
  format24h?: boolean;
  /**
   * Full width
   */
  fullWidth?: boolean;
}

export const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(
  (
    {
      className,
      value,
      defaultValue = '12:00',
      onChange,
      label,
      error = false,
      errorMessage,
      helperText,
      format24h = true,
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const currentValue = value ?? internalValue;
    const [hours, minutes] = currentValue.split(':').map(Number);

    const handleTimeChange = (newHours: number, newMinutes: number) => {
      const formattedTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
      setInternalValue(formattedTime);
      onChange?.(formattedTime);
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

    const hourOptions = format24h
      ? Array.from({ length: 24 }, (_, i) => i)
      : Array.from({ length: 12 }, (_, i) => i + 1);
    const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

    return (
      <div className={cn('relative', fullWidth && 'w-full', className)} ref={containerRef}>
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

        <div className="relative">
          <input
            ref={ref}
            type="text"
            value={currentValue}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            readOnly
            disabled={disabled}
            className={cn(
              'w-full h-9 px-4 pr-10 text-base border-2 rounded-md transition-all cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-primary-main/20',
              error ? 'border-error-main' : 'border-gray-300 hover:border-gray-400',
              disabled && 'opacity-50 cursor-not-allowed',
              isOpen && 'border-primary-main'
            )}
            {...props}
          />
          <Clock className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-text-secondary pointer-events-none" />
        </div>

        {isOpen && (
          <div className="absolute z-dropdown mt-1 bg-background-paper border border-divider rounded-lg shadow-lg p-4 flex gap-4">
            {/* Hours */}
            <div className="flex flex-col">
              <div className="text-xs font-medium text-text-secondary mb-2 text-center">Horas</div>
              <div className="h-48 overflow-y-auto scrollbar-thin">
                {hourOptions.map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => handleTimeChange(hour, minutes)}
                    className={cn(
                      'w-12 py-1.5 text-sm rounded hover:bg-action-hover transition-colors',
                      hours === hour && 'bg-primary-main text-white hover:bg-primary-dark'
                    )}
                  >
                    {String(hour).padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>

            {/* Minutes */}
            <div className="flex flex-col">
              <div className="text-xs font-medium text-text-secondary mb-2 text-center">
                Minutos
              </div>
              <div className="h-48 overflow-y-auto scrollbar-thin">
                {minuteOptions
                  .filter((m) => m % 5 === 0)
                  .map((minute) => (
                    <button
                      key={minute}
                      type="button"
                      onClick={() => handleTimeChange(hours, minute)}
                      className={cn(
                        'w-12 py-1.5 text-sm rounded hover:bg-action-hover transition-colors',
                        minutes === minute && 'bg-primary-main text-white hover:bg-primary-dark'
                      )}
                    >
                      {String(minute).padStart(2, '0')}
                    </button>
                  ))}
              </div>
            </div>
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
);

TimePicker.displayName = 'TimePicker';
