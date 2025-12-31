import { api } from '../api';

export interface DashboardSummary {
  totalUsers: number;
  revenue: number;
  invoices: number;
  orders: number;
}

export interface ChartData {
  name: string;
  revenue: number;
  users: number;
}

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const { data } = await api.get<DashboardSummary>('/api/dashboard/summary');
  return data;
};

export const getDashboardCharts = async (): Promise<ChartData[]> => {
  const { data } = await api.get<ChartData[]>('/api/dashboard/charts');
  return data;
};
