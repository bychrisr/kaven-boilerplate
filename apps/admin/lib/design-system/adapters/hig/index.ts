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
          // Primary (iOS Blue - 5 tones)
          primary: '#007AFF',
          primaryLight: '#4DA2FF',
          primaryLighter: '#B3D9FF',
          primaryDark: '#0051D5',
          primaryDarker: '#003D99',
          
          // Secondary (iOS Purple - 5 tones)
          secondary: '#5856D6',
          secondaryLight: '#8E8CFF',
          secondaryLighter: '#C7C6FF',
          secondaryDark: '#3634A3',
          secondaryDarker: '#1E1D5F',
          
          // Success (iOS Green - 5 tones)
          success: '#34C759',
          successLight: '#6EE77B',
          successLighter: '#B7F3BD',
          successDark: '#248A3D',
          successDarker: '#155724',
          
          // Warning (iOS Orange - 5 tones)
          warning: '#FF9500',
          warningLight: '#FFB340',
          warningLighter: '#FFD699',
          warningDark: '#CC7700',
          warningDarker: '#995900',
          
          // Error (iOS Red - 5 tones)
          error: '#FF3B30',
          errorLight: '#FF6B63',
          errorLighter: '#FFB3AF',
          errorDark: '#CC2F26',
          errorDarker: '#99231C',
          
          // Info (iOS Teal - 5 tones)
          info: '#5AC8FA',
          infoLight: '#8DDBFB',
          infoLighter: '#C6EDFD',
          infoDark: '#32A0C8',
          infoDarker: '#1A7896',
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
        '2xl': '22px',
        full: '9999px',
      },
      shadows: {
        none: 'none',
        sm: '0 1px 3px rgba(0, 0, 0, 0.08)',
        md: '0 4px 12px rgba(0, 0, 0, 0.1)',
        lg: '0 8px 24px rgba(0, 0, 0, 0.12)',
        xl: '0 16px 48px rgba(0, 0, 0, 0.14)',
        // Extended shadows for Minimals compatibility
        z0: 'none',
        z1: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        z2: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        z4: '0 4px 8px 0 rgba(0, 0, 0, 0.08)',
        z6: '0 6px 12px 0 rgba(0, 0, 0, 0.08)',
        z8: '0 8px 16px 0 rgba(0, 0, 0, 0.08)',
        z12: '0 12px 24px -4px rgba(0, 0, 0, 0.08)',
        z16: '0 16px 32px -4px rgba(0, 0, 0, 0.08)',
        z20: '0 20px 40px -4px rgba(0, 0, 0, 0.08)',
        z24: '0 24px 48px 0 rgba(0, 0, 0, 0.08)',
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
