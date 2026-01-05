import { z } from 'zod';

// Schema para criar pagamento
export const createPaymentSchema = z.object({
  userId: z.string().uuid(),
  tenantId: z.string().uuid(),
  productId: z.string().uuid().optional(),
  planId: z.string().uuid().optional(),
}).refine(
  (data) => data.productId || data.planId,
  {
    message: 'productId ou planId é obrigatório',
  }
);

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
