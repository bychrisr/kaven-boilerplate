import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  logo?: string;
  plan?: string;
}

interface TenantState {
  // State
  tenant: Tenant | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setTenant: (tenant: Tenant | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      tenant: null,
      isLoading: false,
      error: null,

      setTenant: (tenant) => set({ tenant }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'kaven-tenant-storage',
      // Only persist essential if needed, but usually tenant is re-fetched on session
      // For now, persist to avoid flickering
    }
  )
);
