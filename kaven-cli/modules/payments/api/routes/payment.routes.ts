import { FastifyInstance } from 'fastify';
import { paymentController } from '../controllers/payment.controller';

export async function paymentRoutes(fastify: FastifyInstance) {
  // Subscription
  fastify.post('/subscription', paymentController.createSubscription.bind(paymentController));
  fastify.delete('/subscription/:id', paymentController.cancelSubscription.bind(paymentController));
  
  // Payment Methods
  fastify.put('/payment-method', paymentController.updatePaymentMethod.bind(paymentController));
  fastify.post('/portal-session', {
    schema: {
      body: {
        type: 'object',
        properties: {
          subscriptionId: { type: 'string' },
          returnUrl: { type: 'string' },
        },
        required: ['subscriptionId', 'returnUrl'],
      },
    },
    handler: paymentController.createPortalSession.bind(paymentController),
  });
  fastify.get(
    '/payment-methods/:subscriptionId',
    paymentController.listPaymentMethods.bind(paymentController)
  );

  // Pix
  fastify.post('/pix/create', paymentController.createPixPayment.bind(paymentController));
  fastify.get('/pix/:id/status', paymentController.checkPixPaymentStatus.bind(paymentController));

  // PagueBit
  fastify.post('/paguebit/create', paymentController.createPagueBitPayment.bind(paymentController));
  fastify.get('/paguebit/:id/status', paymentController.getPagueBitPaymentStatus.bind(paymentController));
}

export async function webhookRoutes(fastify: FastifyInstance) {
  // Webhook do Stripe (precisa de raw body)
  fastify.post(
    '/stripe',
    {
      config: {
        // @ts-expect-error - rawBody is added by plugin
        rawBody: true, // Necessário para verificação de signature
      },
    },
    paymentController.handleStripeWebhook.bind(paymentController)
  );

  // Webhook do Pix
  fastify.post('/pix', paymentController.handlePixWebhook.bind(paymentController));

  // Webhook do PagueBit
  fastify.post('/paguebit', paymentController.handlePagueBitWebhook.bind(paymentController));
}
