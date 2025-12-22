import { prisma } from '../../../lib/prisma';

export interface AuditLogData {
  action: string;
  entity: string;
  entityId: string;
  actorId?: string; // ID do usuário que realizou a ação
  tenantId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditService {
  /**
   * Registra uma ação no log de auditoria
   */
  async log(data: AuditLogData) {
    try {
      await prisma.auditLog.create({
        data: {
          action: data.action,
          entity: data.entity,
          entityId: data.entityId,
          userId: data.actorId, // Mapeando actorId para userId no schema
          tenantId: data.tenantId,
          metadata: data.metadata || {},
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        },
      });
    } catch (error) {
      // Falha silenciosa para não quebrar o fluxo principal, mas logada no console
      console.error('⚠️ Failed to create audit log:', error);
    }
  }
}

export const auditService = new AuditService();
