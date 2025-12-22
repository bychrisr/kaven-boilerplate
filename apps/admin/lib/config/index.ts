/**
 * Global Application Configuration
 * Inspired by Minimals.cc config-global.ts
 * Centralized configuration for the entire application
 */

import packageJson from '../../package.json';

// ============================================
// APP CONFIG
// ============================================

export type AppConfig = {
  name: string;
  version: string;
  description: string;
};

export const APP_CONFIG: AppConfig = {
  name: 'Kaven Admin',
  version: packageJson.version,
  description: 'Multi-tenant SaaS Admin Panel',
};

// ============================================
// API CONFIG
// ============================================

export type ApiConfig = {
  baseUrl: string;
  timeout: number;
  retries: number;
};

export const API_CONFIG: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
  retries: 3,
};

// ============================================
// FEATURE FLAGS
// ============================================

export type FeatureFlags = {
  enableDarkMode: boolean;
  enableMultiTenant: boolean;
  enableNotifications: boolean;
  enableAnalytics: boolean;
  enableExport: boolean;
};

export const FEATURE_FLAGS: FeatureFlags = {
  enableDarkMode: false, // TODO: Implement dark mode
  enableMultiTenant: true,
  enableNotifications: true,
  enableAnalytics: false,
  enableExport: true,
};

// ============================================
// PAGINATION CONFIG
// ============================================

export type PaginationConfig = {
  defaultPageSize: number;
  pageSizeOptions: number[];
};

export const PAGINATION_CONFIG: PaginationConfig = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 25, 50, 100],
};

// ============================================
// CONSOLIDATED CONFIG
// ============================================

export const CONFIG = {
  app: APP_CONFIG,
  api: API_CONFIG,
  features: FEATURE_FLAGS,
  pagination: PAGINATION_CONFIG,
} as const;
