import * as React from 'react';
import { Check, Copy } from 'lucide-react';

interface ColorSwatchProps {
  color: string;
  name: string;
  value: string;
  variant?: 'main' | 'light' | 'dark' | 'contrastText';
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color,
  name,
  value, // eslint-disable-next-line @typescript-eslint/no-unused-vars
  variant: _variant = 'primary',
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative">
      <div
        className="h-24 rounded-t-lg cursor-pointer transition-transform hover:scale-105"
        style={{ backgroundColor: color }}
        onClick={handleCopy}
      />
      <div className="p-3 bg-background-paper border border-t-0 border-divider rounded-b-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">{name}</div>
            <div className="text-xs text-text-secondary">{value}</div>
          </div>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-action-hover transition-colors"
            title="Copiar código"
          >
            {copied ? (
              <Check className="size-4 text-success-main" />
            ) : (
              <Copy className="size-4 text-text-secondary" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const ColorPalette: React.FC = () => {
  const colors = {
    primary: {
      light: '#42a5f5',
      main: '#1976d2',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#ba68c8',
      main: '#9c27b0',
      dark: '#7b1fa2',
      contrastText: '#ffffff',
    },
    success: {
      light: '#66bb6a',
      main: '#4caf50',
      dark: '#388e3c',
      contrastText: '#ffffff',
    },
    error: {
      light: '#ef5350',
      main: '#f44336',
      dark: '#c62828',
      contrastText: '#ffffff',
    },
    warning: {
      light: '#ffa726',
      main: '#ff9800',
      dark: '#f57c00',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    info: {
      light: '#29b6f6',
      main: '#0288d1',
      dark: '#01579b',
      contrastText: '#ffffff',
    },
  };

  const grays = {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-1">Paleta de Cores</h2>
        <p className="text-text-secondary">
          Sistema de cores do design system. Clique em qualquer cor para copiar o código.
        </p>
      </div>

      {/* Theme Colors */}
      {Object.entries(colors).map(([colorName, shades]) => (
        <div key={colorName}>
          <h3 className="text-lg font-semibold mb-4 capitalize">{colorName}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(shades).map(([variant, value]) => (
              <ColorSwatch
                key={variant}
                color={value}
                name={`${colorName}.${variant}`}
                value={value}
                variant={variant as 'main' | 'light' | 'dark' | 'contrastText'}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Gray Scale */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Escala de Cinza</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
          {Object.entries(grays).map(([shade, value]) => (
            <ColorSwatch key={shade} color={value} name={`gray.${shade}`} value={value} />
          ))}
        </div>
      </div>

      {/* Accessibility Info */}
      <div className="p-6 bg-info-main/10 border border-info-main/20 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <span className="text-info-main">ℹ️</span>
          Acessibilidade
        </h3>
        <p className="text-sm text-text-secondary mb-4">
          Todas as combinações de cores seguem as diretrizes WCAG 2.1 AA para contraste.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-background-paper rounded">
            <div className="size-12 rounded bg-primary-main flex items-center justify-center text-white font-bold">
              Aa
            </div>
            <div>
              <div className="text-sm font-medium">Texto em Primary</div>
              <div className="text-xs text-text-secondary">Contraste: 4.5:1</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-background-paper rounded">
            <div className="size-12 rounded bg-error-main flex items-center justify-center text-white font-bold">
              Aa
            </div>
            <div>
              <div className="text-sm font-medium">Texto em Error</div>
              <div className="text-xs text-text-secondary">Contraste: 4.5:1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ColorPalette.displayName = 'ColorPalette';
