import { performance } from 'perf_hooks';
import { register } from '../../../lib/metrics';
import { emailMetricsPersistence } from '../../../lib/email/metrics-persistence.service';

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
    console.log('[AdvancedMetrics] 🔍 Coletando métricas avançadas (Golden Signals + Node.js)...');
    const startTime = Date.now();
    
    const memory = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    // Coleta métricas do Prometheus
    const metrics = await register.getMetricsAsJSON();
    
    // Extrai contadores HTTP
    const httpRequestsTotal = metrics.find(m => m.name === 'kaven_http_requests_total');
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

    const result = {
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

    console.log('[AdvancedMetrics] ✅ Métricas avançadas coletadas:', {
      latency: `p50:${result.goldenSignals.latency.p50}ms p95:${result.goldenSignals.latency.p95}ms p99:${result.goldenSignals.latency.p99}ms`,
      traffic: `${result.goldenSignals.traffic.requestsPerSecond} req/s (${result.goldenSignals.traffic.totalRequests} total)`,
      errors: `${result.goldenSignals.errors.errorRate}% (${result.goldenSignals.errors.errorRequests}/${totalRequests})`,
      eventLoopLag: `${result.nodejs.eventLoopLag}ms`,
      memory: `${result.nodejs.memoryHeap.usedMB}MB/${result.nodejs.memoryHeap.totalMB}MB`,
      collectionTime: `${Date.now() - startTime}ms`
    });

    return result;
  }

  /**
   * Retorna métricas de infraestrutura de e-mail
   * AGORA: Agrega dados históricos do banco + métricas em memória
   */
  async getEmailMetrics() {
    console.log('[AdvancedMetrics] 📧 Coletando métricas de e-mail (DB + Memória)...');
    
    // 1. Buscar métricas históricas do banco (últimos 30 dias)
    const dbMetrics = await emailMetricsPersistence.getAggregatedMetrics(30);
    console.log('[AdvancedMetrics] 💾 Métricas do banco:', dbMetrics);

    // 2. Buscar métricas em memória (Prometheus)
    const metrics = await register.getMetricsAsJSON();
    console.log('[AdvancedMetrics] 🔍 Métricas Prometheus:', metrics.length);
    
    // Funções auxiliares para extrair valores do Prometheus
    const getCounterTotal = (name: string, filter?: (labels: any) => boolean) => {
      const metric = metrics.find(m => m.name === name);
      let total = 0;
      if (metric) {
        // @ts-ignore
        metric.values?.forEach((v: any) => {
          if (!filter || filter(v.labels)) {
            total += v.value;
          }
        });
      }
      return total;
    };

    // Métricas em memória (sessão atual)
    const memSent = getCounterTotal('kaven_email_sent_total');
    const memBounced = getCounterTotal('kaven_email_bounced_total');
    const memComplaints = getCounterTotal('kaven_email_complaints_total');
    
    console.log('[AdvancedMetrics] 🧠 Métricas em memória:', { memSent, memBounced, memComplaints });

    // 3. AGREGAR: DB + Memória
    const totalSent = dbMetrics.overview.sent + memSent;
    const totalBounced = dbMetrics.overview.bounced + memBounced;
    const totalComplaints = dbMetrics.overview.complaints + memComplaints;
    
    console.log('[AdvancedMetrics] 📊 Total agregado:', { totalSent, totalBounced, totalComplaints });
    
    // Calcular delivery rate agregado
    const deliveryRate = totalSent > 0 
      ? Number(((totalSent - totalBounced) / totalSent * 100).toFixed(2)) 
      : 100;
    
    // Extrair latência média (apenas memória, não persiste no banco)
    const latencyMetric = metrics.find(m => m.name === 'kaven_email_delivery_duration_seconds');
    let avgLatency = 0;
    if (latencyMetric) {
      // @ts-ignore
      const sum = latencyMetric.values?.find((v: any) => v.metricName.endsWith('_sum'))?.value || 0;
      // @ts-ignore
      const count = latencyMetric.values?.find((v: any) => v.metricName.endsWith('_count'))?.value || 0;
      avgLatency = count > 0 ? Number((sum / count).toFixed(3)) : 0;
    }

    // 4. Agregar por provider (DB + Memória)
    const providersSet = new Set<string>();
    
    // Adicionar providers do banco
    Object.keys(dbMetrics.byProvider).forEach(p => providersSet.add(p));
    
    // Adicionar providers da memória
    const sentMetric = metrics.find(m => m.name === 'kaven_email_sent_total');
    if (sentMetric) {
      // @ts-ignore
      sentMetric.values?.forEach((v: any) => {
        if (v.labels?.provider) {
          providersSet.add(v.labels.provider);
        }
      });
    }

    console.log('[AdvancedMetrics] 🏢 Providers detectados:', Array.from(providersSet));

    // Calcular estatísticas por provider (DB + Memória)
    const byProvider: Record<string, { sent: number; bounced: number; complaints: number; deliveryRate: number }> = {};
    
    providersSet.forEach(provider => {
      // Dados do banco
      const dbData = dbMetrics.byProvider[provider] || { sent: 0, bounced: 0, complaints: 0 };
      
      // Dados da memória
      const memProviderSent = getCounterTotal('kaven_email_sent_total', (l) => l.provider === provider);
      const memProviderBounced = getCounterTotal('kaven_email_bounced_total', (l) => l.provider === provider);
      const memProviderComplaints = getCounterTotal('kaven_email_complaints_total', (l) => l.provider === provider);
      
      // Agregar
      const providerSent = dbData.sent + memProviderSent;
      const providerBounced = dbData.bounced + memProviderBounced;
      const providerComplaints = dbData.complaints + memProviderComplaints;
      const providerDeliveryRate = providerSent > 0 
        ? Number(((providerSent - providerBounced) / providerSent * 100).toFixed(2)) 
        : 100;

      byProvider[provider] = {
        sent: providerSent,
        bounced: providerBounced,
        complaints: providerComplaints,
        deliveryRate: providerDeliveryRate
      };
      
      console.log(`[AdvancedMetrics] 📊 Provider ${provider} (DB+Mem):`, byProvider[provider]);
    });

    // Se não houver providers, adicionar placeholders
    if (providersSet.size === 0) {
      console.log('[AdvancedMetrics] ⚠️ Nenhum provider detectado, adicionando placeholders');
      ['RESEND', 'POSTMARK', 'SMTP'].forEach(provider => {
        byProvider[provider] = {
          sent: 0,
          bounced: 0,
          complaints: 0,
          deliveryRate: 100
        };
      });
    }

    console.log('[AdvancedMetrics] ✅ Métricas agregadas finais:', {
      totalSent,
      totalBounced,
      totalComplaints,
      deliveryRate,
      providers: Array.from(providersSet),
      byProvider
    });

    return {
      overview: {
        sent: totalSent,
        bounced: totalBounced,
        complaints: totalComplaints,
        deliveryRate,
        avgLatencySeconds: avgLatency
      },
      byProvider,
      health: {
        status: deliveryRate > 98 ? 'healthy' : deliveryRate > 95 ? 'warning' : 'critical',
        indicators: {
          bounceRate: totalSent > 0 ? Number((totalBounced / totalSent * 100).toFixed(2)) : 0,
          complaintRate: totalSent > 0 ? Number((totalComplaints / totalSent * 100).toFixed(2)) : 0
        }
      }
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
