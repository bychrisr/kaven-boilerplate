'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface MegaMenuColumn {
  title: string;
  items: Array<{
    label: string;
    description?: string;
    icon?: React.ReactNode;
    image?: string;
    href?: string;
    onClick?: () => void;
  }>;
}

export interface MegaMenuProps {
  /**
   * Trigger label
   */
  label: string;
  /**
   * Trigger icon
   */
  icon?: React.ReactNode;
  /**
   * Columns
   */
  columns: MegaMenuColumn[];
  /**
   * Featured content (optional)
   */
  featured?: React.ReactNode;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ label, icon, columns, featured }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
          isOpen ? 'bg-action-selected' : 'hover:bg-action-hover'
        )}
      >
        {icon && <span className="size-5">{icon}</span>}
        <span>{label}</span>
        <ChevronDown className={cn('size-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {/* Mega Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-screen max-w-6xl bg-background-paper border border-divider rounded-lg shadow-xl z-dropdown">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Columns */}
              {columns.map((column, colIndex) => (
                <div key={colIndex}>
                  <h3 className="text-sm font-semibold text-text-primary mb-3">{column.title}</h3>
                  <div className="space-y-2">
                    {column.items.map((item, itemIndex) => (
                      <button
                        key={itemIndex}
                        onClick={() => {
                          item.onClick?.();
                          setIsOpen(false);
                        }}
                        className="w-full flex items-start gap-3 p-2 rounded-lg hover:bg-action-hover transition-colors text-left"
                      >
                        {item.icon && <span className="size-5 shrink-0 mt-0.5">{item.icon}</span>}
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.label}
                            width={224}
                            height={224}
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                            unoptimized
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-text-primary">{item.label}</div>
                          {item.description && (
                            <div className="text-xs text-text-secondary mt-0.5 line-clamp-2">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Featured Content */}
              {featured && (
                <div className="md:col-span-1 border-l border-divider pl-6">{featured}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

MegaMenu.displayName = 'MegaMenu';
