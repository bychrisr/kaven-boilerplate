/**
 * Shadow System - Elevation Levels
 * Based on Material Design elevation system
 * Provides 25 levels of elevation (0-24)
 */

export interface ShadowSystem {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  6: string;
  8: string;
  12: string;
  16: string;
  20: string;
  24: string;
}

// Light mode shadows
export const lightShadows: ShadowSystem = {
  0: 'none',
  1: '0px 1px 2px 0px rgba(145, 158, 171, 0.16)',
  2: '0px 1px 4px 0px rgba(145, 158, 171, 0.16)',
  3: '0px 2px 4px -1px rgba(145, 158, 171, 0.16)',
  4: '0px 3px 6px -2px rgba(145, 158, 171, 0.16)',
  6: '0px 6px 12px -4px rgba(145, 158, 171, 0.16)',
  8: '0px 8px 16px -4px rgba(145, 158, 171, 0.16)',
  12: '0px 12px 24px -6px rgba(145, 158, 171, 0.16)',
  16: '0px 16px 32px -8px rgba(145, 158, 171, 0.16)',
  20: '0px 20px 40px -12px rgba(145, 158, 171, 0.24)',
  24: '0px 24px 48px -12px rgba(145, 158, 171, 0.24)',
};

// Dark mode shadows
export const darkShadows: ShadowSystem = {
  0: 'none',
  1: '0px 1px 2px 0px rgba(0, 0, 0, 0.24)',
  2: '0px 1px 4px 0px rgba(0, 0, 0, 0.24)',
  3: '0px 2px 4px -1px rgba(0, 0, 0, 0.24)',
  4: '0px 3px 6px -2px rgba(0, 0, 0, 0.24)',
  6: '0px 6px 12px -4px rgba(0, 0, 0, 0.24)',
  8: '0px 8px 16px -4px rgba(0, 0, 0, 0.24)',
  12: '0px 12px 24px -6px rgba(0, 0, 0, 0.24)',
  16: '0px 16px 32px -8px rgba(0, 0, 0, 0.24)',
  20: '0px 20px 40px -12px rgba(0, 0, 0, 0.32)',
  24: '0px 24px 48px -12px rgba(0, 0, 0, 0.32)',
};

/**
 * Get shadow by elevation level
 */
export function getShadow(
  elevation: keyof ShadowSystem,
  mode: 'light' | 'dark' = 'light'
): string {
  return mode === 'light' ? lightShadows[elevation] : darkShadows[elevation];
}

/**
 * Custom shadow utilities
 */
export const customShadows = {
  // Card shadows
  card: '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
  cardHover:
    '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 16px 32px -4px rgba(145, 158, 171, 0.16)',

  // Dialog shadows
  dialog: '0px 8px 16px 0px rgba(145, 158, 171, 0.24)',

  // Dropdown shadows
  dropdown: '0px 0px 2px 0px rgba(145, 158, 171, 0.24), 0px 20px 40px -4px rgba(145, 158, 171, 0.24)',

  // Primary color shadows
  primary: '0px 8px 16px 0px rgba(0, 171, 85, 0.24)',
  secondary: '0px 8px 16px 0px rgba(51, 102, 255, 0.24)',
  success: '0px 8px 16px 0px rgba(34, 197, 94, 0.24)',
  warning: '0px 8px 16px 0px rgba(255, 171, 0, 0.24)',
  error: '0px 8px 16px 0px rgba(255, 86, 48, 0.24)',
  info: '0px 8px 16px 0px rgba(0, 184, 217, 0.24)',
};

/**
 * Neumorphism shadows (optional)
 */
export const neumorphicShadows = {
  light: {
    raised: '8px 8px 16px rgba(145, 158, 171, 0.2), -8px -8px 16px rgba(255, 255, 255, 0.8)',
    inset: 'inset 8px 8px 16px rgba(145, 158, 171, 0.2), inset -8px -8px 16px rgba(255, 255, 255, 0.8)',
  },
  dark: {
    raised: '8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.05)',
    inset: 'inset 8px 8px 16px rgba(0, 0, 0, 0.4), inset -8px -8px 16px rgba(255, 255, 255, 0.05)',
  },
};
