import * as React from 'react';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Language {
  code: string;
  label: string;
  flag?: string;
}

export interface MultiLanguageProps {
  /**
   * Available languages
   */
  languages: Language[];
  /**
   * Current language
   */
  currentLanguage: string;
  /**
   * Callback when language changes
   */
  onLanguageChange: (code: string) => void;
}

export const MultiLanguage: React.FC<MultiLanguageProps> = ({
  languages,
  currentLanguage,
  onLanguageChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const current = languages.find((lang) => lang.code === currentLanguage);

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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-action-hover transition-colors"
      >
        <Globe className="size-5" />
        <span className="text-sm font-medium">
          {current?.flag} {current?.label}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 min-w-[200px] bg-background-paper border border-divider rounded-lg shadow-lg z-dropdown">
          <div className="p-2">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  onLanguageChange(language.code);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left',
                  language.code === currentLanguage
                    ? 'bg-primary-main/10 text-primary-main'
                    : 'hover:bg-action-hover'
                )}
              >
                {language.flag && <span className="text-xl">{language.flag}</span>}
                <span className="text-sm">{language.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

MultiLanguage.displayName = 'MultiLanguage';
