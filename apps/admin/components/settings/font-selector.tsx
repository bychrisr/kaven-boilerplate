'use client';

import * as React from 'react';
import { Type, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Font {
  name: string;
  family: string;
  weights?: number[];
}

export interface FontSelectorProps {
  /**
   * Available fonts
   */
  fonts?: Font[];
  /**
   * Selected font
   */
  value?: string;
  /**
   * Callback when font changes
   */
  onChange?: (font: Font) => void;
}

const DEFAULT_FONTS: Font[] = [
  { name: 'Inter', family: 'Inter, sans-serif', weights: [400, 500, 600, 700] },
  { name: 'Roboto', family: 'Roboto, sans-serif', weights: [300, 400, 500, 700] },
  { name: 'Open Sans', family: '"Open Sans", sans-serif', weights: [400, 600, 700] },
  { name: 'Poppins', family: 'Poppins, sans-serif', weights: [400, 500, 600, 700] },
  { name: 'Montserrat', family: 'Montserrat, sans-serif', weights: [400, 500, 600, 700] },
  { name: 'Lato', family: 'Lato, sans-serif', weights: [400, 700] },
  { name: 'Nunito', family: 'Nunito, sans-serif', weights: [400, 600, 700] },
  { name: 'Raleway', family: 'Raleway, sans-serif', weights: [400, 500, 600, 700] },
];

export const FontSelector: React.FC<FontSelectorProps> = ({
  fonts = DEFAULT_FONTS,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedFont, setSelectedFont] = React.useState<Font | undefined>(
    fonts.find(f => f.name === value) || fonts[0]
  );
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

  const handleSelect = (font: Font) => {
    setSelectedFont(font);
    onChange?.(font);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 border border-divider rounded-lg hover:border-primary-main transition-colors"
      >
        <div className="flex items-center gap-2">
          <Type className="size-5 text-text-secondary" />
          <span style={{ fontFamily: selectedFont?.family }}>
            {selectedFont?.name}
          </span>
        </div>
        <svg
          className={cn('size-4 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 max-h-80 overflow-y-auto bg-background-paper border border-divider rounded-lg shadow-xl z-dropdown">
          <div className="p-2">
            {fonts.map((font) => (
              <button
                key={font.name}
                onClick={() => handleSelect(font)}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-left',
                  selectedFont?.name === font.name
                    ? 'bg-primary-main/10 text-primary-main'
                    : 'hover:bg-action-hover'
                )}
              >
                <div>
                  <div className="font-medium" style={{ fontFamily: font.family }}>
                    {font.name}
                  </div>
                  <div className="text-xs text-text-secondary mt-0.5" style={{ fontFamily: font.family }}>
                    The quick brown fox jumps over the lazy dog
                  </div>
                </div>
                {selectedFont?.name === font.name && (
                  <Check className="size-5 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

FontSelector.displayName = 'FontSelector';
