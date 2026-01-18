import type { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { continuousMonitoringService } from '../services/continuous-monitoring.service';
import { getCacheProtection } from '../../../lib/cache-protection';
import { getRateLimitMonitor } from '../../../lib/rate-limit-monitor';
import { infrastructureMonitorService } from '../services/infrastructure-monitor.service';
import { externalAPIMonitorService } from '../services/external-api-monitor.service';
import { hardwareMetricsService } from '../services/hardware-metrics.service';

const prisma = new PrismaClient();

export class DiagnosticsController {
  constructor() {
    // Fazer bind de todos os métodos
    this.getHealthDetailed = this.getHealthDetailed.bind(this);
    this.getMemoryProfile = this.getMemoryProfile.bind(this);
    this.getPerformanceProfile = this.getPerformanceProfile.bind(this);
    this.startMonitoring = this.startMonitoring.bind(this);
    this.stopMonitoring = this.stopMonitoring.bind(this);
    this.getMonitoringSessions = this.getMonitoringSessions.bind(this);
    this.testConnectivity = this.testConnectivity.bind(this);
    this.forceRefresh = this.forceRefresh.bind(this);
    this.getCacheMetrics = this.getCacheMetrics.bind(this);
    this.getRateLimitMetrics = this.getRateLimitMetrics.bind(this);
  }

  /**
   * GET /api/diagnostics/health
   * Detailed health check
   */
  async getHealthDetailed(request: FastifyRequest, reply: FastifyReply) {
    const checks = {
      database: await this.checkDatabase(),
      memory: await this.checkMemory(),
      disk: await this.checkDisk(),
    };

    const isHealthy = Object.values(checks).every(check => check.status === 'healthy');

    return {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: Date.now(),
      uptime: process.uptime(),
      checks
    };
  }

  /**
   * GET /api/diagnostics/memory
   * Memory profiling
   */
  async getMemoryProfile(request: FastifyRequest, reply: FastifyReply) {
    const usage = process.memoryUsage();
    
    return {
      heapUsed: usage.heapUsed,
      heapTotal: usage.heapTotal,
      external: usage.external,
      rss: usage.rss,
      arrayBuffers: usage.arrayBuffers,
      heapUsagePercent: Number.parseFloat(((usage.heapUsed / usage.heapTotal) * 100).toFixed(2))
    };
  }

  /**
   * GET /api/diagnostics/performance
   * Performance profiling
   */
  async getPerformanceProfile(request: FastifyRequest, reply: FastifyReply) {
    const eventLoopLag = await this.measureEventLoopLag();
    const processAny = process as any;
    
    return {
      eventLoopLag,
      activeHandles: processAny._getActiveHandles?.().length || 0,
      activeRequests: processAny._getActiveRequests?.().length || 0,
      cpuUsage: process.cpuUsage(),
      uptime: process.uptime()
    };
  }

  private async checkDatabase() {
    try {
      const start = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      const latency = Date.now() - start;
      
      return {
        status: latency < 100 ? 'healthy' : 'degraded',
        latency,
        message: 'Database connection OK'
      };
    } catch (error: any) {
      return {
        status: 'unhealthy',
        latency: 0,
        message: error.message
      };
    }
  }

  private async checkMemory() {
    const usage = process.memoryUsage();
    const heapPercent = (usage.heapUsed / usage.heapTotal) * 100;
    
    return {
      status: heapPercent < 90 ? 'healthy' : 'degraded',
      heapUsagePercent: heapPercent,
      message: `Heap usage: ${heapPercent.toFixed(2)}%`
    };
  }

  private async checkDisk() {
    // Simplified disk check
    return {
      status: 'healthy',
      message: 'Disk check OK'
    };
  }

  private async measureEventLoopLag(): Promise<number> {
    const start = Date.now();
    await new Promise(resolve => setImmediate(resolve));
    return Date.now() - start;
  }

  /**
   * POST /api/diagnostics/monitor/start
   * Iniciar monitoramento contínuo
   */
  async startMonitoring(request: FastifyRequest, reply: FastifyReply) {
    console.log('[DiagnosticsController] 🔄 POST /api/diagnostics/monitor/start');
    
    const body = request.body as { durationMinutes: number; intervalSeconds?: number };
    const { durationMinutes, intervalSeconds = 10 } = body;

    if (!durationMinutes || durationMinutes < 1 || durationMinutes > 60) {
      return reply.code(400).send({
        success: false,
        error: 'durationMinutes deve estar entre 1 e 60'
      });
    }

    try {
      const session = await continuousMonitoringService.startMonitoring(durationMinutes, intervalSeconds);
      console.log(`[DiagnosticsController] ✅ Monitoramento iniciado: sessionId=${session.id}`);
      
      return {
        success: true,
        data: {
          sessionId: session.id,
          startTime: session.startTime,
          endTime: session.endTime,
          durationMinutes: session.durationMinutes,
          intervalSeconds: session.intervalSeconds
        }
      };
    } catch (error: any) {
      console.error('[DiagnosticsController] ❌ Erro ao iniciar monitoramento:', error);
      return reply.code(500).send({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * POST /api/diagnostics/monitor/stop/:id
   * Parar monitoramento contínuo
   */
  async stopMonitoring(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: string };
    console.log(`[DiagnosticsController] ⏹️  POST /api/diagnostics/monitor/stop/${params.id}`);
    
    try {
      const session = await continuousMonitoringService.stopMonitoring(params.id);
      
      if (!session) {
        return reply.code(404).send({
          success: false,
          error: 'Sessão não encontrada'
        });
      }

      console.log(`[DiagnosticsController] ✅ Monitoramento parado: sessionId=${session.id} snapshots=${session.snapshots.length}`);
      
      return {
        success: true,
        data: session
      };
    } catch (error: any) {
      console.error('[DiagnosticsController] ❌ Erro ao parar monitoramento:', error);
      return reply.code(500).send({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/diagnostics/monitor/sessions
   * Listar sessões de monitoramento
   */
  async getMonitoringSessions(request: FastifyRequest, reply: FastifyReply) {
    console.log('[DiagnosticsController] 📊 GET /api/diagnostics/monitor/sessions');
    
    try {
      const sessions = continuousMonitoringService.getAllSessions();
      const activeSessions = continuousMonitoringService.getActiveSessions();

      console.log(`[DiagnosticsController] ✅ Sessões: total=${sessions.length} active=${activeSessions.length}`);
      
      return {
        success: true,
        data: {
          total: sessions.length,
          active: activeSessions.length,
          sessions: sessions.map(s => ({
            id: s.id,
            status: s.status,
            startTime: s.startTime,
            endTime: s.endTime,
            durationMinutes: s.durationMinutes,
            snapshotCount: s.snapshots.length
          }))
        }
      };
    } catch (error: any) {
      console.error('[DiagnosticsController] ❌ Erro ao listar sessões:', error);
      return reply.code(500).send({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/diagnostics/connectivity
   * Testar conectividade de todos os serviços
   */
  async testConnectivity(request: FastifyRequest, reply: FastifyReply) {
    console.log('[DiagnosticsController] 🔌 GET /api/diagnostics/connectivity - Testando conectividade...');
    
    try {
      const [database, infrastructure, externalAPIs] = await Promise.all([
        this.checkDatabase(),
        infrastructureMonitorService.checkAll(),
        externalAPIMonitorService.checkAll()
      ]);

      const allHealthy = database.status === 'healthy' && 
                        infrastructure.every(s => s.status === 'healthy');

      console.log(`[DiagnosticsController] ✅ Conectividade testada: database=${database.status} infrastructure=${infrastructure.length} apis=${externalAPIs.length}`);
      
      return {
        success: allHealthy,
        data: {
          database,
          infrastructure,
          externalAPIs
        },
        timestamp: Date.now()
      };
    } catch (error: any) {
      console.error('[DiagnosticsController] ❌ Erro ao testar conectividade:', error);
      return reply.code(500).send({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * POST /api/diagnostics/refresh
   * Forçar refresh de todas as métricas
   */
  async forceRefresh(request: FastifyRequest, reply: FastifyReply) {
    console.log('[DiagnosticsController] 🔄 POST /api/diagnostics/refresh - Forçando refresh...');
    
    try {
      const start = Date.now();
      const metrics = await hardwareMetricsService.getMetrics();
      const refreshTime = Date.now() - start;

      console.log(`[DiagnosticsController] ✅ Refresh completo em ${refreshTime}ms`);
      
      return {
        success: true,
        data: metrics,
        refreshTime,
        timestamp: Date.now()
      };
    } catch (error: any) {
      console.error('[DiagnosticsController] ❌ Erro ao forçar refresh:', error);
      return reply.code(500).send({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/diagnostics/protection/cache
   * Métricas de cache protection
   */
  async getCacheMetrics(request: FastifyRequest, reply: FastifyReply) {
    console.log('[DiagnosticsController] 📦 GET /api/diagnostics/protection/cache');
    
    const cacheProtection = getCacheProtection();
    
    if (!cacheProtection) {
      return reply.code(503).send({
        success: false,
        error: 'Cache protection não inicializado'
      });
    }

    const metrics = cacheProtection.getMetrics();
    console.log(`[DiagnosticsController] ✅ Cache metrics: hitRate=${metrics.hitRate.toFixed(2)}%`);
    
    return {
      success: true,
      data: metrics
    };
  }

  /**
   * GET /api/diagnostics/protection/rate-limit
   * Métricas de rate limit
   */
  async getRateLimitMetrics(request: FastifyRequest, reply: FastifyReply) {
    console.log('[DiagnosticsController] ⚡ GET /api/diagnostics/protection/rate-limit');
    
    const rateLimitMonitor = getRateLimitMonitor();
    
    if (!rateLimitMonitor) {
      return reply.code(503).send({
        success: false,
        error: 'Rate limit monitor não inicializado'
      });
    }

    const metrics = rateLimitMonitor.getMetrics();
    console.log(`[DiagnosticsController] ✅ Rate limit metrics: violationRate=${metrics.violationRate.toFixed(2)}%`);
    
    return {
      success: true,
      data: metrics
    };
  }
}

export const diagnosticsController = new DiagnosticsController();
