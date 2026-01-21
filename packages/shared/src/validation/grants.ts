import { z } from "zod";

export const createGrantRequestSchema = z.object({
  spaceId: z.string().uuid().optional(),
  capabilityId: z.string().uuid().optional(),
  
  // Se não passar accessLevel, assume READ_ONLY no backend
  accessLevel: z.enum(['READ_ONLY', 'READ_WRITE']).optional(), 
  
  // Se não passar scope, assume SPACE no backend
  scope: z.enum(['GLOBAL', 'TENANT', 'SPACE', 'SELF', 'ASSIGNED']).optional(),

  justification: z.string().min(10, { message: 'Justificativa deve ter no mínimo 10 caracteres' }),
  requestedDuration: z.number().int().min(1).max(365).default(7), // Dias
});

export type CreateGrantRequestInput = z.infer<typeof createGrantRequestSchema>;

export const reviewGrantRequestSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT']),
  reason: z.string().optional(), // Obrigatório se REJECT, validado na service/controller
});

export type ReviewGrantRequestInput = z.infer<typeof reviewGrantRequestSchema>;
