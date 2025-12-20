import { FastifyInstance } from 'fastify';
import { tenantController } from '../controllers/tenant.controller';

export async function tenantRoutes(fastify: FastifyInstance) {
  fastify.get('/', tenantController.list.bind(tenantController));
  fastify.get('/:id', tenantController.getById.bind(tenantController));
  fastify.post('/', tenantController.create.bind(tenantController));
  fastify.put('/:id', tenantController.update.bind(tenantController));
  fastify.delete('/:id', tenantController.delete.bind(tenantController));
}
