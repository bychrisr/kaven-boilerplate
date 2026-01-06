import { FastifyInstance } from 'fastify';
import { planController } from '../controllers/plan.controller';

export async function planRoutes(fastify: FastifyInstance) {
  // Public routes
  fastify.get('/plans', planController.list.bind(planController));
  fastify.get('/plans/:id', planController.getById.bind(planController));
  fastify.get('/plans/code/:code', planController.getByCode.bind(planController));

  // Admin routes (TODO: adicionar middleware de autorização)
  fastify.post('/plans', planController.create.bind(planController));
  fastify.put('/plans/:id', planController.update.bind(planController));
  fastify.delete('/plans/:id', planController.delete.bind(planController));

  // Feature management (Admin only)
  fastify.post('/plans/:id/features', planController.addFeature.bind(planController));
  fastify.put('/plans/:id/features/:featureCode', planController.updateFeature.bind(planController));
  fastify.delete('/plans/:id/features/:featureCode', planController.removeFeature.bind(planController));
}
