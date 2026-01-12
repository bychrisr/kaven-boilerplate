/**
 * Semantic Design Tokens - Minimals.cc Inspired
 * Updated with full Minimals palette and design system
 */

import type { SemanticDesignTokens } from './types';

// ============================================
// MINIMALS LIGHT TOKENS
// ============================================

export const defaultLightTokens: SemanticDesignTokens = {
  colors: {
    brand: {
      // Primary - Minimals Green (theme.css)
      primary: '#00AB55',
      primaryLight: '#5BE584',
      primaryLighter: '#C8FACD',
      primaryDark: '#007B55',
      primaryDarker: '#005249',

      // Secondary - Blue (theme.css)
      secondary: '#3366FF',
      secondaryLight: '#84A9FF',
      secondaryLighter: '#D6E4FF',
      secondaryDark: '#1939B7',
      secondaryDarker: '#091A7A',

      // Success - Green
      success: '#22C55E',
      successLight: '#77ED8B',
      successLighter: '#D3FCD2',
      successDark: '#118D57',
      successDarker: '#065E49',

      // Warning - Orange/Yellow
      warning: '#FFAB00',
      warningLight: '#FFD666',
      warningLighter: '#FFF5CC',
      warningDark: '#B76E00',
      warningDarker: '#7A4100',

      // Error - Red/Coral
      error: '#FF5630',
      errorLight: '#FFAC82',
      errorLighter: '#FFE9D5',
      errorDark: '#B71D18',
      errorDarker: '#7A0916',

      // Info - Cyan
      info: '#00B8D9',
      infoLight: '#61F3F3',
      infoLighter: '#CAFDF5',
      infoDark: '#006C9C',
      infoDarker: '#003768',
    },
    text: {
      primary: '#1C252E', // grey.800
      secondary: '#637381', // grey.600
      disabled: '#919EAB', // grey.500
      inverse: '#FFFFFF',
    },
    background: {
      default: '#F9FAFB', // grey.100
      paper: '#FFFFFF',
      elevated: '#FCFDFD', // grey.50
      overlay: 'rgba(22, 28, 36, 0.8)',
      neutral: '#F4F6F8', // grey.200
    },
    border: {
      default: 'rgba(145, 158, 171, 0.2)', // grey.500 alpha 0.2
      subtle: 'rgba(145, 158, 171, 0.12)', // grey.500 alpha 0.12
      strong: 'rgba(145, 158, 171, 0.48)', // grey.500 alpha 0.48
    },
    grey: {
      50: '#FCFCFD',
      100: '#F9FAFB',
      200: '#F4F6F8',
      300: '#DFE3E8',
      400: '#C4CDD5',
      500: '#919EAB',
      600: '#637381',
      700: '#454F5B',
      800: '#212B36',
      900: '#161C24',
    },
    alerts: {
      success: {
        background: '#D3FCD2', // successLighter
        border: '#77ED8B', // successLight
        text: '#118D57', // successDark
        title: '#065E49', // successDarker
      },
      warning: {
        background: '#FFF5CC', // warningLighter
        border: '#FFD666', // warningLight
        text: '#B76E00', // warningDark
        title: '#7A4100', // warningDarker
      },
      error: {
        background: '#FFE9D5', // errorLighter
        border: '#FFAC82', // errorLight
        text: '#B71D18', // errorDark
        title: '#7A0916', // errorDarker
      },
      info: {
        background: '#CAFDF5', // infoLighter
        border: '#61F3F3', // infoLight
        text: '#006C9C', // infoDark
        title: '#003768', // infoDarker
      },
    },
  },
  gradients: {
    main: 'linear-gradient(135deg, #007B55 0%, #00AB55 100%)', // primaryDark -> primary
    success: 'linear-gradient(135deg, #118D57 0%, #22C55E 100%)',
    warning: 'linear-gradient(135deg, #B76E00 0%, #FFAB00 100%)',
    error: 'linear-gradient(135deg, #B71D18 0%, #FF5630 100%)',
    info: 'linear-gradient(135deg, #006C9C 0%, #00B8D9 100%)',
  },
  typography: {
    fontFamily: "'DM Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontFamilyMono: "'Fira Code', 'Consolas', 'Monaco', monospace",
    fontFamilyHeadings: "'Barlow', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: {
      // Responsive sizes (mobile → desktop)
      h1: 'clamp(2.5rem, 5vw, 4rem)', // 40px → 64px
      h2: 'clamp(2rem, 4vw, 3rem)', // 32px → 48px
      h3: 'clamp(1.5rem, 3vw, 2rem)', // 24px → 32px
      h4: 'clamp(1.25rem, 2vw, 1.5rem)', // 20px → 24px
      h5: 'clamp(1.125rem, 1.5vw, 1.1875rem)', // 18px → 19px
      h6: 'clamp(1.0625rem, 1.2vw, 1.125rem)', // 17px → 18px

      // Body sizes
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem', // 48px
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
      h1: '1.25', // 80/64
      h2: '1.33', // 64/48
      h3: '1.5',
      h4: '1.5',
      h5: '1.5',
      h6: '1.56', // 28/18
      body1: '1.5',
      body2: '1.57', // 22/14
      button: '1.71', // 24/14
    },
  },
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '3rem', // 48px
    '3xl': '4rem', // 64px
    '4xl': '6rem', // 96px
  },
  radius: {
    none: '0',
    sm: '0.25rem', // 4px
    md: '0.5rem', // 8px (base)
    lg: '0.75rem', // 12px
    xl: '1rem', // 16px (cards)
    '2xl': '1.25rem', // 20px
    full: '9999px',
  },
  shadows: {
    // Standard elevation shadows (z0-z24)
    z0: 'none',
    z1: '0 1px 2px 0 rgb(145 158 171 / 0.08)',
    z4: '0 4px 8px 0 rgb(145 158 171 / 0.08)',
    z8: '0 8px 16px 0 rgb(145 158 171 / 0.08)',
    z12: '0 0 2px 0 rgb(145 158 171 / 0.2), 0 12px 24px -4px rgb(145 158 171 / 0.12)',
    z16: '0 0 2px 0 rgb(145 158 171 / 0.2), 0 16px 32px -4px rgb(145 158 171 / 0.12)',
    z20: '0 0 2px 0 rgb(145 158 171 / 0.2), 0 20px 40px -4px rgb(145 158 171 / 0.12)',
    z24: '0 0 4px 0 rgb(145 158 171 / 0.12), 0 24px 48px 0 rgb(145 158 171 / 0.12)',

    // Custom shadows by color (Minimals)
    customShadows: {
      primary: '0 8px 16px 0 rgb(24 119 242 / 0.24)',
      secondary: '0 8px 16px 0 rgb(142 51 255 / 0.24)',
      success: '0 8px 16px 0 rgb(34 197 94 / 0.24)',
      warning: '0 8px 16px 0 rgb(255 171 0 / 0.24)',
      error: '0 8px 16px 0 rgb(255 86 48 / 0.24)',
      info: '0 8px 16px 0 rgb(0 184 217 / 0.24)',
    },
  },
  transitions: {
    duration: {
      shortest: '150ms',
      shorter: '200ms',
      short: '250ms',
      standard: '300ms',
      complex: '375ms',
      enteringScreen: '225ms',
      leavingScreen: '195ms',
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
};

// ============================================
// MINIMALS DARK TOKENS (Future)
// ============================================

export const defaultDarkTokens: SemanticDesignTokens = {
  ...defaultLightTokens,
  colors: {
    ...defaultLightTokens.colors,
    text: {
      primary: '#FFFFFF',
      secondary: '#C4CDD5',
      disabled: '#637381',
      inverse: '#161C24',
    },
    background: {
      default: '#161C24',
      paper: '#212B36',
      elevated: '#2D3843',
      overlay: 'rgba(0, 0, 0, 0.8)',
      neutral: '#1C252E',
    },
    border: {
      default: 'rgba(255, 255, 255, 0.12)',
      subtle: 'rgba(255, 255, 255, 0.06)',
      strong: 'rgba(255, 255, 255, 0.24)',
    },
    alerts: {
      success: {
        background: '#065E49', // successDarker
        border: '#118D57', // successDark
        text: '#D3FCD2', // successLighter
        title: '#77ED8B', // successLight
      },
      warning: {
        background: '#7A4100', // warningDarker
        border: '#B76E00', // warningDark
        text: '#FFF5CC', // warningLighter
        title: '#FFD666', // warningLight
      },
      error: {
        background: '#7A0916', // errorDarker
        border: '#B71D18', // errorDark
        text: '#FFE9D5', // errorLighter
        title: '#FFAC82', // errorLight
      },
      info: {
        background: '#003768', // infoDarker
        border: '#006C9C', // infoDark
        text: '#CAFDF5', // infoLighter
        title: '#61F3F3', // infoLight
      },
    },
  },
};
