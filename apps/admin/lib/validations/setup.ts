import { z } from 'zod';

/**
 * Schema de validação para configuração do setup
 */
export const setupConfigSchema = z.object({
  companyName: z.string()
    .min(3, 'Nome da empresa deve ter no mínimo 3 caracteres')
    .max(100, 'Nome da empresa deve ter no máximo 100 caracteres'),
  
  adminEmail: z.string()
    .email('Email inválido'),
  
  adminPassword: z.string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
  
  modules: z.object({
    createFinance: z.boolean(),
    createSupport: z.boolean(),
    createMarketing: z.boolean(),
    createDevOps: z.boolean()
  }),
  
  mode: z.enum(['SINGLE_TENANT', 'MULTI_TENANT'])
});

export type SetupConfigInput = z.infer<typeof setupConfigSchema>;
