import { FastifyInstance } from 'fastify';
import { platformController } from '../controllers/platform.controller';
import { authMiddleware } from '../../../middleware/auth.middleware';

export async function platformRoutes(app: FastifyInstance) {
  // All routes are protected
  app.addHook('preHandler', authMiddleware);
  
  app.get('/', platformController.getSettings);
  app.put('/', platformController.updateSettings);
  app.get('/timezones', platformController.getTimezones);
  app.post('/test-email', platformController.testEmail);
}
