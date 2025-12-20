import { FastifyRequest, FastifyReply } from 'fastify';
import { userService } from '../services/user.service';
import { createUserSchema, updateUserSchema } from '../../../lib/validation';

export class UserController {
  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { page = '1', limit = '10', tenantId } = request.query as any;
      const result = await userService.listUsers(
        tenantId,
        parseInt(page),
        parseInt(limit)
      );
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const user = await userService.getUserById(id);
      reply.send(user);
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
    }
  }

  async getCurrent(request: FastifyRequest, reply: FastifyReply) {
    try {
      // TODO: Extrair userId do token JWT (implementar auth middleware)
      const userId = 'temp-user-id'; // Placeholder
      const user = await userService.getCurrentUser(userId);
      reply.send(user);
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = createUserSchema.parse(request.body);
      const user = await userService.createUser(data);
      reply.status(201).send(user);
    } catch (error: any) {
      reply.status(400).send({  error: error.message });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const data = updateUserSchema.parse(request.body);
      const user = await userService.updateUser(id, data);
      reply.send(user);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const result = await userService.deleteUser(id);
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }
}

export const userController = new UserController();
