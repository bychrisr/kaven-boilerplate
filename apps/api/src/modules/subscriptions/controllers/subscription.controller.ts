import { FastifyRequest, FastifyReply } from 'fastify';
import { subscriptionService } from '../services/subscription.service';
import {
  upgradePlanSchema,
  cancelSubscriptionSchema,
} from '../../../lib/validation-plans';

export class SubscriptionController {
  /**
   * GET /api/subscriptions/current
   * Busca subscription atual do tenant autenticado
   */
  async getCurrent(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Assumindo que tenantId vem do middleware de autenticação
      const tenantId = (request.user as any)?.tenantId;
      
      if (!tenantId) {
        return reply.status(401).send({ error: 'Tenant não autenticado' });
      }

      const subscription = await subscriptionService.getCurrentSubscription(tenantId);
      reply.send(subscription);
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
    }
  }

  /**
   * POST /api/subscriptions/upgrade
   * Faz upgrade/downgrade de plano
   */
  async upgrade(request: FastifyRequest, reply: FastifyReply) {
    try {
      const tenantId = (request.user as any)?.tenantId;
      
      if (!tenantId) {
        return reply.status(401).send({ error: 'Tenant não autenticado' });
      }

      const data = upgradePlanSchema.parse(request.body);
      const result = await subscriptionService.upgradePlan(tenantId, data);
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  /**
   * POST /api/subscriptions/cancel
   * Cancela subscription
   */
  async cancel(request: FastifyRequest, reply: FastifyReply) {
    try {
      const tenantId = (request.user as any)?.tenantId;
      
      if (!tenantId) {
        return reply.status(401).send({ error: 'Tenant não autenticado' });
      }

      const data = cancelSubscriptionSchema.parse(request.body);
      const subscription = await subscriptionService.cancelSubscription(tenantId, data);
      reply.send(subscription);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  /**
   * GET /api/subscriptions/features/:featureCode/check
   * Verifica se tenant tem acesso a feature
   */
  async checkFeature(request: FastifyRequest, reply: FastifyReply) {
    try {
      const tenantId = (request.user as any)?.tenantId;
      const { featureCode } = request.params as { featureCode: string };
      
      if (!tenantId) {
        return reply.status(401).send({ error: 'Tenant não autenticado' });
      }

      const hasAccess = await subscriptionService.hasFeature(tenantId, featureCode);
      const canUse = await subscriptionService.canUseFeature(tenantId, featureCode);
      const limit = await subscriptionService.getQuotaLimit(tenantId, featureCode);
      const usage = await subscriptionService.getQuotaUsage(tenantId, featureCode);

      reply.send({
        featureCode,
        hasAccess,
        canUse,
        limit,
        usage,
      });
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  /**
   * POST /api/subscriptions/features/:featureCode/usage
   * Registra uso de feature quota
   */
  async recordUsage(request: FastifyRequest, reply: FastifyReply) {
    try {
      const tenantId = (request.user as any)?.tenantId;
      const { featureCode } = request.params as { featureCode: string };
      const { amount = 1 } = request.body as { amount?: number };
      
      if (!tenantId) {
        return reply.status(401).send({ error: 'Tenant não autenticado' });
      }

      const result = await subscriptionService.recordUsage(tenantId, featureCode, amount);
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }
}

export const subscriptionController = new SubscriptionController();
