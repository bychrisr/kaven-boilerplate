import type { FastifyInstance } from 'fastify';
import { observabilityController } from '../controllers/observability.controller';
import { requireAuth } from '../../../middleware/auth.middleware';
import { requireRole } from '../../../middleware/rbac.middleware';

export async function observabilityRoutes(fastify: FastifyInstance) {
  console.log('[ObservabilityRoutes] 🔧 Registrando rotas de observabilidade...');
  
  fastify.get(
    '/stats',
    {
      preHandler: [requireAuth, requireRole(['SUPER_ADMIN'])],
    },
    observabilityController.getSystemStats
  );

  fastify.get(
    '/advanced',
    {
      preHandler: [requireAuth, requireRole(['SUPER_ADMIN'])],
    },
    observabilityController.getAdvancedMetrics
  );

  fastify.get(
    '/hardware',
    {
      preHandler: [requireAuth, requireRole(['SUPER_ADMIN'])],
    },
    observabilityController.getHardwareMetrics
  );

  fastify.get(
    '/infrastructure',
    {
      preHandler: [requireAuth, requireRole(['SUPER_ADMIN'])],
    },
    observabilityController.getInfrastructure
  );

  fastify.get(
    '/external-apis',
    {
      preHandler: [requireAuth, requireRole(['SUPER_ADMIN'])],
    },
    observabilityController.getExternalAPIs
  );

  fastify.get(
    '/alerts',
    {
      preHandler: [requireAuth, requireRole(['SUPER_ADMIN'])],
    },
    observabilityController.getAlerts
  );

  fastify.get(
    '/metrics',
    observabilityController.getMetrics
  );

  // Alert Management
  fastify.put(
    '/alerts/thresholds/:id',
    {
      preHandler: [requireAuth, requireRole(['SUPER_ADMIN'])],
    },
    observabilityController.updateThreshold
  );

  fastify.post(
    '/alerts/:id/resolve',
    {
      preHandler: [requireAuth, requireRole(['SUPER_ADMIN'])],
    },
    observabilityController.resolveAlert
  );

  fastify.get(
    '/metrics/cache',
    {
      preHandler: [requireAuth, requireRole(['SUPER_ADMIN'])],
    },
    observabilityController.getCacheMetrics
  );

  fastify.get(
    '/metrics/rate-limit',
    {
      preHandler: [requireAuth, requireRole(['SUPER_ADMIN'])],
    },
    observabilityController.getRateLimitMetrics
  );

  fastify.get(
    '/email',
    {
      preHandler: [requireAuth, requireRole(['SUPER_ADMIN'])],
    },
    observabilityController.getEmailMetrics
  );
 
  fastify.get(
    '/protection-systems',
    {
      preHandler: [requireAuth, requireRole(['SUPER_ADMIN'])],
    },
    observabilityController.getProtectionSystems
  );

  console.log('[ObservabilityRoutes] ✅ Rotas registradas:', [
    'GET /api/observability/stats (auth)',
    'GET /api/observability/advanced (auth)',
    'GET /api/observability/hardware (auth)',
    'GET /api/observability/infrastructure (auth)',
    'GET /api/observability/external-apis (auth)',
    'GET /api/observability/alerts (auth)',
    'GET /api/observability/email (auth)',
    'GET /api/observability/metrics (public)',
    'PUT /api/observability/alerts/thresholds/:id (auth)',
    'POST /api/observability/alerts/:id/resolve (auth)',
    'GET /api/observability/metrics/cache (auth)',
    'GET /api/observability/metrics/rate-limit (auth)',
    'GET /api/observability/protection-systems (auth)'
  ]);
}

