import type { FastifyReply, FastifyRequest } from 'fastify';
import { register } from '../../../lib/metrics';
import { advancedMetricsService } from '../services/advanced-metrics.service';

export class ObservabilityController {
  /**
   * GET /api/observability/stats
   * Retorna estatísticas simplificadas do sistema para o painel admin
   */
  async getSystemStats(request: FastifyRequest, reply: FastifyReply) {
    // Coleta métricas do Prometheus
    const metrics = await register.getMetricsAsJSON();
    
    // Processar métricas para formato mais amigável
    // Nota: prom-client getMetricsAsJSON retorna array de objetos com values
    
    const uptime = process.uptime();
    const memory = process.memoryUsage();

    // Extrair contadores de requisições HTTP
    // Procura por 'http_requests_total'
    const httpRequestsTotal = metrics.find(m => m.name === 'http_requests_total');
    let totalRequests = 0;
    let errorRequests = 0;

    if (httpRequestsTotal) {
       // @ts-ignore - Tipagem do prom-client JSON value pode variar
       (httpRequestsTotal as any).values?.forEach((v: any) => {
           totalRequests += v.value;
           if (v.labels.status_code && v.labels.status_code.startsWith('5')) {
               errorRequests += v.value;
           }
       });
    }

    // Requests per second (estimativa simples baseada no uptime)
    const requestsPerSecond = uptime > 0 ? (totalRequests / uptime) : 0;

    return {
      uptime,
      system: {
          memory: {
              rss: memory.rss,
              heapTotal: memory.heapTotal,
              heapUsed: memory.heapUsed
          },
          cpu: process.cpuUsage()
      },
      http: {
          totalRequests,
          errorRequests,
          requestsPerSecond: Number(requestsPerSecond.toFixed(2)),
          errorRate: totalRequests > 0 ? Number((errorRequests / totalRequests).toFixed(4)) : 0
      }
    };
  }

  /**
   * GET /api/observability/advanced
   * Retorna métricas avançadas (Golden Signals + Node.js específicas)
   */
  async getAdvancedMetrics(request: FastifyRequest, reply: FastifyReply) {
    return await advancedMetricsService.getAdvancedMetrics();
  }
}

export const observabilityController = new ObservabilityController();
