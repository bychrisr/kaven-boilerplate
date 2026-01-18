import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';
import { TimezoneUtil } from '../../../utils/timezone.util';

const updateSettingsSchema = z.object({
  companyName: z.string().min(1),
  description: z.string().optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  language: z.string(),
  currency: z.string(),
  numberFormat: z.string(),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  ogImageUrl: z.string().optional(),
  twitterHandle: z.string().optional(),
  // Novos campos
  timezone: z.string().optional(),
  dateFormat: z.string().optional(),
  timeFormat: z.string().optional(),
});

export class PlatformController {
  /**
   * GET /api/settings/platform
   * Busca as configurações da plataforma (ou cria default se não existir)
   */
  async getSettings(req: FastifyRequest, reply: FastifyReply) {
    try {
      let config = await prisma.platformConfig.findFirst();

      if (!config) {
        config = await prisma.platformConfig.create({
          data: {
            companyName: 'Kaven SaaS',
            primaryColor: '#00A76F',
            language: 'pt-BR',
            currency: 'BRL',
          },
        });
      }

      return reply.send(config);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({ error: 'Erro ao buscar configurações da plataforma' });
    }
  }

  /**
   * PUT /api/settings/platform
   * Atualiza as configurações da plataforma
   */
  async updateSettings(req: FastifyRequest, reply: FastifyReply) {
    try {
      const data = updateSettingsSchema.parse(req.body);

      // Validar timezone se fornecido
      if (data.timezone && !TimezoneUtil.isValidTimezone(data.timezone)) {
        return reply.status(400).send({ error: 'Timezone inválido' });
      }

      // Garante que existe apenas um registro, atualiza o primeiro encontrado
      const firstConfig = await prisma.platformConfig.findFirst();

      let config;
      if (firstConfig) {
        config = await prisma.platformConfig.update({
          where: { id: firstConfig.id },
          data,
        });
      } else {
        config = await prisma.platformConfig.create({
          data,
        });
      }

      return reply.send(config);
    } catch (error) {
      req.log.error(error);
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Dados inválidos', details: error.issues });
      }
      return reply.status(500).send({ error: 'Erro ao salvar configurações' });
    }
  }

  /**
   * GET /api/settings/platform/timezones?lang=pt
   * Lista todos os timezones disponíveis no idioma especificado
   */
  async getTimezones(req: FastifyRequest<{ Querystring: { lang?: string } }>, reply: FastifyReply) {
    try {
      const lang = (req.query.lang === 'en' ? 'en' : 'pt') as 'pt' | 'en';
      const timezones = TimezoneUtil.getTimezonesByLanguage(lang);
      return reply.send(timezones);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({ error: 'Erro ao buscar timezones' });
    }
  }

  /**
   * POST /api/settings/platform/test-email
   * Envia um e-mail de teste para validar configuração
   */
  async testEmail(req: FastifyRequest<{ Body: { to?: string; provider?: string } }>, reply: FastifyReply) {
    try {
      const { to, provider } = req.body || {};

      // Usar email do request.user ou padrão
      const recipientEmail = to || (req.user?.email) || 'test@example.com';

      // Importar emailServiceV2
      const { emailServiceV2 } = await import('../../../lib/email');
      const { EmailType } = await import('../../../lib/email/types');

      // Enviar e-mail de teste
      const result = await emailServiceV2.send(
        {
          to: recipientEmail,
          subject: 'Teste de Configuração de E-mail - Kaven',
          html: `
            <h1>✅ Teste de E-mail</h1>
            <p>Este é um e-mail de teste enviado através do painel de administração.</p>
            <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            <p><strong>Provider:</strong> ${provider || 'Padrão'}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
              Se você recebeu este e-mail, significa que sua configuração está funcionando corretamente!
            </p>
          `,
          text: 'Teste de configuração de e-mail - Kaven',
          type: EmailType.TRANSACTIONAL,
          provider: provider as any,
        },
        { useQueue: false }
      );

      if (result.success) {
        return reply.send({
          success: true,
          message: 'E-mail de teste enviado com sucesso!',
          messageId: result.messageId,
          provider: result.provider,
        });
      } else {
        return reply.status(500).send({
          success: false,
          error: result.error || 'Erro ao enviar e-mail de teste',
        });
      }
    } catch (error: any) {
      req.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'Erro ao enviar e-mail de teste',
      });
    }
  }
}

export const platformController = new PlatformController();
