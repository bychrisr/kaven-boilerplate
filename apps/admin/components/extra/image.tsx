import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * Image source
   */
  src: string;
  /**
   * Alt text
   */
  alt: string;
  /**
   * Aspect ratio
   */
  aspectRatio?: '1/1' | '4/3' | '16/9' | '21/9';
  /**
   * Object fit
   */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  /**
   * Lazy loading
   */
  lazy?: boolean;
  /**
   * Blur placeholder
   */
  blurDataURL?: string;
  /**
   * Fallback image
   */
  fallback?: string;
  /**
   * Zoom on hover
   */
  zoomOnHover?: boolean;
}

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      className,
      src,
      alt,
      aspectRatio,
      objectFit = 'cover',
      lazy = true,
      blurDataURL,
      fallback,
      zoomOnHover = false,
      onError,
      ...props
    },
    ref
  ) => {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [hasError, setHasError] = React.useState(false);
    const [currentSrc, setCurrentSrc] = React.useState(src);

    const aspectRatioClasses = {
      '1/1': 'aspect-square',
      '4/3': 'aspect-[4/3]',
      '16/9': 'aspect-video',
      '21/9': 'aspect-[21/9]',
    };

    const objectFitClasses = {
      cover: 'object-cover',
      contain: 'object-contain',
      fill: 'object-fill',
      none: 'object-none',
    };

    const handleLoad = () => {
      setIsLoaded(true);
    };

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setHasError(true);
      if (fallback) {
        setCurrentSrc(fallback);
      }
      onError?.(e);
    };

    return (
      <div
        className={cn(
          'relative overflow-hidden bg-background-default',
          aspectRatio && aspectRatioClasses[aspectRatio],
          className
        )}
      >
        {/* Blur placeholder */}
        {blurDataURL && !isLoaded && (
          <img
            src={blurDataURL}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-lg scale-110"
            aria-hidden="true"
          />
        )}

        {/* Main image */}
        <img
          ref={ref}
          src={currentSrc}
          alt={alt}
          loading={lazy ? 'lazy' : 'eager'}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full transition-all duration-300',
            objectFitClasses[objectFit],
            !isLoaded && 'opacity-0',
            isLoaded && 'opacity-100',
            zoomOnHover && 'hover:scale-110',
            hasError && 'opacity-50'
          )}
          {...props}
        />

        {/* Loading skeleton */}
        {!isLoaded && !blurDataURL && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
      </div>
    );
  }
);

Image.displayName = 'Image';
