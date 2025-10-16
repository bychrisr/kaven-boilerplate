import { FastifyInstance } from 'fastify';

export default async function metricRoutes(fastify: FastifyInstance) {
  // Metric routes will be implemented in Phase 4
  fastify.get('/ping', async (request, reply) => {
    return { message: 'Metric routes - coming soon!' };
  });
}
