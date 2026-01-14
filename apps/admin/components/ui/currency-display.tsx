'use client';

import { useCurrency } from '@/hooks/use-currency';
import { CurrencyIcon } from './currency-icon';

interface CurrencyDisplayProps {
  value: number;
  currencyCode?: string; // Opcional: especificar moeda diferente da padrão
  className?: string;
  showIcon?: boolean;
  variant?: 'default' | 'positive' | 'negative' | 'neutral' | 'auto';
}

/**
 * Componente para exibir valores monetários formatados
 * Usa automaticamente a moeda configurada em Platform Settings
 * Suporta moedas com ícone SVG (sats) e texto (R$, $, €)
 * 
 * @example
 * <CurrencyDisplay value={1234.56} />
 * // Exibe: "R$ 1.234,56" (se currency = BRL)
 * 
 * @example
 * <CurrencyDisplay value={2051} currencyCode="SATS" variant="auto" />
 * // Exibe: "2,051 ⚡" (ícone SVG de sats)
 */
export function CurrencyDisplay({
  value,
  currencyCode,
  className = '',
  showIcon = true,
  variant = 'default',
}: CurrencyDisplayProps) {
  const { format, code: defaultCode, getCurrency } = useCurrency();
  const code = currencyCode || defaultCode;
  const currency = getCurrency(code);

  if (!currency) {
    return <span className={className}>{value.toFixed(2)}</span>;
  }

  // Determinar variante automaticamente se 'auto'
  let iconVariant: 'default' | 'positive' | 'negative' | 'neutral' = 'default';
  if (variant === 'auto') {
    if (value > 0) iconVariant = 'positive';
    else if (value < 0) iconVariant = 'negative';
    else iconVariant = 'neutral';
  } else {
    iconVariant = variant;
  }

  // Formatação do número baseado em decimals
  const formattedValue = format(value, code);

  if (!showIcon) {
    return <span className={className}>{formattedValue}</span>;
  }

  // Para sats, usar formatação especial (milhões)
  if (code === 'SATS') {
    let displayValue: string;
    if (value === 0) {
      displayValue = '0';
    } else if (Math.abs(value) < 1000000) {
      displayValue = Math.round(value).toLocaleString();
    } else {
      displayValue = `${(value / 1000000).toFixed(1)}M`;
    }

    return (
      <span className={`flex items-center gap-1 ${className}`}>
        {displayValue}
        <CurrencyIcon currency={currency} size={20} variant={iconVariant} />
      </span>
    );
  }

  // Para moedas com ícone SVG, exibir valor + ícone
  if (currency.iconType === 'SVG') {
    return (
      <span className={`flex items-center gap-1 ${className}`}>
        {formattedValue}
        <CurrencyIcon currency={currency} size={16} variant={iconVariant} />
      </span>
    );
  }

  // Para moedas com símbolo texto, Intl.NumberFormat já inclui o símbolo
  return <span className={className}>{formattedValue}</span>;
}
