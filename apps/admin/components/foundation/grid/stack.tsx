import React from 'react';
import { cn } from '@/lib/utils';

// ============================================
// STACK COMPONENT
// ============================================

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Direction of the stack
   * @default 'column'
   */
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  /**
   * Responsive direction configuration
   */
  responsive?: {
    xs?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    sm?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    md?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    lg?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    xl?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  };
  /**
   * Spacing between items
   * @default 2
   */
  spacing?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 12 | 16 | 20 | 24;
  /**
   * Alignment of items along the main axis
   */
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  /**
   * Alignment of items along the cross axis
   */
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  /**
   * Whether items should wrap
   * @default false
   */
  wrap?: boolean;
  /**
   * Show dividers between items
   * @default false
   */
  divider?: boolean;
  /**
   * Custom divider component
   */
  dividerComponent?: React.ReactNode;
  children: React.ReactNode;
}

const directionClasses = {
  row: 'flex-row',
  column: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'column-reverse': 'flex-col-reverse',
};

const spacingClasses = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  7: 'gap-7',
  8: 'gap-8',
  9: 'gap-9',
  10: 'gap-10',
  12: 'gap-12',
  16: 'gap-16',
  20: 'gap-20',
  24: 'gap-24',
};

const justifyClasses = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const alignClasses = {
  start: 'items-start',
  end: 'items-end',
  center: 'items-center',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
};

export function Stack({
  direction = 'column',
  responsive,
  spacing = 2,
  justify,
  align,
  wrap = false,
  divider = false,
  dividerComponent,
  className,
  children,
  ...props
}: StackProps) {
  const responsiveClasses = responsive
    ? [
        responsive.xs && directionClasses[responsive.xs],
        responsive.sm && `sm:${directionClasses[responsive.sm]}`,
        responsive.md && `md:${directionClasses[responsive.md]}`,
        responsive.lg && `lg:${directionClasses[responsive.lg]}`,
        responsive.xl && `xl:${directionClasses[responsive.xl]}`,
      ].filter(Boolean)
    : [];

  const childrenArray = React.Children.toArray(children);
  const isDividerEnabled = divider && childrenArray.length > 1;

  const content = isDividerEnabled
    ? childrenArray.reduce<React.ReactNode[]>((acc, child, index) => {
        acc.push(child);
        if (index < childrenArray.length - 1) {
          acc.push(
            dividerComponent || (
              <div
                key={`divider-${index}`}
                className={cn(
                  'bg-divider',
                  direction === 'row' || direction === 'row-reverse'
                    ? 'w-px h-full'
                    : 'h-px w-full'
                )}
              />
            )
          );
        }
        return acc;
      }, [])
    : children;

  return (
    <div
      className={cn(
        'flex',
        !responsive && directionClasses[direction],
        ...responsiveClasses,
        !isDividerEnabled && spacingClasses[spacing],
        justify && justifyClasses[justify],
        align && alignClasses[align],
        wrap && 'flex-wrap',
        className
      )}
      {...props}
    >
      {content}
    </div>
  );
}

Stack.displayName = 'Stack';

// ============================================
// BOX COMPONENT
// ============================================

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * HTML element to render
   * @default 'div'
   */
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
}

export function Box({
  as: Component = 'div',
  className,
  children,
  ...props
}: BoxProps) {
  return (
    <Component className={cn(className)} {...props}>
      {children}
    </Component>
  );
}

Box.displayName = 'Box';
