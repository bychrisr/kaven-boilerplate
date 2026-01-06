import { FastifyInstance } from 'fastify';
import { featureController } from '../controllers/feature.controller';

export async function featureRoutes(fastify: FastifyInstance) {
  // Public routes
  fastify.get('/features', featureController.list.bind(featureController));
  fastify.get('/features/categories', featureController.listCategories.bind(featureController));
  fastify.get('/features/:id', featureController.getById.bind(featureController));
  fastify.get('/features/code/:code', featureController.getByCode.bind(featureController));

  // Admin routes (TODO: adicionar middleware de autorização)
  fastify.post('/features', featureController.create.bind(featureController));
  fastify.put('/features/:id', featureController.update.bind(featureController));
  fastify.delete('/features/:id', featureController.delete.bind(featureController));
}
