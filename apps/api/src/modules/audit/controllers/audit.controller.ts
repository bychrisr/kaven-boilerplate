import type { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../../lib/prisma';

export class AuditController {
  /**
   * GET /api/audit-logs
   * Listar logs de auditoria
   */
  async listLogs(
    request: FastifyRequest<{
      Querystring: {
        page?: number;
        limit?: number;
        entity?: string;
        action?: string;
        userId?: string;
      };
    }>,
    reply: FastifyReply
  ) {
    const { page = 1, limit = 20, entity, action, userId } = request.query;
    const skip = (page - 1) * limit;

    // Filtros básicos
    const where: any = {};
    if (entity) where.entity = entity;
    if (action) where.action = { contains: action };
    if (userId) where.userId = userId;

    // Tenant isolation (se não for SUPER_ADMIN, filtra pelo tenant do usuário)
    const user = request.user;
    
    if (!user) {
        reply.status(401).send({ error: 'Unauthorized' });
        return;
    }

    if (user.role !== 'SUPER_ADMIN') {
        // Se usuário tem tenant, filtra por ele
        if (user.tenantId) {
            where.tenantId = user.tenantId;
        } else {
            // Se usuário sem tenant (ex: plataforma) e não é super admin, não vê nada (ou vê só seus)
            // Por segurança, vamos restringir a seus próprios logs se não tiver tenant
            where.userId = user.id;
        }
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: { email: true, name: true }
            }
        }
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }
}

export const auditController = new AuditController();
