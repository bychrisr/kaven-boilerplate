import * as React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DataTableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /**
   * Size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Sticky header
   */
  stickyHeader?: boolean;
  children: React.ReactNode;
}

const DataTableContext = React.createContext<{
  size: 'sm' | 'md' | 'lg';
}>({ size: 'md' });

export const DataTable = React.forwardRef<HTMLTableElement, DataTableProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, size = 'md', stickyHeader: _stickyHeader = false, children, ...props }, ref) => {
    return (
      <DataTableContext.Provider value={{ size }}>
        <div className="w-full overflow-auto">
          <table
            ref={ref}
            className={cn('w-full border-collapse', className)}
            {...props}
          >
            {children}
          </table>
        </div>
      </DataTableContext.Provider>
    );
  }
);

DataTable.displayName = 'DataTable';

export interface DataTableHeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const DataTableHead = React.forwardRef<HTMLTableSectionElement, DataTableHeadProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <thead
        ref={ref}
        className={cn('bg-background-default border-b border-divider', className)}
        {...props}
      >
        {children}
      </thead>
    );
  }
);

DataTableHead.displayName = 'DataTableHead';

export interface DataTableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const DataTableBody = React.forwardRef<HTMLTableSectionElement, DataTableBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <tbody ref={ref} className={className} {...props}>
        {children}
      </tbody>
    );
  }
);

DataTableBody.displayName = 'DataTableBody';

export interface DataTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /**
   * Hover effect
   */
  hover?: boolean;
  /**
   * Selected state
   */
  selected?: boolean;
  children: React.ReactNode;
}

export const DataTableRow = React.forwardRef<HTMLTableRowElement, DataTableRowProps>(
  ({ className, hover = false, selected = false, children, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          'border-b border-divider transition-colors',
          hover && 'hover:bg-action-hover',
          selected && 'bg-action-selected',
          className
        )}
        {...props}
      >
        {children}
      </tr>
    );
  }
);

DataTableRow.displayName = 'DataTableRow';

export interface DataTableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /**
   * Align
   */
  align?: 'left' | 'center' | 'right';
  /**
   * Padding
   */
  padding?: 'normal' | 'checkbox' | 'none';
  children?: React.ReactNode;
}

export const DataTableCell = React.forwardRef<HTMLTableCellElement, DataTableCellProps>(
  ({ className, align = 'left', padding = 'normal', children, ...props }, ref) => {
    const context = React.useContext(DataTableContext);
    const { size } = context;

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-6 py-4 text-lg',
    };

    const alignClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    };

    const paddingClasses = {
      normal: sizeClasses[size],
      checkbox: 'px-2 py-2',
      none: 'p-0',
    };

    return (
      <td
        ref={ref}
        className={cn(
          paddingClasses[padding],
          alignClasses[align],
          'text-text-primary',
          className
        )}
        {...props}
      >
        {children}
      </td>
    );
  }
);

DataTableCell.displayName = 'DataTableCell';

export interface DataTableHeaderCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /**
   * Align
   */
  align?: 'left' | 'center' | 'right';
  /**
   * Padding
   */
  padding?: 'normal' | 'checkbox' | 'none';
  /**
   * Sortable
   */
  sortDirection?: 'asc' | 'desc' | false;
  /**
   * Sort handler
   */
  onSort?: () => void;
  children?: React.ReactNode;
}

export const DataTableHeaderCell = React.forwardRef<HTMLTableCellElement, DataTableHeaderCellProps>(
  ({ className, align = 'left', padding = 'normal', sortDirection, onSort, children, ...props }, ref) => {
    const context = React.useContext(DataTableContext);
    const { size } = context;

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-6 py-4 text-lg',
    };

    const alignClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    };

    const paddingClasses = {
      normal: sizeClasses[size],
      checkbox: 'px-2 py-2',
      none: 'p-0',
    };

    const content = (
      <>
        {children}
        {sortDirection !== undefined && (
          <>
            {sortDirection === 'asc' && <ArrowUp className="size-4" />}
            {sortDirection === 'desc' && <ArrowDown className="size-4" />}
            {sortDirection === false && <ArrowUpDown className="size-4 opacity-30" />}
          </>
        )}
      </>
    );

    return (
      <th
        ref={ref}
        className={cn(
          paddingClasses[padding],
          alignClasses[align],
          'font-semibold text-text-primary',
          onSort && 'cursor-pointer hover:bg-action-hover',
          className
        )}
        onClick={onSort}
        {...props}
      >
        {onSort ? (
          <div className="flex items-center gap-1">{content}</div>
        ) : (
          content
        )}
      </th>
    );
  }
);

DataTableHeaderCell.displayName = 'DataTableHeaderCell';
