import { z } from 'zod';

export const createSecurityRequestSchema = z.object({
  type: z.enum(['2FA_RESET']),
  targetUserId: z.string().uuid(),
  justification: z.string().min(10, 'A justificativa deve ter no mínimo 10 caracteres'),
});

export const reviewSecurityRequestSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT']),
  reason: z.string().optional(),
});

export type CreateSecurityRequestInput = z.infer<typeof createSecurityRequestSchema>;
export type ReviewSecurityRequestInput = z.infer<typeof reviewSecurityRequestSchema>;
