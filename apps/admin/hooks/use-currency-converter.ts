import { useQuery } from '@tanstack/react-query';

interface ConversionResult {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  timestamp: string;
}

interface UseCurrencyConverterOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

/**
 * Hook para conversão de moedas em tempo real
 * Atualiza automaticamente a cada 30 segundos
 * 
 * @param from - Código da moeda de origem (ex: 'BRL')
 * @param to - Código da moeda de destino (ex: 'SATS')
 * @param amount - Valor a converter
 * @param options - Opções do hook (enabled, refetchInterval)
 * 
 * @example
 * const { result, rate, isLoading } = useCurrencyConverter('BRL', 'SATS', 100);
 * // result: ~2051 sats (depende da cotação)
 * // rate: ~20.51 (1 BRL = 20.51 sats)
 */
export function useCurrencyConverter(
  from: string,
  to: string,
  amount: number,
  options?: UseCurrencyConverterOptions
) {
  const { enabled = true, refetchInterval = 30000 } = options || {};

  const { data, isLoading, error, isError } = useQuery<ConversionResult>({
    queryKey: ['currency-convert', from, to, amount],
    queryFn: async () => {
      const params = new URLSearchParams({
        from,
        to,
        amount: String(amount),
      });

      const response = await fetch(`/api/currencies/convert?${params}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha na conversão');
      }

      return response.json();
    },
    enabled: enabled && amount > 0,
    refetchInterval, // Atualiza a cada 30s por padrão
    staleTime: 30000, // Considera dados "frescos" por 30s
    gcTime: 300000, // Cache por 5 minutos
    retry: 3, // Tenta 3 vezes em caso de erro
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    from: data?.from || from,
    to: data?.to || to,
    amount: data?.amount || amount,
    result: data?.result || 0,
    rate: data?.rate || 0,
    timestamp: data?.timestamp || '',
    isLoading,
    error: isError ? (error as Error) : null,
  };
}
