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

  // DEBUG LOGS
  console.log('🔍 [useCurrency] Settings currency:', settings?.currency);
  console.log('🔍 [useCurrency] Default code:', defaultCurrencyCode);
  console.log('🔍 [useCurrency] Currencies loaded:', currencies.length);
  console.log('🔍 [useCurrency] Currency codes:', currencies.map(c => c.code));
  console.log('🔍 [useCurrency] Found currency:', defaultCurrency ? {
    code: defaultCurrency.code,
    decimals: defaultCurrency.decimals,
    iconType: defaultCurrency.iconType,
    hasIconSvgPath: !!defaultCurrency.iconSvgPath,
  } : null);

  const format = (value: number, currencyCode?: string) => {
    const code = currencyCode || defaultCurrencyCode;
    const currency = currencies.find(c => c.code === code);

    console.log('💰 [useCurrency.format] Value:', value, 'Code:', code, 'Found:', !!currency);

    if (!currency) {
      return value.toFixed(2);
    }

    // Para SATS: converter de BTC para sats e formatar como inteiro
    if (code === 'SATS') {
      const metadata = currency.metadata as { satsPerBtc?: number } | null;
      const satsPerBtc = metadata?.satsPerBtc || 100000000;
      const satsValue = Math.round(value * satsPerBtc);
      
      // Respeitar numberFormat do usuário (1.000,00 ou 1,000.00)
      const numberFormat = settings?.numberFormat || '1.000,00';
      const useCommaDecimal = numberFormat === '1.000,00';
      
      const formatted = satsValue.toLocaleString(
        useCommaDecimal ? 'pt-BR' : 'en-US',
        { maximumFractionDigits: 0 }
      );
      
      console.log('⚡ [useCurrency.format] SATS result:', formatted);
      return formatted;
    }

    // Para criptomoedas que não são fiat-compatíveis (USDT, etc)
    if (currency.isCrypto && code !== 'BTC') {
      const numberFormat = settings?.numberFormat || '1.000,00';
      const useCommaDecimal = numberFormat === '1.000,00';
      
      const formatted = value.toLocaleString(
        useCommaDecimal ? 'pt-BR' : 'en-US',
        {
          minimumFractionDigits: currency.decimals,
          maximumFractionDigits: currency.decimals,
        }
      );
      
      // Adicionar símbolo manualmente
      return `${currency.symbol || code} ${formatted}`;
    }

    // Para moedas fiat e BTC (compatíveis com Intl.NumberFormat)
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: code,
        minimumFractionDigits: currency.decimals,
        maximumFractionDigits: currency.decimals,
      }).format(value);
    } catch {
      // Fallback se Intl.NumberFormat falhar
      console.warn(`[useCurrency] Intl.NumberFormat failed for ${code}, using manual format`);
      const numberFormat = settings?.numberFormat || '1.000,00';
      const useCommaDecimal = numberFormat === '1.000,00';
      
      const formatted = value.toLocaleString(
        useCommaDecimal ? 'pt-BR' : 'en-US',
        {
          minimumFractionDigits: currency.decimals,
          maximumFractionDigits: currency.decimals,
        }
      );
      
      return `${currency.symbol || code} ${formatted}`;
    }
  };

  const getCurrency = (code: string): Currency | undefined => {
    const found = currencies.find(c => c.code === code);
    console.log('🔎 [useCurrency.getCurrency] Code:', code, 'Found:', !!found);
    return found;
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
