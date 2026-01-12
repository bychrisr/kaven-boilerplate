import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles
        'w-full min-w-0 rounded-md px-4 py-2.5 text-base md:text-sm',
        'bg-background border border-input text-foreground',
        'placeholder:text-muted-foreground',
        'transition-all outline-none',
        // Focus states
        'focus:border-primary focus:ring-2 focus:ring-ring/20',
        // Disabled state
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        // File input
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
        className
      )}
      {...props}
    />
  );
}

export { Input };
