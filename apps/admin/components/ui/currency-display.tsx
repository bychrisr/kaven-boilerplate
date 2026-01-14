'use client';

import { useCurrency } from '@/hooks/use-currency';

interface CurrencyDisplayProps {
  value: number;
  className?: string;
  showSymbol?: boolean;
}

/**
 * Componente para exibir valores monetários formatados
 * Usa automaticamente a moeda configurada em Platform Settings
 * 
 * @example
 * <CurrencyDisplay value={1234.56} />
 * // Exibe: "R$ 1.234,56" (se currency = BRL)
 * 
 * @example
 * <CurrencyDisplay value={99.99} showSymbol={false} />
 * // Exibe: "99.99"
 */
export function CurrencyDisplay({
  value,
  className,
  showSymbol = true,
}: CurrencyDisplayProps) {
  const { format, code } = useCurrency();

  if (!showSymbol) {
    return <span className={className}>{value.toFixed(2)}</span>;
  }

  return (
    <span className={className} title={`${code}: ${value}`}>
      {format(value)}
    </span>
  );
}
