import { prisma } from '../prisma';
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
    console.log('[EmailMetricsPersistence] 📧 recordEmailSent chamado:', params);
    
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

  private async upsertMetric(params: {
    date: Date;
    provider: EmailProvider;
    emailType?: 'TRANSACTIONAL' | 'MARKETING';
    tenantId?: string;
    templateCode?: string;
    increment: Record<string, number>;
  }) {
    console.log('[EmailMetricsPersistence] 🔄 upsertMetric chamado:', {
      date: params.date.toISOString(),
      provider: params.provider,
      emailType: params.emailType,
      tenantId: params.tenantId,
      templateCode: params.templateCode,
      increment: params.increment,
    });

    try {
      // Prisma upsert não funciona bem com unique constraints que incluem campos nullable
      // Solução: findFirst + create ou update manual
      
      const whereClause = {
        date: params.date,
        hour: null, // Métricas diárias (sem granularidade horária)
        tenantId: params.tenantId || null,
        emailType: params.emailType || null,
        provider: params.provider,
        templateCode: params.templateCode || null,
      };
      
      // Tentar encontrar registro existente
      const existing = await prisma.emailMetrics.findFirst({
        where: whereClause,
      });
      
      if (existing) {
        // Atualizar registro existente (incrementar contadores)
        const updateData: any = {};
        Object.entries(params.increment).forEach(([key, value]) => {
          const currentValue = existing[key as keyof typeof existing];
          // Garantir que estamos somando números
          if (typeof currentValue === 'number') {
            updateData[key] = currentValue + value;
          }
        });
        
        const result = await prisma.emailMetrics.update({
          where: { id: existing.id },
          data: updateData,
        });
        
        console.log('[EmailMetricsPersistence] ✅ Métrica atualizada (incrementada):', result.id);
      } else {
        // Criar novo registro
        const result = await prisma.emailMetrics.create({
          data: {
            date: params.date,
            hour: null,
            tenantId: params.tenantId,
            emailType: params.emailType,
            provider: params.provider,
            templateCode: params.templateCode,
            ...params.increment,
          },
        });
        
        console.log('[EmailMetricsPersistence] ✅ Métrica criada:', result.id);
      }
    } catch (error) {
      console.error('[EmailMetricsPersistence] ❌ ERRO ao persistir métrica:', error);
      console.error('[EmailMetricsPersistence] 📋 Detalhes do erro:', {
        message: (error as Error).message,
        stack: (error as Error).stack,
      });
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
