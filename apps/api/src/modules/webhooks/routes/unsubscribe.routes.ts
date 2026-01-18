import { FastifyInstance } from 'fastify';
import { unsubscribeController } from '../controllers/unsubscribe.controller';

/**
 * Unsubscribe Routes
 * Prefix: /api/webhooks/email/unsubscribe
 */
export async function unsubscribeRoutes(fastify: FastifyInstance) {
  // GET: Confirmação via clique (Landing Page)
  fastify.get('/:token', unsubscribeController.confirm.bind(unsubscribeController));

  // POST: One-Click Unsubscribe (RFC 8058)
  fastify.post('/:token', {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: 60000,
      },
    },
    handler: unsubscribeController.oneClick.bind(unsubscribeController),
  });
}
