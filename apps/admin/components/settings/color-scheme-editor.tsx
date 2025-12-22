'use client';

import * as React from 'react';
import { Palette, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ColorScheme {
  primary: string;
  secondary: string;
  success: string;
  error: string;
  warning: string;
  info: string;
}

export interface ColorSchemeEditorProps {
  /**
   * Current color scheme
   */
  value?: ColorScheme;
  /**
   * Callback when scheme changes
   */
  onChange?: (scheme: ColorScheme) => void;
}

const DEFAULT_SCHEME: ColorScheme = {
  primary: '#1976d2',
  secondary: '#9c27b0',
  success: '#4caf50',
  error: '#f44336',
  warning: '#ff9800',
  info: '#0288d1',
};

const PRESET_SCHEMES: Array<{ name: string; scheme: ColorScheme }> = [
  {
    name: 'Default',
    scheme: DEFAULT_SCHEME,
  },
  {
    name: 'Purple',
    scheme: {
      primary: '#7c3aed',
      secondary: '#ec4899',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
    },
  },
  {
    name: 'Green',
    scheme: {
      primary: '#059669',
      secondary: '#0891b2',
      success: '#22c55e',
      error: '#dc2626',
      warning: '#f97316',
      info: '#0ea5e9',
    },
  },
  {
    name: 'Orange',
    scheme: {
      primary: '#ea580c',
      secondary: '#d946ef',
      success: '#16a34a',
      error: '#dc2626',
      warning: '#ca8a04',
      info: '#2563eb',
    },
  },
];

export const ColorSchemeEditor: React.FC<ColorSchemeEditorProps> = ({
  value = DEFAULT_SCHEME,
  onChange,
}) => {
  const [scheme, setScheme] = React.useState<ColorScheme>(value);

  const handleColorChange = (key: keyof ColorScheme, color: string) => {
    const newScheme = { ...scheme, [key]: color };
    setScheme(newScheme);
    onChange?.(newScheme);
  };

  const handlePresetSelect = (presetScheme: ColorScheme) => {
    setScheme(presetScheme);
    onChange?.(presetScheme);
  };

  const handleReset = () => {
    setScheme(DEFAULT_SCHEME);
    onChange?.(DEFAULT_SCHEME);
  };

  const colorInputs: Array<{ key: keyof ColorScheme; label: string }> = [
    { key: 'primary', label: 'Primária' },
    { key: 'secondary', label: 'Secundária' },
    { key: 'success', label: 'Sucesso' },
    { key: 'error', label: 'Erro' },
    { key: 'warning', label: 'Aviso' },
    { key: 'info', label: 'Informação' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="size-5" />
          <h3 className="text-lg font-semibold">Esquema de Cores</h3>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-1.5 text-sm border border-divider rounded-lg hover:bg-action-hover transition-colors"
        >
          <RotateCcw className="size-4" />
          Resetar
        </button>
      </div>

      {/* Preset Schemes */}
      <div>
        <label className="block text-sm font-medium mb-3">Esquemas Predefinidos</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PRESET_SCHEMES.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePresetSelect(preset.scheme)}
              className="p-3 border border-divider rounded-lg hover:border-primary-main transition-colors"
            >
              <div className="flex gap-1 mb-2">
                {Object.values(preset.scheme).map((color, index) => (
                  <div
                    key={index}
                    className="flex-1 h-8 rounded"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="text-sm font-medium text-center">{preset.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Color Inputs */}
      <div>
        <label className="block text-sm font-medium mb-3">Cores Personalizadas</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {colorInputs.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm text-text-secondary mb-2">{label}</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={scheme[key]}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="size-12 rounded border border-divider cursor-pointer"
                />
                <input
                  type="text"
                  value={scheme[key]}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="flex-1 px-3 py-2 border border-divider rounded focus:outline-none focus:ring-2 focus:ring-primary-main/20"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div>
        <label className="block text-sm font-medium mb-3">Preview</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {colorInputs.map(({ key, label }) => (
            <div
              key={key}
              className="p-4 rounded-lg text-white font-medium text-center"
              style={{ backgroundColor: scheme[key] }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

ColorSchemeEditor.displayName = 'ColorSchemeEditor';
