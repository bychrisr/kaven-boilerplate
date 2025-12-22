import type { FastifyInstance } from 'fastify';
import { auditController } from '../controllers/audit.controller';
import { requireAuth } from '../../../middleware/auth.middleware';
import { requireRole } from '../../../middleware/rbac.middleware';

export async function auditRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/',
    {
      preHandler: [requireAuth, requireRole(['SUPER_ADMIN', 'TENANT_ADMIN'])],
    },
    auditController.listLogs as any // Bypass strict handler type check for query params
  );
}
