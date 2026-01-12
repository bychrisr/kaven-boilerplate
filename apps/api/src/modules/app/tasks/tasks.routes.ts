
import { FastifyInstance } from 'fastify';
import { tasksController } from './tasks.controller';
import { authMiddleware } from '../../../middleware/auth.middleware';

export async function tasksRoutes(fastify: FastifyInstance) {
  
  // GET /api/app/tasks
  fastify.get('/', {
    preHandler: [authMiddleware],
    handler: tasksController.list.bind(tasksController)
  });

  // GET /api/app/tasks/:id
  fastify.get('/:id', {
    preHandler: [authMiddleware],
    handler: tasksController.get.bind(tasksController)
  });

  // POST /api/app/tasks
  fastify.post('/', {
    preHandler: [authMiddleware],
    handler: tasksController.create.bind(tasksController)
  });

  // PUT /api/app/tasks/:id
  fastify.put('/:id', {
    preHandler: [authMiddleware],
    handler: tasksController.update.bind(tasksController)
  });

  // DELETE /api/app/tasks/:id
  fastify.delete('/:id', {
    preHandler: [authMiddleware],
    handler: tasksController.delete.bind(tasksController)
  });
}
