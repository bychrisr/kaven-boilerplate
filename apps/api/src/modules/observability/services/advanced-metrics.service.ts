import { performance } from 'perf_hooks';
import { register } from '../../../lib/metrics';

/**
 * Serviço para métricas avançadas de observabilidade
 * Implementa Golden Signals e métricas específicas de Node.js
 */
export class AdvancedMetricsService {
  private eventLoopLag: number = 0;
  private lastCheck: number = Date.now();
  private latencyBuckets: number[] = [];
  private statusCodeCounts: Map<string, number> = new Map();

  constructor() {
    this.startEventLoopMonitoring();
  }

  /**
   * Monitora Event Loop Lag (crítico para Node.js)
   * Mede o atraso entre quando uma tarefa deveria executar vs quando realmente executa
   */
  private startEventLoopMonitoring() {
    setInterval(() => {
      const start = performance.now();
      setImmediate(() => {
        const lag = performance.now() - start;
        this.eventLoopLag = lag;
      });
    }, 1000);
  }

  /**
   * Registra latência de requisição para cálculo de percentis
   */
  recordLatency(durationMs: number) {
    this.latencyBuckets.push(durationMs);
    // Mantém apenas últimas 1000 requisições
    if (this.latencyBuckets.length > 1000) {
      this.latencyBuckets.shift();
    }
  }

  /**
   * Registra status code HTTP
   */
  recordStatusCode(code: number) {
    const category = this.getStatusCategory(code);
    this.statusCodeCounts.set(category, (this.statusCodeCounts.get(category) || 0) + 1);
  }

  private getStatusCategory(code: number): string {
    if (code >= 200 && code < 300) return '2xx';
    if (code >= 300 && code < 400) return '3xx';
    if (code >= 400 && code < 500) return '4xx';
    if (code >= 500) return '5xx';
    return 'other';
  }

  /**
   * Calcula percentil de latência
   */
  private calculatePercentile(percentile: number): number {
    if (this.latencyBuckets.length === 0) return 0;
    
    const sorted = [...this.latencyBuckets].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index] || 0;
  }

  /**
   * Retorna métricas avançadas completas
   */
  async getAdvancedMetrics() {
    const memory = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    // Coleta métricas do Prometheus
    const metrics = await register.getMetricsAsJSON();
    
    // Extrai contadores HTTP
    const httpRequestsTotal = metrics.find(m => m.name === 'http_requests_total');
    let totalRequests = 0;
    let errorRequests = 0;

    if (httpRequestsTotal) {
      // @ts-ignore
      (httpRequestsTotal as any).values?.forEach((v: any) => {
        totalRequests += v.value;
        if (v.labels.status_code && v.labels.status_code.startsWith('5')) {
          errorRequests += v.value;
        }
      });
    }

    const uptime = process.uptime();
    const requestsPerSecond = uptime > 0 ? (totalRequests / uptime) : 0;

    return {
      // Golden Signals
      goldenSignals: {
        latency: {
          p50: Number(this.calculatePercentile(50).toFixed(2)),
          p95: Number(this.calculatePercentile(95).toFixed(2)),
          p99: Number(this.calculatePercentile(99).toFixed(2)),
        },
        traffic: {
          requestsPerSecond: Number(requestsPerSecond.toFixed(2)),
          totalRequests,
        },
        errors: {
          errorRequests,
          errorRate: totalRequests > 0 ? Number((errorRequests / totalRequests * 100).toFixed(2)) : 0,
        },
        saturation: {
          cpuUsagePercent: this.calculateCpuPercent(cpuUsage),
          memoryUsagePercent: Number(((memory.heapUsed / memory.heapTotal) * 100).toFixed(2)),
        },
      },

      // Node.js Specific
      nodejs: {
        eventLoopLag: Number(this.eventLoopLag.toFixed(2)),
        memoryHeap: {
          used: memory.heapUsed,
          total: memory.heapTotal,
          external: memory.external,
          usedMB: Number((memory.heapUsed / 1024 / 1024).toFixed(2)),
          totalMB: Number((memory.heapTotal / 1024 / 1024).toFixed(2)),
        },
        activeHandles: (process as any)._getActiveHandles?.()?.length || 0,
        activeRequests: (process as any)._getActiveRequests?.()?.length || 0,
      },

      // HTTP Details
      httpDetails: {
        statusDistribution: Object.fromEntries(this.statusCodeCounts),
        uptime,
      },
    };
  }

  /**
   * Calcula percentual de uso de CPU
   */
  private calculateCpuPercent(cpuUsage: NodeJS.CpuUsage): number {
    // Estimativa simplificada baseada em user + system time
    const totalCpuTime = cpuUsage.user + cpuUsage.system;
    const uptimeMs = process.uptime() * 1000000; // microseconds
    return Number(((totalCpuTime / uptimeMs) * 100).toFixed(2));
  }
}

export const advancedMetricsService = new AdvancedMetricsService();
