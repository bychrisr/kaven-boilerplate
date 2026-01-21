import { FastifyInstance } from 'fastify';
import { spaceController } from '../controllers/space.controller';
import { authMiddleware } from '@/middleware/auth.middleware';

export async function spaceRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', authMiddleware);

  // GET /api/spaces
  fastify.get('/', spaceController.list.bind(spaceController));
  
  // GET /api/spaces/:id
  fastify.get('/:id', spaceController.getById.bind(spaceController));
}
