import { z } from 'zod';

// Create User Schema
export const CreateUserSchema = z.object({
  email: z.string().email('Formato de email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  firstName: z.string().min(1, 'Nome é obrigatório').optional(),
  lastName: z.string().min(1, 'Sobrenome é obrigatório').optional(),
  tenantId: z.string().uuid('ID do tenant inválido'),
  isAdm: z.boolean().optional().default(false),
});

// Update User Schema
export const UpdateUserSchema = z.object({
  email: z.string().email('Formato de email inválido').optional(),
  firstName: z.string().min(1, 'Nome deve ter pelo menos 1 caractere').optional(),
  lastName: z.string().min(1, 'Sobrenome deve ter pelo menos 1 caractere').optional(),
  isAdm: z.boolean().optional(),
  password: z.string().min(8, 'Nova senha deve ter pelo menos 8 caracteres').optional(),
});

// Get Users Query Schema
export const GetUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  isAdm: z.coerce.boolean().optional(),
});

// User Response Schema (without sensitive data)
export const UserResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  isAdm: z.boolean(),
  tenantId: z.string().uuid(),
  tenant: z.object({
    id: z.string().uuid(),
    name: z.string(),
    subdomain: z.string(),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// User Stats Schema
export const UserStatsSchema = z.object({
  total: z.number(),
  admins: z.number(),
  regular: z.number(),
  recent: z.number(),
});

// Paginated Users Response Schema
export const PaginatedUsersResponseSchema = z.object({
  users: z.array(UserResponseSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

// Types
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type GetUsersQuery = z.infer<typeof GetUsersQuerySchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UserStats = z.infer<typeof UserStatsSchema>;
export type PaginatedUsersResponse = z.infer<typeof PaginatedUsersResponseSchema>;
