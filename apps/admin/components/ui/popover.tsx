import * as React from 'react';
import { cn } from '@/lib/utils';

export interface PopoverProps {
  /**
   * Anchor element
   */
  anchorEl: HTMLElement | null;
  /**
   * Open state
   */
  open: boolean;
  /**
   * Callback when popover should close
   */
  onClose: () => void;
  /**
   * Anchor origin
   */
  anchorOrigin?: {
    vertical: 'top' | 'center' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  /**
   * Transform origin
   */
  transformOrigin?: {
    vertical: 'top' | 'center' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  /**
   * Elevation
   */
  elevation?: number;
  children: React.ReactNode;
}

export const Popover: React.FC<PopoverProps> = ({
  anchorEl,
  open,
  onClose,
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  transformOrigin = { vertical: 'top', horizontal: 'left' },
  elevation = 8,
  children,
}) => {
  const popoverRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose, anchorEl]);

  if (!open || !anchorEl) return null;

  const rect = anchorEl.getBoundingClientRect();
  
  const getPosition = () => {
    let top = 0;
    let left = 0;

    // Anchor position
    if (anchorOrigin.vertical === 'top') top = rect.top;
    else if (anchorOrigin.vertical === 'center') top = rect.top + rect.height / 2;
    else top = rect.bottom;

    if (anchorOrigin.horizontal === 'left') left = rect.left;
    else if (anchorOrigin.horizontal === 'center') left = rect.left + rect.width / 2;
    else left = rect.right;

    return { top, left };
  };

  const position = getPosition();

  return (
    <>
      <div className="fixed inset-0 z-modal" onClick={onClose} />
      <div
        ref={popoverRef}
        className={cn(
          'fixed z-popover bg-background-paper rounded-lg',
          `shadow-${elevation}`,
          'animate-in fade-in-0 zoom-in-95'
        )}
        style={{
          top: position.top,
          left: position.left,
          transformOrigin: `${transformOrigin.horizontal} ${transformOrigin.vertical}`,
        }}
        role="dialog"
      >
        {children}
      </div>
    </>
  );
};

Popover.displayName = 'Popover';
