import * as React from 'react';
import { cn } from '@/lib/utils';

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn(
          'flex h-16 w-full items-center border-b bg-background px-4 md:px-6',
          className
        )}
        {...props}
      >
        {children}
      </nav>
    );
  }
);
Navbar.displayName = 'Navbar';
