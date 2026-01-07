import type { FastifyReply, FastifyRequest } from 'fastify';
import { register } from '../../../lib/metrics';
import { advancedMetricsService } from '../services/advanced-metrics.service';
import { hardwareMetricsService } from '../services/hardware-metrics.service';
import { infrastructureMonitorService } from '../services/infrastructure-monitor.service';
import { externalAPIMonitorService } from '../services/external-api-monitor.service';
import { alertingService } from '../services/alerting.service';

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

  /**
   * GET /api/observability/hardware
   * Retorna métricas de hardware (CPU, Memory, Disk, Network)
   */
  async getHardwareMetrics(request: FastifyRequest, reply: FastifyReply) {
    try {
      const metrics = await hardwareMetricsService.getMetrics();
      return {
        success: true,
        data: metrics
      };
    } catch (error: any) {
      return reply.code(500).send({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/observability/infrastructure
   * Retorna status de serviços de infraestrutura (Database, Redis)
   */
  async getInfrastructure(request: FastifyRequest, reply: FastifyReply) {
    try {
      const status = await infrastructureMonitorService.checkAll();
      return {
        success: true,
        data: status
      };
    } catch (error: any) {
      return reply.code(500).send({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/observability/external-apis
   * Retorna status de APIs externas (Stripe, Google Maps, PagBit)
   */
  async getExternalAPIs(request: FastifyRequest, reply: FastifyReply) {
    try {
      const status = await externalAPIMonitorService.checkAll();
      return {
        success: true,
        data: status
      };
    } catch (error: any) {
      return reply.code(500).send({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/observability/alerts
   * Retorna alertas ativos e thresholds configurados
   */
  async getAlerts(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Get all metrics to check alerts
      const [hardwareMetrics, advancedMetrics, infrastructure] = await Promise.all([
        hardwareMetricsService.getMetrics(),
        advancedMetricsService.getAdvancedMetrics(),
        infrastructureMonitorService.checkAll()
      ]);

      // Combine metrics for alert checking
      const combinedMetrics = {
        cpu: hardwareMetrics.cpu,
        memory: hardwareMetrics.memory,
        disk: hardwareMetrics.disk,
        goldenSignals: advancedMetrics.goldenSignals,
        nodejs: advancedMetrics.nodejs,
        infrastructure // ⭐ Infrastructure services para thresholds de database/redis
      };

      // Check for new alerts
      await alertingService.checkMetrics(combinedMetrics);

      return {
        success: true,
        data: {
          active: alertingService.getActiveAlerts(),
          thresholds: alertingService.getThresholds()
        }
      };
    } catch (error: any) {
      return reply.code(500).send({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/observability/metrics
   * Retorna métricas em formato Prometheus
   */
  async getMetrics(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Importar métricas
      const {
        cpuUsageGauge,
        cpuCoresGauge,
        cpuTemperatureGauge,
        memoryUsageGauge,
        memoryTotalGauge,
        memoryUsedGauge,
        swapUsageGauge,
        diskUsageGauge,
        diskTotalGauge,
        diskUsedGauge,
        diskReadSpeedGauge,
        diskWriteSpeedGauge,
        systemUptimeGauge,
        infrastructureLatency,
        infrastructureStatus,
        nodejsEventLoopLag,
        nodejsActiveHandles,
        nodejsActiveRequests
      } = await import('../../../lib/metrics');

      // Coletar métricas de hardware
      const hardware = await hardwareMetricsService.getMetrics();
      
      // Popular hardware metrics
      cpuUsageGauge.set(hardware.cpu.usage);
      cpuCoresGauge.set(hardware.cpu.cores);
      if (hardware.cpu.temperature !== undefined) {
        cpuTemperatureGauge.set(hardware.cpu.temperature);
      }
      
      memoryUsageGauge.set(hardware.memory.usagePercent);
      memoryTotalGauge.set(hardware.memory.total);
      memoryUsedGauge.set(hardware.memory.used);
      
      if (hardware.memory.swap && hardware.memory.swap.total > 0) {
        swapUsageGauge.set(hardware.memory.swap.usagePercent);
      }
      
      diskUsageGauge.set(hardware.disk.usagePercent);
      diskTotalGauge.set(hardware.disk.total);
      diskUsedGauge.set(hardware.disk.used);
      
      if (hardware.disk.readSpeed !== undefined) {
        diskReadSpeedGauge.set(hardware.disk.readSpeed);
      }
      if (hardware.disk.writeSpeed !== undefined) {
        diskWriteSpeedGauge.set(hardware.disk.writeSpeed);
      }
      
      systemUptimeGauge.set(hardware.system.uptime);

      // Coletar métricas de infrastructure
      const infrastructure = await infrastructureMonitorService.checkAll();
      
      // Popular infrastructure metrics
      for (const service of infrastructure) {
        infrastructureLatency.set(
          { name: service.name, type: service.type },
          service.latency
        );
        infrastructureStatus.set(
          { name: service.name, type: service.type },
          service.status === 'healthy' ? 1 : 0
        );
      }

      // Popular Node.js metrics
      const eventLoopLag = await this.measureEventLoopLag();
      nodejsEventLoopLag.set(eventLoopLag);
      
      // Type assertion para acessar propriedades internas
      const processAny = process as any;
      nodejsActiveHandles.set(processAny._getActiveHandles?.().length || 0);
      nodejsActiveRequests.set(processAny._getActiveRequests?.().length || 0);

      // Retornar métricas em formato Prometheus
      reply.header('Content-Type', register.contentType);
      return register.metrics();
    } catch (error: any) {
      return reply.code(500).send({ error: error.message });
    }
  }

  /**
   * Medir event loop lag
   */
  private async measureEventLoopLag(): Promise<number> {
    const start = Date.now();
    await new Promise(resolve => setImmediate(resolve));
    return Date.now() - start;
  }
}

export const observabilityController = new ObservabilityController();
