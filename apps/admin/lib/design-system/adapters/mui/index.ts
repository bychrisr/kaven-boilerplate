/**
 * MUI Design System Adapter
 * Translates semantic tokens to MUI/Minimals.cc specific implementation
 */

import type {
  DesignSystemAdapter,
  SemanticDesignTokens,
  UserCustomization,
} from '@/lib/design-system/core/types';
import { DesignSystemType } from '@/lib/design-system/core/types';
import { defaultLightTokens, defaultDarkTokens } from '@/lib/design-system/core/tokens';

export class MUIAdapter implements DesignSystemAdapter {
  type: DesignSystemType = DesignSystemType.MUI;
  name = 'Material UI (Minimals.cc)';

  getDefaultTokens(mode: 'light' | 'dark'): SemanticDesignTokens {
    const baseTokens = mode === 'light' ? defaultLightTokens : defaultDarkTokens;

    // MUI-specific adjustments
    return {
      ...baseTokens,
      colors: {
        ...baseTokens.colors,
        brand: {
          primary: '#00ab55',
          secondary: '#3366ff',
          success: '#22c55e',
          warning: '#ffab00',
          error: '#ff5630',
          info: '#00b8d9',
        },
      },
      radius: {
        none: '0',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        full: '9999px',
      },
    };
  }

  toSemanticTokens(customization: UserCustomization): SemanticDesignTokens {
    const baseTokens = this.getDefaultTokens(customization.mode);

    // Apply user customizations
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

    // Apply typography customization
    if (customization.typography?.fontFamily) {
      tokens.typography.fontFamily = `'${customization.typography.fontFamily}', ${baseTokens.typography.fontFamily}`;
    }

    if (customization.typography?.fontSize) {
      const scale = customization.typography.fontSize;
      Object.keys(tokens.typography.fontSize).forEach((key) => {
        const currentSize = parseFloat(tokens.typography.fontSize[key as keyof typeof tokens.typography.fontSize]);
        tokens.typography.fontSize[key as keyof typeof tokens.typography.fontSize] = `${currentSize * scale}rem`;
      });
    }

    // Apply spacing customization
    if (customization.spacing?.scale) {
      const scale = customization.spacing.scale;
      Object.keys(tokens.spacing).forEach((key) => {
        const currentSpacing = parseFloat(tokens.spacing[key as keyof typeof tokens.spacing]);
        tokens.spacing[key as keyof typeof tokens.spacing] = `${currentSpacing * scale}rem`;
      });
    }

    // Apply radius customization
    if (customization.radius?.scale) {
      const scale = customization.radius.scale;
      Object.keys(tokens.radius).forEach((key) => {
        if (key === 'none' || key === 'full') return;
        const currentRadius = parseFloat(tokens.radius[key as keyof typeof tokens.radius]);
        tokens.radius[key as keyof typeof tokens.radius] = `${currentRadius * scale}rem`;
      });
    }

    return tokens;
  }

  validateCustomization(customization: Partial<UserCustomization>): boolean {
    // Validate color format
    if (customization.colors) {
      const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      for (const color of Object.values(customization.colors)) {
        if (color && !colorRegex.test(color)) {
          return false;
        }
      }
    }

    // Validate scale values
    if (customization.typography?.fontSize && (customization.typography.fontSize < 0.5 || customization.typography.fontSize > 2)) {
      return false;
    }

    if (customization.spacing?.scale && (customization.spacing.scale < 0.5 || customization.spacing.scale > 2)) {
      return false;
    }

    if (customization.radius?.scale && (customization.radius.scale < 0.5 || customization.radius.scale > 2)) {
      return false;
    }

    return true;
  }
}

// Export singleton instance
export const muiAdapter = new MUIAdapter();
