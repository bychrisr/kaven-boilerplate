import { FastifyRequest, FastifyReply } from 'fastify';
import { stripeService } from '../services/stripe.service';
import { z } from 'zod';

const createSubscriptionSchema = z.object({
  tenantId: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  priceId: z.string(), // Stripe Price ID
});

const cancelSubscriptionSchema = z.object({
  subscriptionId: z.string().uuid(),
});

const updatePaymentMethodSchema = z.object({
  subscriptionId: z.string().uuid(),
  paymentMethodId: z.string(),
});

export class PaymentController {
  /**
   * POST /api/payments/subscription
   */
  async createSubscription(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = createSubscriptionSchema.parse(request.body);
      const result = await stripeService.createSubscription(data);
      reply.status(201).send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  /**
   * DELETE /api/payments/subscription/:id
   */
  async cancelSubscription(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const result = await stripeService.cancelSubscription(id);
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  /**
   * PUT /api/payments/payment-method
   */
  async updatePaymentMethod(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = updatePaymentMethodSchema.parse(request.body);
      const result = await stripeService.updatePaymentMethod(
        data.subscriptionId,
        data.paymentMethodId
      );
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  /**
   * GET /api/payments/payment-methods/:subscriptionId
   */
  async listPaymentMethods(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { subscriptionId } = request.params as { subscriptionId: string };
      const methods = await stripeService.listPaymentMethods(subscriptionId);
      reply.send({ paymentMethods: methods });
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  /**
   * POST /api/webhooks/stripe
   * Webhook do Stripe para eventos de pagamento
   */
  async handleStripeWebhook(request: FastifyRequest, reply: FastifyReply) {
    try {
      const signature = request.headers['stripe-signature'] as string;
      
      if (!signature) {
        return reply.status(400).send({ error: 'Missing stripe-signature header' });
      }

      // O body precisa ser raw para verificação do webhook
      const result = await stripeService.handleWebhook(request.body as Buffer, signature);
      
      reply.send(result);
    } catch (error: any) {
      console.error('Webhook error:', error);
      reply.status(400).send({ error: error.message });
    }
  }
}

export const paymentController = new PaymentController();
