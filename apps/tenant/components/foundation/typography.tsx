import React from 'react';
import { cn } from '@/lib/utils';

// Typography variant types
type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'overline'
  | 'button';

type TypographyColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'textPrimary'
  | 'textSecondary'
  | 'textDisabled'
  | 'inherit';

type TypographyAlign = 'left' | 'center' | 'right' | 'justify' | 'inherit';

interface TypographyProps extends Readonly<React.HTMLAttributes<HTMLElement>> {
  /**
   * Typography variant
   * @default 'body1'
   */
  variant?: TypographyVariant;
  /**
   * HTML element to render
   */
  component?: React.ElementType;
  /**
   * Text color
   * @default 'textPrimary'
   */
  color?: TypographyColor;
  /**
   * Text alignment
   */
  align?: TypographyAlign;
  /**
   * Font weight
   */
  fontWeight?: 'regular' | 'medium' | 'semibold' | 'bold' | number;
  /**
   * Enable text truncation with ellipsis
   */
  noWrap?: boolean;
  /**
   * Enable paragraph mode (adds margin bottom)
   */
  paragraph?: boolean;
  /**
   * Disable gutter bottom margin
   */
  gutterBottom?: boolean;
  children: React.ReactNode;
}

const variantMapping: Record<TypographyVariant, React.ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'h6',
  subtitle2: 'h6',
  body1: 'p',
  body2: 'p',
  caption: 'span',
  overline: 'span',
  button: 'span',
};

const variantClasses: Record<TypographyVariant, string> = {
  h1: 'text-5xl leading-[60px] font-bold tracking-tight',
  h2: 'text-4xl leading-[48px] font-bold tracking-tight',
  h3: 'text-3xl leading-[42px] font-bold',
  h4: 'text-2xl leading-[36px] font-bold',
  h5: 'text-xl leading-[30px] font-semibold',
  h6: 'text-lg leading-[28px] font-semibold',
  subtitle1: 'text-base leading-6 font-semibold',
  subtitle2: 'text-sm leading-[22px] font-semibold',
  body1: 'text-base leading-6 font-normal',
  body2: 'text-sm leading-[22px] font-normal',
  caption: 'text-xs leading-[18px] font-normal',
  overline: 'text-xs leading-[18px] font-bold uppercase tracking-widest',
  button: 'text-sm leading-[22px] font-semibold tracking-wide',
};

const colorClasses: Record<TypographyColor, string> = {
  primary: 'text-primary-main',
  secondary: 'text-secondary-main',
  success: 'text-success-main',
  warning: 'text-warning-main',
  error: 'text-error-main',
  info: 'text-info-main',
  textPrimary: 'text-text-primary',
  textSecondary: 'text-text-secondary',
  textDisabled: 'text-text-disabled',
  inherit: 'text-inherit',
};

const alignClasses: Record<TypographyAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
  inherit: 'text-inherit',
};

const fontWeightClasses = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export function Typography({
  variant = 'body1',
  component,
  color = 'textPrimary',
  align,
  fontWeight,
  noWrap = false,
  paragraph = false,
  gutterBottom = false,
  className,
  children,
  ...props
}: TypographyProps) {
  const Component = component || (paragraph ? 'p' : variantMapping[variant]);

  return (
    <Component
      className={cn(
        variantClasses[variant],
        colorClasses[color],
        align && alignClasses[align],
        fontWeight &&
          (typeof fontWeight === 'number' ? `font-[${fontWeight}]` : fontWeightClasses[fontWeight]),
        noWrap && 'truncate',
        gutterBottom && 'mb-2',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

Typography.displayName = 'Typography';
