import type { FastifyReply, FastifyRequest } from 'fastify';
import { register } from '../../../lib/metrics';
import { advancedMetricsService } from '../services/advanced-metrics.service';
import { hardwareMetricsService } from '../services/hardware-metrics.service';
import { infrastructureMonitorService } from '../services/infrastructure-monitor.service';
import { externalAPIMonitorService } from '../services/external-api-monitor.service';
import { alertingService } from '../services/alerting.service';
import { getCacheProtection } from '../../../lib/cache-protection';
import { getRateLimitMonitor } from '../../../lib/rate-limit-monitor';

export class ObservabilityController {
  constructor() {
    // Fazer bind de todos os métodos para preservar o contexto 'this'
    this.getSystemStats = this.getSystemStats.bind(this);
    this.getAdvancedMetrics = this.getAdvancedMetrics.bind(this);
    this.getHardwareMetrics = this.getHardwareMetrics.bind(this);
    this.getInfrastructure = this.getInfrastructure.bind(this);
    this.getExternalAPIs = this.getExternalAPIs.bind(this);
    this.getAlerts = this.getAlerts.bind(this);
    this.getMetrics = this.getMetrics.bind(this);
    this.measureEventLoopLag = this.measureEventLoopLag.bind(this);
    this.updateThreshold = this.updateThreshold.bind(this);
    this.resolveAlert = this.resolveAlert.bind(this);
    this.getCacheMetrics = this.getCacheMetrics.bind(this);
    this.getRateLimitMetrics = this.getRateLimitMetrics.bind(this);
    this.getProtectionSystems = this.getProtectionSystems.bind(this);
  }

