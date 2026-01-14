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

  console.log('💵 [CurrencyDisplay] Value:', value, 'Code:', code, 'Currency:', currency ? {
    code: currency.code,
    decimals: currency.decimals,
    iconType: currency.iconType,
    hasIconSvgPath: !!currency.iconSvgPath,
  } : null);

  if (!currency) {
    console.warn('⚠️ [CurrencyDisplay] Currency not found, using fallback');
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

  // IMPORTANTE: Para sats, formatar ANTES de chamar format() para evitar decimais
  if (code === 'SATS') {
    let displayValue: string;
    if (value === 0) {
      displayValue = '0';
    } else if (Math.abs(value) < 1000000) {
      displayValue = Math.round(value).toLocaleString();
    } else {
      displayValue = `${(value / 1000000).toFixed(1)}M`;
    }

    console.log('⚡ [CurrencyDisplay] SATS path - Display value:', displayValue, 'Show icon:', showIcon);

    if (!showIcon) {
      return <span className={className}>{displayValue}</span>;
    }

    return (
      <span className={`flex items-center gap-1.5 text-lg font-semibold ${className}`}>
        <CurrencyIcon currency={currency} size={24} variant={iconVariant} />
        {displayValue}
      </span>
    );
  }

  // Para outras moedas, usar format() normalmente
  const formattedValue = format(value, code);

  console.log('💰 [CurrencyDisplay] Non-SATS path - Formatted:', formattedValue, 'Icon type:', currency.iconType);

  if (!showIcon) {
    return <span className={className}>{formattedValue}</span>;
  }

  // Para moedas com ícone SVG (não-sats), exibir valor + ícone
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
