/**
 * Currency Formatting Utilities
 * Brazilian Real (BRL) specific formatters
 */

// ============================================
// CURRENCY FORMATTERS
// ============================================

/**
 * Format BRL currency
 * @example fCurrencyBRL(1234.56) => "R$ 1.234,56"
 */
export function fCurrencyBRL(value: number | string): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value));
}

/**
 * Format currency without symbol
 * @example fCurrencyValue(1234.56) => "1.234,56"
 */
export function fCurrencyValue(value: number | string): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

/**
 * Parse currency string to number
 * @example parseCurrency("R$ 1.234,56") => 1234.56
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}
