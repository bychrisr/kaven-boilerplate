/**
 * Core Design System Types
 * Semantic, design-system-agnostic type definitions
 * Updated to support Minimals.cc 5-tone color system
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
// SEMANTIC COLOR TOKENS (Minimals 5-Tone System)
// ============================================

export interface SemanticColorToken {
  // Primary (5 tones)
  primary: string;
  primaryLight: string;
  primaryLighter: string;
  primaryDark: string;
  primaryDarker: string;

  // Secondary (5 tones)
  secondary: string;
  secondaryLight: string;
  secondaryLighter: string;
  secondaryDark: string;
  secondaryDarker: string;

  // Success (5 tones)
  success: string;
  successLight: string;
  successLighter: string;
  successDark: string;
  successDarker: string;

  // Warning (5 tones)
  warning: string;
  warningLight: string;
  warningLighter: string;
  warningDark: string;
  warningDarker: string;

  // Error (5 tones)
  error: string;
  errorLight: string;
  errorLighter: string;
  errorDark: string;
  errorDarker: string;

  // Info (5 tones)
  info: string;
  infoLight: string;
  infoLighter: string;
  infoDark: string;
  infoDarker: string;
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
  neutral: string; // Added for Minimals
}

export interface SemanticBorderColors {
  default: string;
  subtle: string;
  strong: string;
}

export interface SemanticGreyScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

// ============================================
// SEMANTIC TYPOGRAPHY TOKENS
// ============================================

export interface SemanticTypographyScale {
  // Heading sizes (responsive)
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  h5: string;
  h6: string;

  // Body sizes
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
  extrabold: number; // Added for Minimals (800)
}

export interface SemanticLineHeights {
  tight: string;
  normal: string;
  relaxed: string;
  // Specific line heights for headings
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  h5: string;
  h6: string;
  body1: string;
  body2: string;
  button: string;
}

export interface SemanticTypography {
  fontFamily: string;
  fontFamilyMono: string;
  fontFamilyHeadings: string; // Added for Minimals (Barlow)
  fontSize: SemanticTypographyScale;
  fontWeight: SemanticFontWeights;
  lineHeight: SemanticLineHeights;
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
  '2xl': string; // Added for Minimals
  full: string;
}

// ============================================
// SEMANTIC SHADOW TOKENS (Minimals 25 levels)
// ============================================

export interface SemanticShadows {
  none?: string;

  // Standard elevation levels (z-index based)
  z0?: string;
  z1?: string;
  z2?: string;
  z4?: string;
  z6?: string;
  z8?: string;
  z12?: string;
  z16?: string;
  z20?: string;
  z24?: string;

  // Custom shadows by color
  customShadows?: {
    primary?: string;
    secondary?: string;
    success?: string;
    warning?: string;
    error?: string;
    info?: string;
  };

  // Legacy (for compatibility)
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
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
    grey: SemanticGreyScale; // Added for Minimals
  };
  typography: SemanticTypography;
  spacing: SemanticSpacing;
  radius: SemanticRadius;
  shadows: SemanticShadows;
  transitions?: {
    duration?: Record<string, string>;
    easing?: Record<string, string>;
  };
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
  toSemanticTokens(customization: UserCustomization): SemanticDesignTokens;

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
