'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BackdropProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Open state
   */
  open: boolean;
  /**
   * Callback when backdrop is clicked
   */
  onClick?: () => void;
  /**
   * Invisible backdrop
   */
  invisible?: boolean;
  /**
   * Children (usually a loading spinner)
   */
  children?: React.ReactNode;
}

export const Backdrop = React.forwardRef<HTMLDivElement, BackdropProps>(
  ({ className, open, onClick, invisible = false, children, ...props }, ref) => {
    if (!open) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-0 z-modal flex items-center justify-center',
          !invisible && 'bg-black/50 backdrop-blur-sm',
          'animate-in fade-in-0',
          className
        )}
        onClick={onClick}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Backdrop.displayName = 'Backdrop';
