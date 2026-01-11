import { FastifyInstance } from 'fastify';
import { observabilityController } from '../controllers/observability.controller';

export async function observabilityRoutes(fastify: FastifyInstance) {
  // GET /api/observability/metrics - Metrics Endpoint for Prometheus
  fastify.get('/metrics', observabilityController.getMetrics.bind(observabilityController));
}
