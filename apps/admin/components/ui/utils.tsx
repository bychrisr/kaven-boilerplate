import * as React from 'react';
import { cn } from '@/lib/utils';

export interface NoSsrProps {
  /**
   * Defer rendering
   */
  defer?: boolean;
  /**
   * Fallback content
   */
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const NoSsr: React.FC<NoSsrProps> = ({ defer = false, fallback = null, children }) => {
  const [isMounted, setIsMounted] = React.useState(!defer);

  React.useEffect(() => {
    if (defer) {
      setIsMounted(true);
    }
  }, [defer]);

  return isMounted ? <>{children}</> : <>{fallback}</>;
};

NoSsr.displayName = 'NoSsr';

export interface HiddenProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Hide on specific breakpoints
   */
  only?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | ('xs' | 'sm' | 'md' | 'lg' | 'xl')[];
  /**
   * Hide on breakpoints up to
   */
  smUp?: boolean;
  mdUp?: boolean;
  lgUp?: boolean;
  xlUp?: boolean;
  /**
   * Hide on breakpoints down to
   */
  smDown?: boolean;
  mdDown?: boolean;
  lgDown?: boolean;
  xlDown?: boolean;
  /**
   * Implementation method
   */
  implementation?: 'css' | 'js';
  children: React.ReactNode;
}

export const Hidden = React.forwardRef<HTMLDivElement, HiddenProps>(
  (
    {
      className,
      only,
      smUp,
      mdUp,
      lgUp,
      xlUp,
      smDown,
      mdDown,
      lgDown,
      xlDown,
      implementation = 'css',
      children,
      ...props
    },
    ref
  ) => {
    const hiddenClasses = cn(
      only && Array.isArray(only) && only.map((bp) => `hidden-${bp}`).join(' '),
      only && !Array.isArray(only) && `hidden-${only}`,
      smUp && 'sm:hidden',
      mdUp && 'md:hidden',
      lgUp && 'lg:hidden',
      xlUp && 'xl:hidden',
      smDown && 'max-sm:hidden',
      mdDown && 'max-md:hidden',
      lgDown && 'max-lg:hidden',
      xlDown && 'max-xl:hidden'
    );

    if (implementation === 'css') {
      return (
        <div ref={ref} className={cn(hiddenClasses, className)} {...props}>
          {children}
        </div>
      );
    }

    // JS implementation would check window.matchMedia
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    );
  }
);

Hidden.displayName = 'Hidden';
