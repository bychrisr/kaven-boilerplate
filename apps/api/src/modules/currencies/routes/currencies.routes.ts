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
}
