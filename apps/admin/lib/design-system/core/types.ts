/**
 * Core Design System Types
 * Semantic, design-system-agnostic type definitions
 */

// ============================================
// DESIGN SYSTEM ENUM
// ============================================

export enum DesignSystemType {
  MUI = 'mui',
  HIG = 'hig',
  FLUENT = 'fluent',
  SHADCN = 'shadcn',
}

// ============================================
// SEMANTIC COLOR TOKENS
// ============================================

export interface SemanticColorToken {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface SemanticTextColors {
  primary: string;
  secondary: string;
  disabled: string;
  inverse: string;
}

export interface SemanticBackgroundColors {
  default: string;
  paper: string;
  elevated: string;
  overlay: string;
}

export interface SemanticBorderColors {
  default: string;
  subtle: string;
  strong: string;
}

// ============================================
// SEMANTIC TYPOGRAPHY TOKENS
// ============================================

export interface SemanticTypographyScale {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
}

export interface SemanticFontWeights {
  light: number;
  regular: number;
  medium: number;
  semibold: number;
  bold: number;
}

export interface SemanticTypography {
  fontFamily: string;
  fontFamilyMono: string;
  fontSize: SemanticTypographyScale;
  fontWeight: SemanticFontWeights;
  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
  };
}

// ============================================
// SEMANTIC SPACING TOKENS
// ============================================

export interface SemanticSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

// ============================================
// SEMANTIC RADIUS TOKENS
// ============================================

export interface SemanticRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

// ============================================
// SEMANTIC SHADOW TOKENS
// ============================================

export interface SemanticShadows {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

// ============================================
// SEMANTIC DESIGN TOKENS (Complete)
// ============================================

export interface SemanticDesignTokens {
  colors: {
    brand: SemanticColorToken;
    text: SemanticTextColors;
    background: SemanticBackgroundColors;
    border: SemanticBorderColors;
  };
  typography: SemanticTypography;
  spacing: SemanticSpacing;
  radius: SemanticRadius;
  shadows: SemanticShadows;
}

// ============================================
// USER CUSTOMIZATION
// ============================================

export interface UserCustomization {
  id?: string;
  userId?: string;
  designSystem: DesignSystemType;
  colors?: {
    primary?: string;
    secondary?: string;
    success?: string;
    warning?: string;
    error?: string;
    info?: string;
  };
  typography?: {
    fontFamily?: string;
    fontSize?: number; // base size multiplier
  };
  spacing?: {
    scale?: number; // spacing scale multiplier
  };
  radius?: {
    scale?: number; // radius scale multiplier
  };
  mode: 'light' | 'dark';
  createdAt?: Date;
  updatedAt?: Date;
}

// ============================================
// DESIGN SYSTEM ADAPTER INTERFACE
// ============================================

export interface DesignSystemAdapter {
  /**
   * Design system identifier
   */
  type: DesignSystemType;

  /**
   * Design system name
   */
  name: string;

  /**
   * Convert user customization to semantic tokens
   */
  toSemanticTokens(
    customization: UserCustomization
  ): SemanticDesignTokens;

  /**
   * Get default tokens for this design system
   */
  getDefaultTokens(mode: 'light' | 'dark'): SemanticDesignTokens;

  /**
   * Validate customization for this design system
   */
  validateCustomization(customization: Partial<UserCustomization>): boolean;
}

// ============================================
// THEME CONTEXT VALUE
// ============================================

export interface DesignSystemContextValue {
  /**
   * Current design system
   */
  designSystem: DesignSystemType;

  /**
   * Current semantic tokens
   */
  tokens: SemanticDesignTokens;

  /**
   * Current mode
   */
  mode: 'light' | 'dark';

  /**
   * User customization
   */
  customization: UserCustomization;

  /**
   * Switch design system
   */
  setDesignSystem: (type: DesignSystemType) => Promise<void>;

  /**
   * Toggle light/dark mode
   */
  toggleMode: () => Promise<void>;

  /**
   * Update customization
   */
  updateCustomization: (customization: Partial<UserCustomization>) => Promise<void>;

  /**
   * Reset to defaults
   */
  resetCustomization: () => Promise<void>;

  /**
   * Loading state
   */
  isLoading: boolean;

  /**
   * Sync state
   */
  isSyncing: boolean;
}
