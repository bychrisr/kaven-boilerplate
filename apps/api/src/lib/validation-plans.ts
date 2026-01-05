import { z } from 'zod';

// ===========================
// PLAN SCHEMAS
// ===========================

const planFeatureSchema = z.object({
  featureCode: z.string(),
  enabled: z.boolean().optional(),
  limitValue: z.number().int().optional(),
  customValue: z.string().optional(),
  displayOverride: z.string().optional(),
});

const priceSchema = z.object({
  interval: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'LIFETIME', 'FOREVER']),
  intervalCount: z.number().int().min(1).default(1),
  amount: z.number().min(0),
  currency: z.string().length(3).default('BRL'),
  originalAmount: z.number().min(0).optional(),
  stripePriceId: z.string().optional(),
  pagueBitPriceId: z.string().optional(),
});

export const createPlanSchema = z.object({
  code: z.string().regex(/^[a-z0-9_-]+$/, { message: 'Code deve conter apenas letras minúsculas, números, hífens e underscores' }),
  name: z.string().min(2, { message: 'Nome deve ter no mínimo 2 caracteres' }),
  description: z.string().optional(),
  type: z.enum(['SUBSCRIPTION', 'LIFETIME']).default('SUBSCRIPTION'),
  trialDays: z.number().int().min(0).default(0),
  isDefault: z.boolean().default(false),
  isPublic: z.boolean().default(true),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  badge: z.string().optional(),
  stripeProductId: z.string().optional(),
  tenantId: z.string().uuid().nullable().optional(),
  prices: z.array(priceSchema).min(1, { message: 'Plano deve ter pelo menos um preço' }),
  features: z.array(planFeatureSchema).optional(),
  metadata: z.record(z.any()).optional(),
});

export const updatePlanSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  trialDays: z.number().int().min(0).optional(),
  isDefault: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  badge: z.string().nullable().optional(),
  stripeProductId: z.string().nullable().optional(),
  metadata: z.record(z.any()).optional(),
});

export const listPlansSchema = z.object({
  tenantId: z.string().uuid().optional(),
  isActive: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  type: z.enum(['SUBSCRIPTION', 'LIFETIME']).optional(),
});

// ===========================
// PRODUCT SCHEMAS
// ===========================

const productEffectSchema = z.object({
  featureCode: z.string(),
  effectType: z.enum(['ADD', 'SET', 'MULTIPLY', 'ENABLE']).default('ADD'),
  value: z.number().int().optional(),
  isPermanent: z.boolean().default(false),
  durationDays: z.number().int().positive().optional(),
});

export const createProductSchema = z.object({
  code: z.string().regex(/^[a-z0-9_-]+$/, { message: 'Code deve conter apenas letras minúsculas, números, hífens e underscores' }),
  name: z.string().min(2, { message: 'Nome deve ter no mínimo 2 caracteres' }),
  description: z.string().optional(),
  type: z.enum(['ONE_TIME', 'CONSUMABLE', 'ADD_ON']).default('ONE_TIME'),
  price: z.number().min(0),
  currency: z.string().length(3).default('BRL'),
  originalPrice: z.number().min(0).optional(),
  isActive: z.boolean().default(true),
  isPublic: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  stock: z.number().int().default(-1),
  maxPerTenant: z.number().int().default(-1),
  stripeProductId: z.string().optional(),
  stripePriceId: z.string().optional(),
  imageUrl: z.string().url().optional(),
  tenantId: z.string().uuid().nullable().optional(),
  effects: z.array(productEffectSchema).min(1, { message: 'Produto deve ter pelo menos um efeito' }),
  metadata: z.record(z.any()).optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  originalPrice: z.number().min(0).nullable().optional(),
  isActive: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  stock: z.number().int().optional(),
  maxPerTenant: z.number().int().optional(),
  imageUrl: z.string().url().nullable().optional(),
  metadata: z.record(z.any()).optional(),
});

export const listProductsSchema = z.object({
  tenantId: z.string().uuid().optional(),
  isActive: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  type: z.enum(['ONE_TIME', 'CONSUMABLE', 'ADD_ON']).optional(),
});

// ===========================
// SUBSCRIPTION SCHEMAS
// ===========================

export const upgradePlanSchema = z.object({
  planId: z.string().uuid(),
  priceId: z.string().uuid().optional(),
  prorated: z.boolean().default(true),
});

export const cancelSubscriptionSchema = z.object({
  immediately: z.boolean().default(false),
  reason: z.string().optional(),
});

// ===========================
// FEATURE SCHEMAS
// ===========================

export const createFeatureSchema = z.object({
  code: z.string().regex(/^[A-Z0-9_]+$/, { message: 'Code deve conter apenas letras maiúsculas, números e underscores' }),
  name: z.string().min(2, { message: 'Nome deve ter no mínimo 2 caracteres' }),
  description: z.string().optional(),
  type: z.enum(['BOOLEAN', 'QUOTA', 'CUSTOM']).default('BOOLEAN'),
  defaultValue: z.string().optional(),
  unit: z.string().optional(),
  category: z.string().optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const updateFeatureSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  defaultValue: z.string().nullable().optional(),
  unit: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

// ===========================
// TYPES
// ===========================

export type CreatePlanInput = z.infer<typeof createPlanSchema>;
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>;
export type ListPlansInput = z.infer<typeof listPlansSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ListProductsInput = z.infer<typeof listProductsSchema>;
export type UpgradePlanInput = z.infer<typeof upgradePlanSchema>;
export type CancelSubscriptionInput = z.infer<typeof cancelSubscriptionSchema>;
export type CreateFeatureInput = z.infer<typeof createFeatureSchema>;
export type UpdateFeatureInput = z.infer<typeof updateFeatureSchema>;
