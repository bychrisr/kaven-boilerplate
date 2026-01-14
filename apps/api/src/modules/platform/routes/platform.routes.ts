import { FastifyInstance } from 'fastify';
import { platformController } from '../controllers/platform.controller';

export async function platformRoutes(app: FastifyInstance) {
  app.get('/', platformController.getSettings);
  app.put('/', platformController.updateSettings);
  app.get('/timezones', platformController.getTimezones);
  app.post('/test-email', platformController.testEmail);
}
