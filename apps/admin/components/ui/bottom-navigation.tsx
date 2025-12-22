import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BottomNavigationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "onScroll"> {
  /**
   * Selected value
   */
  value?: string | number;
  /**
   * Callback when value changes
   */
  onChange?: (value: string | number) => void;
  /**
   * Show labels
   * @default 'selected'
   */
  showLabels?: 'always' | 'selected' | 'never';
  children: React.ReactNode;
}

const BottomNavigationContext = React.createContext<{
  value?: string | number;
  onChange?: (value: string | number) => void;
  showLabels: 'always' | 'selected' | 'never';
} | null>(null);

export const BottomNavigation = React.forwardRef<HTMLDivElement, BottomNavigationProps>(
  ({ className, value, onChange, showLabels = 'selected', children, ...props }, ref) => {
    return (
      <BottomNavigationContext.Provider value={{ value, onChange, showLabels }}>
        <div
          ref={ref}
          className={cn(
            'fixed bottom-0 left-0 right-0 z-appbar',
            'flex items-center justify-around',
            'bg-background-paper border-t border-divider',
            'h-14 md:h-16',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </BottomNavigationContext.Provider>
    );
  }
);

BottomNavigation.displayName = 'BottomNavigation';

export interface BottomNavigationActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Value
   */
  value: string | number;
  /**
   * Label
   */
  label?: string;
  /**
   * Icon
   */
  icon?: React.ReactNode;
}

export const BottomNavigationAction = React.forwardRef<HTMLButtonElement, BottomNavigationActionProps>(
  ({ className, value, label, icon, ...props }, ref) => {
    const context = React.useContext(BottomNavigationContext);
    if (!context) {
      throw new Error('BottomNavigationAction must be used within BottomNavigation');
    }

    const { value: selectedValue, onChange, showLabels } = context;
    const isSelected = value === selectedValue;
    const shouldShowLabel = showLabels === 'always' || (showLabels === 'selected' && isSelected);

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => onChange?.(value)}
        className={cn(
          'flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-20 transition-colors',
          'hover:bg-action-hover',
          isSelected ? 'text-primary-main' : 'text-text-secondary',
          className
        )}
        {...props}
      >
        {icon && <div className="text-2xl">{icon}</div>}
        {shouldShowLabel && label && (
          <span className="text-xs font-medium">{label}</span>
        )}
      </button>
    );
  }
);

BottomNavigationAction.displayName = 'BottomNavigationAction';
