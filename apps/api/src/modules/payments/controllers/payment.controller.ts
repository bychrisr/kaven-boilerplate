import { FastifyRequest, FastifyReply } from 'fastify';
import { stripeService } from '../stripe.service';
import { pixService } from '../pix.service';
import { pagueBitService } from '../providers/paguebit/paguebit.service';
import { handlePagueBitWebhook } from '../providers/paguebit/paguebit.webhook';
import { createPaymentSchema, type CreatePaymentInput } from '../../../lib/validation-payments';
import { prisma } from '../../../lib/prisma';
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

  /**
   * POST /api/payments/paguebit/create
   * Criar pagamento PIX via PagueBit
   */
  async createPagueBitPayment(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = createPaymentSchema.parse(request.body) as CreatePaymentInput;

      let amount: number;
      let description: string;
      let productId: string | null = null;
      let metadata: any = {};

      if (data.productId) {
        const product = await prisma.product.findUnique({ where: { id: data.productId } });
        if (!product || !product.isActive) {
          return reply.status(404).send({ error: 'Produto não encontrado' });
        }
        amount = Number(product.price);
        description = product.name;
        productId = product.id;
        metadata = { type: 'PRODUCT' };
      } else if (data.planId) {
        const plan = await prisma.plan.findUnique({
          where: { id: data.planId },
          include: { prices: { where: { isActive: true } } },
        });
        if (!plan || !plan.isActive || plan.prices.length === 0) {
          return reply.status(404).send({ error: 'Plano não encontrado' });
        }
        amount = Number(plan.prices[0].amount);
        description = plan.name;
        metadata = { type: 'SUBSCRIPTION', planId: plan.id };
      } else {
        return reply.status(400).send({ error: 'productId ou planId obrigatório' });
      }

      const purchase = await prisma.purchase.create({
        data: {
          userId: data.userId,
          tenantId: data.tenantId,
          productId: productId || undefined,
          amount,
          currency: 'BRL',
          status: 'PENDING',
          metadata,
        },
      });

      const qrCode = await pagueBitService.createDynamicQRCode({
        amount,
        description,
        externalId: purchase.id,
        metadata: { userId: data.userId, tenantId: data.tenantId },
      });

      await prisma.purchase.update({
        where: { id: purchase.id },
        data: { externalPaymentId: qrCode.paymentId },
      });

      return reply.status(201).send({
        purchaseId: purchase.id,
        paymentId: qrCode.paymentId,
        qrCode: qrCode.qrCode,
        qrCodeText: qrCode.qrCodeText,
        expiresAt: qrCode.expiresAt,
        amount,
      });
    } catch (error: any) {
      console.error('Erro ao criar pagamento PagueBit:', error);
      return reply.status(500).send({ error: 'Erro ao criar pagamento' });
    }
  }

  /**
   * GET /api/payments/paguebit/:id/status
   * Verificar status de pagamento PagueBit
   */
  async getPagueBitPaymentStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const purchase = await prisma.purchase.findUnique({ where: { id } });

      if (!purchase) {
        return reply.status(404).send({ error: 'Pagamento não encontrado' });
      }

      return reply.send({
        id: purchase.id,
        status: purchase.status,
        amount: Number(purchase.amount),
        externalPaymentId: purchase.externalPaymentId,
      });
    } catch (error: any) {
      return reply.status(500).send({ error: 'Erro ao buscar status' });
    }
  }

  /**
   * POST /api/webhooks/paguebit
   * Webhook do PagueBit
   */
  async handlePagueBitWebhook(request: FastifyRequest, reply: FastifyReply) {
    return handlePagueBitWebhook(request, reply);
  }
}

export const paymentController = new PaymentController();
