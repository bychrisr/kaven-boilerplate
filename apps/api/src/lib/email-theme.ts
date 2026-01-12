import { defaultLightTokens } from '@kaven/shared';

/**
 * Kaven Design System Tokens for Emails
 * Sourced from @kaven/shared (Single Source of Truth)
 */
export const emailTheme = {
  colors: {
    // Brand Colors - Map to Light Tokens
    // Brand Colors - Map to Light Tokens
    
    primary: defaultLightTokens.colors.brand.primary,
    secondary: defaultLightTokens.colors.brand.secondary,
    
    // UI Colors
    background: defaultLightTokens.colors.background.paper,
    surface: defaultLightTokens.colors.background.paper,
    
    // Text Colors
    text: defaultLightTokens.colors.text.primary,
    textMuted: defaultLightTokens.colors.text.secondary,
    textInverse: defaultLightTokens.colors.text.inverse,
    
    // Semantic Colors
    success: defaultLightTokens.colors.brand.success,
    error: defaultLightTokens.colors.brand.error,
    warning: defaultLightTokens.colors.brand.warning,
    info: defaultLightTokens.colors.brand.info,
    
    // Borders
    border: defaultLightTokens.colors.border.subtle,
    alerts: defaultLightTokens.colors.alerts,
  },
  gradients: defaultLightTokens.gradients,
  typography: {
    fontFamily: defaultLightTokens.typography.fontFamily,
    headingFont: defaultLightTokens.typography.fontFamilyHeadings,
  },
};
