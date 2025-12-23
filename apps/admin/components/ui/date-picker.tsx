import * as React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DatePickerProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'defaultValue'
> {
  /**
   * Selected date
   */
  value?: Date;
  /**
   * Default date
   */
  defaultValue?: Date;
  /**
   * Callback when date changes
   */
  onChange?: (date: Date | null) => void;
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
   * Min date
   */
  minDate?: Date;
  /**
   * Max date
   */
  maxDate?: Date;
  /**
   * Disabled dates
   */
  disabledDates?: Date[];
  /**
   * Full width
   */
  fullWidth?: boolean;
}

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      className,
      value,
      defaultValue,
      onChange,
      label,
      error = false,
      errorMessage,
      helperText,
      minDate,
      maxDate,
      disabledDates = [],
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<Date | null>(defaultValue || null);
    const [isOpen, setIsOpen] = React.useState(false);
    const [viewDate, setViewDate] = React.useState(value || defaultValue || new Date());
    const containerRef = React.useRef<HTMLDivElement>(null);

    const currentValue = value ?? internalValue;

    const handleDateSelect = (date: Date) => {
      setInternalValue(date);
      onChange?.(date);
      setIsOpen(false);
    };

    const isDateDisabled = (date: Date) => {
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      return disabledDates.some(
        (d) =>
          d.getDate() === date.getDate() &&
          d.getMonth() === date.getMonth() &&
          d.getFullYear() === date.getFullYear()
      );
    };

    const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      const days: (Date | null)[] = [];

      // Add empty cells for days before month starts
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
      }

      // Add days of month
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
      }

      return days;
    };

    const formatDate = (date: Date | null) => {
      if (!date) return '';
      return date.toLocaleDateString('pt-BR');
    };

    const previousMonth = () => {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1));
    };

    const nextMonth = () => {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1));
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

    const days = getDaysInMonth(viewDate);

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
            value={formatDate(currentValue)}
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
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-text-secondary pointer-events-none" />
        </div>

        {isOpen && (
          <div className="absolute z-dropdown mt-1 bg-background-paper border border-divider rounded-lg shadow-lg p-4 min-w-[280px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={previousMonth}
                className="p-1 hover:bg-action-hover rounded"
              >
                <ChevronLeft className="size-5" />
              </button>
              <div className="font-semibold">
                {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
              </div>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1 hover:bg-action-hover rounded"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-text-secondary p-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} />;
                }

                const isSelected =
                  currentValue &&
                  day.getDate() === currentValue.getDate() &&
                  day.getMonth() === currentValue.getMonth() &&
                  day.getFullYear() === currentValue.getFullYear();

                const isToday =
                  day.getDate() === new Date().getDate() &&
                  day.getMonth() === new Date().getMonth() &&
                  day.getFullYear() === new Date().getFullYear();

                const disabled = isDateDisabled(day);

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => !disabled && handleDateSelect(day)}
                    disabled={disabled}
                    className={cn(
                      'p-2 text-sm rounded hover:bg-action-hover transition-colors',
                      isSelected && 'bg-primary-main text-white hover:bg-primary-dark',
                      isToday && !isSelected && 'border border-primary-main',
                      disabled && 'opacity-30 cursor-not-allowed hover:bg-transparent'
                    )}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
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

DatePicker.displayName = 'DatePicker';
