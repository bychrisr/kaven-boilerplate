import { FastifyInstance } from 'fastify';
import { grantRequestController } from '../controllers/grant-request.controller';
import { authMiddleware } from '@/middleware/auth.middleware';

export async function grantRequestRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authMiddleware);

  // User routes
  app.post('/requests', grantRequestController.create);
  app.get('/requests/my', grantRequestController.listMyRequests);

  // Approver routes
  // TODO: Adicionar middleware 'canApproveGrants' no futuro
  app.get('/requests/pending', grantRequestController.listPending);
  app.put('/requests/:id/review', grantRequestController.review);
}
