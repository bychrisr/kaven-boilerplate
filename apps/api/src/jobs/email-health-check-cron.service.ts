import cron from 'node-cron';
import { prisma } from '../lib/prisma';
import { emailIntegrationHealthService } from '../modules/platform/services/email-integration-health.service';

/**
 * Serviço de cron job para health check automático de integrações de email
 * Configurável via Platform Settings
 */
export class EmailHealthCheckCronService {
  private currentJob: cron.ScheduledTask | null = null;
  private isRunning = false;

  /**
   * Inicia o cron job baseado na configuração do banco
   */
  async start() {
    try {
      // Buscar configuração
      const config = await this.getConfig();

      if (!config.enabled) {
        console.log('[EmailHealthCheckCron] Cron job desabilitado');
        this.stop();
        return;
      }

      // Converter frequência para cron expression
      const cronExpression = this.frequencyToCron(config.frequency);

      // Parar job anterior se existir
      this.stop();

      // Criar novo job
      this.currentJob = cron.schedule(cronExpression, async () => {
        await this.executeHealthCheck();
      });

      console.log(`[EmailHealthCheckCron] Cron job iniciado com frequência: ${config.frequency} (${cronExpression})`);
    } catch (error) {
      console.error('[EmailHealthCheckCron] Erro ao iniciar cron job:', error);
    }
  }

  /**
   * Para o cron job
   */
  stop() {
    if (this.currentJob) {
      this.currentJob.stop();
      this.currentJob = null;
      console.log('[EmailHealthCheckCron] Cron job parado');
    }
  }

  /**
   * Reinicia o cron job (útil após atualizar configuração)
   */
  async restart() {
    console.log('[EmailHealthCheckCron] Reiniciando cron job...');
    await this.start();
  }

  /**
   * Executa health check de todas as integrações
   */
  private async executeHealthCheck() {
    if (this.isRunning) {
      console.log('[EmailHealthCheckCron] Health check já em execução, pulando...');
      return;
    }

    try {
      this.isRunning = true;
      console.log('[EmailHealthCheckCron] Executando health check automático...');

      const startTime = Date.now();

      // Executar health check em todas as integrações
      await emailIntegrationHealthService.checkAllIntegrations();

      const duration = Date.now() - startTime;
      console.log(`[EmailHealthCheckCron] Health check concluído em ${duration}ms`);

      // Atualizar timestamps
      await this.updateExecutionTimestamps();
    } catch (error) {
      console.error('[EmailHealthCheckCron] Erro ao executar health check:', error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Atualiza timestamps de execução (vazio pois modelo foi removido)
   */
  private async updateExecutionTimestamps() {
    // No-op: EmailHealthCheckSettings model was removed from schema
  }

  /**
   * Calcula próxima execução baseado na frequência
   */
  private calculateNextRun(frequency: string): Date {
    const now = new Date();
    const minutes = this.frequencyToMinutes(frequency);
    return new Date(now.getTime() + minutes * 60 * 1000);
  }

  /**
   * Converte frequência para minutos
   */
  private frequencyToMinutes(frequency: string): number {
    const map: Record<string, number> = {
      '15m': 15,
      '30m': 30,
      '1h': 60,
      '6h': 360,
      '12h': 720,
      '24h': 1440,
    };
    return map[frequency] || 60; // Default: 1h
  }

  /**
   * Converte frequência para cron expression
   */
  private frequencyToCron(frequency: string): string {
    const cronMap: Record<string, string> = {
      '15m': '*/15 * * * *',  // A cada 15 minutos
      '30m': '*/30 * * * *',  // A cada 30 minutos
      '1h': '0 * * * *',      // A cada hora (minuto 0)
      '6h': '0 */6 * * *',    // A cada 6 horas
      '12h': '0 */12 * * *',  // A cada 12 horas
      '24h': '0 0 * * *',     // Diariamente à meia-noite
    };
    return cronMap[frequency] || '0 * * * *'; // Default: 1h
  }

  /**
   * Retorna configuração padrão (substitui modelo removido do banco)
   */
  private async getConfig() {
    return {
      id: 'default',
      enabled: process.env.EMAIL_HEALTH_CHECK_ENABLED === 'true',
      frequency: (process.env.EMAIL_HEALTH_CHECK_FREQUENCY as string) || '1h',
    };
  }

  /**
   * Atualiza configuração (apenas reinicia job, persiste via ENV se necessário)
   */
  async updateConfig(data: { enabled?: boolean; frequency?: string }) {
    // No-op: Persistência removida do schema. 
    // Em produção, isso deve ser via Env ou nova Tabela.
    await this.restart();
  }
}

// Singleton instance
export const emailHealthCheckCron = new EmailHealthCheckCronService();
