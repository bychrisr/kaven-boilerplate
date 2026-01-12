/**
 * Design System - Main Export
 * Centralized export for all design system functionality
 */

// Core
export * from './core/types';
export * from './core/tokens';

// Adapters
export { muiAdapter } from './adapters/mui';
export { higAdapter } from './adapters/hig';

// Persistence
export * from './persistence';

// Provider
export { DesignSystemProvider, useDesignSystem } from './provider';
