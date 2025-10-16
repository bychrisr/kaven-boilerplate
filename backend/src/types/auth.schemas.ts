import { z } from 'zod';

// Login Schema
export const LoginSchema = z.object({
  email: z.string().email('Formato de email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

// Forgot Password Schema
export const ForgotPasswordSchema = z.object({
  email: z.string().email('Formato de email inválido'),
});

// Refresh Token Schema
export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
});

// Reset Password Schema
export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
});

// Change Password Schema
export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(8, 'Nova senha deve ter pelo menos 8 caracteres'),
});

// JWT Payload Schema
export const JWTPayloadSchema = z.object({
  userId: z.string().uuid(),
  tenantId: z.string().uuid(),
  email: z.string().email(),
  isAdm: z.boolean(),
  iat: z.number(),
  exp: z.number(),
});

// Types
export type LoginInput = z.infer<typeof LoginSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type JWTPayload = z.infer<typeof JWTPayloadSchema>;
