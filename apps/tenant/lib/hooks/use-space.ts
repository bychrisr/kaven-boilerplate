import { useSpaceStore } from '../store/space-store';
import { useMemo } from 'react';

export const useSpace = () => {
  const { spaces, activeSpaceId, isLoading, setActiveSpace, setSpaces } = useSpaceStore();

  const activeSpace = useMemo(() => 
    spaces.find(s => s.id === activeSpaceId) || null
  , [spaces, activeSpaceId]);

  return {
    spaces,
    activeSpace,
    activeSpaceId,
    isLoading,
    setActiveSpace,
    setSpaces,
  };
};
