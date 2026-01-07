'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Active step (0-indexed)
   */
  activeStep: number;
  /**
   * Orientation
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Alternative label (horizontal only)
   */
  alternativeLabel?: boolean;
  children: React.ReactNode;
}

const StepperContext = React.createContext<{
  activeStep: number;
  orientation: 'horizontal' | 'vertical';
  alternativeLabel: boolean;
} | null>(null);

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      className,
      activeStep,
      orientation = 'horizontal',
      alternativeLabel = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <StepperContext.Provider value={{ activeStep, orientation, alternativeLabel }}>
        <div
          ref={ref}
          className={cn(
            'flex',
            orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </StepperContext.Provider>
    );
  }
);

Stepper.displayName = 'Stepper';

export interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Completed
   */
  completed?: boolean;
  /**
   * Disabled
   */
  disabled?: boolean;
  children: React.ReactNode;
}

export const Step = React.forwardRef<HTMLDivElement, StepProps>(
  ({ className, completed = false, disabled = false, children, ...props }, ref) => {
    const context = React.useContext(StepperContext);
    if (!context) {
      throw new Error('Step must be used within Stepper');
    }

    const { orientation } = context;

    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          orientation === 'horizontal' ? 'flex-1 flex-row items-center' : 'flex-col',
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(
              child as React.ReactElement<{ completed?: boolean; disabled?: boolean }>,
              {
                completed,
                disabled,
              }
            );
          }
          return child;
        })}
      </div>
    );
  }
);

Step.displayName = 'Step';

export interface StepLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Optional step
   */
  optional?: React.ReactNode;
  /**
   * Error
   */
  error?: boolean;
  /**
   * Internal props
   */
  completed?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

export const StepLabel = React.forwardRef<HTMLDivElement, StepLabelProps>(
  (
    { className, optional, error = false, completed = false, disabled = false, children, ...props },
    ref
  ) => {
    const context = React.useContext(StepperContext);
    if (!context) {
      throw new Error('StepLabel must be used within Stepper');
    }

    const { orientation, alternativeLabel } = context;

    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          orientation === 'horizontal' && alternativeLabel
            ? 'flex-col items-center'
            : 'flex-row items-center gap-2',
          className
        )}
        {...props}
      >
        <div className="flex flex-col">
          <span
            className={cn(
              'text-sm font-medium',
              completed && 'text-primary-main',
              error && 'text-error-main',
              disabled && 'text-text-disabled',
              !completed && !error && !disabled && 'text-text-secondary'
            )}
          >
            {children}
          </span>
          {optional && <span className="text-xs text-text-secondary">{optional}</span>}
        </div>
      </div>
    );
  }
);

StepLabel.displayName = 'StepLabel';

export interface StepIconProps {
  /**
   * Step number
   */
  icon: number;
  /**
   * Active
   */
  active?: boolean;
  /**
   * Completed
   */
  completed?: boolean;
  /**
   * Error
   */
  error?: boolean;
}

export const StepIcon: React.FC<StepIconProps> = ({
  icon,
  active = false,
  completed = false,
  error = false,
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center size-8 rounded-full border-2 transition-colors',
        completed && 'bg-primary-main border-primary-main text-white',
        active && !completed && 'bg-primary-main border-primary-main text-white',
        error && 'bg-error-main border-error-main text-white',
        !active && !completed && !error && 'border-gray-300 text-text-secondary'
      )}
    >
      {completed ? (
        <Check className="size-4" />
      ) : (
        <span className="text-sm font-medium">{icon}</span>
      )}
    </div>
  );
};

StepIcon.displayName = 'StepIcon';
