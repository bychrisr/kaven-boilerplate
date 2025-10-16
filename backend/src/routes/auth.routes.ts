import { FastifyInstance } from 'fastify';

export default async function authRoutes(fastify: FastifyInstance) {
  // Auth routes will be implemented in Phase 2
  fastify.get('/ping', async (request, reply) => {
    return { message: 'Auth routes - coming soon!' };
  });
}
