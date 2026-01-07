'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type TooltipPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

interface TooltipContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  placement: TooltipPlacement;
  delayDuration: number;
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

export interface TooltipProps {
  children: React.ReactNode;
  delayDuration?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, delayDuration = 200 }) => {
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState<TooltipPlacement>('top');

  return (
    <TooltipContext.Provider value={{ open, setOpen, placement, delayDuration }}>
        <div className="relative inline-block group">
            {children}
        </div>
    </TooltipContext.Provider>
  );
};
Tooltip.displayName = 'Tooltip';

export interface TooltipTriggerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

export const TooltipTrigger = React.forwardRef<HTMLElement, TooltipTriggerProps>(
  ({ children, asChild, ...props }, ref) => {
    const context = React.useContext(TooltipContext);
    if (!context) throw new Error('TooltipTrigger must be used within Tooltip');
    
    const timeoutRef = React.useRef<NodeJS.Timeout>();

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => context.setOpen(true), context.delayDuration);
    };

    const handleMouseLeave = () => {
         if (timeoutRef.current) clearTimeout(timeoutRef.current);
         context.setOpen(false);
    };

    // Logic to handle 'asChild' is simplified here for docs
    const Comp = asChild ? React.Children.only(children) as React.ReactElement : <button {...props}>{children}</button>; 
    
    // Merge handlers
    return React.cloneElement(Comp, {
        ref,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onFocus: handleMouseEnter,
        onBlur: handleMouseLeave,
        ...props
    });
  }
);
TooltipTrigger.displayName = 'TooltipTrigger';


export interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: TooltipPlacement;
}

const placementClasses: Record<TooltipPlacement, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  'top-start': 'bottom-full left-0 mb-2',
  'top-end': 'bottom-full right-0 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  'bottom-start': 'top-full left-0 mt-2',
  'bottom-end': 'top-full right-0 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  'left-start': 'right-full top-0 mr-2',
  'left-end': 'right-full bottom-0 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  'right-start': 'left-full top-0 ml-2',
  'right-end': 'left-full bottom-0 ml-2',
};

export const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
    ({ className, side = 'top', children, ...props }, ref) => {
        const context = React.useContext(TooltipContext);
        if (!context) throw new Error('TooltipContent must be used within Tooltip');

        if (!context.open) return null;

        return (
            <div
                ref={ref}
                className={cn(
                    'absolute z-tooltip px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-md shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
                    placementClasses[side],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
TooltipContent.displayName = 'TooltipContent';
