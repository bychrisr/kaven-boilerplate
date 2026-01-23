import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';

export interface Space {
  id: string;
  code: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
}

interface SpaceState {
  currentSpace: Space | null;
  availableSpaces: Space[];
  isLoading: boolean;
  error: string | null;
  
  setCurrentSpace: (space: Space) => void;
  fetchSpaces: () => Promise<void>;
}

export const useSpaceStore = create<SpaceState>()(
  persist(
    (set) => ({
      currentSpace: null,
      availableSpaces: [],
      isLoading: false,
      error: null,
      
      setCurrentSpace: (space) => {
        console.log('🔄 Switching to space:', space.name);
        set({ currentSpace: space });
      },
      
  fetchSpaces: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.get('/api/spaces');
      const spaces = response.data.spaces as Space[];
      
      set({ 
        availableSpaces: spaces,
        currentSpace: spaces[0] || null,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false 
      });
    }
  }
    }),
    {
      name: 'space-storage-v2',
      partialize: (state) => ({ 
        currentSpace: state.currentSpace,
        availableSpaces: state.availableSpaces
      })
    }
  )
);
