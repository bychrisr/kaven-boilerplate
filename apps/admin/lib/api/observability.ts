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

export interface AdvancedMetrics {
  goldenSignals: {
    latency: {
      p50: number;
      p95: number;
      p99: number;
    };
    traffic: {
      requestsPerSecond: number;
      totalRequests: number;
    };
    errors: {
      errorRequests: number;
      errorRate: number;
    };
    saturation: {
      cpuUsagePercent: number;
      memoryUsagePercent: number;
    };
  };
  nodejs: {
    eventLoopLag: number;
    memoryHeap: {
      used: number;
      total: number;
      external: number;
      usedMB: number;
      totalMB: number;
    };
    activeHandles: number;
    activeRequests: number;
  };
  httpDetails: {
    statusDistribution: Record<string, number>;
    uptime: number;
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

  getAdvancedMetrics: async () => {
    const { data } = await api.get<AdvancedMetrics>('/api/observability/advanced');
    return data;
  },

  getAuditLogs: async (params?: { page?: number; limit?: number; action?: string }) => {
    const { data } = await api.get<AuditLogsResponse>('/api/audit-logs', { params });
    return data;
  },
};
