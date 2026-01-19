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
   * Testa uma integração de email enviando um email real ao administrador logado
   */
  async test(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id, mode } = req.body as { id: string; mode?: 'sandbox' | 'custom' };
      
      if (!id) {
        return reply.status(400).send({ 
          success: false, 
          error: 'ID da integração é obrigatório' 
        });
      }
      
      const integration = await prisma.emailIntegration.findUnique({
        where: { id }
      });

      if (!integration) {
        return reply.status(404).send({ 
          success: false, 
          error: 'Integração não encontrada' 
        });
      }

      // Buscar email do admin logado
      const user = (req as any).user;
      if (!user || !user.email) {
        return reply.status(401).send({ 
          success: false, 
          error: 'Usuário não autenticado ou sem email' 
        });
      }

      // Determinar email de envio baseado no modo
      let fromEmail = integration.fromEmail;
      let testMode = mode || 'custom';
      
      // Para Resend e Postmark, oferecer opção de sandbox
      if (testMode === 'sandbox') {
        if (integration.provider === 'RESEND') {
          fromEmail = 'onboarding@resend.dev';
        } else if (integration.provider === 'POSTMARK') {
          fromEmail = 'test@blackhole.postmarkapp.com';
        } else {
          // Outros providers não têm sandbox, usar custom
          testMode = 'custom';
        }
      }

      // Recarregar providers para garantir que a integração está disponível
      await EmailServiceV2.getInstance().reload();
      
      // Enviar email de teste
      const result = await EmailServiceV2.getInstance().send({
        to: user.email,
        from: fromEmail || undefined,
        subject: `✅ Teste de Integração - ${integration.provider} (${testMode === 'sandbox' ? 'Sandbox' : 'Domínio Customizado'})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Teste de Configuração de Email</h2>
            <p>Olá <strong>${user.name || user.email}</strong>,</p>
            <p>Este é um email de teste da sua integração <strong>${integration.provider}</strong> configurada no Kaven.</p>
            
            <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #374151;">Detalhes da Integração:</h3>
              <ul style="color: #6b7280;">
                <li><strong>Provedor:</strong> ${integration.provider}</li>
                <li><strong>Modo de Teste:</strong> ${testMode === 'sandbox' ? '🧪 Sandbox' : '🌐 Domínio Customizado'}</li>
                <li><strong>Email de Envio:</strong> ${fromEmail || 'Não configurado'}</li>
                <li><strong>Status:</strong> ${integration.isActive ? '✅ Ativo' : '❌ Inativo'}</li>
                <li><strong>Primário:</strong> ${integration.isPrimary ? 'Sim' : 'Não'}</li>
              </ul>
            </div>
            
            <p style="color: #10b981; font-weight: bold;">✅ Se você recebeu este email, sua integração está funcionando corretamente!</p>
            
            ${testMode === 'sandbox' ? `
              <div style="background: #fef3c7; padding: 12px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  <strong>⚠️ Modo Sandbox:</strong> Este email foi enviado usando o domínio de teste do provedor. 
                  Para produção, configure e verifique seu domínio customizado.
                </p>
              </div>
            ` : ''}
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
            <p style="color: #9ca3af; font-size: 12px;">
              Este email foi enviado automaticamente pelo sistema Kaven.<br>
              Data/Hora: ${new Date().toLocaleString('pt-BR')}
            </p>
          </div>
        `,
        provider: integration.provider as any,
      }, { useQueue: false }); // Envio direto para feedback imediato

      if (result.success) {
        return reply.send({ 
          success: true, 
          message: `Email de teste (${testMode === 'sandbox' ? 'Sandbox' : 'Domínio Customizado'}) enviado com sucesso para ${user.email}`,
          messageId: result.messageId,
          mode: testMode
        });
      } else {
        return reply.send({ 
          success: false, 
          error: result.error || 'Falha ao enviar email de teste'
        });
      }
    } catch (error: any) {
      req.log.error(error);
      return reply.send({ 
        success: false, 
        error: error.message || 'Erro ao testar integração'
      });
    }
  }
}

export const emailIntegrationController = new EmailIntegrationController();
