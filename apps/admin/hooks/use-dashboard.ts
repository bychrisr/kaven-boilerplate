import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth.store';

interface DashboardStats {
  totalUsers: number;
  totalTenants: number;
  totalInvoices: number;
  totalOrders: number;
  revenue: number;
  revenueGrowth: number;
}

interface MonthlyData {
  month: string;
  revenue: number;
  users: number;
}

// Query: Dashboard stats
export function useDashboardStats() {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  
  return useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      // NOTE: Criar endpoint /api/dashboard/stats no backend
      // Por enquanto, retornar dados mock
      return {
        totalUsers: 0,
        totalTenants: 0,
        totalInvoices: 0,
        totalOrders: 0,
        revenue: 0,
        revenueGrowth: 0,
      };
    },
    enabled: isInitialized,
  });
}

// Query: Monthly data for charts
export function useMonthlyData() {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  
  return useQuery<MonthlyData[]>({
    queryKey: ['dashboard', 'monthly'],
    queryFn: async () => {
      // NOTE: Criar endpoint /api/dashboard/monthly no backend
      // Por enquanto, retornar dados mock
      const months = ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      return months.map((month, index) => ({
        month,
        revenue: 8000 + index * 1500 + Math.random() * 1000,
        users: 20 + index * 5 + Math.floor(Math.random() * 10),
      }));
    },
    enabled: isInitialized,
  });
}
