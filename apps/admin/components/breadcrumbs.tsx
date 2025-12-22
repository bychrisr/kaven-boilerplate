import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Separator between items
   */
  separator?: React.ReactNode;
  /**
   * Maximum items to display
   */
  maxItems?: number;
  /**
   * Items to show before collapse
   */
  itemsBeforeCollapse?: number;
  /**
   * Items to show after collapse
   */
  itemsAfterCollapse?: number;
  children: React.ReactNode;
}

export const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  (
    {
      className,
      separator = <ChevronRight className="size-4" />,
      maxItems,
      itemsBeforeCollapse = 1,
      itemsAfterCollapse = 1,
      children,
      ...props
    },
    ref
  ) => {
    const childrenArray = React.Children.toArray(children);
    const shouldCollapse = maxItems && childrenArray.length > maxItems;

    let displayedChildren = childrenArray;

    if (shouldCollapse) {
      const before = childrenArray.slice(0, itemsBeforeCollapse);
      const after = childrenArray.slice(-itemsAfterCollapse);
      displayedChildren = [
        ...before,
        <li key="ellipsis" className="flex items-center">
          <span className="px-2 text-text-secondary">...</span>
        </li>,
        ...after,
      ];
    }

    return (
      <nav ref={ref} aria-label="Breadcrumb" {...props}>
        <ol className={cn('flex items-center flex-wrap gap-2', className)}>
          {displayedChildren.map((child, index) => (
            <React.Fragment key={index}>
              {child}
              {index < displayedChildren.length - 1 && (
                <li className="flex items-center text-text-secondary" aria-hidden="true">
                  {separator}
                </li>
              )}
            </React.Fragment>
          ))}
        </ol>
      </nav>
    );
  }
);

Breadcrumbs.displayName = 'Breadcrumbs';

export interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLLIElement> {
  /**
   * Is current page
   */
  current?: boolean;
  /**
   * Icon
   */
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, current = false, icon, children, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn(
          'flex items-center gap-1.5 text-sm',
          current ? 'text-text-primary font-medium' : 'text-text-secondary',
          className
        )}
        aria-current={current ? 'page' : undefined}
        {...props}
      >
        {icon}
        {children}
      </li>
    );
  }
);

BreadcrumbItem.displayName = 'BreadcrumbItem';
