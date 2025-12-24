import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';
import { secureLog } from '../utils/secure-logger';

/**
 * IDOR Middleware (Insecure Direct Object Reference)
 * Verifica se o usuário tem permissão para acessar o recurso solicitado pelo ID.
 */
export const preventIdor = (
  modelName: 'user' | 'tenant' | 'invoice' | 'order' | 'subscription' | 'file',
  paramName: string = 'id',
  ownerField: string = 'userId'
) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.user) {
        return reply.status(401).send({ error: 'Não autenticado' });
      }

      const resourceId = (request.params as any)[paramName];
      secureLog.debug('[MW_ENTER: IDOR]', { 
          reqId: request.id, 
          resource: modelName, 
          resourceId 
      });

      if (!resourceId) {
        // Se não tem ID na rota, talvez seja criação ou listagem, ignora
        return;
      }

      // Admin e Super Admin podem acessar tudo (dependendo da regra de negócio)
      // Ajuste conforme necessidade:
      if (request.user.role === 'SUPER_ADMIN') {
        return;
      }

      // @ts-ignore - Prisma dynamic access
      const resource = await prisma[modelName].findUnique({
        where: { id: resourceId },
        select: { [ownerField]: true, tenantId: true },
      });

      if (!resource) {
        return reply.status(404).send({ error: 'Recurso não encontrado' });
      }

      // Verificação de propriedade
      const isOwner = resource[ownerField] === request.user.id;
      
      // Verificação de Tenant (se o recurso pertencer ao mesmo tenant do usuário)
      // ownerField pode não ser userId, mas tenantId
      const isSameTenant = resource.tenantId && resource.tenantId === request.user.tenantId;

      if (!isOwner && !isSameTenant) {
        secureLog.warn('[MW_BLOCK: IDOR]', { 
            reqId: request.id,
            userId: request.user.id, 
            resource: modelName, 
            resourceId, 
            reason: 'Unauthorized Access' 
        });
        
        return reply.status(403).send({ error: 'Acesso negado' });
      }

    } catch (error) {
      secureLog.error('[MW_ERROR: IDOR]', { reqId: request.id, error });
      return reply.status(500).send({ error: 'Erro interno na verificação de permissão' });
    }
  };
};
