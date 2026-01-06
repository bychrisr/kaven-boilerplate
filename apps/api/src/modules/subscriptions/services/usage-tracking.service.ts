import { Injectable } from '@nestjs/common';
import { prisma } from '../../../lib/prisma';
import type { UsageStats } from '../types/validation.types';

@Injectable()
export class UsageTrackingService {
  /**
   * Incrementar uso de feature
   */
  async incrementUsage(
    tenantId: string,
    featureCode: string,
    amount: number = 1
  ): Promise<void> {
    await prisma.usageRecord.upsert({
      where: {
        tenantId_featureCode: {
          tenantId,
          featureCode,
        },
      },
      update: {
        currentUsage: { increment: amount },
        updatedAt: new Date(),
      },
      create: {
        tenantId,
        featureCode,
        currentUsage: amount,
        periodStart: new Date(),
        periodEnd: this.getNextPeriodEnd(),
      },
    });
  }

  /**
   * Obter uso atual
   */
  async getCurrentUsage(
    tenantId: string,
    featureCode: string
  ): Promise<number> {
    const record = await prisma.usageRecord.findUnique({
      where: {
        tenantId_featureCode: {
          tenantId,
          featureCode,
        },
      },
    });

    return record?.currentUsage || 0;
  }

  /**
   * Resetar uso mensal (cron job)
   */
  async resetMonthlyUsage(): Promise<void> {
    await prisma.usageRecord.updateMany({
      where: {
        periodEnd: { lte: new Date() },
      },
      data: {
        currentUsage: 0,
        periodStart: new Date(),
        periodEnd: this.getNextPeriodEnd(),
      },
    });
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
        tenant: {
          include: {
            subscription: {
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
      featureCode: record.featureCode,
      currentUsage: record.currentUsage,
      limit: this.getFeatureLimit(record),
      periodStart: record.periodStart,
      periodEnd: record.periodEnd,
    }));
  }

  private getFeatureLimit(record: any): number {
    const planFeature = record.tenant.subscription?.plan?.features?.find(
      (f: any) => f.feature.code === record.featureCode
    );
    return planFeature?.limitValue || -1;
  }
}
