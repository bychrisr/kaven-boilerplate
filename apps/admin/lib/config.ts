import { z } from 'zod';

// Validate environment variables
const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_NAME: z.string().default('Kaven SaaS'),
  NEXT_PUBLIC_APP_VERSION: z.string().default('1.0.0'),
});

// Process environment
const env = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
});

if (!env.success) {
  console.error('❌ Invalid environment variables:', env.error.format());
}

export const CONFIG = {
  appName: env.data?.NEXT_PUBLIC_APP_NAME ?? 'Kaven SaaS',
  appVersion: env.data?.NEXT_PUBLIC_APP_VERSION ?? '1.0.0',
  serverUrl: env.data?.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000',
  
  // Auth
  auth: {
    method: 'jwt',
    skip: false,
    redirectPath: '/dashboard',
    loginPath: '/auth/login',
  },

  // Layout
  layout: {
    headerHeight: 72,
    headerMobileHeight: 64,
    navWidth: 280,
    navMiniWidth: 88,
  },
} as const;
