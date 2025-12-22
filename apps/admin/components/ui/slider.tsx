import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange' | 'onScroll' | 'defaultValue' | 'value'> {
  /**
   * Current value
   */
  value?: number | number[];
  /**
   * Default value
   */
  defaultValue?: number | number[];
  /**
   * Callback when value changes
   */
  onChange?: (value: number | number[]) => void;
  /**
   * Minimum value
   * @default 0
   */
  min?: number;
  /**
   * Maximum value
   * @default 100
   */
  max?: number;
  /**
   * Step increment
   * @default 1
   */
  step?: number;
  /**
   * Show marks
   */
  marks?: boolean | Array<{ value: number; label?: string }>;
  /**
   * Show value label
   */
  valueLabelDisplay?: 'on' | 'auto' | 'off';
  /**
   * Color
   * @default 'primary'
   */
  color?: 'primary' | 'secondary';
  /**
   * Size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Orientation
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
}

const colorClasses = {
  primary: 'bg-primary-main',
  secondary: 'bg-secondary-main',
};

const sizeClasses = {
  sm: { track: 'h-1', thumb: 'size-3' },
  md: { track: 'h-1.5', thumb: 'size-4' },
  lg: { track: 'h-2', thumb: 'size-5' },
};

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      value,
      defaultValue = 0,
      onChange,
      min = 0,
      max = 100,
      step = 1,
      marks = false,
      valueLabelDisplay = 'auto',
      color = 'primary',
      size = 'md',
      orientation = 'horizontal',
      disabled,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      (value ?? defaultValue) as number
    );
    const [isDragging, setIsDragging] = React.useState(false);

    const currentValue = value ?? internalValue;
    const percentage = ((currentValue as number - min) / (max - min)) * 100;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      setInternalValue(newValue);
      onChange?.(newValue);
    };

    return (
      <div
        className={cn(
          'relative flex items-center',
          orientation === 'vertical' ? 'h-48 w-8' : 'w-full h-8',
          className
        )}
      >
        {/* Track */}
        <div
          className={cn(
            'absolute bg-gray-200 rounded-full',
            orientation === 'vertical'
              ? `w-${sizeClasses[size].track.replace('h-', '')} h-full`
              : `${sizeClasses[size].track} w-full`
          )}
        >
          {/* Filled track */}
          <div
            className={cn(
              'absolute rounded-full',
              colorClasses[color],
              orientation === 'vertical'
                ? `w-full bottom-0`
                : `h-full left-0`,
              sizeClasses[size].track
            )}
            style={
              orientation === 'vertical'
                ? { height: `${percentage}%` }
                : { width: `${percentage}%` }
            }
          />
        </div>

        {/* Input */}
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue as number}
          onChange={handleChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          disabled={disabled}
          className="absolute w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          {...props}
        />

        {/* Thumb */}
        <div
          className={cn(
            'absolute rounded-full bg-white border-2 shadow-md transition-transform',
            colorClasses[color].replace('bg-', 'border-'),
            sizeClasses[size].thumb,
            isDragging && 'scale-125',
            disabled && 'opacity-50'
          )}
          style={
            orientation === 'vertical'
              ? { bottom: `calc(${percentage}% - ${sizeClasses[size].thumb.split('-')[1]}px / 2)` }
              : { left: `calc(${percentage}% - ${sizeClasses[size].thumb.split('-')[1]}px / 2)` }
          }
        >
          {/* Value label */}
          {(valueLabelDisplay === 'on' || (valueLabelDisplay === 'auto' && isDragging)) && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
              {currentValue}
            </div>
          )}
        </div>

        {/* Marks */}
        {marks && Array.isArray(marks) && (
          <div className="absolute w-full">
            {marks.map((mark) => {
              const markPercentage = ((mark.value - min) / (max - min)) * 100;
              return (
                <div
                  key={mark.value}
                  className="absolute"
                  style={{ left: `${markPercentage}%` }}
                >
                  <div className="absolute -translate-x-1/2 size-2 bg-gray-400 rounded-full" />
                  {mark.label && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-text-secondary whitespace-nowrap">
                      {mark.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

Slider.displayName = 'Slider';
