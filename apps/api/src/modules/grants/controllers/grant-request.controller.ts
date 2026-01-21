import { FastifyRequest, FastifyReply } from 'fastify';
import { grantRequestService } from '../services/grant-request.service';
import { createGrantRequestSchema, reviewGrantRequestSchema } from '@kaven/shared';

export class GrantRequestController {
  
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) return reply.status(401).send({ error: 'Unauthorized' });
      
      const data = createGrantRequestSchema.parse(request.body);
      const grantRequest = await grantRequestService.createRequest(request.user.id, data);
      
      reply.status(201).send(grantRequest);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async listMyRequests(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) return reply.status(401).send({ error: 'Unauthorized' });
      
      const requests = await grantRequestService.listMyRequests(request.user.id);
      reply.send(requests);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async listPending(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { spaceId } = request.query as { spaceId?: string };
      // TODO: Validar se o usuário TEM permissão para ver pedidos (Space Owner, Admin, etc)
      // Por enquanto, assumiremos que a rota possui middleware de proteção de permissão
      
      const requests = await grantRequestService.listPendingRequests(spaceId);
      reply.send(requests);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async review(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) return reply.status(401).send({ error: 'Unauthorized' });
      
      const { id } = request.params as { id: string };
      const data = reviewGrantRequestSchema.parse(request.body);
      
      const result = await grantRequestService.reviewRequest(request.user.id, id, data);
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }
}

export const grantRequestController = new GrantRequestController();
