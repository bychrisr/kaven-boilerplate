import * as React from 'react';
import { cn } from '@/lib/utils';

export interface MasonryProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns
   * @default 3
   */
  columns?: number;
  /**
   * Gap between items
   * @default 4
   */
  spacing?: number;
  /**
   * Responsive columns
   */
  columnsCountBreakPoints?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  children: React.ReactNode;
}

export const Masonry = React.forwardRef<HTMLDivElement, MasonryProps>(
  (
    {
      className,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      columns: _columns = 3,
      spacing = 2,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      columnsCountBreakPoints: _columnsCountBreakPoints = { 350: 1, 750: 2, 900: 3 },
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn('columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5', className)}
        style={{
          columnGap: `${spacing * 4}px`,
        }}
        {...props}
      >
        {React.Children.map(children, (child) => (
          <div
            className="break-inside-avoid"
            style={{
              marginBottom: `${spacing * 4}px`,
            }}
          >
            {child}
          </div>
        ))}
      </div>
    );
  }
);

Masonry.displayName = 'Masonry';