  /**
   * GET /api/observability/stats
   * Retorna estatísticas simplificadas do sistema para o painel admin
   */
  async getSystemStats(request: FastifyRequest, reply: FastifyReply) {
    console.log('[ObservabilityController] 📊 GET /api/observability/stats - Coletando estatísticas do sistema...');
    const startTime = Date.now();
    
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

    const result = {
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

    console.log(`[ObservabilityController] ✅ Stats coletadas em ${Date.now() - startTime}ms:`, {
      uptime: `${(uptime / 3600).toFixed(1)}h`,
      memory: `${(memory.heapUsed / 1024 / 1024).toFixed(0)}MB/${(memory.heapTotal / 1024 / 1024).toFixed(0)}MB`,
      http: `${totalRequests} reqs (${errorRequests} erros, ${requestsPerSecond.toFixed(2)} req/s)`
    });

    return result;
  }

  /**
   * GET /api/observability/advanced
   * Retorna métricas avançadas (Golden Signals + Node.js específicas)
   */
  async getAdvancedMetrics(request: FastifyRequest, reply: FastifyReply) {
    console.log('[ObservabilityController] 🎯 GET /api/observability/advanced - Coletando métricas avançadas...');
    const result = await advancedMetricsService.getAdvancedMetrics();
    console.log('[ObservabilityController] ✅ Métricas avançadas retornadas');
    return result;
  }

  /**
   * GET /api/observability/hardware
   * Retorna métricas de hardware (CPU, Memory, Disk, Network)
   */
  async getHardwareMetrics(request: FastifyRequest, reply: FastifyReply) {
    try {
      console.log('[ObservabilityController] GET /api/observability/hardware called');
      const metrics = await hardwareMetricsService.getMetrics();
      console.log('[ObservabilityController] Hardware metrics:', {
        cpu: `${metrics.cpu.usage}% (${metrics.cpu.cores} cores, ${metrics.cpu.temperature}°C)`,
        memory: `${metrics.memory.usagePercent}% (${(metrics.memory.used / 1024 / 1024 / 1024).toFixed(2)}GB used)`,
        disk: `${metrics.disk.usagePercent}% (${(metrics.disk.used / 1024 / 1024 / 1024).toFixed(2)}GB used)`,
        alerts: metrics.alerts.length
      });
      return {
        success: true,
        data: metrics
      };
    } catch (error: any) {
      console.error('[ObservabilityController] Error getting hardware metrics:', error);
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
    console.log('[ObservabilityController] 🏗️  GET /api/observability/infrastructure - Verificando infraestrutura...');
    try {
      const status = await infrastructureMonitorService.checkAll();
      console.log('[ObservabilityController] ✅ Status de infraestrutura retornado');
      return {
        success: true,
        data: status
      };
    } catch (error: any) {
      console.error('[ObservabilityController] ❌ Erro ao verificar infraestrutura:', error);
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
    console.log('[ObservabilityController] 🌐 GET /api/observability/external-apis - Verificando APIs externas...');
    try {
      const status = await externalAPIMonitorService.checkAll();
      console.log('[ObservabilityController] ✅ Status de APIs externas retornado');
      return {
        success: true,
        data: status
      };
    } catch (error: any) {
      console.error('[ObservabilityController] ❌ Erro ao verificar APIs externas:', error);
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
    console.log('[ObservabilityController] 🚨 GET /api/observability/alerts - Verificando alertas...');
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

      const activeAlerts = alertingService.getActiveAlerts();
      const thresholds = alertingService.getAllThresholds();

      const result = {
        success: true,
        data: {
          alerts: alertingService.getAllAlerts(),
          active: activeAlerts,
          thresholds: thresholds
        }
      };

      console.log(`[ObservabilityController] ✅ Alertas retornados: ${result.data.active.length} ativos`);
      return result;
    } catch (error: any) {
      console.error('[ObservabilityController] ❌ Erro ao verificar alertas:', error);
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
    console.log('[ObservabilityController] 📈 GET /api/observability/metrics - Gerando métricas Prometheus...');
    const startTime = Date.now();
    
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
        networkReceiveSpeedGauge,
        networkTransmitSpeedGauge,
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

      // Network metrics - Agregando interfaces
      if (hardware.network && hardware.network.interfaces) {
        let totalRx = 0;
        let totalTx = 0;
        
        hardware.network.interfaces.forEach(iface => {
          totalRx += iface.bytesReceived || 0;
          totalTx += iface.bytesSent || 0;
        });
        
        // Grafana usará rate() nesses counters/gauges para calcular velocidade
        networkReceiveSpeedGauge.set(totalRx); 
        networkTransmitSpeedGauge.set(totalTx);
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

      console.log(`[ObservabilityController] ✅ Métricas Prometheus geradas em ${Date.now() - startTime}ms`);

      // Retornar métricas em formato Prometheus
      reply.header('Content-Type', register.contentType);
      return register.metrics();
    } catch (error: any) {
      console.error('[ObservabilityController] ❌ Erro ao gerar métricas:', error);
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

  /**
   * PUT /api/observability/alerts/thresholds/:id
   * Atualizar threshold de alerta
   */
  async updateThreshold(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: string };
    const body = request.body as Partial<any>;
    
    console.log(`[ObservabilityController] ✏️ PUT /api/observability/alerts/thresholds/${params.id}`);
    
    try {
      const success = alertingService.updateThreshold(params.id, body);
      
      if (!success) {
        return reply.code(404).send({
          success: false,
          error: 'Threshold não encontrado'
        });
      }

      const updated = alertingService.getThreshold(params.id);
      console.log(`[ObservabilityController] ✅ Threshold atualizado: id=${params.id}`);
      
      return {
        success: true,
        data: updated
      };
    } catch (error: any) {
      console.error(`[ObservabilityController] ❌ Erro ao atualizar threshold:`, error);
      return reply.code(500).send({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * POST /api/observability/alerts/:id/resolve
   * Resolver alerta manualmente
   */
  async resolveAlert(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: string };
    
    console.log(`[ObservabilityController] 🔧 POST /api/observability/alerts/${params.id}/resolve`);
    
    try {
      const alert = alertingService.resolveAlertById(params.id);
      
      if (!alert) {
        return reply.code(404).send({
          success: false,
          error: 'Alerta não encontrado'
        });
      }

      console.log(`[ObservabilityController] ✅ Alerta resolvido: id=${params.id}`);
      
      return {
        success: true,
        data: alert
      };
    } catch (error: any) {
      console.error(`[ObservabilityController] ❌ Erro ao resolver alerta:`, error);
      return reply.code(500).send({
        success: false,
        error: error.message
      });
    }
  }


  /**
   * GET /api/observability/metrics/cache
   * Retorna métricas do cache protection
   */
  async getCacheMetrics(request: FastifyRequest, reply: FastifyReply) {
    const cacheProtection = getCacheProtection();
    if (!cacheProtection) {
      return reply.code(503).send({
        success: false,
        error: 'Cache Protection não inicializado'
      });
    }
    return {
      success: true,
      data: cacheProtection.getMetrics()
    };
  }

  /**
   * GET /api/observability/metrics/rate-limit
   * Retorna métricas do rate limit monitor
   */
  async getRateLimitMetrics(request: FastifyRequest, reply: FastifyReply) {
    const rateLimitMonitor = getRateLimitMonitor();
    if (!rateLimitMonitor) {
      return reply.code(503).send({
        success: false,
        error: 'Rate Limit Monitor não inicializado'
      });
    }
    return {
      success: true,
      data: rateLimitMonitor.getMetrics()
    };
  }

  /**
   * GET /api/observability/protection-systems
   * Retorna visão geral dos sistemas de proteção
   */
  async getProtectionSystems(request: FastifyRequest, reply: FastifyReply) {
    const cacheProtection = getCacheProtection();
    const rateLimitMonitor = getRateLimitMonitor();

    return {
      success: true,
      data: {
        cache: cacheProtection ? cacheProtection.getMetrics() : null,
        rateLimit: rateLimitMonitor ? rateLimitMonitor.getMetrics() : null
      }
    };
  }
}

export const observabilityController = new ObservabilityController();
