import { FastifyInstance } from 'fastify';
import { securityRequestController } from '../controllers/security-request.controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { requireCapability } from '../../../middleware/requireCapability';

export async function securityRoutes(fastify: FastifyInstance) {
  // Criar solicitação (ex: Reset de 2FA)
  fastify.post('/requests', {
    preHandler: [authMiddleware, requireCapability('auth.2fa_reset.request')],
    handler: securityRequestController.create.bind(securityRequestController),
  });

  // Listar solicitações pendentes
  fastify.get('/requests/pending', {
    preHandler: [authMiddleware, requireCapability('auth.2fa_reset.request')],
    handler: securityRequestController.listPending.bind(securityRequestController),
  });

  // Aprovar/Rejeitar solicitação
  fastify.post('/requests/:id/review', {
    preHandler: [authMiddleware, requireCapability('auth.2fa_reset.execute')],
    handler: securityRequestController.review.bind(securityRequestController),
  });

  // Executar solicitação aprovada
  fastify.post('/requests/:id/execute', {
    preHandler: [authMiddleware, requireCapability('auth.2fa_reset.execute')],
    handler: securityRequestController.execute.bind(securityRequestController),
  });
}
