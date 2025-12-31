'use client';

import { useEffect } from 'react';
import { useSettings } from '@/stores/settings.store';
import { generatePalette } from '@/utils/color';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------



export function ThemeConfigurator() {
  const { theme, themeLayout, themeStretch, themeContrast } = useSettings();

  useEffect(() => {
    const applyTheme = async () => {
        let primaryColor = '#00A76F'; // Default Green

        try {
            // Fetch platform settings
            // Optimization: In a real app this should be in a Context/Provider to avoid fetching on every component mount
            // or cached via React Query. For this boilerplate, a simple fetch is acceptable.
            const res = await fetch('/api/settings/platform');
            if (res.ok) {
                const data = await res.json();
                if (data.primaryColor) {
                    primaryColor = data.primaryColor;
                }
            }
        } catch (e) {
            console.error('Failed to load theme settings', e);
        }

        const palette = generatePalette(primaryColor);
        const root = document.documentElement;

        // Inject Color Variables
        root.style.setProperty('--primary', palette.main);
        root.style.setProperty('--primary-foreground', palette.contrastText);
        
        root.style.setProperty('--primary-lighter', palette.lighter);
        root.style.setProperty('--primary-light', palette.light);
        root.style.setProperty('--primary-main', palette.main);
        root.style.setProperty('--primary-dark', palette.dark);
        root.style.setProperty('--primary-darker', palette.darker);

        // Sidebar Specifics (reuse primary for active states)
        root.style.setProperty('--sidebar-primary', palette.main);
        root.style.setProperty('--sidebar-primary-foreground', palette.contrastText);
    };

    applyTheme();
  }, []); // Run once on mount to load platform defaults. 
  // Ideally we would listen to a "branding update" event.

  // Layout Settings
  useEffect(() => {
    const root = document.documentElement;
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
  }, [themeLayout, themeStretch]);

  // Handle Dark/Light Mode
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Handle Contrast Mode
  useEffect(() => {
    const root = document.documentElement;
     if (themeContrast === 'bold') {
        root.classList.add('theme-contrast-bold');
    } else {
        root.classList.remove('theme-contrast-bold');
    }
  }, [themeContrast]);

  return null;
}
