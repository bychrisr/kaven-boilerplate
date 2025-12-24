import { describe, it } from 'node:test';
import assert from 'node:assert';
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
    assert.ok(result.success, 'Valid config should pass');
  });

  it('should fail if DATABASE_URL is missing', () => {
    const invalidEnv = {
      REDIS_URL: 'redis://localhost:6379',
      JWT_SECRET: '32chars_minimun_length_string_here_!',
    };
    const result = envSchema.safeParse(invalidEnv);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some(i => i.path.includes('DATABASE_URL')));
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
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some(i => i.path.includes('JWT_SECRET')));
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
    assert.ok(result.success);
    if (result.success) {
      assert.strictEqual(result.data.PORT, 8000);
      assert.strictEqual(result.data.LOG_LEVEL, 'info');
    }
  });
});
