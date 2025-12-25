import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles - seguindo padrão da página de login
        'w-full min-w-0 rounded-md px-4 py-2.5 text-base md:text-sm',
        'bg-[#161C24] border-2 border-gray-700 text-white',
        'placeholder:text-gray-500',
        'transition-all outline-none',
        // Focus states
        'focus:border-primary-main focus:ring-2 focus:ring-primary-main/20',
        // Disabled state
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        // File input
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white',
        className
      )}
      {...props}
    />
  );
}

export { Input };
