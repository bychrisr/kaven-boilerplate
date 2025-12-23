import * as React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * Current value
   */
  value?: number;
  /**
   * Default value
   */
  defaultValue?: number;
  /**
   * Callback when value changes
   */
  onChange?: (value: number) => void;
  /**
   * Maximum rating
   * @default 5
   */
  max?: number;
  /**
   * Precision (0.5 for half stars, 1 for full stars)
   * @default 1
   */
  precision?: 0.5 | 1;
  /**
   * Size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Read only
   */
  readOnly?: boolean;
  /**
   * Disabled
   */
  disabled?: boolean;
  /**
   * Show empty icon
   */
  emptyIcon?: React.ReactNode;
  /**
   * Show filled icon
   */
  icon?: React.ReactNode;
}

const sizeClasses = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
};

export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      className,
      value,
      defaultValue = 0,
      onChange,
      max = 5,
      precision = 1,
      size = 'md',
      readOnly = false,
      disabled = false,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      emptyIcon: _emptyIcon,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      icon: _icon,
      ...props
    },
    ref
  ) => {
    const [hoverValue, setHoverValue] = React.useState<number | null>(null);
    const [internalValue, setInternalValue] = React.useState(defaultValue);

    const currentValue = value ?? internalValue;
    const displayValue = hoverValue ?? currentValue;

    const handleClick = (newValue: number) => {
      if (readOnly || disabled) return;
      setInternalValue(newValue);
      onChange?.(newValue);
    };

    const handleMouseEnter = (newValue: number) => {
      if (readOnly || disabled) return;
      setHoverValue(newValue);
    };

    const handleMouseLeave = () => {
      setHoverValue(null);
    };

    return (
      <div
        ref={ref}
        role="group"
        aria-label="Rating"
        className={cn('inline-flex items-center gap-0.5', className)}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {Array.from({ length: max }, (_, index) => {
          const starValue = index + 1;
          const filled = displayValue >= starValue;
          const halfFilled =
            precision === 0.5 && displayValue >= starValue - 0.5 && displayValue < starValue;

          return (
            <button
              key={index}
              type="button"
              aria-label={`Rate ${starValue} stars`}
              aria-pressed={hoverValue ? hoverValue >= starValue : (value || 0) >= starValue}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseMove={(e) => {
                if (precision === 0.5 && !readOnly && !disabled) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const isHalf = e.clientX - rect.left < rect.width / 2;
                  handleMouseEnter(isHalf ? starValue - 0.5 : starValue);
                }
              }}
              onClick={() => handleClick(starValue)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClick(starValue);
                }
              }}
              className={cn(
                'transition-transform',
                !readOnly && !disabled && 'cursor-pointer hover:scale-110',
                disabled && 'cursor-not-allowed opacity-50',
                readOnly && 'cursor-default'
              )}
            >
              {halfFilled ? (
                <div className="relative">
                  <Star className={cn(sizeClasses[size], 'text-gray-300')} />
                  <StarHalf
                    className={cn(
                      sizeClasses[size],
                      'absolute top-0 left-0 text-warning-main fill-warning-main'
                    )}
                  />
                </div>
              ) : (
                <Star
                  className={cn(
                    sizeClasses[size],
                    filled ? 'text-warning-main fill-warning-main' : 'text-gray-300'
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    );
  }
);

Rating.displayName = 'Rating';
