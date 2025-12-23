/**
 * Design Token System
 * Complete type-safe design tokens for the Kaven application
 * Based on Minimals.cc design system
 */

// ============================================
// COLOR TOKENS
// ============================================

export interface ColorShades {
  main: string;
  dark: string;
  light: string;
  lighter: string;
  darker: string;
  contrastText?: string;
}

export interface GrayScale {
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

export interface CommonColors {
  black: string;
  white: string;
}

export interface TextColors {
  primary: string;
  secondary: string;
  disabled: string;
}

export interface BackgroundColors {
  default: string;
  paper: string;
  neutral: string;
}

export interface ActionColors {
  active: string;
  hover: string;
  selected: string;
  disabled: string;
  disabledBackground: string;
  focus: string;
}

export interface ColorPalette {
  primary: ColorShades;
  secondary: ColorShades;
  success: ColorShades;
  warning: ColorShades;
  error: ColorShades;
  info: ColorShades;
  gray: GrayScale;
  common: CommonColors;
  text: TextColors;
  background: BackgroundColors;
  action: ActionColors;
  divider: string;
}

// ============================================
// TYPOGRAPHY TOKENS
// ============================================

export interface TypographyVariant {
  fontSize: string;
  lineHeight: string;
  fontWeight: number;
  letterSpacing?: string;
}

export interface Typography {
  fontFamily: string;
  fontFamilyMonospace: string;
  h1: TypographyVariant;
  h2: TypographyVariant;
  h3: TypographyVariant;
  h4: TypographyVariant;
  h5: TypographyVariant;
  h6: TypographyVariant;
  subtitle1: TypographyVariant;
  subtitle2: TypographyVariant;
  body1: TypographyVariant;
  body2: TypographyVariant;
  caption: TypographyVariant;
  overline: TypographyVariant;
  button: TypographyVariant;
}

// ============================================
// SPACING TOKENS
// ============================================

export interface Spacing {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
  12: string;
  14: string;
  16: string;
  20: string;
  24: string;
}

// ============================================
// BORDER RADIUS TOKENS
// ============================================

export interface BorderRadius {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  full: string;
}

// ============================================
// SHADOW TOKENS
// ============================================

export interface Shadows {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  none: string;
}

// ============================================
// BREAKPOINT TOKENS
// ============================================

export interface Breakpoints {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

// ============================================
// Z-INDEX TOKENS
// ============================================

export interface ZIndex {
  dropdown: number;
  sticky: number;
  fixed: number;
  modalBackdrop: number;
  modal: number;
  popover: number;
  tooltip: number;
}

// ============================================
// TRANSITION TOKENS
// ============================================

export interface Transitions {
  duration: {
    shortest: number;
    shorter: number;
    short: number;
    standard: number;
    complex: number;
    enteringScreen: number;
    leavingScreen: number;
  };
  easing: {
    easeInOut: string;
    easeOut: string;
    easeIn: string;
    sharp: string;
  };
}

// ============================================
// THEME CONFIGURATION
// ============================================

export interface ThemeConfig {
  mode: 'light' | 'dark';
  palette: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  shadows: Shadows;
  breakpoints: Breakpoints;
  zIndex: ZIndex;
  transitions: Transitions;
}

// ============================================
// DEFAULT THEME VALUES
// ============================================

export const defaultLightPalette: ColorPalette = {
  primary: {
    main: '#00ab55',
    dark: '#007b55',
    light: '#5be584',
    lighter: '#c8facd',
    darker: '#005249',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#3366ff',
    dark: '#1939b7',
    light: '#84a9ff',
    lighter: '#d6e4ff',
    darker: '#091a7a',
    contrastText: '#ffffff',
  },
  success: {
    main: '#22c55e',
    dark: '#118d57',
    light: '#77ed8b',
    lighter: '#d8fbde',
    darker: '#065e49',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#ffab00',
    dark: '#b76e00',
    light: '#ffd666',
    lighter: '#fff5cc',
    darker: '#7a4100',
    contrastText: '#212b36',
  },
  error: {
    main: '#ff5630',
    dark: '#b71d18',
    light: '#ffac82',
    lighter: '#ffe9d5',
    darker: '#7a0916',
    contrastText: '#ffffff',
  },
  info: {
    main: '#00b8d9',
    dark: '#006c9c',
    light: '#61f3f3',
    lighter: '#cafdf5',
    darker: '#003768',
    contrastText: '#ffffff',
  },
  gray: {
    50: '#fcfcfd',
    100: '#f9fafb',
    200: '#f4f6f8',
    300: '#dfe3e8',
    400: '#c4cdd5',
    500: '#919eab',
    600: '#637381',
    700: '#454f5b',
    800: '#212b36',
    900: '#161c24',
  },
  common: {
    black: '#000000',
    white: '#ffffff',
  },
  text: {
    primary: '#161c24',
    secondary: '#637381',
    disabled: '#919eab',
  },
  background: {
    default: '#ffffff',
    paper: '#ffffff',
    neutral: '#f4f6f8',
  },
  action: {
    active: '#637381',
    hover: 'rgba(145, 158, 171, 0.08)',
    selected: 'rgba(145, 158, 171, 0.16)',
    disabled: 'rgba(145, 158, 171, 0.8)',
    disabledBackground: 'rgba(145, 158, 171, 0.24)',
    focus: 'rgba(145, 158, 171, 0.24)',
  },
  divider: 'rgba(145, 158, 171, 0.24)',
};

export const defaultDarkPalette: ColorPalette = {
  ...defaultLightPalette,
  text: {
    primary: '#ffffff',
    secondary: '#c4cdd5',
    disabled: '#637381',
  },
  background: {
    default: '#161c24',
    paper: '#212b36',
    neutral: '#212b36',
  },
  action: {
    active: '#c4cdd5',
    hover: 'rgba(255, 255, 255, 0.08)',
    selected: 'rgba(255, 255, 255, 0.16)',
    disabled: 'rgba(255, 255, 255, 0.3)',
    disabledBackground: 'rgba(255, 255, 255, 0.12)',
    focus: 'rgba(255, 255, 255, 0.12)',
  },
  divider: 'rgba(255, 255, 255, 0.12)',
};

export const defaultTypography: Typography = {
  fontFamily:
    "'Public Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
  fontFamilyMonospace: "'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
  h1: {
    fontSize: '48px',
    lineHeight: '60px',
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '36px',
    lineHeight: '48px',
    fontWeight: 700,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: '30px',
    lineHeight: '42px',
    fontWeight: 700,
  },
  h4: {
    fontSize: '24px',
    lineHeight: '36px',
    fontWeight: 700,
  },
  h5: {
    fontSize: '20px',
    lineHeight: '30px',
    fontWeight: 600,
  },
  h6: {
    fontSize: '18px',
    lineHeight: '28px',
    fontWeight: 600,
  },
  subtitle1: {
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: 600,
  },
  subtitle2: {
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: 600,
  },
  body1: {
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: 400,
  },
  body2: {
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: 400,
  },
  caption: {
    fontSize: '12px',
    lineHeight: '18px',
    fontWeight: 400,
  },
  overline: {
    fontSize: '12px',
    lineHeight: '18px',
    fontWeight: 700,
    letterSpacing: '0.1em',
  },
  button: {
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: 600,
    letterSpacing: '0.02em',
  },
};

export const defaultSpacing: Spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
};

export const defaultBorderRadius: BorderRadius = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  full: '9999px',
};

