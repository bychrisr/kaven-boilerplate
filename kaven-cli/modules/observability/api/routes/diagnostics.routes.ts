import type { FastifyInstance } from 'fastify';
import { diagnosticsController } from '../controllers/diagnostics.controller';
import { requireAuth } from '../../../middleware/auth.middleware';
import { requireRole } from '../../../middleware/rbac.middleware';

export async function diagnosticsRoutes(fastify: FastifyInstance) {
  console.log('[DiagnosticsRoutes] 🔧 Registrando rotas de diagnóstico...');

  // Health checks
  fastify.get(
    '/health',
    {
      preHandler: [requireAuth, requireRole(['SUPER_ADMIN'])],
    },
    diagnosticsController.getHealthDetailed
  );

  fastify.get(
    '/memory',
    {
      preHandler: [requireAuth, requireRole(['SUPER_ADMIN'])],
    },
    diagnosticsController.getMemoryProfile
  );

  fastify.get(
    '/performance',
    {
      preHandler: [requireAuth, requireRole(['SUPER_ADMIN'])],
    },
    diagnosticsController.getPerformanceProfile
  );

  // Continuous Monitoring
  fastify.post(
    '/monitor/start',
    {
      preHandler: [requireAuth, requireRole(['SUPER_ADMIN'])],
    },
    diagnosticsController.startMonitoring
  );

  fastify.post(
    '/monitor/stop/:id',
    {
      preHandler: [requireAuth, requireRole(['SUPER_ADMIN'])],
    },
    diagnosticsController.stopMonitoring
  );

  fastify.get(
    '/monitor/sessions',
    {
      preHandler: [requireAuth, requireRole(['SUPER_ADMIN'])],
    },
    diagnosticsController.getMonitoringSessions
  );

  // Connectivity & Refresh
  fastify.get(
    '/connectivity',
    {
      preHandler: [requireAuth, requireRole(['SUPER_ADMIN'])],
    },
    diagnosticsController.testConnectivity
  );

  fastify.post(
    '/refresh',
    {
      preHandler: [requireAuth, requireRole(['SUPER_ADMIN'])],
    },
    diagnosticsController.forceRefresh
  );

  // Protection Systems
  fastify.get(
    '/protection/cache',
    {
      preHandler: [requireAuth, requireRole(['SUPER_ADMIN'])],
    },
    diagnosticsController.getCacheMetrics
  );

  fastify.get(
    '/protection/rate-limit',
    {
      preHandler: [requireAuth, requireRole(['SUPER_ADMIN'])],
    },
    diagnosticsController.getRateLimitMetrics
  );

  console.log('[DiagnosticsRoutes] ✅ Rotas registradas:', [
    'GET /api/diagnostics/health (auth)',
    'GET /api/diagnostics/memory (auth)',
    'GET /api/diagnostics/performance (auth)',
    'POST /api/diagnostics/monitor/start (auth)',
    'POST /api/diagnostics/monitor/stop/:id (auth)',
    'GET /api/diagnostics/monitor/sessions (auth)',
    'GET /api/diagnostics/connectivity (auth)',
    'POST /api/diagnostics/refresh (auth)',
    'GET /api/diagnostics/protection/cache (auth)',
    'GET /api/diagnostics/protection/rate-limit (auth)'
  ]);
}
