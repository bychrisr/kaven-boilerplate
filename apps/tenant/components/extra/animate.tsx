import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AnimateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onScroll'> {
  /**
   * Animation type
   */
  type?: 'fade' | 'slide' | 'zoom' | 'bounce';
  /**
   * Direction (for slide)
   */
  direction?: 'up' | 'down' | 'left' | 'right';
  /**
   * Duration (ms)
   */
  duration?: number;
  /**
   * Delay (ms)
   */
  delay?: number;
  /**
   * Trigger on scroll
   */
  onScroll?: boolean;
  children: React.ReactNode;
}

export const Animate: React.FC<AnimateProps> = ({
  className,
  type = 'fade',
  direction = 'up',
  duration = 300,
  delay = 0,
  onScroll = false,
  children,
  ...props
}) => {
  const [isVisible, setIsVisible] = React.useState(!onScroll);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!onScroll) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [onScroll]);

  const getAnimationClasses = () => {
    const base = 'transition-all';

    if (!isVisible) {
      switch (type) {
        case 'fade':
          return `${base} opacity-0`;
        case 'slide':
          return `${base} opacity-0 ${
            direction === 'up'
              ? 'translate-y-8'
              : direction === 'down'
                ? '-translate-y-8'
                : direction === 'left'
                  ? 'translate-x-8'
                  : '-translate-x-8'
          }`;
        case 'zoom':
          return `${base} opacity-0 scale-95`;
        case 'bounce':
          return `${base} opacity-0 scale-95`;
        default:
          return base;
      }
    }

    return `${base} opacity-100 translate-x-0 translate-y-0 scale-100`;
  };

  return (
    <div
      ref={ref}
      className={cn(getAnimationClasses(), className)}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

Animate.displayName = 'Animate';
