'use client';

import { useEffect } from 'react';
import { useSettings, ThemeColorPresets } from '@/stores/settings.store';

// ----------------------------------------------------------------------

type ColorPalette = {
  name: ThemeColorPresets;
  lighter: string;
  light: string;
  main: string;
  dark: string;
  darker: string;
  contrastText: string;
};

export const presets: ColorPalette[] = [
  // DEFAULT (Green/Emerald-like as per existing)
  {
    name: 'default',
    lighter: '#C8FAD6',
    light: '#5BE49B',
    main: '#00A76F',
    dark: '#007867',
    darker: '#004B50',
    contrastText: '#FFFFFF',
  },
  // CYAN
  {
    name: 'cyan',
    lighter: '#CCF4FE',
    light: '#68CDF9',
    main: '#078DEE',
    dark: '#0351AB',
    darker: '#012972',
    contrastText: '#FFFFFF',
  },
  // PURPLE
  {
    name: 'purple',
    lighter: '#EBD6FD',
    light: '#B985F4',
    main: '#7635dc',
    dark: '#431A9E',
    darker: '#200A69',
    contrastText: '#FFFFFF',
  },
  // BLUE
  {
    name: 'blue',
    lighter: '#D1E9FC',
    light: '#76B0F1',
    main: '#2065D1',
    dark: '#103996',
    darker: '#061B64',
    contrastText: '#FFFFFF',
  },
  // ORANGE
  {
    name: 'orange',
    lighter: '#FEF4D4',
    light: '#FED680',
    main: '#fda92d',
    dark: '#B66816',
    darker: '#793908',
    contrastText: '#212B36',
  },
  // RED
  {
    name: 'red',
    lighter: '#FFE3D5',
    light: '#FFC1AC',
    main: '#FF3030',
    dark: '#B71D18',
    darker: '#7A0916',
    contrastText: '#FFFFFF',
  },
];

export function ThemeConfigurator() {
  const { theme, themeColorPresets, themeLayout, themeStretch, themeContrast } = useSettings();

  useEffect(() => {
    const root = document.documentElement;
    const preset = presets.find((p) => p.name === themeColorPresets) || presets[0];

    // Inject Color Variables
    // We map these to the Shadcn --primary variable and custom Kaven --primary-* vars
    
    // Helper to hexToRgb/Oklch could be added here, 
    // but for now we rely on CSS handling or just set the variable if the system accepts Hex
    // Shadcn globals often use HSL or OKLCH, let's try injecting the HEX directly 
    // and hope Tailwind v4 handles it or we match the format.
    // Looking at globals.css, it uses OKLCH. 
    // Ideally we should convert HEX to OKLCH but for simplicity (and usually browser support for vars)
    // we can stick to hex if we redefine the variable usage, but globals.css defines --primary as oklch(...)
    
    // Actually, simply overriding with HEX works in modern CSS/Tailwind colors usually 
    // IF the variable is used directly.
    
    root.style.setProperty('--primary', preset.main);
    root.style.setProperty('--primary-foreground', preset.contrastText);
    
    // Also inject our extended palette for "Minimals" parity
    root.style.setProperty('--primary-lighter', preset.lighter);
    root.style.setProperty('--primary-light', preset.light);
    root.style.setProperty('--primary-main', preset.main);
    root.style.setProperty('--primary-dark', preset.dark);
    root.style.setProperty('--primary-darker', preset.darker);

    // Layout Settings
    if (themeLayout === 'mini') {
        root.style.setProperty('--layout-nav-width', '88px');
    } else {
        root.style.setProperty('--layout-nav-width', '280px');
    }

    if (themeStretch) {
        root.style.setProperty('--layout-container-width', '100%');
    } else {
        root.style.setProperty('--layout-container-width', '1200px');
    }

  }, [themeColorPresets, themeLayout, themeStretch]);

  // Handle Dark/Light Mode
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Handle Contrast Mode (injects class 'theme-contrast-bold' or similar if needed, 
  // or simply modifies vars. Minimals uses a class usually)
  useEffect(() => {
    const root = document.documentElement;
     if (themeContrast === 'bold') {
        root.classList.add('theme-contrast-bold'); // We can use this later in CSS
    } else {
        root.classList.remove('theme-contrast-bold');
    }
  }, [themeContrast]);

  return null;
}
