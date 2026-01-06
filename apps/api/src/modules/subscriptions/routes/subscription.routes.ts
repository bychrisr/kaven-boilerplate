import { FastifyInstance } from 'fastify';
import { subscriptionController } from '../controllers/subscription.controller';

export async function subscriptionRoutes(fastify: FastifyInstance) {
  // Tenant routes (require authentication)
  fastify.get('/subscriptions/current', subscriptionController.getCurrent.bind(subscriptionController));
  fastify.post('/subscriptions/upgrade', subscriptionController.upgrade.bind(subscriptionController));
  fastify.post('/subscriptions/cancel', subscriptionController.cancel.bind(subscriptionController));

  // Feature entitlement routes
  fastify.get('/subscriptions/features/:featureCode/check', subscriptionController.checkFeature.bind(subscriptionController));
  fastify.post('/subscriptions/features/:featureCode/usage', subscriptionController.recordUsage.bind(subscriptionController));
}
