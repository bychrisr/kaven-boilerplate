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

      // Acessar provider pelo ID da integração (não pelo nome do provider)
      const provider = (emailService as any).providers.get(integration.id);

      if (!provider) {
        // Provider não inicializado (credenciais faltando ou erro na inicialização)
        const healthResult = {
          healthy: false,
          message: 'Credentials not configured',
          details: { reason: 'missing_credentials' },
        };

        // Retornar resultado sem atualizar banco (campos não existem no schema)
        return healthResult;
      }

      // Executar health check
      const healthResult = await provider.healthCheck();

      // Retornar resultado sem atualizar banco (campos não existem no schema)
      return healthResult;
    } catch (error: any) {
      const healthResult = {
        healthy: false,
        message: `Health check failed: ${error.message}`,
        details: { reason: 'error', error: error.message },
      };

      // Tentar reportar erro sem atualizar banco (campos não existem no schema)
      console.error('[HealthService] Email Health Check failed:', error);
      return healthResult;
    }
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
