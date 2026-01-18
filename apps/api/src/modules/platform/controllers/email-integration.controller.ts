import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';
import { encrypt } from '../../../lib/crypto/encryption';
import { EmailServiceV2 } from '../../../lib/email';
import { EmailProvider } from '../../../lib/email/types';

const emailIntegrationSchema = z.object({
  provider: z.nativeEnum(EmailProvider),
  isActive: z.boolean().default(true),
  isPrimary: z.boolean().default(false),
  apiKey: z.string().optional().nullable(),
  apiSecret: z.string().optional().nullable(),
  webhookSecret: z.string().optional().nullable(),
  smtpHost: z.string().optional().nullable(),
  smtpPort: z.number().optional().nullable(),
  smtpSecure: z.boolean().optional().nullable(),
  smtpUser: z.string().optional().nullable(),
  smtpPassword: z.string().optional().nullable(),
  transactionalDomain: z.string().optional().nullable(),
  marketingDomain: z.string().optional().nullable(),
  fromName: z.string().optional().nullable(),
  fromEmail: z.string().optional().nullable(),
  trackOpens: z.boolean().default(true),
  trackClicks: z.boolean().default(true),
  dailyLimit: z.number().optional().nullable(),
  hourlyLimit: z.number().optional().nullable(),
});

export class EmailIntegrationController {
  /**
   * GET /api/settings/email
   */
  async list(req: FastifyRequest, reply: FastifyReply) {
    try {
      const integrations = await prisma.emailIntegration.findMany({
        orderBy: { createdAt: 'desc' },
      });

      // Mask sensitive data
      const masked = integrations.map((int: any) => ({
        ...int,
        apiKey: int.apiKey ? '********' : null,
        apiSecret: int.apiSecret ? '********' : null,
        webhookSecret: int.webhookSecret ? '********' : null,
        smtpPassword: int.smtpPassword ? '********' : null,
      }));

      return reply.send(masked);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({ error: 'Erro ao listar integrações de e-mail' });
    }
  }

  /**
   * POST /api/settings/email
   */
  async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const data = emailIntegrationSchema.parse(req.body);

      // Encrypt sensitive fields
      if (data.apiKey) data.apiKey = encrypt(data.apiKey);
      if (data.apiSecret) data.apiSecret = encrypt(data.apiSecret);
      if (data.webhookSecret) data.webhookSecret = encrypt(data.webhookSecret);
      if (data.smtpPassword) data.smtpPassword = encrypt(data.smtpPassword);

      // If isPrimary is true, unset other primary integrations
      if (data.isPrimary) {
        await prisma.emailIntegration.updateMany({
          where: { isPrimary: true },
          data: { isPrimary: false },
        });
      }

      const integration = await prisma.emailIntegration.create({
        data: data as any,
      });

      // Reload EmailServiceV2
      await EmailServiceV2.getInstance().reload();

      return reply.status(201).send(integration);
    } catch (error) {
      req.log.error(error);
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Dados inválidos', details: error.issues });
      }
      return reply.status(500).send({ 
        error: 'Erro ao criar integração de e-mail', 
        message: (error as Error).message,
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
      });
    }
  }

  /**
   * PUT /api/settings/email/:id
   */
  async update(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = req.params;
      const data = emailIntegrationSchema.partial().parse(req.body);

      // Encrypt sensitive fields if provided
      if (data.apiKey && data.apiKey !== '********') data.apiKey = encrypt(data.apiKey);
      else if (data.apiKey === '********') delete data.apiKey;
      
      if (data.apiSecret && data.apiSecret !== '********') data.apiSecret = encrypt(data.apiSecret);
      else if (data.apiSecret === '********') delete data.apiSecret;

      if (data.webhookSecret && data.webhookSecret !== '********') data.webhookSecret = encrypt(data.webhookSecret);
      else if (data.webhookSecret === '********') delete data.webhookSecret;

      if (data.smtpPassword && data.smtpPassword !== '********') data.smtpPassword = encrypt(data.smtpPassword);
      else if (data.smtpPassword === '********') delete data.smtpPassword;

      // If isPrimary is true, unset other primary integrations
      if (data.isPrimary) {
        await prisma.emailIntegration.updateMany({
          where: { isPrimary: true, id: { not: id } },
          data: { isPrimary: false },
        });
      }

      const integration = await prisma.emailIntegration.update({
        where: { id },
        data: data as any,
      });

      // Reload EmailServiceV2
      await EmailServiceV2.getInstance().reload();

      return reply.send(integration);
    } catch (error) {
      req.log.error(error);
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Dados inválidos', details: error.issues });
      }
      return reply.status(500).send({ 
        error: 'Erro ao atualizar integração de e-mail',
        message: (error as Error).message,
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
      });
    }
  }

  /**
   * DELETE /api/settings/email/:id
   */
  async delete(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = req.params;
      await prisma.emailIntegration.delete({ where: { id } });

      // Reload EmailServiceV2
      await EmailServiceV2.getInstance().reload();

      return reply.status(204).send();
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({ error: 'Erro ao excluir integração de e-mail' });
    }
  }

  /**
   * POST /api/settings/email/test
   */
  async test(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { integrationId, to } = req.body as any;
      
      const integration = await prisma.emailIntegration.findUnique({
        where: { id: integrationId }
      });

      if (!integration) {
        return reply.status(404).send({ error: 'Integração não encontrada' });
      }

      // We can use EmailServiceV2 to send a test email
      // But we need to make sure the provider is loaded
      await EmailServiceV2.getInstance().reload();
      
      const result = await EmailServiceV2.getInstance().send({
        to: to || 'test@example.com',
        subject: 'Teste de Configuração de E-mail - Kaven',
        html: '<p>Este é um e-mail de teste da sua nova infraestrutura Kaven.</p>',
        userId: (req as any).user?.id,
        tenantId: integration.isPrimary ? undefined : 'some-tenant-id' // Ideally we should have context
      }, { useQueue: false }); // Bypass queue for immediate testing feedback

      return reply.send(result);
    } catch (error: any) {
      req.log.error(error);
      return reply.send({ success: false, error: error.message });
    }
  }
}

export const emailIntegrationController = new EmailIntegrationController();
