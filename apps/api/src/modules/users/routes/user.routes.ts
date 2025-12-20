import { FastifyInstance } from 'fastify';
import { userController } from '../controllers/user.controller';

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/', userController.list.bind(userController));
  fastify.get('/me', userController.getCurrent.bind(userController));
  fastify.get('/:id', userController.getById.bind(userController));
  fastify.post('/', userController.create.bind(userController));
  fastify.put('/:id', userController.update.bind(userController));
  fastify.delete('/:id', userController.delete.bind(userController));
}
