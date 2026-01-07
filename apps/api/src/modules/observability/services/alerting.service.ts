export interface AlertThreshold {
  id: string;
  name: string;
  metric: string;
  operator: 'gt' | 'lt' | 'gte' | 'lte' | 'eq';
  value: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
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

export class AlertingService {
  private thresholds: AlertThreshold[] = [
    {
      id: 'cpu_high',
      name: 'CPU Usage High',
      metric: 'cpu_usage',
      operator: 'gt',
      value: 80,
      severity: 'high',
      enabled: true
    },
    {
      id: 'memory_high',
      name: 'Memory Usage High',
      metric: 'memory_usage',
      operator: 'gt',
      value: 85,
      severity: 'high',
      enabled: true
    },
    {
      id: 'disk_high',
      name: 'Disk Usage High',
      metric: 'disk_usage',
      operator: 'gt',
      value: 90,
      severity: 'critical',
      enabled: true
    },
    {
      id: 'error_rate_high',
      name: 'Error Rate High',
      metric: 'error_rate',
      operator: 'gt',
      value: 5,
      severity: 'critical',
      enabled: true
    },
    {
      id: 'event_loop_lag_high',
      name: 'Event Loop Lag High',
      metric: 'event_loop_lag',
      operator: 'gt',
      value: 50,
      severity: 'high',
      enabled: true
    },
    // ⭐ Novos thresholds
    {
      id: 'response_time_high',
      name: 'Response Time High',
      metric: 'response_time',
      operator: 'gt',
      value: 2000, // 2 segundos em ms
      severity: 'high',
      enabled: true
    },
    {
      id: 'database_slow',
      name: 'Database Slow',
      metric: 'database_latency',
      operator: 'gt',
      value: 1000, // 1 segundo em ms
      severity: 'high',
      enabled: true
    },
    {
      id: 'redis_slow',
      name: 'Redis Slow',
      metric: 'redis_latency',
      operator: 'gt',
      value: 500, // 500ms
      severity: 'medium',
      enabled: true
    }
  ];

  private activeAlerts: Map<string, Alert> = new Map();

  async checkMetrics(metrics: any): Promise<Alert[]> {
    const alerts: Alert[] = [];

    for (const threshold of this.thresholds) {
      if (!threshold.enabled) continue;

      const value = this.getMetricValue(metrics, threshold.metric);
      if (this.evaluate(value, threshold)) {
        const alert = this.createAlert(threshold, value);
        alerts.push(alert);
        this.activeAlerts.set(alert.id, alert);
      } else {
        // Resolve alert if it exists
        this.resolveAlert(threshold.id);
      }
    }

    return alerts;
  }

  private getMetricValue(metrics: any, metric: string): number {
    switch (metric) {
      case 'cpu_usage':
        return metrics.cpu?.usage || 0;
      case 'memory_usage':
        return metrics.memory?.usagePercent || 0;
      case 'disk_usage':
        return metrics.disk?.usagePercent || 0;
      case 'error_rate':
        return metrics.goldenSignals?.errors?.errorRate || 0;
      case 'event_loop_lag':
        return metrics.nodejs?.eventLoopLag || 0;
      // ⭐ Novas métricas
      case 'response_time':
        // Latency p95 em ms
        return metrics.goldenSignals?.latency?.p95 || 0;
      case 'database_latency':
        // Buscar latência do PostgreSQL nos infrastructure services
        const dbService = metrics.infrastructure?.find((svc: any) => svc.name === 'PostgreSQL');
        return dbService?.latency || 0;
      case 'redis_latency':
        // Buscar latência do Redis nos infrastructure services
        const redisService = metrics.infrastructure?.find((svc: any) => svc.name === 'Redis');
        return redisService?.latency || 0;
      default:
        return 0;
    }
  }

  private evaluate(value: number, threshold: AlertThreshold): boolean {
    switch (threshold.operator) {
      case 'gt': return value > threshold.value;
      case 'gte': return value >= threshold.value;
      case 'lt': return value < threshold.value;
      case 'lte': return value <= threshold.value;
      case 'eq': return value === threshold.value;
      default: return false;
    }
  }

  private createAlert(threshold: AlertThreshold, value: number): Alert {
    return {
      id: `${threshold.id}_${Date.now()}`,
      thresholdId: threshold.id,
      severity: threshold.severity,
      message: `${threshold.name}: ${value.toFixed(2)}% (threshold: ${threshold.value}%)`,
      value,
      threshold: threshold.value,
      timestamp: Date.now(),
      resolved: false
    };
  }

  private resolveAlert(thresholdId: string) {
    // Find and resolve active alert for this threshold
    for (const [id, alert] of this.activeAlerts.entries()) {
      if (alert.thresholdId === thresholdId && !alert.resolved) {
        alert.resolved = true;
        this.activeAlerts.delete(id);
      }
    }
  }

  getActiveAlerts(): Alert[] {
    return Array.from(this.activeAlerts.values()).filter(a => !a.resolved);
  }

  getThresholds(): AlertThreshold[] {
    return this.thresholds;
  }

  updateThreshold(id: string, updates: Partial<AlertThreshold>): boolean {
    const threshold = this.thresholds.find(t => t.id === id);
    if (!threshold) return false;

    Object.assign(threshold, updates);
    return true;
  }
}

export const alertingService = new AlertingService();
