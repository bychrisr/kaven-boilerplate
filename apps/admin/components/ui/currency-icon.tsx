'use client';

import type { Currency } from '@/hooks/use-currency';

interface CurrencyIconProps {
  currency?: Currency;
  currencyCode?: string; // Fallback se currency não fornecido
  size?: number;
  className?: string;
  variant?: 'default' | 'positive' | 'negative' | 'neutral';
}

/**
 * Componente para exibir ícone de moeda (texto ou SVG)
 * Suporta moedas com símbolo texto (R$, $, €) e SVG (sats)
 * 
 * @example
 * <CurrencyIcon currency={satsCurrency} size={20} />
 * <CurrencyIcon currencyCode="BRL" size={16} />
 */
export function CurrencyIcon({
  currency,
  currencyCode,
  size = 20,
  className = '',
  variant = 'default',
}: CurrencyIconProps) {
  // Debug: log para verificar dados
  if (typeof window !== 'undefined') {
    console.log('[CurrencyIcon] Debug:', {
      hasCurrency: !!currency,
      currencyCode: currency?.code || currencyCode,
      iconType: currency?.iconType,
      hasIconSvgPath: !!currency?.iconSvgPath,
      iconSvgPath: currency?.iconSvgPath?.substring(0, 50) + '...',
    });
  }

  if (!currency && !currencyCode) return null;

  // Se for ícone de texto (símbolo)
  if (currency?.iconType === 'TEXT' && currency.symbol) {
    return (
      <span className={className} style={{ fontSize: size }}>
        {currency.symbol}
      </span>
    );
  }

  // Se for ícone SVG
  if (currency?.iconType === 'SVG' && currency.iconSvgPath) {
    const getVariantClass = () => {
      switch (variant) {
        case 'positive':
          return 'text-green-600 dark:text-green-400';
        case 'negative':
          return 'text-red-600 dark:text-red-400';
        case 'neutral':
          return 'text-muted-foreground';
        default:
          return 'text-current';
      }
    };

    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${getVariantClass()} ${className}`}
        aria-label={currency.name}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d={currency.iconSvgPath}
          fill="currentColor"
        />
      </svg>
    );
  }

  // Fallback: exibir código da moeda
  if (currencyCode) {
    return (
      <span className={`text-xs ${className}`} style={{ fontSize: size * 0.6 }}>
        {currencyCode}
      </span>
    );
  }

  return null;
}
