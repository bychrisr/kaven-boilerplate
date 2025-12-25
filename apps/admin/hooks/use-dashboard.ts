import { useQuery } from '@tanstack/react-query';
import { getDashboardSummary, getDashboardCharts } from '@/lib/api/dashboard';

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: getDashboardSummary,
    // Add staleTime if needed, e.g. 5 minutes
    staleTime: 1000 * 60 * 5, 
  });
};

export const useDashboardCharts = () => {
  return useQuery({
    queryKey: ['dashboard', 'charts'],
    queryFn: getDashboardCharts,
    staleTime: 1000 * 60 * 5,
  });
};