export const defaultShadows: Shadows = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  none: 'none',
};

export const defaultBreakpoints: Breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const defaultZIndex: ZIndex = {
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
};

export const defaultTransitions: Transitions = {
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195,
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
};

// ============================================
// CREATE THEME FUNCTION
// ============================================

export function createTheme(mode: 'light' | 'dark' = 'light'): ThemeConfig {
  return {
    mode,
    palette: mode === 'light' ? defaultLightPalette : defaultDarkPalette,
    typography: defaultTypography,
    spacing: defaultSpacing,
    borderRadius: defaultBorderRadius,
    shadows: defaultShadows,
    breakpoints: defaultBreakpoints,
    zIndex: defaultZIndex,
    transitions: defaultTransitions,
  };
}

// ============================================
// THEME CUSTOMIZATION HELPERS
// ============================================

export function mergeTheme(baseTheme: ThemeConfig, customTheme: Partial<ThemeConfig>): ThemeConfig {
  return {
    ...baseTheme,
    ...customTheme,
    palette: {
      ...baseTheme.palette,
      ...customTheme.palette,
    },
    typography: {
      ...baseTheme.typography,
      ...customTheme.typography,
    },
    spacing: {
      ...baseTheme.spacing,
      ...customTheme.spacing,
    },
    borderRadius: {
      ...baseTheme.borderRadius,
      ...customTheme.borderRadius,
    },
    shadows: {
      ...baseTheme.shadows,
      ...customTheme.shadows,
    },
    breakpoints: {
      ...baseTheme.breakpoints,
      ...customTheme.breakpoints,
    },
    zIndex: {
      ...baseTheme.zIndex,
      ...customTheme.zIndex,
    },
    transitions: {
      ...baseTheme.transitions,
      ...customTheme.transitions,
    },
  };
}
