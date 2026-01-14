import { usePlatformSettings } from './use-platform-settings';
import { useLocale } from './use-locale';

export interface CurrencyConfig {
  code: string; // 'BRL', 'USD', 'EUR', 'GBP'
  symbol: string; // 'R$', '$', '€', '£'
  locale: string; // 'pt-BR', 'en-US', etc
  format: (value: number) => string;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  BRL: 'R$',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

/**
 * Hook para gerenciar moeda da plataforma
 * Similar ao useLocale() e useTimezoneDetection()
 * 
 * @returns CurrencyConfig com código, símbolo, locale e função de formatação
 * 
 * @example
 * const { format, code, symbol } = useCurrency();
 * format(1234.56) // "R$ 1.234,56" (se currency = BRL)
 */
export function useCurrency(): CurrencyConfig {
  const { data: settings } = usePlatformSettings();
  const { locale } = useLocale();

  const currency = settings?.currency || 'BRL';
  const symbol = CURRENCY_SYMBOLS[currency] || currency;

  const format = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  return {
    code: currency,
    symbol,
    locale,
    format,
  };
}
