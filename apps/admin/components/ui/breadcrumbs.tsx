import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbsProps extends React.ComponentPropsWithoutRef<'nav'> {
  separator?: React.ReactNode;
}

const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ className, separator = <ChevronRight className="h-4 w-4" />, children, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        aria-label="breadcrumb"
        className={cn('flex items-center text-sm text-text-secondary', className)}
        {...props}
      >
        <ol className="flex items-center gap-2">
          {React.Children.map(children, (child, index) => {
            if (!React.isValidElement(child)) return child;

            const isLast = index === React.Children.count(children) - 1;

            return (
              <>
                <li className={cn('inline-flex items-center', isLast && 'font-medium text-text-primary')}>
                  {child}
                </li>
                {!isLast && (
                  <li aria-hidden="true" className="text-text-disabled">
                    {separator}
                  </li>
                )}
              </>
            );
          })}
        </ol>
      </nav>
    );
  }
);
Breadcrumbs.displayName = 'Breadcrumbs';

export interface BreadcrumbItemProps extends React.ComponentPropsWithoutRef<'span'> {
  current?: boolean;
}

const BreadcrumbItem = React.forwardRef<HTMLSpanElement, BreadcrumbItemProps>(
  ({ className, current, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        aria-current={current ? 'page' : undefined}
        className={cn('inline-flex items-center gap-2', className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);
BreadcrumbItem.displayName = 'BreadcrumbItem';

export { Breadcrumbs, BreadcrumbItem };
