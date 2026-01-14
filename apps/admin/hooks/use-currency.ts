import { usePlatformSettings } from './use-platform-settings';
import { useLocale } from './use-locale';
import { useQuery } from '@tanstack/react-query';

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string | null;
  iconType: 'TEXT' | 'SVG';
  iconSvgPath: string | null;
  decimals: number;
  isActive: boolean;
  isCrypto: boolean;
  sortOrder: number;
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  locale: string;
  currencies: Currency[];
  format: (value: number, currencyCode?: string) => string;
  getCurrency: (code: string) => Currency | undefined;
}

/**
 * Hook para gerenciar moeda da plataforma
 * Busca currencies do banco de dados e fornece formatação dinâmica
 * 
 * @returns CurrencyConfig com código, símbolo, locale, lista de currencies e funções
 * 
 * @example
 * const { format, code, currencies } = useCurrency();
 * format(1234.56) // "R$ 1.234,56" (se currency = BRL)
 * format(1234.56, 'USD') // "$1,234.56"
 */
export function useCurrency(): CurrencyConfig {
  const { data: settings } = usePlatformSettings();
  const { locale } = useLocale();

  // Buscar todas as moedas do banco
  const { data: currencies = [] } = useQuery<Currency[]>({
    queryKey: ['currencies'],
    queryFn: async () => {
      const response = await fetch('/api/currencies');
      if (!response.ok) {
        throw new Error('Failed to fetch currencies');
      }
      return response.json();
    },
    staleTime: 300000, // Cache por 5 minutos (currencies mudam raramente)
    refetchOnWindowFocus: false,
  });

  const defaultCurrencyCode = settings?.currency || 'BRL';
  const defaultCurrency = currencies.find(c => c.code === defaultCurrencyCode);
  const symbol = defaultCurrency?.symbol || defaultCurrencyCode;

  const format = (value: number, currencyCode?: string) => {
    const code = currencyCode || defaultCurrencyCode;
    const currency = currencies.find(c => c.code === code);

    if (!currency) {
      return value.toFixed(2);
    }

    // Para sats, formatação especial (sem Intl.NumberFormat)
    if (code === 'SATS') {
      return Math.round(value).toLocaleString(locale);
    }

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      minimumFractionDigits: currency.decimals,
      maximumFractionDigits: currency.decimals,
    }).format(value);
  };

  const getCurrency = (code: string): Currency | undefined => {
    return currencies.find(c => c.code === code);
  };

  return {
    code: defaultCurrencyCode,
    symbol,
    locale,
    currencies,
    format,
    getCurrency,
  };
}
