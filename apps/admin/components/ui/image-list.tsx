import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ImageListProps extends React.HTMLAttributes<HTMLUListElement> {
  /**
   * Number of columns
   * @default 2
   */
  cols?: number;
  /**
   * Gap between items
   * @default 4
   */
  gap?: number;
  /**
   * Row height
   * @default 'auto'
   */
  rowHeight?: number | 'auto';
  /**
   * Variant
   * @default 'standard'
   */
  variant?: 'standard' | 'quilted' | 'woven' | 'masonry';
  children: React.ReactNode;
}

export const ImageList = React.forwardRef<HTMLUListElement, ImageListProps>(
  (
    { className, cols = 2, gap = 4, rowHeight = 'auto', variant = 'standard', children, ...props },
    ref
  ) => {
    return (
      <ul
        ref={ref}
        className={cn('grid', variant === 'masonry' && 'auto-rows-auto', className)}
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: `${gap * 4}px`,
          gridAutoRows: rowHeight === 'auto' ? 'auto' : `${rowHeight}px`,
        }}
        {...props}
      >
        {children}
      </ul>
    );
  }
);

ImageList.displayName = 'ImageList';

export interface ImageListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  /**
   * Column span
   */
  cols?: number;
  /**
   * Row span
   */
  rows?: number;
  children: React.ReactNode;
}

export const ImageListItem = React.forwardRef<HTMLLIElement, ImageListItemProps>(
  ({ className, cols = 1, rows = 1, children, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn('relative overflow-hidden', className)}
        style={{
          gridColumn: `span ${cols}`,
          gridRow: `span ${rows}`,
        }}
        {...props}
      >
        {children}
      </li>
    );
  }
);

ImageListItem.displayName = 'ImageListItem';

export interface ImageListItemBarProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange' | 'onScroll' | 'title'
> {
  /**
   * Title
   */
  title?: React.ReactNode;
  /**
   * Subtitle
   */
  subtitle?: React.ReactNode;
  /**
   * Action icon
   */
  actionIcon?: React.ReactNode;
  /**
   * Position
   * @default 'bottom'
   */
  position?: 'top' | 'bottom' | 'below';
  children?: React.ReactNode;
}

export const ImageListItemBar = React.forwardRef<HTMLDivElement, ImageListItemBarProps>(
  ({ className, title, subtitle, actionIcon, position = 'bottom', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between px-4 py-2',
          position === 'top' &&
            'absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent',
          position === 'bottom' &&
            'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent',
          position === 'below' && 'bg-background-paper',
          className
        )}
        {...props}
      >
        <div className="flex-1 min-w-0">
          {title && (
            <div className={cn('font-medium truncate', position !== 'below' && 'text-white')}>
              {title}
            </div>
          )}
          {subtitle && (
            <div
              className={cn(
                'text-sm truncate',
                position !== 'below' ? 'text-white/80' : 'text-text-secondary'
              )}
            >
              {subtitle}
            </div>
          )}
          {children}
        </div>
        {actionIcon && <div className="ml-2 shrink-0">{actionIcon}</div>}
      </div>
    );
  }
);

ImageListItemBar.displayName = 'ImageListItemBar';
