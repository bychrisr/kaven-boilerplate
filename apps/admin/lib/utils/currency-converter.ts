import type { Currency } from '@/hooks/use-currency';

/**
 * Utility class para conversão entre moedas
 * Suporta conversão via taxa de câmbio em tempo real
 */
export class CurrencyConverter {
  /**
   * Converte valor de uma moeda para outra usando taxa de câmbio
   * 
   * @param value Valor a converter
   * @param fromCurrency Moeda origem
   * @param toCurrency Moeda destino
   * @param exchangeRate Taxa de câmbio (from → to)
   * @returns Valor convertido
   * 
   * @example
   * // Converter R$ 2.000 para USD (taxa: 1 BRL = 0.20 USD)
   * convert(2000, brlCurrency, usdCurrency, 0.20) // 400
   */
  static convert(
    value: number,
    fromCurrency: Currency,
    toCurrency: Currency,
    exchangeRate: number
  ): number {
    // Se mesma moeda, retorna valor
    if (fromCurrency.code === toCurrency.code) {
      return value;
    }

    // Aplicar taxa de câmbio
    const convertedValue = value * exchangeRate;

    // Arredondar baseado em decimals da moeda destino
    const multiplier = Math.pow(10, toCurrency.decimals);
    return Math.round(convertedValue * multiplier) / multiplier;
  }

  /**
   * Formata valor com conversão automática
   * 
   * @param value Valor original
   * @param currency Moeda do valor
   * @param displayCurrency Moeda para exibição (opcional)
   * @param exchangeRate Taxa de câmbio (se displayCurrency fornecido)
   * @returns String formatada
   */
  static formatWithConversion(
    value: number,
    currency: Currency,
    displayCurrency?: Currency,
    exchangeRate?: number
  ): string {
    if (!displayCurrency || !exchangeRate) {
      return value.toFixed(currency.decimals);
    }

    const convertedValue = this.convert(value, currency, displayCurrency, exchangeRate);
    return convertedValue.toFixed(displayCurrency.decimals);
  }

  /**
   * Calcula taxa de câmbio inversa
   * 
   * @param rate Taxa de câmbio (A → B)
   * @returns Taxa inversa (B → A)
   * 
   * @example
   * // Se 1 BRL = 0.20 USD, então 1 USD = 5 BRL
   * inverseRate(0.20) // 5
   */
  static inverseRate(rate: number): number {
    if (rate === 0) throw new Error('Cannot calculate inverse of zero rate');
    return 1 / rate;
  }
}
