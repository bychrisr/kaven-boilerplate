'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TimelineProps extends React.HTMLAttributes<HTMLUListElement> {
  /**
   * Position
   * @default 'right'
   */
  position?: 'left' | 'right' | 'alternate';
  children: React.ReactNode;
}

const TimelineContext = React.createContext<{
  position: 'left' | 'right' | 'alternate';
} | null>(null);

export const Timeline = React.forwardRef<HTMLUListElement, TimelineProps>(
  ({ className, position = 'right', children, ...props }, ref) => {
    return (
      <TimelineContext.Provider value={{ position }}>
        <ul ref={ref} className={cn('relative', className)} {...props}>
          {children}
        </ul>
      </TimelineContext.Provider>
    );
  }
);

Timeline.displayName = 'Timeline';

export interface TimelineItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
}

export const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(TimelineContext);
    if (!context) {
      throw new Error('TimelineItem must be used within Timeline');
    }

    return (
      <li ref={ref} className={cn('relative pb-8 last:pb-0', className)} {...props}>
        {children}
      </li>
    );
  }
);

TimelineItem.displayName = 'TimelineItem';

export interface TimelineSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const TimelineSeparator = React.forwardRef<HTMLDivElement, TimelineSeparatorProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('absolute left-0 top-0 flex flex-col items-center', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TimelineSeparator.displayName = 'TimelineSeparator';

export interface TimelineDotProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Color
   * @default 'grey'
   */
  color?: 'grey' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  /**
   * Variant
   * @default 'filled'
   */
  variant?: 'filled' | 'outlined';
  children?: React.ReactNode;
}

const dotColorClasses = {
  grey: {
    filled: 'bg-gray-400',
    outlined: 'border-2 border-gray-400 bg-background',
  },
  primary: {
    filled: 'bg-primary-main',
    outlined: 'border-2 border-primary-main bg-background',
  },
  secondary: {
    filled: 'bg-secondary-main',
    outlined: 'border-2 border-secondary-main bg-background',
  },
  success: {
    filled: 'bg-success-main',
    outlined: 'border-2 border-success-main bg-background',
  },
  error: {
    filled: 'bg-error-main',
    outlined: 'border-2 border-error-main bg-background',
  },
  info: {
    filled: 'bg-info-main',
    outlined: 'border-2 border-info-main bg-background',
  },
  warning: {
    filled: 'bg-warning-main',
    outlined: 'border-2 border-warning-main bg-background',
  },
};

export const TimelineDot = React.forwardRef<HTMLDivElement, TimelineDotProps>(
  ({ className, color = 'grey', variant = 'filled', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center rounded-full size-3',
          dotColorClasses[color][variant],
          children && 'size-10',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TimelineDot.displayName = 'TimelineDot';

export type TimelineConnectorProps = React.HTMLAttributes<HTMLDivElement>;

export const TimelineConnector = React.forwardRef<HTMLDivElement, TimelineConnectorProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('w-0.5 h-full bg-gray-300 min-h-6', className)} {...props} />
    );
  }
);

TimelineConnector.displayName = 'TimelineConnector';

export interface TimelineContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const TimelineContent = React.forwardRef<HTMLDivElement, TimelineContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('ml-6 pb-4', className)} {...props}>
        {children}
      </div>
    );
  }
);

TimelineContent.displayName = 'TimelineContent';

export interface TimelineOppositeContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const TimelineOppositeContent = React.forwardRef<
  HTMLDivElement,
  TimelineOppositeContentProps
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('text-sm text-text-secondary', className)} {...props}>
      {children}
    </div>
  );
});

TimelineOppositeContent.displayName = 'TimelineOppositeContent';
