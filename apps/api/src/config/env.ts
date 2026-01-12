import { z } from 'zod';
import * as dotenv from 'dotenv';
import * as path from 'path';

if (process.env['NODE_ENV'] !== 'production') {
  // Load .env from monorepo root (../../.env from apps/api/src/config/)
  dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
}

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test', 'staging']).default('development'),
  PORT: z.string().transform(Number).default(8000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('2h'),
  REFRESH_TOKEN_SECRET: z.string().min(32, 'REFRESH_TOKEN_SECRET must be at least 32 characters'),
  ENCRYPTION_KEY: z.string().min(32, 'ENCRYPTION_KEY must be at least 32 characters').optional(),
  RATE_LIMIT_MAX: z.union([z.string().transform(Number), z.number()]).default(100),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),

  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // SMTP
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.union([z.string().transform(Number), z.number()]).default(1025),
  SMTP_SECURE: z.union([
    z.boolean(),
    z.string().transform(v => v === 'true')
  ]).default(false),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  
  // Sentry
  SENTRY_DSN: z.string().optional(),
  EMAIL_FROM: z.string().default('Kaven <noreply@kaven.com>'),
  
  // App Config
  MULTI_TENANT_MODE: z.string().default('true'),

  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      console.error(error.issues.map(i => `${i.path}: ${i.message}`).join('\n'));
      process.exit(1);
    }
    throw error;
  }
};

export const env = parseEnv();
export type Environment = z.infer<typeof envSchema>;
