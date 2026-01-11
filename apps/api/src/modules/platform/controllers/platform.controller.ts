import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';

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
}

export const platformController = new PlatformController();
