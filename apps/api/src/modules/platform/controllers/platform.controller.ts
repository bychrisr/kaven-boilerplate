import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';
import { TimezoneUtil } from '../../../utils/timezone.util';
import { EncryptionUtil } from '../../../utils/encryption.util';
import * as nodemailer from 'nodemailer';

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
  smtpHost: z.string().optional(),
  smtpPort: z.number().optional(),
  smtpSecure: z.boolean().optional(),
  smtpUser: z.string().optional(),
  smtpPassword: z.string().optional(),
  emailFrom: z.string().optional(),
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

      // Criptografar senha SMTP se fornecida
      if (data.smtpPassword) {
        data.smtpPassword = EncryptionUtil.encrypt(data.smtpPassword);
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

      // Descriptografar senha antes de retornar (para não expor)
      if (config.smtpPassword) {
        config.smtpPassword = '********';
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
   * Testa a configuração de email enviando um email de teste
   */
  async testEmail(req: FastifyRequest, reply: FastifyReply) {
    try {
      const config = await prisma.platformConfig.findFirst();

      if (!config || !config.smtpHost || !config.smtpPort) {
        return reply.status(400).send({
          success: false,
          message: 'Configuração de email incompleta',
        });
      }

      // Descriptografar senha
      const smtpPassword = config.smtpPassword
        ? EncryptionUtil.decrypt(config.smtpPassword)
        : undefined;

      // Criar transporter
      const transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort,
        secure: config.smtpSecure || false,
        auth: config.smtpUser
          ? {
              user: config.smtpUser,
              pass: smtpPassword,
            }
          : undefined,
      });

      // Enviar email de teste
      await transporter.sendMail({
        from: config.emailFrom || 'Kaven <noreply@kaven.com>',
        to: config.smtpUser || 'test@example.com',
        subject: 'Teste de Configuração de Email - Kaven',
        text: 'Este é um email de teste para verificar a configuração SMTP.',
        html: '<p>Este é um email de teste para verificar a configuração SMTP.</p>',
      });

      return reply.send({
        success: true,
        message: 'Email de teste enviado com sucesso!',
      });
    } catch (error) {
      req.log.error(error);
      return reply.send({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao enviar email de teste',
      });
    }
  }
}

export const platformController = new PlatformController();
