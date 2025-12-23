/**
 * Design System Token Utilities
 * Helper constants and utilities to use Minimals design tokens in components
 */

/**
 * Minimals-specific token classes
 * These map to the Minimals.cc design system
 */
export const minimalTokens = {
  // Shadows (Minimals uses z-index based elevation)
  shadow: {
    card: 'shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)]', // z12
    button: 'shadow-[0_8px_16px_0_rgba(145,158,171,0.08)]', // z8
    dialog: 'shadow-[0_24px_48px_0_rgba(145,158,171,0.08)]', // z24
    dropdown: 'shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_20px_40px_-4px_rgba(145,158,171,0.12)]', // z20
  },
  
  // Custom shadows by color (Minimals)
  customShadows: {
    primary: 'shadow-[0_8px_16px_0_rgba(24,119,242,0.24)]',
    secondary: 'shadow-[0_8px_16px_0_rgba(142,51,255,0.24)]',
    success: 'shadow-[0_8px_16px_0_rgba(34,197,94,0.24)]',
    warning: 'shadow-[0_8px_16px_0_rgba(255,171,0,0.24)]',
    error: 'shadow-[0_8px_16px_0_rgba(255,86,48,0.24)]',
    info: 'shadow-[0_8px_16px_0_rgba(0,184,217,0.24)]',
  },
  
  // Radius (Minimals uses specific values)
  radius: {
    sm: 'rounded-[4px]',
    md: 'rounded-[8px]',
    lg: 'rounded-[12px]',
    xl: 'rounded-[16px]', // Cards
    '2xl': 'rounded-[20px]',
  },
  
  // Spacing (Minimals uses 24px for card padding)
  spacing: {
    cardPadding: 'p-6', // 24px
    cardGap: 'gap-6', // 24px
  },
  
  // Typography
  typography: {
    button: 'text-sm font-bold', // 14px, weight 700
    h1: 'text-[clamp(2.5rem,1.25rem+3.333vw,4rem)] font-extrabold leading-[1.25]', // 40-64px
    h2: 'text-[clamp(2rem,1.333rem+1.778vw,3rem)] font-extrabold leading-[1.3]', // 32-48px
  },
  
  // Colors with alpha (for hover states, focus rings)
  alpha: {
    primary: 'rgba(24, 119, 242, 0.24)',
    success: 'rgba(34, 197, 94, 0.24)',
    error: 'rgba(255, 86, 48, 0.24)',
    warning: 'rgba(255, 171, 0, 0.24)',
    info: 'rgba(0, 184, 217, 0.24)',
  },
};

/**
 * Get Minimals color classes
 */
export const minimalColors = {
  primary: {
    main: 'bg-[#1877F2] text-white',
    light: 'bg-[#73BAFB]',
    lighter: 'bg-[#D0ECFE]',
    dark: 'bg-[#0C44AE]',
    darker: 'bg-[#042174]',
    hover: 'hover:bg-[#0C44AE]',
    focus: 'focus-visible:ring-[rgba(24,119,242,0.24)]',
  },
  secondary: {
    main: 'bg-[#8E33FF] text-white',
    light: 'bg-[#C684FF]',
    lighter: 'bg-[#EFD6FF]',
    dark: 'bg-[#5119B7]',
    darker: 'bg-[#27097A]',
    hover: 'hover:bg-[#5119B7]',
    focus: 'focus-visible:ring-[rgba(142,51,255,0.24)]',
  },
  success: {
    main: 'bg-[#22C55E] text-white',
    light: 'bg-[#77ED8B]',
    lighter: 'bg-[#D3FCD2]',
    dark: 'bg-[#118D57]',
    darker: 'bg-[#065E49]',
    hover: 'hover:bg-[#118D57]',
    focus: 'focus-visible:ring-[rgba(34,197,94,0.24)]',
  },
  error: {
    main: 'bg-[#FF5630] text-white',
    light: 'bg-[#FFAC82]',
    lighter: 'bg-[#FFE9D5]',
    dark: 'bg-[#B71D18]',
    darker: 'bg-[#7A0916]',
    hover: 'hover:bg-[#B71D18]',
    focus: 'focus-visible:ring-[rgba(255,86,48,0.24)]',
  },
  warning: {
    main: 'bg-[#FFAB00] text-white',
    light: 'bg-[#FFD666]',
    lighter: 'bg-[#FFF5CC]',
    dark: 'bg-[#B76E00]',
    darker: 'bg-[#7A4100]',
    hover: 'hover:bg-[#B76E00]',
    focus: 'focus-visible:ring-[rgba(255,171,0,0.24)]',
  },
  info: {
    main: 'bg-[#00B8D9] text-white',
    light: 'bg-[#61F3F3]',
    lighter: 'bg-[#CAFDF5]',
    dark: 'bg-[#006C9C]',
    darker: 'bg-[#003768]',
    hover: 'hover:bg-[#006C9C]',
    focus: 'focus-visible:ring-[rgba(0,184,217,0.24)]',
  },
  grey: {
    50: 'bg-[#FCFDFD]',
    100: 'bg-[#F9FAFB]',
    200: 'bg-[#F4F6F8]',
    300: 'bg-[#DFE3E8]',
    400: 'bg-[#C4CDD5]',
    500: 'bg-[#919EAB]',
    600: 'bg-[#637381]',
    700: 'bg-[#454F5B]',
    800: 'bg-[#1C252E]',
    900: 'bg-[#141A21]',
  },
};
