import { EmailServiceV2 } from '../../../lib/email';
import { prisma } from '../../../lib/prisma';
import { decrypt } from '../../../lib/crypto/encryption';
import type { EmailProvider } from '../../../lib/email/types';

/**
 * Serviço para executar health check em integrações de email
 * e atualizar o status no banco de dados
 */
export class EmailIntegrationHealthService {
  /**
   * Executa health check em uma integração específica
   */
  async checkIntegration(integrationId: string): Promise<{
    healthy: boolean;
    message?: string;
    details?: Record<string, any>;
  }> {
    try {
      // Buscar integração
      const integration = await prisma.emailIntegration.findUnique({
        where: { id: integrationId },
      });

      if (!integration) {
        throw new Error('Integration not found');
      }

      // Criar provider temporário para health check
      const emailService = EmailServiceV2.getInstance();
      await emailService.reload(); // Garantir que está atualizado

      // Acessar provider
      const provider = (emailService as any).providers.get(integration.provider);

      if (!provider) {
        // Provider não inicializado (credenciais faltando)
        const healthResult = {
          healthy: false,
          message: 'Credentials not configured',
          details: { reason: 'missing_credentials' },
        };

        // Atualizar banco
        await this.updateHealthStatus(integrationId, healthResult);
        return healthResult;
      }

      // Executar health check
      const healthResult = await provider.healthCheck();

      // Atualizar banco
      await this.updateHealthStatus(integrationId, healthResult);

      return healthResult;
    } catch (error: any) {
      const healthResult = {
        healthy: false,
        message: `Health check failed: ${error.message}`,
        details: { reason: 'error', error: error.message },
      };

      // Tentar atualizar banco mesmo em caso de erro
      try {
        await this.updateHealthStatus(integrationId, healthResult);
      } catch (updateError) {
        console.error('[HealthService] Failed to update health status:', updateError);
      }

      return healthResult;
    }
  }

  /**
   * Atualiza status de health check no banco
   */
  private async updateHealthStatus(
    integrationId: string,
    health: { healthy: boolean; message?: string; details?: Record<string, any> }
  ) {
    await prisma.emailIntegration.update({
      where: { id: integrationId },
      data: {
        healthStatus: health.healthy ? 'healthy' : 'unhealthy',
        healthMessage: health.message,
        healthDetails: health.details as any,
        lastHealthCheck: new Date(),
      },
    });
  }

  /**
   * Executa health check em todas as integrações ativas
   */
  async checkAllIntegrations(): Promise<void> {
    const integrations = await prisma.emailIntegration.findMany({
      where: { isActive: true },
      select: { id: true },
    });

    await Promise.all(
      integrations.map((integration) => this.checkIntegration(integration.id))
    );
  }
}

export const emailIntegrationHealthService = new EmailIntegrationHealthService();
