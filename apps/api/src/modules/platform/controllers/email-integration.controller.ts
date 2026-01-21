import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';
import { encrypt } from '../../../lib/crypto/encryption';
import { EmailServiceV2 } from '../../../lib/email';
import { EmailProvider } from '../../../lib/email/types';
import { providerEmailDetector } from '../../../lib/email/provider-email-detector';
import { emailIntegrationHealthService } from '../services/email-integration-health.service';
import { maskingService } from '../../../services/masking.service';
import { authorizationService } from '../../../services/authorization.service';

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
  testEmail: z.string().email().optional().nullable(), // Email para testes (Resend)
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

      // Get user capabilities for masking
      const user = (req as any).user;
      const spaceId = req.headers['x-space-id'] as string | undefined;
      const capabilities = user ? await authorizationService.getUserCapabilities(user.id, spaceId) : [];
      
      const masked = maskingService.maskObject('EmailIntegration', integrations, capabilities);

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

      // Executar health check em background (não bloquear resposta)
      emailIntegrationHealthService.checkIntegration(integration.id).catch((error) => {
        req.log.error('[HealthCheck] Failed to check integration:', error);
      });

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

      // Executar health check em background (não bloquear resposta)
      emailIntegrationHealthService.checkIntegration(id).catch((error) => {
        req.log.error('[HealthCheck] Failed to check integration:', error);
      });

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
   * GET /api/settings/email/:id/health
   * Executa health check em uma integração específica
   */
  async healthCheck(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = req.params;

      // Verificar se integração existe
      const integration = await prisma.emailIntegration.findUnique({
        where: { id },
        select: { id: true, provider: true, isActive: true },
      });

      if (!integration) {
        return reply.status(404).send({ 
          healthy: false,
          error: 'Integration not found' 
        });
      }

      // Executar health check
      const result = await emailIntegrationHealthService.checkIntegration(id);

      return reply.send(result);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({ 
        healthy: false,
        error: 'Erro ao executar health check',
        message: (error as Error).message 
      });
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

      // Buscar email do admin logado (usado como fallback)
      const user = (req as any).user;
      if (!user || !user.email) {
        return reply.status(401).send({ 
          success: false, 
          error: 'Usuário não autenticado ou sem email' 
        });
      }

      // Determinar modo de teste
      let testMode = mode || 'custom';

      // Detectar email apropriado para teste baseado no provider
      const detectedEmail = await providerEmailDetector.detectEmail(
        {
          id: integration.id,
          provider: integration.provider as EmailProvider,
          apiKey: integration.apiKey,
          apiSecret: integration.apiSecret,
          fromEmail: integration.fromEmail,
          testEmail: integration.testEmail,
        },
        testMode,
        user.email // Fallback para email do admin
      );

      // Determinar email de envio baseado no modo
      let fromEmail = integration.fromEmail;
      
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
      
      
      // Verificar se o provider foi inicializado (tem credenciais válidas)
      const emailService = EmailServiceV2.getInstance() as any;
      const providerInstance = emailService.providers.get(integration.id);
      
      if (!providerInstance) {
        return reply.status(400).send({
          success: false,
          error: 'Provider não inicializado - verifique se as credenciais estão configuradas corretamente',
          provider: integration.provider,
        });
      }
      // Enviar email de teste
      const result = await EmailServiceV2.getInstance().send({
        to: detectedEmail.email,
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
                <li><strong>Email de Destino:</strong> ${detectedEmail.email}</li>
                <li><strong>Fonte:</strong> ${detectedEmail.source === 'verified' ? '✅ Verificado no provider' : detectedEmail.source === 'configured' ? '⚙️ Configurado' : '👤 Email do admin'}</li>
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
            
            ${detectedEmail.source === 'fallback' ? `
              <div style="background: #dbeafe; padding: 12px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
                <p style="margin: 0; color: #1e40af; font-size: 14px;">
                  <strong>ℹ️ Email de Fallback:</strong> ${detectedEmail.providerMessage}
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
        // Mensagem de sucesso baseada na fonte do email
        let successMessage = '';
        
        if (detectedEmail.source === 'verified') {
          successMessage = `✅ Teste enviado para ${detectedEmail.email} (email verificado no ${integration.provider})`;
        } else if (detectedEmail.source === 'sandbox') {
          successMessage = `✅ Teste enviado! Modo sandbox permite apenas envio para seu email (${detectedEmail.email}). Para produção, verifique seu domínio.`;
        } else if (detectedEmail.source === 'configured') {
          successMessage = `✅ Teste enviado para ${detectedEmail.email} (email configurado). ${detectedEmail.providerMessage}`;
        } else {
          successMessage = `ℹ️ Teste enviado para ${detectedEmail.email} (email do admin). ${detectedEmail.providerMessage}`;
        }
        
        return reply.send({ 
          success: true,
          isInfo: detectedEmail.source === 'fallback' || detectedEmail.source === 'sandbox',
          message: successMessage,
          messageId: result.messageId,
          mode: testMode,
          emailSource: detectedEmail.source
        });
      } else {
        // Detectar mensagens específicas de providers que são informativas, não erros
        const errorMessage = result.error || 'Falha ao enviar email de teste';
        
        // Resend: Mensagem de limitação de sandbox (sucesso, mas com restrição)
        if (errorMessage.includes('You can only send testing emails to your own email')) {
          return reply.send({ 
            success: true,
            isInfo: true, // Flag para frontend exibir como info
            message: testMode === 'sandbox' 
              ? `✅ Teste enviado! Modo sandbox permite apenas envio para seu email (${user.email}). Para produção, verifique seu domínio em resend.com/domains`
              : `✅ Teste enviado! Domínio não verificado - emails limitados ao seu endereço (${user.email}). Verifique seu domínio em resend.com/domains para enviar para outros destinatários.`,
            messageEn: testMode === 'sandbox'
              ? `✅ Test sent! Sandbox mode only allows sending to your email (${user.email}). For production, verify your domain at resend.com/domains`
              : `✅ Test sent! Unverified domain - emails limited to your address (${user.email}). Verify your domain at resend.com/domains to send to other recipients.`,
            provider: integration.provider
          });
        }
        
        // Outros erros reais
        return reply.send({ 
          success: false, 
          error: errorMessage
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
