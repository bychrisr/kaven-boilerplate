import { FastifyRequest, FastifyReply } from 'fastify';
import { stripeService } from '../stripe.service';
import { pixService } from '../pix.service';
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

const createPixPaymentSchema = z.object({
  tenantId: z.string().uuid(),
  amount: z.number().positive(),
  description: z.string(),
});

const createPortalSessionSchema = z.object({
  subscriptionId: z.string().uuid(),
  returnUrl: z.string().url(),
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
   * POST /api/payments/portal-session
   */
  async createPortalSession(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = createPortalSessionSchema.parse(request.body);
      const result = await stripeService.createPortalSession(
        data.subscriptionId,
        data.returnUrl
      );
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  /**
   * POST /api/payments/pix/create
   */
  async createPixPayment(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = createPixPaymentSchema.parse(request.body);
      const result = await pixService.createPixPayment(data);
      reply.status(201).send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  /**
   * GET /api/payments/pix/:id/status
   */
  async checkPixPaymentStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const result = await pixService.checkPixPaymentStatus(id);
      reply.send(result);
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
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

  /**
   * POST /api/webhooks/pix
   * Webhook para notificações de pagamento Pix
   */
  async handlePixWebhook(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = request.body as any;
      const result = await pixService.handlePixWebhook(data);
      reply.send(result);
    } catch (error: any) {
      console.error('Pix webhook error:', error);
      reply.status(400).send({ error: error.message });
    }
  }
}

export const paymentController = new PaymentController();
