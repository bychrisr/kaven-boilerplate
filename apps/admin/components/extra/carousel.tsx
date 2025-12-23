import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CarouselProps {
  /**
   * Carousel items
   */
  children: React.ReactNode;
  /**
   * Auto-play
   */
  autoPlay?: boolean;
  /**
   * Auto-play interval (ms)
   * @default 3000
   */
  interval?: number;
  /**
   * Show arrows
   * @default true
   */
  showArrows?: boolean;
  /**
   * Show dots
   * @default true
   */
  showDots?: boolean;
  /**
   * Infinite loop
   * @default true
   */
  infinite?: boolean;
  /**
   * Current slide index (controlled)
   */
  activeIndex?: number;
  /**
   * Callback when slide changes
   */
  onChange?: (index: number) => void;
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  autoPlay = false,
  interval = 3000,
  showArrows = true,
  showDots = true,
  infinite = true,
  activeIndex: controlledIndex,
  onChange,
}) => {
  const [internalIndex, setInternalIndex] = React.useState(0);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const slides = React.Children.toArray(children);
  const currentIndex = controlledIndex ?? internalIndex;

  const goToSlide = (index: number) => {
    let newIndex = index;

    if (infinite) {
      if (index < 0) newIndex = slides.length - 1;
      else if (index >= slides.length) newIndex = 0;
    } else {
      newIndex = Math.max(0, Math.min(index, slides.length - 1));
    }

    setInternalIndex(newIndex);
    onChange?.(newIndex);
  };

  const goToPrevious = () => {
    goToSlide(currentIndex - 1);
  };

  const goToNext = () => {
    goToSlide(currentIndex + 1);
  };

  React.useEffect(() => {
    if (autoPlay) {
      timeoutRef.current = setTimeout(() => {
        goToNext();
      }, interval);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [autoPlay, interval, currentIndex]);

  const canGoPrevious = infinite || currentIndex > 0;
  const canGoNext = infinite || currentIndex < slides.length - 1;

  return (
    <div className="relative group">
      {/* Slides */}
      <div className="relative overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="min-w-full">
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      {showArrows && (
        <>
          <button
            type="button"
            onClick={goToPrevious}
            disabled={!canGoPrevious}
            className={cn(
              'absolute left-2 top-1/2 -translate-y-1/2 z-10',
              'p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all',
              'opacity-0 group-hover:opacity-100',
              'disabled:opacity-30 disabled:cursor-not-allowed'
            )}
            aria-label="Anterior"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            onClick={goToNext}
            disabled={!canGoNext}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2 z-10',
              'p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all',
              'opacity-0 group-hover:opacity-100',
              'disabled:opacity-30 disabled:cursor-not-allowed'
            )}
            aria-label="Próximo"
          >
            <ChevronRight className="size-6" />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              className={cn(
                'size-2 rounded-full transition-all',
                index === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
              )}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

Carousel.displayName = 'Carousel';
