import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface DrawerProps {
  /**
   * Open state
   */
  open: boolean;
  /**
   * Callback when drawer should close
   */
  onClose: () => void;
  /**
   * Anchor position
   * @default 'left'
   */
  anchor?: 'left' | 'right' | 'top' | 'bottom';
  /**
   * Variant
   * @default 'temporary'
   */
  variant?: 'permanent' | 'persistent' | 'temporary';
  /**
   * Disable backdrop click to close
   */
  disableBackdropClick?: boolean;
  /**
   * Disable escape key to close
   */
  disableEscapeKeyDown?: boolean;
  /**
   * Children
   */
  children: React.ReactNode;
}

const anchorClasses = {
  // Minimals: width 280px for left/right
  left: 'left-0 top-0 bottom-0 w-[280px]',
  right: 'right-0 top-0 bottom-0 w-[280px]',
  top: 'top-0 left-0 right-0 h-80',
  bottom: 'bottom-0 left-0 right-0 h-80',
};

const slideClasses = {
  left: '-translate-x-full',
  right: 'translate-x-full',
  top: '-translate-y-full',
  bottom: 'translate-y-full',
};

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  anchor = 'left',
  variant = 'temporary',
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  children,
}) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !disableEscapeKeyDown && variant === 'temporary') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      if (variant === 'temporary') {
        document.body.style.overflow = 'hidden';
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose, disableEscapeKeyDown, variant]);

  if (variant === 'permanent') {
    return (
      <div className={cn('fixed bg-background-paper shadow-lg', anchorClasses[anchor])}>
        {children}
      </div>
    );
  }

  if (!open && variant === 'temporary') return null;

  return (
    <>
      {/* Backdrop */}
      {variant === 'temporary' && open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-modal-backdrop"
          onClick={() => !disableBackdropClick && onClose()}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed bg-background-paper shadow-lg z-modal transition-transform duration-300',
          // Minimals: border grey.200 (#F4F6F8)
          (anchor === 'left' || anchor === 'right') && 'border-r border-[#F4F6F8]',
          anchorClasses[anchor],
          !open && slideClasses[anchor]
        )}
      >
        {children}
      </div>
    </>
  );
};

Drawer.displayName = 'Drawer';

export interface DrawerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Show close button
   */
  onClose?: () => void;
  children: React.ReactNode;
}

export const DrawerHeader = React.forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ className, onClose, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between px-6 py-4 border-b border-divider',
          className
        )}
        {...props}
      >
        <h2 className="text-xl font-semibold text-text-primary">{children}</h2>
        {onClose && (
          <Button variant="text" size="icon-sm" onClick={onClose}>
            <X className="size-5" />
          </Button>
        )}
      </div>
    );
  }
);

DrawerHeader.displayName = 'DrawerHeader';

export interface DrawerContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('px-6 py-4 overflow-y-auto', className)} {...props}>
        {children}
      </div>
    );
  }
);

DrawerContent.displayName = 'DrawerContent';
