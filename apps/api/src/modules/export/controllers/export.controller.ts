import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../../lib/prisma';
import { exportService } from '../../../services/export.service';
import { sanitize } from 'isomorphic-dompurify';

export class ExportController {
  /**
   * Exporta a lista de usuários em CSV
   */
  async exportUsers(request: FastifyRequest, reply: FastifyReply) {
    const tenantId = request.tenantId;
    if (!tenantId) {
      return reply.status(400).send({ error: 'Tenant ID é obrigatório' });
    }

    const query = request.query as Record<string, any>;
    const role = typeof query.role === 'string' ? query.role : undefined;
    const status = typeof query.status === 'string' ? query.status : undefined;
    const search = typeof query.search === 'string' ? sanitize(query.search) : undefined;

    const where: any = {
      tenantId,
    };

    if (role && role !== 'all') where.role = role;
    if (status && status !== 'all') where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    const csv = await exportService.generateCSV({
      entity: 'User',
      data: users,
      headers: {
        id: 'ID',
        name: 'Nome',
        email: 'E-mail',
        phone: 'Telefone',
        role: 'Função',
        status: 'Status',
        createdAt: 'Criado em',
      },
      actorId: request.user?.id || 'system',
      tenantId: tenantId,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });

    reply
      .header('Content-Type', 'text/csv')
      .header('Content-Disposition', `attachment; filename=users-export-${new Date().getTime()}.csv`)
      .send(csv);
  }

  /**
   * Exporta logs de auditoria em CSV
   */
  async exportAuditLogs(request: FastifyRequest, reply: FastifyReply) {
    const tenantId = request.tenantId;
    
    // Logs de auditoria podem ser globais para Super Admin ou por tenant
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 5000, // Limite para evitar estouro de memória no CSV simples
      include: {
        user: {
          select: { email: true }
        }
      }
    });

    const formattedLogs = logs.map(log => ({
      ...log,
      userEmail: log.user?.email || 'N/A',
      metadataStr: JSON.stringify(log.metadata)
    }));

    const csv = await exportService.generateCSV({
      entity: 'AuditLog',
      data: formattedLogs,
      headers: {
        id: 'ID',
        createdAt: 'Data/Hora',
        action: 'Ação',
        entity: 'Entidade',
        entityId: 'ID da Entidade',
        userEmail: 'Ator (Email)',
        ipAddress: 'IP',
        metadataStr: 'Metadados'
      },
      actorId: request.user?.id || 'system',
      tenantId: tenantId || 'system',
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });

    reply
      .header('Content-Type', 'text/csv')
      .header('Content-Disposition', `attachment; filename=audit-logs-export-${new Date().getTime()}.csv`)
      .send(csv);
  }
}

export const exportController = new ExportController();
