import { FastifyInstance } from 'fastify';

export default async function userRoutes(fastify: FastifyInstance) {
  // User routes will be implemented in Phase 3
  fastify.get('/ping', async (request, reply) => {
    return { message: 'User routes - coming soon!' };
  });
}
