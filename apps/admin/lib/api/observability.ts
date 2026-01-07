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

export interface HardwareMetrics {
  cpu: {
    usage: number;
    cores: number;
    model: string;
    speed: number;
    loadAverage: number[];
    temperature?: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usagePercent: number;
    swap?: {
      total: number;
      used: number;
      free: number;
      usagePercent: number;
    };
  };
  disk: {
    total: number;
    used: number;
    free: number;
    usagePercent: number;
    readSpeed?: number;
    writeSpeed?: number;
  };
  network: {
    interfaces: Array<{
      name: string;
      bytesReceived: number;
      bytesSent: number;
    }>;
  };
  system: {
    uptime: number;
    platform: string;
    arch: string;
    hostname: string;
  };
  timestamp: number;
}

export interface InfrastructureServiceStatus {
  name: string;
  type: 'database' | 'cache' | 'queue' | 'storage';
  priority: number;
  enabled: boolean;
  status: 'healthy' | 'degraded' | 'unhealthy';
  latency: number;
  lastCheck: number;
  errorCount: number;
  successRate: number;
}

export interface ExternalAPIStatus {
  name: string;
  provider: 'stripe' | 'google_maps' | 'pagbit' | 'sendgrid' | 'openai' | 'custom';
  endpoint?: string;
  priority: number;
  enabled: boolean;
  requiresAuth: boolean;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'not_configured';
  latency: number;
  lastCheck: number;
  errorCount: number;
  successRate: number;
  errorMessage?: string;
}

export interface Alert {
  id: string;
  thresholdId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  value: number;
  threshold: number;
  timestamp: number;
  resolved: boolean;
}

export interface AlertThreshold {
  id: string;
  name: string;
  metric: string;
  operator: 'gt' | 'lt' | 'gte' | 'lte' | 'eq';
  value: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
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

  getHardwareMetrics: async () => {
    const { data } = await api.get<{ success: boolean; data: HardwareMetrics }>('/api/observability/hardware');
    return data.data;
  },

  getInfrastructure: async () => {
    const { data } = await api.get<{ success: boolean; data: InfrastructureServiceStatus[] }>('/api/observability/infrastructure');
    return data.data;
  },

  getExternalAPIs: async () => {
    const { data } = await api.get<{ success: boolean; data: ExternalAPIStatus[] }>('/api/observability/external-apis');
    return data.data;
  },

  getAlerts: async () => {
    const { data } = await api.get<{ success: boolean; data: { active: Alert[]; thresholds: AlertThreshold[] } }>('/api/observability/alerts');
    return data.data;
  },

  getAuditLogs: async (params?: { page?: number; limit?: number; action?: string }) => {
    const { data } = await api.get<AuditLogsResponse>('/api/audit-logs', { params });
    return data;
  },
};
