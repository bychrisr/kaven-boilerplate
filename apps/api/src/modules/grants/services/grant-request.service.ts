import { 
  PrismaClient, 
  GrantRequest, 
  GrantRequestStatus, 
  GrantType,
  AccessLevel,
  CapabilityScope
} from '@prisma/client';
import { 
    CreateGrantRequestInput, 
    ReviewGrantRequestInput 
} from '@kaven/shared';

import { notificationService } from '../../notifications/services/notification.service';
const prisma = new PrismaClient();

export class GrantRequestService {
  /**
   * Cria uma solicitação de acesso
   */
  async createRequest(userId: string, data: CreateGrantRequestInput) {
    // 1. Validar se a capability existe (se fornecida)
    if (data.capabilityId) {
      const capability = await prisma.capability.findUnique({
        where: { id: data.capabilityId },
      });
      if (!capability) throw new Error('Capability not found');
    }

    // 2. Validar se o space existe (se fornecido)
    if (data.spaceId) {
      const space = await prisma.space.findUnique({
        where: { id: data.spaceId },
      });
      if (!space) throw new Error('Space not found');
    }

    // 3. Criar a solicitação
    const request = await prisma.grantRequest.create({
      data: {
        requesterId: userId,
        spaceId: data.spaceId,
        capabilityId: data.capabilityId,
        justification: data.justification,
        requestedDuration: data.requestedDuration,
        accessLevel: (data.accessLevel as AccessLevel) || AccessLevel.READ_ONLY,
        scope: (data.scope as CapabilityScope) || CapabilityScope.SPACE,
        status: GrantRequestStatus.PENDING,
      },
      include: {
        capability: true,
        space: true,
        requester: {
            select: { id: true, name: true, email: true, avatar: true }
        }
      }
    });

    // 4. Disparar notificação para aprovadores (quem tem capacidade grant.review)
    // Buscamos usuários que possuem essa capability no space ou globalmente
    // Por simplicidade nesta fase, notificaremos os administradores do sistema ou gestores do space
    setTimeout(async () => {
        try {
            await notificationService.createNotification({
                userId: userId, // User should actually be the admin/manager, but we need to find them
                type: 'security',
                priority: 'medium',
                title: 'Nova Solicitação de Acesso',
                message: `O usuário ${request.requester.name} solicitou acesso à capability ${request.capability?.code || request.capabilityId} no space ${request.space?.name || 'Global'}.`,
                actionUrl: `/platform/grants/requests`,
                actionText: 'Ver Solicitação',
                metadata: { requestId: request.id }
            });
        } catch (err) {
            console.error('[GrantRequestService] Failed to send notification:', err);
        }
    }, 0);
    
    return request;
  }

  /**
   * Lista solicitações do próprio usuário
   */
  async listMyRequests(userId: string) {
    return prisma.grantRequest.findMany({
      where: { requesterId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        capability: true,
        space: true,
        approver: { select: { name: true } },
        rejector: { select: { name: true } },
      },
    });
  }

  /**
   * Lista solicitações pendentes (para gestores)
   * pode filtrar por spaceId se necessário
   */
  async listPendingRequests(spaceId?: string) {
    const whereClause: any = {
      status: GrantRequestStatus.PENDING,
    };
    
    if (spaceId) {
        whereClause.spaceId = spaceId;
    }

    return prisma.grantRequest.findMany({
      where: whereClause,
      orderBy: { createdAt: 'asc' },
      include: {
        capability: true,
        space: true,
        requester: {
          select: { id: true, name: true, email: true, avatar: true, role: true },
        },
      },
    });
  }

  /**
   * Aprova ou Rejeita uma solicitação
   */
  async reviewRequest(reviewerId: string, requestId: string, review: ReviewGrantRequestInput) {
    const request = await prisma.grantRequest.findUnique({
      where: { id: requestId },
      include: { capability: true }
    });

    if (!request) throw new Error('Request not found');
    if (request.status !== GrantRequestStatus.PENDING) throw new Error('Request is not pending');

    // Se REJECT
    if (review.action === 'REJECT') {
        if (!review.reason) throw new Error('Rejection reason is required');

        const result = await prisma.grantRequest.update({
            where: { id: requestId },
            data: {
                status: GrantRequestStatus.REJECTED,
                rejectedBy: reviewerId,
                rejectedAt: new Date(),
                rejectionReason: review.reason
            }
        });

        // Notificar o solicitante sobre a rejeição
        setTimeout(async () => {
            try {
                await notificationService.createNotification({
                    userId: request.requesterId,
                    type: 'security',
                    priority: 'high',
                    title: 'Solicitação de Acesso Rejeitada',
                    message: `Sua solicitação para o recurso ${request.capability?.code || 'solicitado'} foi rejeitada. Motivo: ${review.reason}`,
                    actionUrl: '/profile/access-requests',
                    actionText: 'Minhas Solicitações'
                });
            } catch (err) {
                console.error('[GrantRequestService] Notification error:', err);
            }
        }, 0);

        return result;
    }

    // Se APPROVE
    // Transação para atômica criação do Grant + Atualização do Request
    return prisma.$transaction(async (tx) => {
        // 1. Atualizar Request
        const updatedRequest = await tx.grantRequest.update({
            where: { id: requestId },
            data: {
                status: GrantRequestStatus.APPROVED,
                approvedBy: reviewerId,
                approvedAt: new Date(),
            }
        });

        // 2. Calcular expiração
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + request.requestedDuration);

        // 3. Criar Grant
        const grant = await tx.grant.create({
            data: {
                userId: request.requesterId,
                spaceId: request.spaceId,
                capabilityId: request.capabilityId,
                type: GrantType.ADD,
                accessLevel: request.accessLevel,
                scope: request.scope,
                justification: `Approved Request: ${request.justification}`,
                grantedBy: reviewerId,
                status: 'ACTIVE',
                expiresAt: expiresAt,
                grantRequestId: request.id,
            }
        });

        // Notificar o solicitante sobre a aprovação
        setTimeout(async () => {
            try {
                await notificationService.createNotification({
                    userId: request.requesterId,
                    type: 'security',
                    priority: 'high',
                    title: 'Solicitação de Acesso Aprovada',
                    message: `Sua solicitação de acesso para ${request.capability?.code || 'recurso'} foi aprovada e já está ativa.`,
                    actionUrl: '/profile/access-requests',
                    actionText: 'Ver Acessos'
                });
            } catch (err) {
                console.error('[GrantRequestService] Notification error:', err);
            }
        }, 0);

        return { request: updatedRequest, grant };
    });
  }
}

export const grantRequestService = new GrantRequestService();
