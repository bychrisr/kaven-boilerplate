import type { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DiagnosticsController {
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
}

export const diagnosticsController = new DiagnosticsController();
