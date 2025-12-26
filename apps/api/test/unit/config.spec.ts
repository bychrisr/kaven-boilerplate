import { describe, it, expect } from 'vitest';
import { envSchema } from '../../src/config/env.schema';

describe('Environment Configuration (Zod)', () => {
  it('should validate valid configuration', () => {
    const validEnv = {
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
      REDIS_URL: 'redis://localhost:6379',
      JWT_SECRET: '12345678901234567890123456789012', // 32 chars
      REFRESH_TOKEN_SECRET: '12345678901234567890123456789012', // 32 chars
    };
    const result = envSchema.safeParse(validEnv);
    expect(result.success).toBe(true);
  });

  it('should fail if DATABASE_URL is missing', () => {
    const invalidEnv = {
      REDIS_URL: 'redis://localhost:6379',
      JWT_SECRET: '32chars_minimun_length_string_here_!',
    };
    const result = envSchema.safeParse(invalidEnv);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.path.includes('DATABASE_URL'))).toBe(true);
    }
  });

  it('should fail if JWT_SECRET is too short', () => {
    const invalidEnv = {
      DATABASE_URL: 'postgresql://...',
      REDIS_URL: 'redis://...',
      JWT_SECRET: 'short',
      REFRESH_TOKEN_SECRET: '32chars_minimun_length_string_here_!',
    };
    const result = envSchema.safeParse(invalidEnv);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.path.includes('JWT_SECRET'))).toBe(true);
    }
  });

  it('should use defaults for optional fields', () => {
    const minimalEnv = {
      DATABASE_URL: 'postgresql://...',
      REDIS_URL: 'redis://...',
      JWT_SECRET: '12345678901234567890123456789012',
      REFRESH_TOKEN_SECRET: '12345678901234567890123456789012',
      // PORT missing, should default
    };
    const result = envSchema.safeParse(minimalEnv);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.PORT).toBe(8000);
      expect(result.data.LOG_LEVEL).toBe('info');
    }
  });
});
