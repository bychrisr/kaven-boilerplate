import { FastifyInstance } from 'fastify';

export default async function tenantRoutes(fastify: FastifyInstance) {
  // Tenant routes will be implemented in Phase 3
  fastify.get('/ping', async (request, reply) => {
    return { message: 'Tenant routes - coming soon!' };
  });
}
