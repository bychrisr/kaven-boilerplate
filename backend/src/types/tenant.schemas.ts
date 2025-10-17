import { z } from 'zod';

// Create Tenant Schema
export const CreateTenantSchema = z.object({
  name: z.string().min(1, 'Nome do tenant é obrigatório').max(100, 'Nome muito longo'),
  subdomain: z.string()
    .min(3, 'Subdomínio deve ter pelo menos 3 caracteres')
    .max(50, 'Subdomínio muito longo')
    .regex(/^[a-z0-9-]+$/, 'Subdomínio deve conter apenas letras minúsculas, números e hífens'),
  planId: z.string().uuid('ID do plano inválido').optional(),
});

// Update Tenant Schema
export const UpdateTenantSchema = z.object({
  name: z.string().min(1, 'Nome do tenant é obrigatório').max(100, 'Nome muito longo').optional(),
  subdomain: z.string()
    .min(3, 'Subdomínio deve ter pelo menos 3 caracteres')
    .max(50, 'Subdomínio muito longo')
    .regex(/^[a-z0-9-]+$/, 'Subdomínio deve conter apenas letras minúsculas, números e hífens')
    .optional(),
  planId: z.string().uuid('ID do plano inválido').optional(),
});

// Get Tenants Query Schema
export const GetTenantsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  planId: z.string().uuid().optional(),
});

// Tenant Response Schema
export const TenantResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  subdomain: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  plan: z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().nullable(),
    features: z.any().nullable(),
    price: z.number().nullable(),
  }).nullable(),
  _count: z.object({
    users: z.number(),
    metrics: z.number(),
  }),
});

// Tenant Stats Schema
export const TenantStatsSchema = z.object({
  users: z.object({
    total: z.number(),
    admins: z.number(),
    regular: z.number(),
    recent: z.number(),
  }),
  metrics: z.object({
    total: z.number(),
    last24h: z.number(),
    last7d: z.number(),
  }),
  plan: z.object({
    name: z.string(),
    features: z.any().nullable(),
  }).nullable(),
});

// Global Stats Schema
export const GlobalStatsSchema = z.object({
  total: z.number(),
  active: z.number(),
  byPlan: z.array(z.object({
    planName: z.string(),
    count: z.number(),
  })),
  recent: z.number(),
});

// Paginated Tenants Response Schema
export const PaginatedTenantsResponseSchema = z.object({
  tenants: z.array(TenantResponseSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

// Types
export type CreateTenantInput = z.infer<typeof CreateTenantSchema>;
export type UpdateTenantInput = z.infer<typeof UpdateTenantSchema>;
export type GetTenantsQuery = z.infer<typeof GetTenantsQuerySchema>;
export type TenantResponse = z.infer<typeof TenantResponseSchema>;
export type TenantStats = z.infer<typeof TenantStatsSchema>;
export type GlobalStats = z.infer<typeof GlobalStatsSchema>;
export type PaginatedTenantsResponse = z.infer<typeof PaginatedTenantsResponseSchema>;
