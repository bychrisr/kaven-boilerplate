import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';
import { emailHealthCheckCron } from '../../../jobs/email-health-check-cron.service';

const updateConfigSchema = z.object({
  enabled: z.boolean().optional(),
  frequency: z.enum(['15m', '30m', '1h', '6h', '12h', '24h']).optional(),
});

export class EmailHealthCheckConfigController {
  /**
   * GET /api/settings/email-health-check-config
   * Retorna configuração atual do cron job
   */
  async getConfig(req: FastifyRequest, reply: FastifyReply) {
    try {
      let config = await prisma.emailHealthCheckSettings.findFirst();

      if (!config) {
        // Criar configuração padrão se não existir
        config = await prisma.emailHealthCheckSettings.create({
          data: {
            enabled: false,
            frequency: '1h',
          },
        });
      }

      return reply.send(config);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({ 
        error: 'Erro ao buscar configuração de health check' 
      });
    }
  }

  /**
   * PUT /api/settings/email-health-check-config
   * Atualiza configuração do cron job
   */
  async updateConfig(req: FastifyRequest, reply: FastifyReply) {
    try {
      const data = updateConfigSchema.parse(req.body);

      // Buscar configuração existente
      let config = await prisma.emailHealthCheckSettings.findFirst();

      if (!config) {
        // Criar se não existir
        config = await prisma.emailHealthCheckSettings.create({
          data: {
            enabled: data.enabled ?? false,
            frequency: data.frequency ?? '1h',
          },
        });
      } else {
        // Atualizar existente
        config = await prisma.emailHealthCheckSettings.update({
          where: { id: config.id },
          data,
        });
      }

      // Reiniciar cron job com nova configuração
      await emailHealthCheckCron.restart();

      return reply.send(config);
    } catch (error) {
      req.log.error(error);
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ 
          error: 'Dados inválidos', 
          details: error.issues 
        });
      }
      return reply.status(500).send({ 
        error: 'Erro ao atualizar configuração de health check' 
      });
    }
  }

  /**
   * POST /api/settings/email-health-check-config/run-now
   * Executa health check manualmente (independente do cron)
   */
  async runNow(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { emailIntegrationHealthService } = await import(
        '../services/email-integration-health.service'
      );

      // Executar health check em background
      emailIntegrationHealthService.checkAllIntegrations().catch((error) => {
        req.log.error('[HealthCheck] Failed to run manual check:', error);
      });

      return reply.send({ 
        success: true,
        message: 'Health check iniciado em background' 
      });
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({ 
        error: 'Erro ao executar health check manual' 
      });
    }
  }
}

export const emailHealthCheckConfigController = new EmailHealthCheckConfigController();
