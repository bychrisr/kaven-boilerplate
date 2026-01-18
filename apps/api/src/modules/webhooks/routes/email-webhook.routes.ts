import { FastifyInstance } from 'fastify';
import { emailWebhookController } from '../controllers/email-webhook.controller';

/**
 * Rotas de Webhook para E-mail
 */
export async function emailWebhookRoutes(app: FastifyInstance) {
  // Rota pública para webhooks de provedores
  // A validação de segurança é feita via assinatura HMAC nos controllers
  app.post('/:provider', emailWebhookController.handle.bind(emailWebhookController));

}
