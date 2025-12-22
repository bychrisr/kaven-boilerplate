import { api } from '../api';

export interface SystemStats {
  uptime: number;
  system: {
    memory: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
    };
    cpu: {
      user: number;
      system: number;
    };
  };
  http: {
    totalRequests: number;
    errorRequests: number;
    requestsPerSecond: number;
    errorRate: number;
  };
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  userId: string;
  user?: {
      name: string;
      email: string;
  };
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface AuditLogsResponse {
  logs: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const observabilityApi = {
  getStats: async () => {
    const { data } = await api.get<SystemStats>('/api/observability/stats');
    return data;
  },

  getAuditLogs: async (params?: { page?: number; limit?: number; action?: string }) => {
    const { data } = await api.get<AuditLogsResponse>('/api/audit-logs', { params });
    return data;
  },
};
