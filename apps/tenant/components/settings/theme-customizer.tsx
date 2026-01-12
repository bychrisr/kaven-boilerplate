'use client';

import * as React from 'react';
import { Palette, Type, Settings as SettingsIcon, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/providers/theme-provider';

interface ThemeCustomizerProps {
  open?: boolean;
  onClose?: () => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ open = false, onClose }) => {
  const { mode, toggleMode } = useTheme();
  const [primaryColor, setPrimaryColor] = React.useState('#1976d2');
  const [secondaryColor, setSecondaryColor] = React.useState('#9c27b0');
  const [borderRadius, setBorderRadius] = React.useState(8);
  const [fontFamily, setFontFamily] = React.useState('Inter');

  const handleReset = () => {
    setPrimaryColor('#1976d2');
    setSecondaryColor('#9c27b0');
    setBorderRadius(8);
    setFontFamily('Inter');
  };

  const handleExport = () => {
    const theme = {
      primaryColor,
      secondaryColor,
      borderRadius,
      fontFamily,
      mode,
    };
    const blob = new Blob([JSON.stringify(theme, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theme.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background-paper rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-divider flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SettingsIcon className="size-5" />
            <h2 className="text-xl font-semibold">Personalizar Tema</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-action-hover rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Mode */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              {mode === 'dark' ? <Moon className="size-4" /> : <Sun className="size-4" />}
              Modo de Cor
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => mode === 'dark' && toggleMode()}
                className={cn(
                  'flex-1 py-3 px-4 rounded-lg border-2 transition-all',
                  mode === 'light'
                    ? 'border-primary-main bg-primary-main/10'
                    : 'border-gray-300 hover:border-gray-400'
                )}
              >
                <Sun className="size-5 mx-auto mb-1" />
                <div className="text-sm font-medium">Claro</div>
              </button>
              <button
                onClick={() => mode === 'light' && toggleMode()}
                className={cn(
                  'flex-1 py-3 px-4 rounded-lg border-2 transition-all',
                  mode === 'dark'
                    ? 'border-primary-main bg-primary-main/10'
                    : 'border-gray-300 hover:border-gray-400'
                )}
              >
                <Moon className="size-5 mx-auto mb-1" />
                <div className="text-sm font-medium">Escuro</div>
              </button>
            </div>
          </div>

          {/* Colors */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Palette className="size-4" />
              Cores
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-text-secondary mb-1 block">Cor Primária</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="size-10 rounded border border-divider cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-divider rounded focus:outline-none focus:ring-2 focus:ring-primary-main/20"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-text-secondary mb-1 block">Cor Secundária</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="size-10 rounded border border-divider cursor-pointer"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-divider rounded focus:outline-none focus:ring-2 focus:ring-primary-main/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Type className="size-4" />
              Tipografia
            </h3>
            <div>
              <label className="text-sm text-text-secondary mb-1 block">Fonte</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full px-3 py-2 border border-divider rounded focus:outline-none focus:ring-2 focus:ring-primary-main/20"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Poppins">Poppins</option>
                <option value="Montserrat">Montserrat</option>
              </select>
            </div>
          </div>

          {/* Border Radius */}
          <div>
            <label className="text-sm font-semibold mb-3 block">
              Border Radius: {borderRadius}px
            </label>
            <input
              type="range"
              min="0"
              max="24"
              value={borderRadius}
              onChange={(e) => setBorderRadius(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>0px</span>
              <span>24px</span>
            </div>
          </div>

          {/* Preview */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Preview</h3>
            <div className="p-4 border border-divider rounded-lg space-y-3">
              <button
                className="px-4 py-2 rounded text-white font-medium"
                style={{
                  backgroundColor: primaryColor,
                  borderRadius: `${borderRadius}px`,
                  fontFamily,
                }}
              >
                Botão Primário
              </button>
              <button
                className="px-4 py-2 rounded text-white font-medium"
                style={{
                  backgroundColor: secondaryColor,
                  borderRadius: `${borderRadius}px`,
                  fontFamily,
                }}
              >
                Botão Secundário
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-divider flex items-center justify-between">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-action-hover rounded transition-colors"
          >
            Resetar
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="px-4 py-2 text-sm font-medium border border-divider hover:bg-action-hover rounded transition-colors"
            >
              Exportar
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium bg-primary-main text-white hover:bg-primary-dark rounded transition-colors"
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ThemeCustomizer.displayName = 'ThemeCustomizer';
