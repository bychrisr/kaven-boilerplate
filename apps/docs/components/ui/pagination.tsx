'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /**
   * Total number of pages
   */
  count: number;
  /**
   * Current page (1-indexed)
   */
  page: number;
  /**
   * Callback when page changes
   */
  onChange: (page: number) => void;
  /**
   * Number of siblings on each side
   * @default 1
   */
  siblingCount?: number;
  /**
   * Number of boundary pages
   * @default 1
   */
  boundaryCount?: number;
  /**
   * Show first/last buttons
   * @default false
   */
  showFirstButton?: boolean;
  /**
   * Show last button
   * @default false
   */
  showLastButton?: boolean;
  /**
   * Size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Shape
   * @default 'rounded'
   */
  shape?: 'rounded' | 'circular';
  /**
   * Color
   * @default 'primary'
   */
  color?: 'primary' | 'secondary';
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      className,
      count,
      page,
      onChange,
      siblingCount = 1,
      boundaryCount = 1,
      showFirstButton = false,
      showLastButton = false,
      size = 'md',
      shape = 'rounded',
      color = 'primary',
      ...props
    },
    ref
  ) => {
    const range = (start: number, end: number) => {
      const length = end - start + 1;
      return Array.from({ length }, (_, i) => start + i);
    };

    const startPages = range(1, Math.min(boundaryCount, count));
    const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count);

    const siblingsStart = Math.max(
      Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
      boundaryCount + 2
    );

    const siblingsEnd = Math.min(
      Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
      endPages.length > 0 ? endPages[0] - 2 : count - 1
    );

    const itemList = [
      ...(showFirstButton ? ['first'] : []),
      'previous',
      ...startPages,
      ...(siblingsStart > boundaryCount + 2
        ? ['start-ellipsis']
        : boundaryCount + 1 < count - boundaryCount
          ? [boundaryCount + 1]
          : []),
      ...range(siblingsStart, siblingsEnd),
      ...(siblingsEnd < count - boundaryCount - 1
        ? ['end-ellipsis']
        : count - boundaryCount > boundaryCount
          ? [count - boundaryCount]
          : []),
      ...endPages,
      'next',
      ...(showLastButton ? ['last'] : []),
    ];

    const buttonSize = size === 'sm' ? 'icon-sm' : size === 'lg' ? 'icon-lg' : 'icon';

    return (
      <nav ref={ref} role="navigation" aria-label="Pagination" {...props}>
        <ul className={cn('flex items-center gap-1', className)}>
          {itemList.map((item, index) => {
            if (item === 'first') {
              return (
                <li key={index}>
                  <Button
                    variant="text"
                    size={buttonSize}
                    onClick={() => onChange(1)}
                    disabled={page === 1}
                    aria-label="Go to first page"
                  >
                    <ChevronLeft className="size-4" />
                    <ChevronLeft className="size-4 -ml-3" />
                  </Button>
                </li>
              );
            }

            if (item === 'previous') {
              return (
                <li key={index}>
                  <Button
                    variant="text"
                    size={buttonSize}
                    onClick={() => onChange(page - 1)}
                    disabled={page === 1}
                    aria-label="Go to previous page"
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                </li>
              );
            }

            if (item === 'next') {
              return (
                <li key={index}>
                  <Button
                    variant="text"
                    size={buttonSize}
                    onClick={() => onChange(page + 1)}
                    disabled={page === count}
                    aria-label="Go to next page"
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </li>
              );
            }

            if (item === 'last') {
              return (
                <li key={index}>
                  <Button
                    variant="text"
                    size={buttonSize}
                    onClick={() => onChange(count)}
                    disabled={page === count}
                    aria-label="Go to last page"
                  >
                    <ChevronRight className="size-4" />
                    <ChevronRight className="size-4 -ml-3" />
                  </Button>
                </li>
              );
            }

            if (item === 'start-ellipsis' || item === 'end-ellipsis') {
              return (
                <li key={index} className="px-2 text-text-secondary">
                  …
                </li>
              );
            }

            const pageNumber = item as number;
            const isSelected = pageNumber === page;

            return (
              <li key={index}>
                <Button
                  variant={isSelected ? 'contained' : 'text'}
                  color={isSelected ? color : 'inherit'}
                  size={buttonSize}
                  onClick={() => onChange(pageNumber)}
                  className={cn(shape === 'circular' && 'rounded-full')}
                  aria-label={`Go to page ${pageNumber}`}
                  aria-current={isSelected ? 'page' : undefined}
                >
                  {pageNumber}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
);

Pagination.displayName = 'Pagination';
