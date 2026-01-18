import { FastifyInstance } from 'fastify';
import { emailIntegrationController } from '../controllers/email-integration.controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { requireSuperAdmin } from '../../../middleware/rbac.middleware';

export async function emailIntegrationRoutes(app: FastifyInstance) {
  // All routes are protected and for super admins only
  app.addHook('preHandler', authMiddleware);
  app.addHook('preHandler', requireSuperAdmin);

  app.get('/', emailIntegrationController.list);
  app.post('/', emailIntegrationController.create);
  app.put('/:id', emailIntegrationController.update);
  app.delete('/:id', emailIntegrationController.delete);
  app.post('/test', emailIntegrationController.test);
}
