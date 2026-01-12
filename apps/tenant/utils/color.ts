/**
 * Color Utilities for Branding
 * Generates palette variations from a single HEX color.
 */

// Helper: Convert Hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Helper: Mix two colors (color1 mixed with color2 by weight)
// Weight: 0 = color1, 1 = color2
function mix(color1: {r:number, g:number, b:number}, color2: {r:number, g:number, b:number}, weight: number) {
  // Simple linear interpolation
  return {
    r: Math.round(color1.r + (color2.r - color1.r) * weight),
    g: Math.round(color1.g + (color2.g - color1.g) * weight),
    b: Math.round(color1.b + (color2.b - color1.b) * weight),
  };
}

// Helper: Convert RGB to Hex
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// Helper: Get contrast text (simple brightness check)
function getContrastText(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#FFFFFF';
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128 ? '#212B36' : '#FFFFFF';
}

export type ColorPalette = {
  lighter: string;
  light: string;
  main: string;
  dark: string;
  darker: string;
  contrastText: string;
};

export function generatePalette(hex: string): ColorPalette {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    // Fallback to default green if invalid hex
    return {
       lighter: '#C8FAD6',
       light: '#5BE49B',
       main: '#00A76F',
       dark: '#007867',
       darker: '#004B50',
       contrastText: '#FFFFFF',
    };
  }

  // Minimals-like generation logic (mixing with white for lighter, black for darker)
  // Lighter: Mix 80% white
  const lighterRgb = mix(rgb, {r:255, g:255, b:255}, 0.8);
  const lighter = rgbToHex(lighterRgb.r, lighterRgb.g, lighterRgb.b);

  // Light: Mix 40% white
  const lightRgb = mix(rgb, {r:255, g:255, b:255}, 0.4);
  const light = rgbToHex(lightRgb.r, lightRgb.g, lightRgb.b);

  // Dark: Mix 20% black
  const darkRgb = mix(rgb, {r:0, g:0, b:0}, 0.2);
  const dark = rgbToHex(darkRgb.r, darkRgb.g, darkRgb.b);

  // Darker: Mix 50% black
  const darkerRgb = mix(rgb, {r:0, g:0, b:0}, 0.5);
  const darker = rgbToHex(darkerRgb.r, darkerRgb.g, darkerRgb.b);

  return {
    lighter,
    light,
    main: hex,
    dark,
    darker,
    contrastText: getContrastText(hex),
  };
}
