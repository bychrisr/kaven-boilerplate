import { useEffect } from 'react';
import { useSpaceStore } from '@/stores/space.store';

/**
 * Hook para buscar e gerenciar spaces disponíveis
 */
export function useSpaces() {
  const { currentSpace, availableSpaces, isLoading, error, fetchSpaces, setCurrentSpace } = useSpaceStore();
  
  useEffect(() => {
    if (availableSpaces.length === 0 && !isLoading) {
      fetchSpaces();
    }
  }, [availableSpaces.length, isLoading, fetchSpaces]);
  
  return { 
    currentSpace, 
    availableSpaces, 
    isLoading, 
    error,
    setCurrentSpace
  };
}
