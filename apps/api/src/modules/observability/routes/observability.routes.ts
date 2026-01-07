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
}
