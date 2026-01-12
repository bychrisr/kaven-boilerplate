import * as React from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LightboxImage {
  src: string;
  alt?: string;
  title?: string;
}

export interface LightboxProps {
  /**
   * Images
   */
  images: LightboxImage[];
  /**
   * Open state
   */
  open: boolean;
  /**
   * Callback when lightbox closes
   */
  onClose: () => void;
  /**
   * Initial index
   */
  initialIndex?: number;
}

export const Lightbox: React.FC<LightboxProps> = ({ images, open, onClose, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const [zoom, setZoom] = React.useState(1);

  const currentImage = images[currentIndex];

  const goToPrevious = React.useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setZoom(1);
  }, [images.length]);

  const goToNext = React.useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setZoom(1);
  }, [images.length]);

  const handleZoomIn = React.useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
  }, []);

  const handleZoomOut = React.useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.5, 1));
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, goToPrevious, goToNext, handleZoomIn, handleZoomOut]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        aria-label="Fechar"
      >
        <X className="size-6 text-white" />
      </button>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft className="size-6 text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Próximo"
          >
            <ChevronRight className="size-6 text-white" />
          </button>
        </>
      )}

      {/* Zoom controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 1}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30"
          aria-label="Diminuir zoom"
        >
          <ZoomOut className="size-5 text-white" />
        </button>
        <span className="px-4 py-2 rounded-full bg-white/10 text-white text-sm">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          disabled={zoom >= 3}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30"
          aria-label="Aumentar zoom"
        >
          <ZoomIn className="size-5 text-white" />
        </button>
      </div>

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full bg-white/10 text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Main image */}
      <div className="relative w-full h-full flex items-center justify-center p-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentImage.src}
          alt={currentImage.alt || ''}
          className="max-w-full max-h-full object-contain transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
        />
      </div>

      {/* Image title */}
      {currentImage.title && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-lg bg-white/10 text-white text-sm max-w-2xl text-center">
          {currentImage.title}
        </div>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex gap-2 max-w-screen-lg overflow-x-auto px-4">
          {images.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              onClick={() => {
                setCurrentIndex(index);
                setZoom(1);
              }}
              className={cn(
                'shrink-0 size-16 rounded overflow-hidden border-2 transition-all',
                index === currentIndex
                  ? 'border-white scale-110'
                  : 'border-white/30 hover:border-white/60'
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.src} alt={image.alt || ''} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

Lightbox.displayName = 'Lightbox';
