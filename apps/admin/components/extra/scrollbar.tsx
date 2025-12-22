import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ScrollbarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Auto-hide scrollbar
   */
  autoHide?: boolean;
  /**
   * Scrollbar size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Max height
   */
  maxHeight?: string | number;
  children: React.ReactNode;
}

export const Scrollbar = React.forwardRef<HTMLDivElement, ScrollbarProps>(
  ({ className, autoHide = false, size = 'md', maxHeight, children, ...props }, ref) => {
    const sizeClasses = {
      sm: '[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar]:h-1',
      md: '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2',
      lg: '[&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar]:h-3',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'overflow-auto',
          // Webkit scrollbar styling
          '[&::-webkit-scrollbar-track]:bg-background-default',
          '[&::-webkit-scrollbar-thumb]:bg-gray-400',
          '[&::-webkit-scrollbar-thumb]:rounded-full',
          '[&::-webkit-scrollbar-thumb:hover]:bg-gray-500',
          sizeClasses[size],
          autoHide && '[&::-webkit-scrollbar]:opacity-0 hover:[&::-webkit-scrollbar]:opacity-100 [&::-webkit-scrollbar]:transition-opacity',
          className
        )}
        style={{
          maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Scrollbar.displayName = 'Scrollbar';
