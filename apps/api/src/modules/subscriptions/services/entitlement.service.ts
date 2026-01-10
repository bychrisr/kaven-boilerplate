import { prisma } from '../../../lib/prisma';
import { UsageTrackingService } from './usage-tracking.service';
import type { ValidationResult } from '../types/validation.types';

export class EntitlementService {
  constructor(private readonly usageTrackingService: UsageTrackingService) {}

  /**
   * Validar se tenant pode executar ação
   */
  async validateAction(
    tenantId: string,
    featureCode: string,
    requestedAmount: number = 1
  ): Promise<ValidationResult> {
    const subscription = await this.getActiveSubscription(tenantId);

    if (!subscription) {
      return {
        isValid: false,
        error: 'Nenhuma assinatura ativa encontrada',
        currentPlan: 'FREE',
        availableUpgrades: await this.getAvailableUpgrades(null),
      };
    }

    const planFeature = this.getPlanFeature(subscription, featureCode);

    if (!planFeature) {
      return {
        isValid: false,
        error: `Feature ${featureCode} não disponível no seu plano`,
        currentPlan: subscription.plan.code,
        availableUpgrades: await this.getAvailableUpgrades(subscription.planId),
      };
    }

    // Validar BOOLEAN
    if (planFeature.feature.type === 'BOOLEAN') {
      return {
        isValid: planFeature.enabled ?? true,
        error: planFeature.enabled ? undefined : `Feature ${featureCode} desabilitada`,
      };
    }

    // Validar QUOTA
    if (planFeature.feature.type === 'QUOTA') {
      const currentUsage = await this.usageTrackingService.getCurrentUsage(
        tenantId,
        featureCode
      );
      const limit = planFeature.limitValue || 0;

      if (limit !== -1 && currentUsage + requestedAmount > limit) {
        return {
          isValid: false,
          error: `Limite de ${limit} ${planFeature.feature.unit} atingido`,
          currentUsage,
          limit,
          currentPlan: subscription.plan.code,
          availableUpgrades: await this.getAvailableUpgrades(subscription.planId),
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Obter assinatura ativa do tenant
   */
  private async getActiveSubscription(tenantId: string) {
    return await prisma.subscription.findFirst({
      where: {
        tenantId,
        status: 'ACTIVE',
      },
      include: {
        plan: {
          include: {
            features: {
              include: {
                feature: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Obter upgrades disponíveis
   */
  async getAvailableUpgrades(currentPlanId: string | null): Promise<any[]> {
    if (!currentPlanId) {
      // Retornar todos os planos públicos
      const plans = await prisma.plan.findMany({
        where: {
          isActive: true,
          isPublic: true,
        },
        include: { prices: true },
        orderBy: { sortOrder: 'asc' },
        take: 3,
      });

      return plans.map((plan) => ({
        id: plan.id,
        code: plan.code,
        name: plan.name,
        price: Number(plan.prices[0]?.amount || 0),
      }));
    }

    const currentPlan = await prisma.plan.findUnique({
      where: { id: currentPlanId },
      include: { prices: true },
    });

    if (!currentPlan) return [];

    const minPrice = Math.min(...currentPlan.prices.map((p) => Number(p.amount)));

    const plans = await prisma.plan.findMany({
      where: {
        isActive: true,
        isPublic: true,
        prices: {
          some: {
            amount: { gt: minPrice },
          },
        },
      },
      include: { prices: true, features: true },
      orderBy: { sortOrder: 'asc' },
      take: 3,
    });

    return plans.map((plan) => ({
      id: plan.id,
      code: plan.code,
      name: plan.name,
      price: Number(plan.prices[0]?.amount || 0),
    }));
  }

  /**
   * Obter feature do plano
   */
  private getPlanFeature(subscription: any, featureCode: string): any {
    return subscription.plan.features.find(
      (pf: any) => pf.feature.code === featureCode
    );
  }
}
