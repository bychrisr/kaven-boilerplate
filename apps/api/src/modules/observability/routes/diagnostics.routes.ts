import type { FastifyInstance } from 'fastify';
import { diagnosticsController } from '../controllers/diagnostics.controller';
import { requireAuth } from '../../../middleware/auth.middleware';
import { requireRole } from '../../../middleware/rbac.middleware';

export async function diagnosticsRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/health',
    {
      preHandler: [requireAuth, requireRole(['SUPER_ADMIN'])],
    },
    diagnosticsController.getHealthDetailed.bind(diagnosticsController)
  );

  fastify.get(
    '/memory',
    {
      preHandler: [requireAuth, requireRole(['SUPER_ADMIN'])],
    },
    diagnosticsController.getMemoryProfile.bind(diagnosticsController)
  );

  fastify.get(
    '/performance',
    {
      preHandler: [requireAuth, requireRole(['SUPER_ADMIN'])],
    },
    diagnosticsController.getPerformanceProfile.bind(diagnosticsController)
  );
}
