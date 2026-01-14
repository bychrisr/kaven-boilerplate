/**
 * Currency Formatting Utilities
 * Dynamic currency support based on platform settings
 */

// ============================================
// CURRENCY FORMATTERS
// ============================================

/**
 * Format currency dynamically
 * @param value - Number to format
 * @param currency - Currency code (BRL, USD, EUR, GBP)
 * @param locale - Locale for formatting (pt-BR, en-US, etc)
 * @example formatCurrency(1234.56, 'BRL', 'pt-BR') => "R$ 1.234,56"
 * @example formatCurrency(1234.56, 'USD', 'en-US') => "$1,234.56"
 */
export function formatCurrency(
  value: number | string,
  currency: string = 'BRL',
  locale: string = 'pt-BR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(Number(value));
}

/**
 * Format BRL currency (legacy compatibility)
 * @deprecated Use formatCurrency() with useCurrency() hook instead
 * @example fCurrencyBRL(1234.56) => "R$ 1.234,56"
 */
export function fCurrencyBRL(value: number | string): string {
  return formatCurrency(value, 'BRL', 'pt-BR');
}

/**
 * Format currency without symbol
 * @param value - Number to format
 * @param locale - Locale for formatting
 * @example fCurrencyValue(1234.56, 'pt-BR') => "1.234,56"
 */
export function fCurrencyValue(
  value: number | string,
  locale: string = 'pt-BR'
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

/**
 * Parse currency string to number
 * @example parseCurrency("R$ 1.234,56") => 1234.56
 * @example parseCurrency("$1,234.56") => 1234.56
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^\d,.-]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}

/**
 * Get currency symbol
 * @param currency - Currency code
 * @example getCurrencySymbol('BRL') => 'R$'
 * @example getCurrencySymbol('USD') => '$'
 */
export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    BRL: 'R$',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };
  return symbols[currency] || currency;
}
