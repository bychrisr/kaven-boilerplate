/**
 * Semantic Design Tokens
 * Default values for semantic tokens
 */

import type { SemanticDesignTokens } from './types';

// ============================================
// DEFAULT LIGHT TOKENS
// ============================================

export const defaultLightTokens: SemanticDesignTokens = {
  colors: {
    brand: {
      primary: '#00ab55',
      secondary: '#3366ff',
      success: '#22c55e',
      warning: '#ffab00',
      error: '#ff5630',
      info: '#00b8d9',
    },
    text: {
      primary: '#161c24',
      secondary: '#637381',
      disabled: '#919eab',
      inverse: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
      elevated: '#f9fafb',
      overlay: 'rgba(22, 28, 36, 0.8)',
    },
    border: {
      default: 'rgba(145, 158, 171, 0.24)',
      subtle: 'rgba(145, 158, 171, 0.12)',
      strong: 'rgba(145, 158, 171, 0.48)',
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontFamilyMono: "'Fira Code', 'Consolas', 'Monaco', monospace",
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '6rem',   // 96px
  },
  radius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    full: '9999px',
  },
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
};

// ============================================
// DEFAULT DARK TOKENS
// ============================================

export const defaultDarkTokens: SemanticDesignTokens = {
  ...defaultLightTokens,
  colors: {
    ...defaultLightTokens.colors,
    text: {
      primary: '#ffffff',
      secondary: '#c4cdd5',
      disabled: '#637381',
      inverse: '#161c24',
    },
    background: {
      default: '#161c24',
      paper: '#212b36',
      elevated: '#2d3843',
      overlay: 'rgba(0, 0, 0, 0.8)',
    },
    border: {
      default: 'rgba(255, 255, 255, 0.12)',
      subtle: 'rgba(255, 255, 255, 0.06)',
      strong: 'rgba(255, 255, 255, 0.24)',
    },
  },
};
