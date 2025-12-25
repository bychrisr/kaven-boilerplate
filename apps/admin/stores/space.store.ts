import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Space {
  id: 'ARCHITECT' | 'FINANCE' | 'SUPPORT' | 'MARKETING' | 'DEVOPS';
  name: string;
  icon: string;
  color: string;
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
          const response = await fetch('/api/spaces');
          
          if (!response.ok) {
            throw new Error('Failed to fetch spaces');
          }
          
          const data = await response.json();
          const spaces = data.spaces as Space[];
          
          set({ 
            availableSpaces: spaces,
            currentSpace: spaces[0] || null, // Default to first space
            isLoading: false 
          });
        } catch (error) {
          console.error('Error fetching spaces:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false 
          });
        }
      }
    }),
    {
      name: 'space-storage',
      partialize: (state) => ({ 
        currentSpace: state.currentSpace,
        availableSpaces: state.availableSpaces
      })
    }
  )
);
