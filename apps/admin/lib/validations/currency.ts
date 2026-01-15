import { z } from 'zod';

/**
 * Schema de validação para criação/edição de Currency
 */
export const currencySchema = z.object({
  code: z
    .string()
    .min(3, 'Código deve ter no mínimo 3 caracteres')
    .max(10, 'Código deve ter no máximo 10 caracteres')
    .toUpperCase()
    .regex(/^[A-Z]+$/, 'Código deve conter apenas letras maiúsculas'),
  
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  symbol: z
    .string()
    .max(10, 'Símbolo deve ter no máximo 10 caracteres')
    .nullable()
    .optional(),
  
  iconType: z.enum(['TEXT', 'SVG']),
  
  iconSvgPath: z
    .string()
    .max(5000, 'SVG path muito longo')
    .nullable()
    .optional(),
  
  iconSvgViewBox: z
    .string()
    .default('0 0 24 24')
    .optional(),
  
  decimals: z
    .number()
    .int('Decimais deve ser um número inteiro')
    .min(0, 'Decimais deve ser no mínimo 0')
    .max(8, 'Decimais deve ser no máximo 8')
    .default(2),
  
  isActive: z.boolean().default(true),
  
  isCrypto: z.boolean().default(false),
  
  sortOrder: z
    .number()
    .int('Ordem deve ser um número inteiro')
    .min(0, 'Ordem deve ser no mínimo 0')
    .default(0),
  
  metadata: z.record(z.string(), z.any()).nullable().optional(),
});

export type CurrencyFormData = z.infer<typeof currencySchema>;

/**
 * Schema para atualização parcial
 */
export const currencyUpdateSchema = currencySchema.partial();

/**
 * Validação customizada: se iconType = SVG, iconSvgPath é obrigatório
 */
export function validateCurrencyData(data: CurrencyFormData): { 
  valid: boolean; 
  errors?: string[] 
} {
  const errors: string[] = [];

  // Se iconType = SVG, iconSvgPath é obrigatório
  if (data.iconType === 'SVG' && !data.iconSvgPath) {
    errors.push('SVG path é obrigatório quando tipo de ícone é SVG');
  }

  // Se iconType = TEXT, symbol é obrigatório
  if (data.iconType === 'TEXT' && !data.symbol) {
    errors.push('Símbolo é obrigatório quando tipo de ícone é TEXT');
  }

  // Se isCrypto = false, decimals deve ser <= 2
  if (!data.isCrypto && data.decimals > 2) {
    errors.push('Moedas fiat devem ter no máximo 2 casas decimais');
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}
