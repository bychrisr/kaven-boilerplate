import type { FastifyInstance } from 'fastify';
import prisma from '../lib/prisma';
import { register } from '../lib/metrics';

export async function healthRoutes(fastify: FastifyInstance) {
  /**
   * GET /health - Basic health check
   */
  fastify.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  });

  /**
   * GET /health/ready - Readiness probe (verifica dependências)
   */
  fastify.get('/health/ready', async (request, reply) => {
    const checks = {
      database: false,
      timestamp: new Date().toISOString(),
    };

    try {
      // Testar conexão PostgreSQL
      await prisma.$queryRaw`SELECT 1`;
      checks.database = true;

      // Se tudo ok
      if (checks.database) {
        return {
          status: 'ready',
          checks,
        };
      }

      // Se algum check falhou
      reply.status(503);
      return {
        status: 'not_ready',
        checks,
      };
    } catch (error) {
      reply.status(503);
      return {
        status: 'not_ready',
        checks,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });

  /**
   * GET /health/live - Liveness probe (verifica se app está vivo)
   */
  fastify.get('/health/live', async () => {
    const memoryUsage = process.memoryUsage();
    
    return {
      status: 'alive',
      uptime: process.uptime(),
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
      },
      pid: process.pid,
      nodeVersion: process.version,
    };
  });

  /**
   * GET /metrics - Prometheus metrics endpoint
   */
  fastify.get('/metrics', async (request, reply) => {
    reply.header('Content-Type', register.contentType);
    return register.metrics();
  });
}
