/**
 * Number Formatting Utilities
 * Inspired by Minimals.cc format-number.ts
 */

// ============================================
// NUMBER FORMATTERS
// ============================================

/**
 * Format number with thousands separator
 * @example fNumber(1234) => "1.234"
 */
export function fNumber(number: number | string): string {
  return new Intl.NumberFormat('pt-BR').format(Number(number));
}

/**
 * Format currency (BRL)
 * @example fCurrency(1234.56) => "R$ 1.234,56"
 */
export function fCurrency(number: number | string): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(number));
}

/**
 * Format percentage
 * @example fPercent(0.1234) => "12,34%"
 */
export function fPercent(number: number | string, decimals: number = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number(number));
}

/**
 * Format compact number (K, M, B)
 * @example fCompact(1234567) => "1,2 mi"
 */
export function fCompact(number: number | string): string {
  return new Intl.NumberFormat('pt-BR', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(Number(number));
}

/**
 * Format file size
 * @example fData(1234567) => "1,18 MB"
 */
export function fData(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Shorten number with suffix
 * @example fShortenNumber(1234567) => "1.23M"
 */
export function fShortenNumber(number: number): string {
  const format = number ? Math.floor(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';

  return format;
}
