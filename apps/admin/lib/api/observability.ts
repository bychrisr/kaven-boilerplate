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
  resolvedAt?: number;
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
    const { data } = await api.get<{ success: boolean; data: { alerts: Alert[]; active: Alert[]; thresholds: AlertThreshold[] } }>('/api/observability/alerts');
    return data.data;
  },

  getAuditLogs: async (params?: { page?: number; limit?: number; action?: string }) => {
    const { data } = await api.get<AuditLogsResponse>('/api/audit-logs', { params });
    return data;
  },

  // Alert Management
  updateThreshold: async (id: string, updates: Partial<AlertThreshold>) => {
    const { data } = await api.put<{ success: boolean; data: AlertThreshold }>(`/api/observability/alerts/thresholds/${id}`, updates);
    return data.data;
  },

  resolveAlert: async (id: string) => {
    const { data } = await api.post<{ success: boolean; data: Alert }>(`/api/observability/alerts/${id}/resolve`);
    return data.data;
  },

  // Protection Systems
  getCacheMetrics: async () => {
    const { data } = await api.get<{ success: boolean; data: CacheMetrics }>('/api/diagnostics/protection/cache');
    return data.data;
  },

  getRateLimitMetrics: async () => {
    const { data } = await api.get<{ success: boolean; data: RateLimitMetrics }>('/api/diagnostics/protection/rate-limit');
    return data.data;
  },

  // Diagnostic Tools
  startMonitoring: async (durationMinutes: number, intervalSeconds = 10) => {
    const { data } = await api.post<{ success: boolean; data: { sessionId: string; startTime: number; endTime: number } }>('/api/diagnostics/monitor/start', { durationMinutes, intervalSeconds });
    return data.data;
  },

  stopMonitoring: async (sessionId: string) => {
    const { data } = await api.post<{ success: boolean; data: MonitoringSession }>(`/api/diagnostics/monitor/stop/${sessionId}`);
    return data.data;
  },

  getMonitoringSessions: async () => {
    const { data } = await api.get<{ success: boolean; data: { total: number; active: number; sessions: MonitoringSession[] } }>('/api/diagnostics/monitor/sessions');
    return data.data;
  },

  testConnectivity: async () => {
    const { data } = await api.get<{ success: boolean; data: ConnectivityTest; timestamp: number }>('/api/diagnostics/connectivity');
    return data.data;
  },

  forceRefresh: async () => {
    const { data } = await api.post<{ success: boolean; data: HardwareMetrics; refreshTime: number }>('/api/diagnostics/refresh');
    return data.data;
  },
 
  getEmailMetrics: async () => {
    const { data } = await api.get<{ success: boolean; data: EmailMetrics }>('/api/observability/email');
    return data.data;
  },
};
 
// Additional types for new features
export interface EmailMetrics {
  overview: {
    sent: number;
    bounced: number;
    complaints: number;
    deliveryRate: number;
    avgLatencySeconds: number;
  };
  byProvider: Record<string, {
    sent: number;
    bounced: number;
    complaints: number;
    deliveryRate: number;
  }>;
  health: {
    status: 'healthy' | 'warning' | 'critical';
    indicators: {
      bounceRate: number;
      complaintRate: number;
    };
  };
}
export interface CacheMetrics {
  hitCount: number;
  missCount: number;
  total: number;
  hitRate: number;
  missRate: number;
  enabled: boolean;
  ttl: number;
  strategy: string;
}

export interface RateLimitMetrics {
  totalRequests: number;
  violations: number;
  violationRate: number;
  topViolators: Array<{ ip: string; count: number }>;
}

export interface MonitoringSession {
  id: string;
  status: 'active' | 'completed' | 'stopped';
  startTime: number;
  endTime: number;
  durationMinutes: number;
  intervalSeconds: number;
  snapshotCount: number;
}

export interface ConnectivityTest {
  database: {
    status: string;
    latency: number;
  };
  infrastructure: InfrastructureServiceStatus[];
  externalAPIs: ExternalAPIStatus[];
}
