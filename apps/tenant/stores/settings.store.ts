import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';
export type ThemeLayout = 'vertical' | 'horizontal' | 'mini';
export type ThemeColorPresets = 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red';
export type ThemeContrast = 'default' | 'bold';

interface SettingsState {
  // Theme Mode
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;

  // Layout
  themeLayout: ThemeLayout;
  setThemeLayout: (layout: ThemeLayout) => void;

  // Color Presets
  themeColorPresets: ThemeColorPresets;
  setThemeColorPresets: (presets: ThemeColorPresets) => void;

  // Stretch
  themeStretch: boolean;
  setThemeStretch: (stretch: boolean) => void;

  // Contrast
  themeContrast: ThemeContrast;
  setThemeContrast: (contrast: ThemeContrast) => void;

  // Reset
  onResetSetting: () => void;
}

const initialState = {
  theme: 'light' as ThemeMode,
  themeLayout: 'vertical' as ThemeLayout,
  themeColorPresets: 'default' as ThemeColorPresets,
  themeStretch: false,
  themeContrast: 'default' as ThemeContrast,
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      ...initialState,

      // Actions
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      
      setThemeLayout: (themeLayout) => set({ themeLayout }),
      setThemeColorPresets: (themeColorPresets) => set({ themeColorPresets }),
      setThemeStretch: (themeStretch) => set({ themeStretch }),
      setThemeContrast: (themeContrast) => set({ themeContrast }),
      
      onResetSetting: () => set(initialState),
    }),
    {
      name: 'kaven-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
