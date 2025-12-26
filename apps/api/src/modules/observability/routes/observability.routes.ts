import type { FastifyInstance } from 'fastify';
import { observabilityController } from '../controllers/observability.controller';
import { requireAuth } from '../../../middleware/auth.middleware';
import { requireRole } from '../../../middleware/rbac.middleware';

export async function observabilityRoutes(fastify: FastifyInstance) {
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
    '/metrics',
    observabilityController.getMetrics
  );
}
