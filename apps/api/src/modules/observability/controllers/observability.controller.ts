import { FastifyRequest, FastifyReply } from 'fastify';
import { register } from '../../../lib/metrics';

export class ObservabilityController {
  async getMetrics(request: FastifyRequest, reply: FastifyReply) {
    try {
      reply.header('Content-Type', register.contentType);
      const metrics = await register.metrics();
      reply.send(metrics);
    } catch (error: any) {
      reply.status(500).send({ error: error.message });
    }
  }
}

export const observabilityController = new ObservabilityController();
