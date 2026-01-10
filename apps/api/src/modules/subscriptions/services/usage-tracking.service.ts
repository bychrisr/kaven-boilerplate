import { prisma } from '../../../lib/prisma';
import type { UsageStats } from '../types/validation.types';

export class UsageTrackingService {
  /**
   * Incrementar uso de feature (por featureId)
   */
  async incrementUsage(
    tenantId: string,
    featureId: string,
    amount: number = 1
  ): Promise<void> {
    const now = new Date();
    const periodEnd = this.getNextPeriodEnd();

    await prisma.usageRecord.upsert({
      where: {
        tenantId_featureId_periodStart: {
          tenantId,
          featureId,
          periodStart: this.getPeriodStart(now),
        },
      },
      update: {
        currentUsage: { increment: amount },
        updatedAt: now,
      },
      create: {
        tenantId,
        featureId,
        currentUsage: amount,
        periodStart: this.getPeriodStart(now),
        periodEnd,
      },
    });
  }

  /**
   * Incrementar uso de feature (por featureCode - faz lookup)
   */
  async incrementUsageByCode(
    tenantId: string,
    featureCode: string,
    amount: number = 1
  ): Promise<void> {
    const feature = await prisma.feature.findUnique({
      where: { code: featureCode },
    });

    if (!feature) {
      throw new Error(`Feature com code "${featureCode}" não encontrada`);
    }

    await this.incrementUsage(tenantId, feature.id, amount);
  }

  /**
   * Obter uso atual (por featureId)
   */
  async getCurrentUsage(
    tenantId: string,
    featureId: string
  ): Promise<number> {
    const now = new Date();
    const record = await prisma.usageRecord.findUnique({
      where: {
        tenantId_featureId_periodStart: {
          tenantId,
          featureId,
          periodStart: this.getPeriodStart(now),
        },
      },
    });

    return record?.currentUsage || 0;
  }

  /**
   * Obter uso atual (por featureCode - faz lookup)
   */
  async getCurrentUsageByCode(
    tenantId: string,
    featureCode: string
  ): Promise<number> {
    const feature = await prisma.feature.findUnique({
      where: { code: featureCode },
    });

    if (!feature) {
      return 0;
    }

    return this.getCurrentUsage(tenantId, feature.id);
  }

  /**
   * Resetar uso mensal (cron job)
   */
  async resetMonthlyUsage(): Promise<void> {
    const now = new Date();
    await prisma.usageRecord.updateMany({
      where: {
        periodEnd: { lte: now },
      },
      data: {
        currentUsage: 0,
        periodStart: now,
        periodEnd: this.getNextPeriodEnd(),
        lastReset: now,
      },
    });
  }

  /**
   * Obter início do período atual (normalizado para início do dia)
   */
  private getPeriodStart(date: Date): Date {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  /**
   * Obter próximo fim de período (30 dias)
   */
  private getNextPeriodEnd(): Date {
    const now = new Date();
    return new Date(now.setDate(now.getDate() + 30));
  }

  /**
   * Obter estatísticas de uso
   */
  async getUsageStats(tenantId: string): Promise<UsageStats[]> {
    const records = await prisma.usageRecord.findMany({
      where: { tenantId },
      include: {
        feature: true,
        tenant: {
          include: {
            subscriptions: {
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
            },
          },
        },
      },
    });

    return records.map((record) => ({
      tenantId: record.tenantId,
      featureCode: record.feature.code,
      currentUsage: record.currentUsage,
      limit: this.getFeatureLimit(record),
      periodStart: record.periodStart,
      periodEnd: record.periodEnd,
    }));
  }

  private getFeatureLimit(record: any): number {
    const subscription = record.tenant.subscriptions?.[0];
    if (!subscription) return -1;

    const planFeature = subscription.plan?.features?.find(
      (f: any) => f.feature.id === record.featureId
    );
    return planFeature?.limitValue ?? -1;
  }
}
