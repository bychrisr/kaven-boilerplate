import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CollapseProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Open state
   */
  in?: boolean;
  /**
   * Timeout duration (ms)
   * @default 300
   */
  timeout?: number;
  /**
   * Unmount on exit
   */
  unmountOnExit?: boolean;
  children: React.ReactNode;
}

export const Collapse = React.forwardRef<HTMLDivElement, CollapseProps>(
  (
    { className, in: isOpen = false, timeout = 300, unmountOnExit = false, children, ...props },
    ref
  ) => {
    const [shouldRender, setShouldRender] = React.useState(isOpen);
    const [maxHeight, setMaxHeight] = React.useState<number | undefined>(undefined);
    const contentRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (isOpen) {
        setShouldRender(true);
      } else if (unmountOnExit) {
        const timer = setTimeout(() => setShouldRender(false), timeout);
        return () => clearTimeout(timer);
      }
    }, [isOpen, unmountOnExit, timeout]);

    // Use useLayoutEffect to measure DOM synchronously after render
    React.useLayoutEffect(() => {
      if (contentRef.current) {
        setMaxHeight(isOpen ? contentRef.current.scrollHeight : 0);
      }
    }, [isOpen, children]);

    if (!shouldRender && unmountOnExit) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn('overflow-hidden transition-all', className)}
        style={{
          maxHeight,
          transitionDuration: `${timeout}ms`,
          opacity: isOpen ? 1 : 0,
        }}
        {...props}
      >
        <div ref={contentRef}>{children}</div>
      </div>
    );
  }
);

Collapse.displayName = 'Collapse';

export interface FadeProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Open state
   */
  in?: boolean;
  /**
   * Timeout duration (ms)
   * @default 300
   */
  timeout?: number;
  /**
   * Unmount on exit
   */
  unmountOnExit?: boolean;
  children: React.ReactNode;
}

export const Fade = React.forwardRef<HTMLDivElement, FadeProps>(
  (
    { className, in: isOpen = false, timeout = 300, unmountOnExit = false, children, ...props },
    ref
  ) => {
    const [shouldRender, setShouldRender] = React.useState(isOpen);

    React.useEffect(() => {
      if (isOpen) {
        setShouldRender(true);
      } else if (unmountOnExit) {
        const timer = setTimeout(() => setShouldRender(false), timeout);
        return () => clearTimeout(timer);
      }
    }, [isOpen, unmountOnExit, timeout]);

    if (!shouldRender && unmountOnExit) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn('transition-opacity', className)}
        style={{
          opacity: isOpen ? 1 : 0,
          transitionDuration: `${timeout}ms`,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Fade.displayName = 'Fade';

export interface GrowProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Open state
   */
  in?: boolean;
  /**
   * Timeout duration (ms)
   * @default 300
   */
  timeout?: number;
  /**
   * Unmount on exit
   */
  unmountOnExit?: boolean;
  children: React.ReactNode;
}

export const Grow = React.forwardRef<HTMLDivElement, GrowProps>(
  (
    { className, in: isOpen = false, timeout = 300, unmountOnExit = false, children, ...props },
    ref
  ) => {
    const [shouldRender, setShouldRender] = React.useState(isOpen);

    React.useEffect(() => {
      if (isOpen) {
        setShouldRender(true);
      } else if (unmountOnExit) {
        const timer = setTimeout(() => setShouldRender(false), timeout);
        return () => clearTimeout(timer);
      }
    }, [isOpen, unmountOnExit, timeout]);

    if (!shouldRender && unmountOnExit) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn('transition-all origin-center', className)}
        style={{
          transform: isOpen ? 'scale(1)' : 'scale(0)',
          opacity: isOpen ? 1 : 0,
          transitionDuration: `${timeout}ms`,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grow.displayName = 'Grow';

export interface SlideProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Open state
   */
  in?: boolean;
  /**
   * Direction
   * @default 'down'
   */
  direction?: 'up' | 'down' | 'left' | 'right';
  /**
   * Timeout duration (ms)
   * @default 300
   */
  timeout?: number;
  /**
   * Unmount on exit
   */
  unmountOnExit?: boolean;
  children: React.ReactNode;
}

export const Slide = React.forwardRef<HTMLDivElement, SlideProps>(
  (
    {
      className,
      in: isOpen = false,
      direction = 'down',
      timeout = 300,
      unmountOnExit = false,
      children,
      ...props
    },
    ref
  ) => {
    const [shouldRender, setShouldRender] = React.useState(isOpen);

    React.useEffect(() => {
      if (isOpen) {
        setShouldRender(true);
      } else if (unmountOnExit) {
        const timer = setTimeout(() => setShouldRender(false), timeout);
        return () => clearTimeout(timer);
      }
    }, [isOpen, unmountOnExit, timeout]);

    if (!shouldRender && unmountOnExit) {
      return null;
    }

    const transforms = {
      up: isOpen ? 'translateY(0)' : 'translateY(100%)',
      down: isOpen ? 'translateY(0)' : 'translateY(-100%)',
      left: isOpen ? 'translateX(0)' : 'translateX(100%)',
      right: isOpen ? 'translateX(0)' : 'translateX(-100%)',
    };

    return (
      <div
        ref={ref}
        className={cn('transition-transform', className)}
        style={{
          transform: transforms[direction],
          transitionDuration: `${timeout}ms`,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Slide.displayName = 'Slide';

export interface ZoomProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Open state
   */
  in?: boolean;
  /**
   * Timeout duration (ms)
   * @default 300
   */
  timeout?: number;
  /**
   * Unmount on exit
   */
  unmountOnExit?: boolean;
  children: React.ReactNode;
}

export const Zoom = React.forwardRef<HTMLDivElement, ZoomProps>(
  (
    { className, in: isOpen = false, timeout = 300, unmountOnExit = false, children, ...props },
    ref
  ) => {
    const [shouldRender, setShouldRender] = React.useState(isOpen);

    React.useEffect(() => {
      if (isOpen) {
        setShouldRender(true);
      } else if (unmountOnExit) {
        const timer = setTimeout(() => setShouldRender(false), timeout);
        return () => clearTimeout(timer);
      }
    }, [isOpen, unmountOnExit, timeout]);

    if (!shouldRender && unmountOnExit) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn('transition-all', className)}
        style={{
          transform: isOpen ? 'scale(1)' : 'scale(0.8)',
          opacity: isOpen ? 1 : 0,
          transitionDuration: `${timeout}ms`,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Zoom.displayName = 'Zoom';
