import React from 'react';
import { cn } from '@/lib/utils';

// ============================================
// CONTAINER COMPONENT
// ============================================

interface ContainerProps extends Readonly<React.HTMLAttributes<HTMLDivElement>> {
  /**
   * Maximum width of the container
   * @default 'lg'
   */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | false;
  /**
   * If true, removes horizontal padding
   * @default false
   */
  disableGutters?: boolean;
  /**
   * If true, sets max-width to match the current breakpoint
   * @default false
   */
  fixed?: boolean;
  children: React.ReactNode;
}

const maxWidthClasses = {
  xs: 'max-w-screen-xs',
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
};

export function Container({
  maxWidth = 'lg',
  disableGutters = false,
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        'w-full mx-auto',
        !disableGutters && 'px-4 sm:px-6 lg:px-8',
        maxWidth && maxWidthClasses[maxWidth],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

Container.displayName = 'Container';
