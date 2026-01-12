
import { FastifyInstance } from 'fastify';
import { projectsController } from './projects.controller';
import { authMiddleware } from '../../../middleware/auth.middleware';

export async function projectsRoutes(fastify: FastifyInstance) {
  
  // GET /api/app/projects
  fastify.get('/', {
    preHandler: [authMiddleware],
    handler: projectsController.list.bind(projectsController)
  });

  // GET /api/app/projects/:id
  fastify.get('/:id', {
    preHandler: [authMiddleware],
    handler: projectsController.get.bind(projectsController)
  });

  // POST /api/app/projects
  fastify.post('/', {
    preHandler: [authMiddleware],
    handler: projectsController.create.bind(projectsController)
  });

  // PUT /api/app/projects/:id
  fastify.put('/:id', {
    preHandler: [authMiddleware],
    handler: projectsController.update.bind(projectsController)
  });

  // DELETE /api/app/projects/:id
  fastify.delete('/:id', {
    preHandler: [authMiddleware],
    handler: projectsController.delete.bind(projectsController)
  });
}
