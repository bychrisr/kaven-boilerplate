import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Space {
  id: string;
  code: string;
  name: string;
  icon: string;
  color: string;
  isActive: boolean;
}

interface SpaceState {
  // State
  spaces: Space[];
  activeSpaceId: string | null;
  isLoading: boolean;

  // Actions
  setSpaces: (spaces: Space[]) => void;
  setActiveSpace: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useSpaceStore = create<SpaceState>()(
  persist(
    (set) => ({
      spaces: [],
      activeSpaceId: null,
      isLoading: false,

      setSpaces: (spaces) => set({ spaces }),
      
      setActiveSpace: (id) => {
        console.log('🌌 Space Context Changed:', id);
        set({ activeSpaceId: id });
      },
      
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'kaven-space-storage',
      partialize: (state) => ({ activeSpaceId: state.activeSpaceId }), // Persist only active selection
    }
  )
);
