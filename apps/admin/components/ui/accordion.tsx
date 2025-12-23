import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "onScroll"> {
  /**
   * Expanded panel(s)
   */
  expanded?: string | string[];
  /**
   * Callback when panel changes
   */
  onChange?: (panel: string) => void;
  /**
   * Allow multiple panels open
   */
  multiple?: boolean;
  /**
   * Disable all panels
   */
  disabled?: boolean;
  children: React.ReactNode;
}

const AccordionContext = React.createContext<{
  expanded: string | string[];
  onChange: (panel: string) => void;
  multiple: boolean;
  disabled: boolean;
} | null>(null);

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      className,
      expanded = '',
      onChange = () => {},
      multiple = false,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <AccordionContext.Provider value={{ expanded, onChange, multiple, disabled }}>
        <div ref={ref} className={cn('divide-y divide-divider', className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);

Accordion.displayName = 'Accordion';

export interface AccordionItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "onScroll"> {
  /**
   * Panel identifier
   */
  value: string;
  /**
   * Disable this panel
   */
  disabled?: boolean;
  children: React.ReactNode;
}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, disabled = false, children, ...props }, ref) => {
    const context = React.useContext(AccordionContext);
    if (!context) {
      throw new Error('AccordionItem must be used within Accordion');
    }

    const { expanded, onChange,  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  multiple: _multiple = false, disabled: accordionDisabled } = context;
    const isExpanded = Array.isArray(expanded) ? expanded.includes(value) : expanded === value;
    const isDisabled = disabled || accordionDisabled;

    const handleClick = () => {
      if (isDisabled) return;
      onChange(value);
    };

    return (
      <div ref={ref} className={cn('', className)} {...props}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<{ isExpanded?: boolean; onClick?: () => void; disabled?: boolean }>, {
              isExpanded,
              onClick: child.type === AccordionSummary ? handleClick : undefined,
              disabled: isDisabled,
            });
          }
          return child;
        })}
      </div>
    );
  }
);

AccordionItem.displayName = 'AccordionItem';

export interface AccordionSummaryProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "onScroll"> {
  /**
   * Expand icon
   */
  expandIcon?: React.ReactNode;
  /**
   * Internal props
   */
  isExpanded?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

export const AccordionSummary = React.forwardRef<HTMLDivElement, AccordionSummaryProps>(
  (
    {
      className,
      expandIcon = <ChevronDown className="size-5" />,
      isExpanded = false,
      disabled = false,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-expanded={isExpanded}
        aria-disabled={disabled}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
          }
        }}
        className={cn(
          'flex items-center justify-between px-4 py-3 cursor-pointer transition-colors',
          'hover:bg-action-hover',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className
        )}
        {...props}
      >
        <div className="flex-1">{children}</div>
        <div
          className={cn(
            'transition-transform duration-200',
            isExpanded && 'rotate-180'
          )}
        >
          {expandIcon}
        </div>
      </div>
    );
  }
);

AccordionSummary.displayName = 'AccordionSummary';

export interface AccordionDetailsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "onScroll"> {
  /**
   * Internal props
   */
  isExpanded?: boolean;
  children: React.ReactNode;
}

export const AccordionDetails = React.forwardRef<HTMLDivElement, AccordionDetailsProps>(
  ({ className, isExpanded = false, children, ...props }, ref) => {
    if (!isExpanded) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn('px-4 py-3 text-sm text-text-secondary', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AccordionDetails.displayName = 'AccordionDetails';
