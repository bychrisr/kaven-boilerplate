import React from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface IconProps extends Readonly<Omit<React.SVGProps<SVGSVGElement>, 'ref'>> {
  /**
   * Lucide icon component
   */
  icon: LucideIcon;
  /**
   * Icon size
   * @default 'md'
   */
  size?: IconSize | number;
  /**
   * Icon color (uses theme colors)
   */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'inherit' | 'currentColor';
  /**
   * Accessibility label
   */
  label?: string;
}

const sizeClasses: Record<IconSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-10 h-10',
};

const colorClasses = {
  primary: 'text-primary-main',
  secondary: 'text-secondary-main',
  success: 'text-success-main',
  warning: 'text-warning-main',
  error: 'text-error-main',
  info: 'text-info-main',
  inherit: 'text-inherit',
  currentColor: 'text-current',
};

export function Icon({
  icon: IconComponent,
  size = 'md',
  color = 'currentColor',
  label,
  className,
  ...props
}: IconProps) {
  const sizeClass = typeof size === 'number' ? undefined : sizeClasses[size];
  const style = typeof size === 'number' ? { width: size, height: size } : undefined;

  return (
    <IconComponent
      className={cn(sizeClass, colorClasses[color], className)}
      style={style}
      aria-label={label}
      aria-hidden={!label}
      {...props}
    />
  );
}

Icon.displayName = 'Icon';
