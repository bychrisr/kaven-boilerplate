import { z } from 'zod';

// ===========================
// AUTH SCHEMAS
// ===========================

export const registerSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(8, { message: 'Senha deve ter no mínimo 8 caracteres' }),
  name: z.string().min(2, { message: 'Nome deve ter no mínimo 2 caracteres' }),
  tenantSlug: z.string().optional(), // Para multi-tenant
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(1, { message: 'Senha é obrigatória' }),
  twoFactorCode: z.string().length(6).optional(), // TOTP code
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, { message: 'Senha deve ter no mínimo 8 caracteres' }),
});

export const verifyEmailSchema = z.object({
  token: z.string(),
});

export const setup2FASchema = z.object({
  userId: z.string().uuid(),
});

export const verify2FASchema = z.object({
  userId: z.string().uuid(),
  code: z.string().length(6),
});

export const disable2FASchema = z.object({
  userId: z.string().uuid(),
  code: z.string().length(6),
});

// ===========================
// USER SCHEMAS
// ===========================

export const createUserSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(8, { message: 'Senha deve ter no mínimo 8 caracteres' }),
  name: z.string().min(2, { message: 'Nome deve ter no mínimo 2 caracteres' }),
  phone: z.string().optional(),
  role: z.enum(['SUPER_ADMIN', 'TENANT_ADMIN', 'USER']).default('USER'),
  status: z.enum(['ACTIVE', 'PENDING', 'BANNED', 'REJECTED']).default('ACTIVE'),
  emailVerified: z.boolean().optional(),
  tenantId: z.union([z.string().uuid(), z.literal('create-own')]).optional(),
  // Metadata fields
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  zipcode: z.string().optional(),
  company: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().nullable().optional(),
  role: z.enum(['SUPER_ADMIN', 'TENANT_ADMIN', 'USER']).optional(),
  status: z.enum(['ACTIVE', 'PENDING', 'BANNED', 'REJECTED']).optional(),
  emailVerified: z.boolean().optional(),
  tenantId: z.string().uuid().nullable().optional(),
  // Metadata fields
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  zipcode: z.string().optional(),
  company: z.string().optional(),
  avatarUrl: z.string().optional(),
});

// ===========================
// TENANT SCHEMAS
// ===========================

export const createTenantSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter no mínimo 2 caracteres' }),
  slug: z.string().regex(/^[a-z0-9-]+$/, { message: 'Slug deve conter apenas letras minúsculas, números e hífens' }),
  domain: z.string().optional(),
});

export const updateTenantSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  domain: z.string().optional(),
  status: z.enum (['ACTIVE', 'SUSPENDED', 'DELETED']).optional(),
});

// ===========================
// TYPES
// ===========================

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateTenantInput = z.infer<typeof createTenantSchema>;
export type UpdateTenantInput = z.infer<typeof updateTenantSchema>;

// ===========================
// GRANT REQUEST SCHEMAS
// ===========================

// Grants validation moved to @kaven/shared
