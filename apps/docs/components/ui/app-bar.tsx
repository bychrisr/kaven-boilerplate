import * as React from 'react';
import { cn } from '../../lib/utils';

export interface AppBarProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Position
   * @default 'fixed'
   */
  position?: 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative';
  /**
   * Color
   * @default 'primary'
   */
  color?: 'default' | 'primary' | 'secondary' | 'transparent' | 'inherit';
  /**
   * Elevation
   * @default 4
   */
  elevation?: number;
  children: React.ReactNode;
}

const colorClasses = {
  default: 'bg-background-paper text-text-primary',
  primary: 'bg-primary-main text-white',
  secondary: 'bg-secondary-main text-white',
  transparent: 'bg-transparent text-inherit',
  inherit: 'bg-inherit text-inherit',
};

export const AppBar = React.forwardRef<HTMLElement, AppBarProps>(
  ({ className, position = 'fixed', color = 'primary', children, ...props }, ref) => {
    return (
      <header
        ref={ref}
        className={cn(
          'w-full z-appbar',
          // Minimals: shadow z8 (via elevation)
          'shadow-[0_8px_16px_0_rgba(145,158,171,0.08)]',
          position === 'fixed' && 'fixed top-0 left-0 right-0',
          position === 'absolute' && 'absolute top-0 left-0 right-0',
          position === 'sticky' && 'sticky top-0',
          position === 'static' && 'static',
          position === 'relative' && 'relative',
          colorClasses[color],
          className
        )}
        {...props}
      >
        {children}
      </header>
    );
  }
);

AppBar.displayName = 'AppBar';

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Variant
   * @default 'regular'
   */
  variant?: 'regular' | 'dense';
  /**
   * Disable gutters
   */
  disableGutters?: boolean;
  children: React.ReactNode;
}

export const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, variant = 'regular', disableGutters = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center w-full',
          // Minimals: height 72px for regular variant
          variant === 'regular' && 'min-h-[72px]',
          variant === 'dense' && 'min-h-12',
          !disableGutters && 'px-4 md:px-6',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Toolbar.displayName = 'Toolbar';
