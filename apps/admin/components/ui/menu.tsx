import * as React from 'react';
import { cn } from '@/lib/utils';

export interface MenuProps {
  /**
   * Anchor element
   */
  anchorEl: HTMLElement | null;
  /**
   * Open state
   */
  open: boolean;
  /**
   * Callback when menu should close
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
   * Children
   */
  children: React.ReactNode;
}

export const Menu: React.FC<MenuProps> = ({
  anchorEl,
  open,
  onClose,
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  transformOrigin = { vertical: 'top', horizontal: 'left' },
  children,
}) => {
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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
  }, [open, onClose]);

  if (!open || !anchorEl) return null;

  const rect = anchorEl.getBoundingClientRect();
  const position = {
    top: anchorOrigin.vertical === 'top' ? rect.top : anchorOrigin.vertical === 'bottom' ? rect.bottom : rect.top + rect.height / 2,
    left: anchorOrigin.horizontal === 'left' ? rect.left : anchorOrigin.horizontal === 'right' ? rect.right : rect.left + rect.width / 2,
  };

  return (
    <>
      <div className="fixed inset-0 z-dropdown" onClick={onClose} />
      <div
        ref={menuRef}
        className={cn(
          'fixed z-popover min-w-[8rem] bg-background-paper rounded-lg shadow-lg py-2',
          'animate-in fade-in-0 zoom-in-95'
        )}
        style={{
          top: position.top,
          left: position.left,
          transformOrigin: `${transformOrigin.horizontal} ${transformOrigin.vertical}`,
        }}
        role="menu"
      >
        {children}
      </div>
    </>
  );
};

Menu.displayName = 'Menu';

export interface MenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Selected state
   */
  selected?: boolean;
  /**
   * Divider
   */
  divider?: boolean;
  /**
   * Children
   */
  children: React.ReactNode;
}

export const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(
  ({ className, disabled = false, selected = false, divider = false, children, onClick, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="menuitem"
        tabIndex={disabled ? -1 : 0}
        className={cn(
          'px-4 py-2 text-sm cursor-pointer transition-colors',
          'hover:bg-action-hover focus:bg-action-hover outline-none',
          selected && 'bg-action-selected',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          divider && 'border-b border-divider',
          className
        )}
        onClick={disabled ? undefined : onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!disabled) onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
          }
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MenuItem.displayName = 'MenuItem';
