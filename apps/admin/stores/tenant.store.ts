import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
}

interface TenantState {
  tenant: Tenant | null;
  isLoading: boolean;
  error: string | null;
  
  fetchTenant: () => Promise<void>;
  setTenant: (tenant: Tenant) => void;
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      tenant: null,
      isLoading: false,
      error: null,
      
      fetchTenant: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/tenant');
          
          if (!response.ok) {
            throw new Error('Failed to fetch tenant');
          }
          
          const data = await response.json();
          set({ tenant: data, isLoading: false });
        } catch (error) {
          console.error('Error fetching tenant:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false 
          });
        }
      },
      
      setTenant: (tenant) => set({ tenant })
    }),
    {
      name: 'tenant-storage',
      partialize: (state) => ({ tenant: state.tenant })
    }
  )
);
