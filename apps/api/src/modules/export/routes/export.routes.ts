import { FastifyInstance } from 'fastify';
import { exportController } from '../controllers/export.controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { requireCapability } from '../../../middleware/requireCapability';

export async function exportRoutes(fastify: FastifyInstance) {
  // Rota de exportação de usuários
  fastify.get('/users', {
    preHandler: [authMiddleware, requireCapability('users.export')],
    handler: exportController.exportUsers.bind(exportController),
  });

  // Rota de exportação de logs de auditoria
  fastify.get('/audit-logs', {
    preHandler: [authMiddleware, requireCapability('audit.export')],
    handler: exportController.exportAuditLogs.bind(exportController),
  });
}
