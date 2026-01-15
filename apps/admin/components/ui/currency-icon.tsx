'use client';

import { cn } from '@/lib/utils';

interface Currency {
  code: string;
  symbol: string | null;
  iconType: 'TEXT' | 'SVG';
  iconColorMode?: 'MONOCHROME' | 'COLORED';
  iconSvgPath: string | null;
  iconSvgViewBox?: string | null;
}

interface CurrencyIconProps {
  currency: Currency;
  size?: number;
  variant?: 'default' | 'positive' | 'negative' | 'neutral';
  className?: string;
}

const variantColors = {
  default: 'text-foreground',
  positive: 'text-green-600 dark:text-green-400',
  negative: 'text-red-600 dark:text-red-400',
  neutral: 'text-muted-foreground',
};

/**
 * Componente para exibir ícone de moeda
 * Suporta:
 * - Ícones de texto (R$, $, €)
 * - Ícones SVG monocromáticos (respeitam theme via currentColor)
 * - Ícones SVG coloridos (mantêm cores originais)
 */
export function CurrencyIcon({
  currency,
  size = 16,
  variant = 'default',
  className,
}: CurrencyIconProps) {
  if (currency.iconType === 'TEXT') {
    return (
      <span
        className={cn(
          'font-semibold',
          variantColors[variant],
          className
        )}
        style={{ fontSize: `${size}px` }}
      >
        {currency.symbol}
      </span>
    );
  }

  if (currency.iconType === 'SVG' && currency.iconSvgPath) {
    const isMonochrome = !currency.iconColorMode || currency.iconColorMode === 'MONOCHROME';
    
    return (
      <svg
        width={size}
        height={size}
        viewBox={currency.iconSvgViewBox || '0 0 24 24'}
        fill={isMonochrome ? 'currentColor' : 'none'}
        className={cn(
          isMonochrome && variantColors[variant],
          className
        )}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={currency.iconSvgPath} />
      </svg>
    );
  }

  // Fallback
  return <span className={cn(variantColors[variant], className)}>{currency.code}</span>;
}
