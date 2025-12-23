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

export interface TooltipProps {
  /**
   * Tooltip content
   */
  title: React.ReactNode;
  /**
   * Placement
   * @default 'top'
   */
  placement?: TooltipPlacement;
  /**
   * Show arrow
   * @default true
   */
  arrow?: boolean;
  /**
   * Delay before showing (ms)
   * @default 200
   */
  enterDelay?: number;
  /**
   * Delay before hiding (ms)
   * @default 0
   */
  leaveDelay?: number;
  /**
   * Children to wrap
   */
  children: React.ReactElement;
  /**
   * Custom className for tooltip
   */
  className?: string;
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

const arrowClasses: Record<TooltipPlacement, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
  'top-start': 'top-full left-2 border-l-transparent border-r-transparent border-b-transparent',
  'top-end': 'top-full right-2 border-l-transparent border-r-transparent border-b-transparent',
  bottom:
    'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
  'bottom-start':
    'bottom-full left-2 border-l-transparent border-r-transparent border-t-transparent',
  'bottom-end':
    'bottom-full right-2 border-l-transparent border-r-transparent border-t-transparent',
  left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
  'left-start': 'left-full top-2 border-t-transparent border-b-transparent border-r-transparent',
  'left-end': 'left-full bottom-2 border-t-transparent border-b-transparent border-r-transparent',
  right:
    'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent',
  'right-start': 'right-full top-2 border-t-transparent border-b-transparent border-l-transparent',
  'right-end': 'right-full bottom-2 border-t-transparent border-b-transparent border-l-transparent',
};

export const Tooltip: React.FC<TooltipProps> = ({
  title,
  placement = 'top',
  arrow = true,
  enterDelay = 200,
  leaveDelay = 0,
  children,
  className,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, enterDelay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, leaveDelay);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative inline-block">
      {/* eslint-disable-next-line */}
      {React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onFocus: handleMouseEnter,
        onBlur: handleMouseLeave,
      })}

      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-tooltip px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-md shadow-lg whitespace-nowrap pointer-events-none',
            placementClasses[placement],
            className
          )}
        >
          {title}
          {arrow && (
            <div
              className={cn('absolute w-0 h-0 border-4 border-gray-900', arrowClasses[placement])}
            />
          )}
        </div>
      )}
    </div>
  );
};

Tooltip.displayName = 'Tooltip';
