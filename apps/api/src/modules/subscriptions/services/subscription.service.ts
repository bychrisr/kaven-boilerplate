import { prisma } from '../../../lib/prisma';
import type { UpgradePlanInput, CancelSubscriptionInput } from '../../../lib/validation-plans';

export class SubscriptionService {
  /**
   * Busca subscription atual do tenant
   */
  async getCurrentSubscription(tenantId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { tenantId },
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
        price: true,
      },
    });

    if (!subscription) {
      throw new Error('Subscription não encontrada');
    }

    return this.formatSubscriptionResponse(subscription);
  }

  /**
   * Faz upgrade/downgrade de plano
   */
  async upgradePlan(tenantId: string, data: UpgradePlanInput) {
    // Buscar subscription atual
    const currentSubscription = await prisma.subscription.findUnique({
      where: { tenantId },
      include: { plan: true, price: true },
    });

    if (!currentSubscription) {
      throw new Error('Subscription não encontrada');
    }

    // Buscar novo plano
    const newPlan = await prisma.plan.findUnique({
      where: { id: data.planId },
      include: { prices: true },
    });

    if (!newPlan || !newPlan.isActive) {
      throw new Error('Plano não encontrado ou inativo');
    }

    // Determinar price
    let newPrice;
    if (data.priceId) {
      newPrice = newPlan.prices.find(p => p.id === data.priceId);
      if (!newPrice) {
        throw new Error('Price não encontrado para este plano');
      }
    } else {
      // Usar primeiro price ativo
      newPrice = newPlan.prices.find(p => p.isActive);
      if (!newPrice) {
        throw new Error('Plano não possui prices ativos');
      }
    }

    // Calcular proration se solicitado
    let proratedAmount = 0;
    if (data.prorated && currentSubscription.currentPeriodEnd) {
      const now = new Date();
      const periodEnd = new Date(currentSubscription.currentPeriodEnd);
      const daysRemaining = Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysRemaining > 0 && currentSubscription.price) {
        const currentDailyRate = Number(currentSubscription.price.amount) / 30;
        const newDailyRate = Number(newPrice.amount) / 30;
        proratedAmount = (newDailyRate - currentDailyRate) * daysRemaining;
      }
    }

    // Atualizar subscription
    const updatedSubscription = await prisma.subscription.update({
      where: { tenantId },
      data: {
        planId: newPlan.id,
        priceId: newPrice.id,
        // Se for upgrade, manter período atual
        // Se for downgrade, aplicar no próximo ciclo (implementar lógica se necessário)
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
        price: true,
      },
    });

    return {
      subscription: this.formatSubscriptionResponse(updatedSubscription),
      proratedAmount,
    };
  }

  /**
   * Cancela subscription
   */
  async cancelSubscription(tenantId: string, data: CancelSubscriptionInput) {
    const subscription = await prisma.subscription.findUnique({
      where: { tenantId },
    });

    if (!subscription) {
      throw new Error('Subscription não encontrada');
    }

    if (subscription.status === 'CANCELED') {
      throw new Error('Subscription já está cancelada');
    }

    const updateData: any = {
      canceledAt: new Date(),
      cancelReason: data.reason,
    };

    if (data.immediately) {
      // Cancelar imediatamente
      updateData.status = 'CANCELED';
      updateData.currentPeriodEnd = new Date();
    } else {
      // Cancelar no fim do período
      updateData.cancelAtPeriodEnd = true;
    }

    const canceledSubscription = await prisma.subscription.update({
      where: { tenantId },
      data: updateData,
      include: {
        plan: true,
        price: true,
      },
    });

    return this.formatSubscriptionResponse(canceledSubscription);
  }

  /**
   * Verifica se tenant tem acesso a uma feature
   */
  async hasFeature(tenantId: string, featureCode: string): Promise<boolean> {
    const subscription = await prisma.subscription.findUnique({
      where: { tenantId },
      include: {
        plan: {
          include: {
            features: {
              where: {
                feature: {
                  code: featureCode,
                },
              },
              include: {
                feature: true,
              },
            },
          },
        },
      },
    });

    if (!subscription || subscription.status !== 'ACTIVE') {
      return false;
    }

    const planFeature = subscription.plan.features[0];
    if (!planFeature) {
      return false;
    }

    // Para features boolean
    if (planFeature.feature.type === 'BOOLEAN') {
      return planFeature.enabled;
    }

    // Para features quota/custom, apenas verificar se existe
    return true;
  }

  /**
   * Busca limite de quota de uma feature
   */
  async getQuotaLimit(tenantId: string, featureCode: string): Promise<number> {
    const subscription = await prisma.subscription.findUnique({
      where: { tenantId },
      include: {
        plan: {
          include: {
            features: {
              where: {
                feature: {
                  code: featureCode,
                },
              },
              include: {
                feature: true,
              },
            },
          },
        },
      },
    });

    if (!subscription || subscription.status !== 'ACTIVE') {
      return 0;
    }

    const planFeature = subscription.plan.features[0];
    if (!planFeature || planFeature.feature.type !== 'QUOTA') {
      return 0;
    }

    return planFeature.limitValue ?? 0;
  }

  /**
   * Busca uso atual de uma feature quota
   */
  async getQuotaUsage(tenantId: string, featureCode: string): Promise<number> {
    const feature = await prisma.feature.findUnique({
      where: { code: featureCode },
    });

    if (!feature) {
      return 0;
    }

    const latestUsage = await prisma.usageRecord.findFirst({
      where: {
        tenantId,
        featureId: feature.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return latestUsage?.currentUsage ?? 0;
  }

  /**
   * Verifica se tenant pode usar feature (não excedeu quota)
   */
  async canUseFeature(tenantId: string, featureCode: string): Promise<boolean> {
    const hasAccess = await this.hasFeature(tenantId, featureCode);
    if (!hasAccess) {
      return false;
    }

    const feature = await prisma.feature.findUnique({
      where: { code: featureCode },
    });

    if (!feature || feature.type !== 'QUOTA') {
      return hasAccess; // Boolean features apenas verificam acesso
    }

    const limit = await this.getQuotaLimit(tenantId, featureCode);
    const usage = await this.getQuotaUsage(tenantId, featureCode);

    // -1 = unlimited
    if (limit === -1) {
      return true;
    }

    return usage < limit;
  }

  /**
   * Registra uso de feature quota
   */
  async recordUsage(tenantId: string, featureCode: string, amount: number = 1) {
    const feature = await prisma.feature.findUnique({
      where: { code: featureCode },
    });

    if (!feature || feature.type !== 'QUOTA') {
      throw new Error('Feature não encontrada ou não é do tipo QUOTA');
    }

    const currentUsage = await this.getQuotaUsage(tenantId, featureCode);
    const newUsage = currentUsage + amount;

    await prisma.usageRecord.create({
      data: {
        tenantId,
        featureId: feature.id,
        currentUsage: newUsage,
      },
    });

    return { currentUsage: newUsage };
  }

  /**
   * Formata resposta de subscription
   */
  private formatSubscriptionResponse(subscription: any) {
    return {
      id: subscription.id,
      tenantId: subscription.tenantId,
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      canceledAt: subscription.canceledAt,
      cancelReason: subscription.cancelReason,
      trialEnd: subscription.trialEnd,
      plan: subscription.plan ? {
        id: subscription.plan.id,
        code: subscription.plan.code,
        name: subscription.plan.name,
        description: subscription.plan.description,
        type: subscription.plan.type,
        trialDays: subscription.plan.trialDays,
        features: subscription.plan.features?.map((pf: any) => ({
          code: pf.feature.code,
          name: pf.feature.name,
          type: pf.feature.type,
          unit: pf.feature.unit,
          enabled: pf.enabled,
          limitValue: pf.limitValue,
          customValue: pf.customValue,
        })) || [],
      } : null,
      price: subscription.price ? {
        id: subscription.price.id,
        interval: subscription.price.interval,
        intervalCount: subscription.price.intervalCount,
        amount: Number(subscription.price.amount),
        currency: subscription.price.currency,
      } : null,
    };
  }
}

export const subscriptionService = new SubscriptionService();
