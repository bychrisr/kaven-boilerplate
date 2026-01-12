'use client';

/**
 * Design System Provider
 * Main provider that manages design system state, sync, and CSS injection
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type {
  DesignSystemContextValue,
  SemanticDesignTokens,
  UserCustomization,
  DesignSystemAdapter,
} from '../core/types';
import { DesignSystemType } from '../core/types';
import { defaultLightTokens } from '../core/tokens';
import { muiAdapter } from '../adapters/mui';
import { higAdapter } from '../adapters/hig';
import { syncCustomization, saveAndSync, resetAndSync } from '../persistence';

// ============================================
// ADAPTER REGISTRY
// ============================================

const adapters: Record<DesignSystemType, DesignSystemAdapter> = {
  [DesignSystemType.MUI]: muiAdapter,
  [DesignSystemType.HIG]: higAdapter,
  [DesignSystemType.FLUENT]: muiAdapter, // TODO: Implement Fluent adapter
  [DesignSystemType.SHADCN]: muiAdapter, // TODO: Implement Shadcn adapter
};

// ============================================
// CONTEXT
// ============================================

const DesignSystemContext = createContext<DesignSystemContextValue | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

interface DesignSystemProviderProps {
  children: React.ReactNode;
  userId?: string;
}

export function DesignSystemProvider({ children, userId }: DesignSystemProviderProps) {
  const [designSystem, setDesignSystemState] = useState<DesignSystemType>(DesignSystemType.MUI);
  const [tokens, setTokens] = useState<SemanticDesignTokens>(defaultLightTokens);
  const [customization, setCustomizationState] = useState<UserCustomization>({
    designSystem: DesignSystemType.MUI,
    mode: 'light',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize from cache/DB
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);

        // Try to sync from DB/cache
        const synced = await syncCustomization(userId);

        if (synced) {
          setCustomizationState(synced);
          setDesignSystemState(synced.designSystem);

          // Apply tokens
          const adapter = adapters[synced.designSystem];
          const newTokens = adapter.toSemanticTokens(synced);
          setTokens(newTokens);
        } else {
          // No customization, use defaults
          const defaultCustomization: UserCustomization = {
            designSystem: DesignSystemType.MUI,
            mode: 'light',
          };
          setCustomizationState(defaultCustomization);

          const adapter = adapters[DesignSystemType.MUI];
          const newTokens = adapter.getDefaultTokens('light');
          setTokens(newTokens);
        }
      } catch (error) {
        console.error('Error initializing design system:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [userId]);

  // Inject CSS variables when tokens change
  useEffect(() => {
    if (isLoading) return;
    injectCSSVariables(tokens, customization.mode);
  }, [tokens, customization.mode, isLoading]);

  // Set design system
  const setDesignSystem = useCallback(
    async (type: DesignSystemType) => {
      try {
        setIsSyncing(true);

        const newCustomization: UserCustomization = {
          ...customization,
          designSystem: type,
          updatedAt: new Date(),
        };

        // Save and sync
        const saved = await saveAndSync(newCustomization);
        if (saved) {
          setCustomizationState(saved);
          setDesignSystemState(type);

          // Apply new tokens
          const adapter = adapters[type];
          const newTokens = adapter.toSemanticTokens(saved);
          setTokens(newTokens);
        }
      } catch (error) {
        console.error('Error setting design system:', error);
      } finally {
        setIsSyncing(false);
      }
    },
    [customization]
  );

  // Toggle mode
  const toggleMode = useCallback(async () => {
    const newMode = customization.mode === 'light' ? 'dark' : 'light';

    try {
      setIsSyncing(true);

      const newCustomization: UserCustomization = {
        ...customization,
        mode: newMode,
        updatedAt: new Date(),
      };

      const saved = await saveAndSync(newCustomization);
      if (saved) {
        setCustomizationState(saved);

        // Apply new tokens
        const adapter = adapters[designSystem];
        const newTokens = adapter.toSemanticTokens(saved);
        setTokens(newTokens);
      }
    } catch (error) {
      console.error('Error toggling mode:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [customization, designSystem]);

  // Update customization
  const updateCustomization = useCallback(
    async (partial: Partial<UserCustomization>) => {
      try {
        setIsSyncing(true);

        const newCustomization: UserCustomization = {
          ...customization,
          ...partial,
          updatedAt: new Date(),
        };

        // Validate
        const adapter = adapters[designSystem];
        if (!adapter.validateCustomization(newCustomization)) {
          throw new Error('Invalid customization');
        }

        const saved = await saveAndSync(newCustomization);
        if (saved) {
          setCustomizationState(saved);

          // Apply new tokens
          const newTokens = adapter.toSemanticTokens(saved);
          setTokens(newTokens);
        }
      } catch (error) {
        console.error('Error updating customization:', error);
      } finally {
        setIsSyncing(false);
      }
    },
    [customization, designSystem]
  );

  // Reset customization
  const resetCustomization = useCallback(async () => {
    try {
      setIsSyncing(true);

      await resetAndSync(userId);

      const defaultCustomization: UserCustomization = {
        designSystem,
        mode: customization.mode,
      };

      setCustomizationState(defaultCustomization);

      // Apply default tokens
      const adapter = adapters[designSystem];
      const newTokens = adapter.getDefaultTokens(customization.mode);
      setTokens(newTokens);
    } catch (error) {
      console.error('Error resetting customization:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [userId, designSystem, customization.mode]);

  const value: DesignSystemContextValue = {
    designSystem,
    tokens,
    mode: customization.mode,
    customization,
    setDesignSystem,
    toggleMode,
    updateCustomization,
    resetCustomization,
    isLoading,
    isSyncing,
  };

  return <DesignSystemContext.Provider value={value}>{children}</DesignSystemContext.Provider>;
}

// ============================================
// HOOK
// ============================================

export function useDesignSystem(): DesignSystemContextValue {
  const context = useContext(DesignSystemContext);

  if (context === undefined) {
    throw new Error('useDesignSystem must be used within a DesignSystemProvider');
  }

  return context;
}

// ============================================
// CSS VARIABLE INJECTION
// ============================================

function injectCSSVariables(tokens: SemanticDesignTokens, mode: 'light' | 'dark'): void {
  const root = document.documentElement;

  // Set mode attribute
  root.setAttribute('data-theme', mode);

  // Inject brand colors
  Object.entries(tokens.colors.brand).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });

  // Inject text colors
  Object.entries(tokens.colors.text).forEach(([key, value]) => {
    root.style.setProperty(`--color-text-${key}`, value);
  });

  // Inject background colors
  Object.entries(tokens.colors.background).forEach(([key, value]) => {
    root.style.setProperty(`--color-bg-${key}`, value);
  });

  // Inject border colors
  Object.entries(tokens.colors.border).forEach(([key, value]) => {
    root.style.setProperty(`--color-border-${key}`, value);
  });

  // Inject typography
  root.style.setProperty('--font-family', tokens.typography.fontFamily);
  root.style.setProperty('--font-family-mono', tokens.typography.fontFamilyMono);

  Object.entries(tokens.typography.fontSize).forEach(([key, value]) => {
    root.style.setProperty(`--font-size-${key}`, value);
  });

  Object.entries(tokens.typography.fontWeight).forEach(([key, value]) => {
    root.style.setProperty(`--font-weight-${key}`, String(value));
  });

  Object.entries(tokens.typography.lineHeight).forEach(([key, value]) => {
    root.style.setProperty(`--line-height-${key}`, value);
  });

  // Inject spacing
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, value);
  });

  // Inject radius
  Object.entries(tokens.radius).forEach(([key, value]) => {
    root.style.setProperty(`--radius-${key}`, value);
  });

  // Inject shadows
  Object.entries(tokens.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value);
  });
}
