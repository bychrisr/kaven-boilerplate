import { FastifyRequest, FastifyReply } from 'fastify';
import { securityRequestService } from '../services/security-request.service';
import { 
  createSecurityRequestSchema, 
  reviewSecurityRequestSchema 
} from '@kaven/shared';

export class SecurityRequestController {
  
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) return reply.status(401).send({ error: 'Unauthorized' });
      
      const data = createSecurityRequestSchema.parse(request.body);
      const result = await securityRequestService.createRequest(request.user.id, data);
      
      reply.status(201).send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async listPending(request: FastifyRequest, reply: FastifyReply) {
    try {
      const requests = await securityRequestService.listPending();
      reply.send(requests);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async review(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) return reply.status(401).send({ error: 'Unauthorized' });
      
      const { id } = request.params as { id: string };
      const data = reviewSecurityRequestSchema.parse(request.body);
      
      const result = await securityRequestService.reviewRequest(request.user.id, id, data);
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async execute(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) return reply.status(401).send({ error: 'Unauthorized' });
      
      const { id } = request.params as { id: string };
      const result = await securityRequestService.executeRequest(request.user.id, id);
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }
}

export const securityRequestController = new SecurityRequestController();
