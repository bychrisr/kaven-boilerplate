import { prisma } from '../../config/database';
import { EmailProvider } from '@prisma/client';

/**
 * Serviço para persistir métricas de email no banco de dados
 * Resolve o problema de perda de métricas ao reiniciar o servidor
 */
export class EmailMetricsPersistenceService {
  /**
   * Persiste métricas de envio de email
   */
  async recordEmailSent(params: {
    provider: EmailProvider;
    emailType?: 'TRANSACTIONAL' | 'MARKETING';
    tenantId?: string;
    templateCode?: string;
  }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await this.upsertMetric({
      date: today,
      provider: params.provider,
      emailType: params.emailType,
      tenantId: params.tenantId,
      templateCode: params.templateCode,
      increment: { sentCount: 1 },
    });
  }

  /**
   * Persiste métricas de bounce
   */
  async recordBounce(params: {
    provider: EmailProvider;
    bounceType: 'HARD' | 'SOFT';
    emailType?: 'TRANSACTIONAL' | 'MARKETING';
    tenantId?: string;
  }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const increment: any = { bounceCount: 1 };
    if (params.bounceType === 'HARD') {
      increment.hardBounceCount = 1;
    } else {
      increment.softBounceCount = 1;
    }

    await this.upsertMetric({
      date: today,
      provider: params.provider,
      emailType: params.emailType,
      tenantId: params.tenantId,
      increment,
    });
  }

  /**
   * Persiste métricas de complaint
   */
  async recordComplaint(params: {
    provider: EmailProvider;
    emailType?: 'TRANSACTIONAL' | 'MARKETING';
    tenantId?: string;
  }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await this.upsertMetric({
      date: today,
      provider: params.provider,
      emailType: params.emailType,
      tenantId: params.tenantId,
      increment: { complaintCount: 1 },
    });
  }

  /**
   * Persiste métricas de entrega
   */
  async recordDelivery(params: {
    provider: EmailProvider;
    emailType?: 'TRANSACTIONAL' | 'MARKETING';
    tenantId?: string;
  }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await this.upsertMetric({
      date: today,
      provider: params.provider,
      emailType: params.emailType,
      tenantId: params.tenantId,
      increment: { deliveredCount: 1 },
    });
  }

  /**
   * Upsert genérico de métrica
   */
  private async upsertMetric(params: {
    date: Date;
    provider: EmailProvider;
    emailType?: 'TRANSACTIONAL' | 'MARKETING';
    tenantId?: string;
    templateCode?: string;
    increment: Record<string, number>;
  }) {
    try {
      await prisma.emailMetrics.upsert({
        where: {
          metrics_unique: {
            date: params.date,
            hour: null,
            tenantId: params.tenantId || null,
            emailType: params.emailType || null,
            provider: params.provider,
            templateCode: params.templateCode || null,
          },
        },
        create: {
          date: params.date,
          hour: null,
          tenantId: params.tenantId,
          emailType: params.emailType,
          provider: params.provider,
          templateCode: params.templateCode,
          ...params.increment,
        },
        update: {
          ...Object.fromEntries(
            Object.entries(params.increment).map(([key, value]) => [
              key,
              { increment: value },
            ])
          ),
        },
      });
    } catch (error) {
      console.error('[EmailMetricsPersistence] Error upserting metric:', error);
      // Não falhar o envio de email por erro de métrica
    }
  }

  /**
   * Obtém métricas agregadas do banco (últimos 30 dias)
   */
  async getAggregatedMetrics(days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    since.setHours(0, 0, 0, 0);

    const metrics = await prisma.emailMetrics.findMany({
      where: {
        date: { gte: since },
      },
    });

    // Agregar por provider
    const byProvider: Record<
      string,
      {
        sent: number;
        delivered: number;
        bounced: number;
        hardBounced: number;
        softBounced: number;
        complaints: number;
      }
    > = {};

    let totalSent = 0;
    let totalDelivered = 0;
    let totalBounced = 0;
    let totalComplaints = 0;

    metrics.forEach((metric) => {
      const provider = metric.provider || 'UNKNOWN';

      if (!byProvider[provider]) {
        byProvider[provider] = {
          sent: 0,
          delivered: 0,
          bounced: 0,
          hardBounced: 0,
          softBounced: 0,
          complaints: 0,
        };
      }

      byProvider[provider].sent += metric.sentCount;
      byProvider[provider].delivered += metric.deliveredCount;
      byProvider[provider].bounced += metric.bounceCount;
      byProvider[provider].hardBounced += metric.hardBounceCount;
      byProvider[provider].softBounced += metric.softBounceCount;
      byProvider[provider].complaints += metric.complaintCount;

      totalSent += metric.sentCount;
      totalDelivered += metric.deliveredCount;
      totalBounced += metric.bounceCount;
      totalComplaints += metric.complaintCount;
    });

    return {
      overview: {
        sent: totalSent,
        delivered: totalDelivered,
        bounced: totalBounced,
        complaints: totalComplaints,
      },
      byProvider,
    };
  }
}

export const emailMetricsPersistence = new EmailMetricsPersistenceService();
