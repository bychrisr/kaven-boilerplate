import type { FastifyRequest, FastifyReply } from 'fastify';
import { EntitlementService } from '../modules/subscriptions/services/entitlement.service';
import { UsageTrackingService } from '../modules/subscriptions/services/usage-tracking.service';

// Instâncias dos serviços (serão injetadas via DI em produção)
let entitlementService: EntitlementService;
let usageTrackingService: UsageTrackingService;

export function initializeFeatureGuard(
  entitlement: EntitlementService,
  usageTracking: UsageTrackingService
) {
  entitlementService = entitlement;
  usageTrackingService = usageTracking;
}

export function requireFeature(featureCode: string, amount?: number) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const tenantId = (request.user as any)?.tenantId;

    if (!tenantId) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'Tenant ID não encontrado',
      });
    }

    const validation = await entitlementService.validateAction(
      tenantId,
      featureCode,
      amount
    );

    if (!validation.isValid) {
      return reply.status(403).send({
        error: 'Feature not available',
        message: validation.error,
        featureCode,
        currentPlan: validation.currentPlan,
        currentUsage: validation.currentUsage,
        limit: validation.limit,
        availableUpgrades: validation.availableUpgrades,
        upgradeUrl: '/pricing',
      });
    }

    // Incrementar uso se QUOTA
    if (amount) {
      await usageTrackingService.incrementUsage(tenantId, featureCode, amount);
    }
  };
}
