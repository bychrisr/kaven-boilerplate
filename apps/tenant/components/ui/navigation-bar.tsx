import * as React from 'react';
import { Menu as MenuIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NavigationBarProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Position
   */
  position?: 'top' | 'bottom';
  /**
   * Variant
   */
  variant?: 'default' | 'elevated';
  /**
   * Logo
   */
  logo?: React.ReactNode;
  /**
   * Navigation items
   */
  items?: Array<{
    label: string;
    href?: string;
    icon?: React.ReactNode;
    badge?: number;
    active?: boolean;
    onClick?: () => void;
  }>;
  /**
   * Actions (right side)
   */
  actions?: React.ReactNode;
}

export const NavigationBar = React.forwardRef<HTMLElement, NavigationBarProps>(
  (
    {
      className,
      position = 'top',
      variant = 'default',
      logo,
      items = [],
      actions,
      children,
      ...props
    },
    ref
  ) => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    return (
      <nav
        ref={ref}
        className={cn(
          'w-full bg-background-paper border-divider transition-all',
          position === 'top' && 'border-b',
          position === 'bottom' && 'border-t fixed bottom-0 left-0 right-0 z-50',
          variant === 'elevated' && 'shadow-md',
          className
        )}
        {...props}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            {logo && <div className="flex-shrink-0">{logo}</div>}

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 flex-1 mx-8">
              {items.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={cn(
                    'relative flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                    item.active
                      ? 'bg-primary-main/10 text-primary-main font-medium'
                      : 'text-text-primary hover:bg-action-hover'
                  )}
                >
                  {item.icon && <span className="size-5">{item.icon}</span>}
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 size-5 flex items-center justify-center bg-error-main text-white text-xs rounded-full">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Actions */}
            {actions && <div className="hidden md:flex items-center gap-2">{actions}</div>}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-action-hover"
            >
              <MenuIcon className="size-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-divider">
              <div className="flex flex-col gap-2">
                {items.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      item.onClick?.();
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                      item.active
                        ? 'bg-primary-main/10 text-primary-main font-medium'
                        : 'text-text-primary hover:bg-action-hover'
                    )}
                  >
                    {item.icon && <span className="size-5">{item.icon}</span>}
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="size-6 flex items-center justify-center bg-error-main text-white text-xs rounded-full">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {actions && <div className="mt-4 pt-4 border-t border-divider">{actions}</div>}
            </div>
          )}
        </div>

        {children}
      </nav>
    );
  }
);

NavigationBar.displayName = 'NavigationBar';
