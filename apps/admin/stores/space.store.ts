import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
        console.log('🚀 [SpaceStore] fetchSpaces called');
        set({ isLoading: true, error: null });
        
        try {
          console.log('📡 [SpaceStore] Fetching /api/spaces...');
          const response = await fetch('/api/spaces');
          console.log('📡 [SpaceStore] Response status:', response.status);
          
          if (!response.ok) {
            console.error('❌ [SpaceStore] Failed to fetch:', response.statusText);
            throw new Error('Failed to fetch spaces');
          }
          
          const data = await response.json();
          console.log('📦 [SpaceStore] API Data:', data);
          const spaces = data.spaces as Space[];
          console.log('📦 [SpaceStore] Parsed Spaces:', spaces);
          
          set({ 
            availableSpaces: spaces,
            currentSpace: spaces[0] || null, // Default to first space
            isLoading: false 
          });
          console.log('✅ [SpaceStore] State updated. Current Space:', spaces[0]);
        } catch (error) {
          console.error('❌ [SpaceStore] Error fetching spaces:', error);
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
