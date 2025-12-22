/**
 * Apple HIG (Human Interface Guidelines) Adapter
 * Translates semantic tokens to Apple HIG design language
 */

import type {
  DesignSystemAdapter,
  SemanticDesignTokens,
  UserCustomization,
} from '@/lib/design-system/core/types';
import { DesignSystemType } from '@/lib/design-system/core/types';
import { defaultLightTokens, defaultDarkTokens } from '@/lib/design-system/core/tokens';

export class HIGAdapter implements DesignSystemAdapter {
  type: DesignSystemType = DesignSystemType.HIG;
  name = 'Apple Human Interface Guidelines';

  getDefaultTokens(mode: 'light' | 'dark'): SemanticDesignTokens {
    const baseTokens = mode === 'light' ? defaultLightTokens : defaultDarkTokens;

    // HIG-specific adjustments (SF Pro, larger spacing, softer shadows)
    return {
      ...baseTokens,
      colors: {
        ...baseTokens.colors,
        brand: {
          primary: '#007AFF',  // iOS Blue
          secondary: '#5856D6', // iOS Purple
          success: '#34C759',   // iOS Green
          warning: '#FF9500',   // iOS Orange
          error: '#FF3B30',     // iOS Red
          info: '#5AC8FA',      // iOS Teal
        },
      },
      typography: {
        ...baseTokens.typography,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif",
      },
      spacing: {
        xs: '0.5rem',    // 8px - HIG uses larger base spacing
        sm: '0.75rem',   // 12px
        md: '1.25rem',   // 20px
        lg: '2rem',      // 32px
        xl: '2.5rem',    // 40px
        '2xl': '3.5rem', // 56px
        '3xl': '5rem',   // 80px
        '4xl': '7rem',   // 112px
      },
      radius: {
        none: '0',
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '18px',
        full: '9999px',
      },
      shadows: {
        none: 'none',
        sm: '0 1px 3px rgba(0, 0, 0, 0.08)',
        md: '0 4px 12px rgba(0, 0, 0, 0.1)',
        lg: '0 8px 24px rgba(0, 0, 0, 0.12)',
        xl: '0 16px 48px rgba(0, 0, 0, 0.14)',
      },
    };
  }

  toSemanticTokens(customization: UserCustomization): SemanticDesignTokens {
    const baseTokens = this.getDefaultTokens(customization.mode);

    // Apply customizations (same logic as MUI)
    const tokens: SemanticDesignTokens = {
      ...baseTokens,
      colors: {
        ...baseTokens.colors,
        brand: {
          ...baseTokens.colors.brand,
          ...(customization.colors?.primary && { primary: customization.colors.primary }),
          ...(customization.colors?.secondary && { secondary: customization.colors.secondary }),
          ...(customization.colors?.success && { success: customization.colors.success }),
          ...(customization.colors?.warning && { warning: customization.colors.warning }),
          ...(customization.colors?.error && { error: customization.colors.error }),
          ...(customization.colors?.info && { info: customization.colors.info }),
        },
      },
    };

    if (customization.typography?.fontFamily) {
      tokens.typography.fontFamily = `'${customization.typography.fontFamily}', ${baseTokens.typography.fontFamily}`;
    }

    return tokens;
  }

  validateCustomization(customization: Partial<UserCustomization>): boolean {
    // Same validation as MUI
    if (customization.colors) {
      const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      for (const color of Object.values(customization.colors)) {
        if (color && !colorRegex.test(color)) {
          return false;
        }
      }
    }

    return true;
  }
}

// Export singleton instance
export const higAdapter = new HIGAdapter();
