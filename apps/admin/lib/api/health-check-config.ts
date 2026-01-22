import { api } from '../api';

export interface HealthCheckConfig {
  id: string;
  enabled: boolean;
  frequency: '15m' | '30m' | '1h' | '6h' | '12h' | '24h';
  lastRun: string | null;
  nextRun: string | null;
  createdAt: string;
  updatedAt: string;
}

export const healthCheckConfigApi = {
  /**
   * Get current health check configuration
   */
  getConfig: async (): Promise<HealthCheckConfig> => {
    const { data } = await api.get('/api/settings/email/health-check-config');
    return data;
  },

  /**
   * Update health check configuration
   */
  updateConfig: async (updates: Partial<Pick<HealthCheckConfig, 'enabled' | 'frequency'>>): Promise<HealthCheckConfig> => {
    const { data } = await api.put('/api/settings/email/health-check-config', updates);
    return data;
  },

  /**
   * Run health check manually
   */
  runNow: async (): Promise<{ success: boolean; message: string }> => {
    const { data } = await api.post('/api/settings/email/health-check-config/run-now');
    return data;
  },
};
