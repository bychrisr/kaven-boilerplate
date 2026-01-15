import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../../lib/prisma';

export async function currenciesRoutes(app: FastifyInstance) {
  // GET /api/currencies - Lista todas as currencies
  app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { includeInactive } = request.query as { includeInactive?: string };
      
      const currencies = await prisma.currency.findMany({
        where: includeInactive === 'true' ? {} : { isActive: true },
        orderBy: { sortOrder: 'asc' },
      });

      return reply.send(currencies);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch currencies' });
    }
  });

  // GET /api/currencies/:code - Busca currency por código
  app.get('/:code', async (request: FastifyRequest<{ Params: { code: string } }>, reply: FastifyReply) => {
    try {
      const { code } = request.params;
      
      const currency = await prisma.currency.findUnique({
        where: { code: code.toUpperCase() },
      });

      if (!currency) {
        return reply.status(404).send({ error: 'Currency not found' });
      }

      return reply.send(currency);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch currency' });
    }
  });

  // PUT /api/currencies/:code - Atualiza currency por código
  app.put('/:code', async (request: FastifyRequest<{ Params: { code: string }; Body: any }>, reply: FastifyReply) => {
    try {
      const { code } = request.params;
      const data = request.body;

      // Verifica se a currency existe
      const existing = await prisma.currency.findUnique({
        where: { code: code.toUpperCase() },
      });

      if (!existing) {
        return reply.status(404).send({ error: 'Currency not found' });
      }

      // Se está mudando o código, verifica se o novo código já existe
      if (data.code && data.code.toUpperCase() !== code.toUpperCase()) {
        const codeExists = await prisma.currency.findUnique({
          where: { code: data.code.toUpperCase() },
        });

        if (codeExists) {
          return reply.status(400).send({ error: 'Currency code already exists' });
        }
      }

      // Atualiza a currency
      const updated = await prisma.currency.update({
        where: { code: code.toUpperCase() },
        data: {
          ...data,
          code: data.code?.toUpperCase() || code.toUpperCase(),
        },
      });

      return reply.send(updated);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: 'Failed to update currency' });
    }
  });

  // DELETE /api/currencies/:code - Desativa currency (soft delete)
  app.delete('/:code', async (request: FastifyRequest<{ Params: { code: string } }>, reply: FastifyReply) => {
    try {
      const { code } = request.params;

      // Verifica se a currency existe
      const existing = await prisma.currency.findUnique({
        where: { code: code.toUpperCase() },
      });

      if (!existing) {
        return reply.status(404).send({ error: 'Currency not found' });
      }

      // Soft delete - apenas desativa
      await prisma.currency.update({
        where: { code: code.toUpperCase() },
        data: { isActive: false },
      });

      return reply.send({ message: 'Currency deactivated successfully' });
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: 'Failed to delete currency' });
    }
  });
}
