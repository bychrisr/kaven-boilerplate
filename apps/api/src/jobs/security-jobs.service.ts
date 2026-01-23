import cron from 'node-cron';
import { prisma } from '../lib/prisma';
import { subDays } from 'date-fns';
import { notificationService } from '../modules/notifications/services/notification.service';

/**
 * Security Jobs Service
 * 
 * Gerencia automações de segurança:
 * - Expiração de Grants temporários
 * - Limpeza de sessões de Impersonation
 * - Geração de relatórios de auditoria para executivos
 */
export class SecurityJobsService {
  private jobs: cron.ScheduledTask[] = [];

  /**
   * Inicia todos os cron jobs de segurança
   */
  start() {
    console.log('[SecurityJobs] Iniciando automações de segurança...');

    // 1. A cada hora: Expirar grants (Minuto 5)
    this.jobs.push(
      cron.schedule('5 * * * *', async () => {
        await this.processExpiredGrants();
      })
    );

    // 2. A cada 15 minutos: Limpar impersonations (Minutos 0, 15, 30, 45)
    this.jobs.push(
      cron.schedule('*/15 * * * *', async () => {
        await this.cleanupImpersonations();
      })
    );

    // 3. Quinzenalmente: Relatório de Revisão (Segunda-feira às 08:00)
    // Usamos '0 8 * * 1' e verificamos se passaram 14 dias no código se necessário, 
    // ou apenas rodamos toda segunda e pegamos os últimos 7-14 dias.
    this.jobs.push(
      cron.schedule('0 8 * * 1', async () => {
        await this.generateAccessReviewReport();
      })
    );

    console.log('[SecurityJobs] 3 jobs registrados com sucesso');
  }

  /**
   * Para todos os jobs
   */
  stop() {
    this.jobs.forEach(job => job.stop());
    this.jobs = [];
    console.log('[SecurityJobs] Todos os jobs parados');
  }

  /**
   * Processa grants expirados
   */
  private async processExpiredGrants() {
    try {
      console.log('[SecurityJobs] Verificando grants expirados...');
      
      const now = new Date();
      
      // Buscar grants ativos que já passaram da data de expiração
      const expiredGrants = await prisma.grant.findMany({
        where: {
          status: 'ACTIVE',
          expiresAt: { lt: now }
        },
        include: {
          user: true,
          capability: true
        }
      });

      if (expiredGrants.length === 0) return;

      for (const grant of expiredGrants) {
        await prisma.grant.update({
          where: { id: grant.id },
          data: { status: 'EXPIRED' }
        });

        // Registrar auditoria da expiração
        await prisma.grantAuditEvent.create({
          data: {
            grantId: grant.id,
            action: 'revoked',
            reason: 'GRANT_EXPIRED',
            metadata: { autoExpired: true }
          }
        });

        // Notificar o usuário
        await notificationService.createNotification({
          userId: grant.userId,
          type: 'security',
          priority: 'low',
          title: 'Acesso Temporário Expirado',
          message: `Seu acesso temporário ao recurso ${grant.capability?.code || 'solicitado'} expirou.`,
        });
      }

      console.log(`[SecurityJobs] ${expiredGrants.length} grants expirados processados`);
    } catch (error) {
      console.error('[SecurityJobs] Erro ao processar grants expirados:', error);
    }
  }

  /**
   * Encerra sessões de impersonation expiradas
   */
  private async cleanupImpersonations() {
    try {
      const now = new Date();

      const result = await prisma.impersonationSession.updateMany({
        where: {
          status: 'ACTIVE',
          expiresAt: { lt: now }
        },
        data: {
          status: 'EXPIRED',
          endedAt: now
        }
      });

      if (result.count > 0) {
        console.log(`[SecurityJobs] ${result.count} sessões de impersonation expiradas limpas`);
      }
    } catch (error) {
      console.error('[SecurityJobs] Erro ao limpar impersonations:', error);
    }
  }

  /**
   * Gera relatório de revisão de acessos (DLP / Governance)
   */
  private async generateAccessReviewReport() {
    try {
      console.log('[SecurityJobs] Gerando relatório quinzenal de revisão de acessos...');
      
      const fourteenDaysAgo = subDays(new Date(), 14);

      // Métricas de Segurança
      const [
        activeGrants,
        newRequests,
        deniedAttempts,
        impersonationsCount,
        exportsCount
      ] = await Promise.all([
        prisma.grant.count({ where: { status: 'ACTIVE' } }),
        prisma.grantRequest.count({ where: { createdAt: { gte: fourteenDaysAgo } } }),
        prisma.capabilityAuditEvent.count({ 
            where: { 
                result: 'denied', 
                createdAt: { gte: fourteenDaysAgo } 
            } 
        }),
        prisma.impersonationSession.count({ where: { startedAt: { gte: fourteenDaysAgo } } }),
        prisma.auditLog.count({ 
            where: { 
                action: { contains: 'export' },
                createdAt: { gte: fourteenDaysAgo } 
            } 
        })
      ]);

      // Notificar Super Admins / Executives
      // Em um cenário real, isso enviaria um Email formatado ou PDF.
      // Aqui, registraremos no log e enviaremos uma notificação de sistema para os Admins.
      
      const superAdmins = await prisma.user.findMany({
        where: { role: 'SUPER_ADMIN' },
        select: { id: true }
      });

      for (const admin of superAdmins) {
        await notificationService.createNotification({
          userId: admin.id,
          type: 'security',
          priority: 'medium',
          title: 'Relatório de Governança (14 dias)',
          message: `Resumo: ${activeGrants} grants ativos, ${newRequests} novas solicitações, ${deniedAttempts} tentativas negadas e ${exportsCount} exportações realizadas.`,
          actionUrl: '/platform/audit',
          actionText: 'Ver Auditoria Completa'
        });
      }

      console.log('[SecurityJobs] Relatório de governança enviado com sucesso');
    } catch (error) {
      console.error('[SecurityJobs] Erro ao gerar relatório de revisão:', error);
    }
  }
}

export const securityJobs = new SecurityJobsService();
