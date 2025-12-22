import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ScrollProgressProps {
  /**
   * Position
   */
  position?: 'top' | 'bottom';
  /**
   * Height
   */
  height?: number;
  /**
   * Color
   */
  color?: string;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  position = 'top',
  height = 3,
  color = 'var(--color-primary-main, #1976d2)',
}) => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      setProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={cn(
        'fixed left-0 right-0 z-[9999]',
        position === 'top' ? 'top-0' : 'bottom-0'
      )}
      style={{ height: `${height}px` }}
    >
      <div
        className="h-full transition-all duration-150"
        style={{
          width: `${progress}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );
};

ScrollProgress.displayName = 'ScrollProgress';
