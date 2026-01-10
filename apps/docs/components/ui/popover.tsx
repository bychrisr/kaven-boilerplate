'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface PopoverContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

export interface PopoverProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}

export const Popover: React.FC<PopoverProps> = ({ 
    children, 
    open: controlledOpen, 
    onOpenChange: controlledOnOpenChange,
    defaultOpen = false
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = controlledOnOpenChange ?? setUncontrolledOpen;

  const handleOpenChange = (value: boolean) => {
      setOpen(value);
  };

  return (
    <PopoverContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
        <div className="relative inline-block">
            {children}
        </div>
    </PopoverContext.Provider>
  );
};
Popover.displayName = 'Popover';

export const PopoverTrigger = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & { asChild?: boolean }>(
  ({ children, asChild, onClick, ...props }, ref) => {
    const context = React.useContext(PopoverContext);
    if (!context) throw new Error('PopoverTrigger must be used within Popover');

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        onClick?.(e);
        context.onOpenChange(!context.open);
    };

    const Comp = asChild ? React.Children.only(children) as React.ReactElement : <button {...props}>{children}</button>; 

    return React.cloneElement(Comp, {
        ref,
        onClick: handleClick,
        ...props,
        "aria-expanded": context.open
    });
  }
);
PopoverTrigger.displayName = 'PopoverTrigger';

export const PopoverContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(PopoverContext);
    if (!context) throw new Error('PopoverContent must be used within Popover');
    
    // Close on click outside (simplified for docs)
    const contentRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => contentRef.current!);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (context.open && contentRef.current && !contentRef.current.contains(event.target as Node) && !event.defaultPrevented) {
                // Ensure we aren't clicking the trigger - tricky without ref access to trigger.
                // For docs simple use case, this timeout hack or just document body click is often used.
                // Better: Check if target is not within the Popover root.
                // Since Popover root wraps both, we can't easily distinguish 'outside' just by root.
                // Standard radix uses Portals. We will use a simple Backdrop for docs.
            }
        };
        // document.addEventListener('mousedown', handleClickOutside);
        // return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [context.open]);

    if (!context.open) return null;

    return (
      <>
        <div className="fixed inset-0 z-50 bg-black/5" onClick={() => context.onOpenChange(false)} />
        <div
            ref={contentRef}
            className={cn(
            'absolute z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            'top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2', // Simple positioning
            className
            )}
            {...props}
        >
            {children}
        </div>
      </>
    );
  }
);
PopoverContent.displayName = 'PopoverContent';
