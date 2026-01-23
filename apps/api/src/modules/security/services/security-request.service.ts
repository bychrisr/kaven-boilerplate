import { prisma } from '../../../lib/prisma';
import { SecurityRequestStatus, Role } from '@prisma/client';
import { 
  CreateSecurityRequestInput, 
  ReviewSecurityRequestInput 
} from '@kaven/shared';
import { userService } from '../../users/services/user.service';
import { notificationService } from '../../notifications/services/notification.service';

export class SecurityRequestService {
  
  /**
   * Cria uma nova solicitação de segurança (ex: 2FA Reset)
   */
  async createRequest(requesterId: string, data: CreateSecurityRequestInput) {
    const request = await prisma.securityRequest.create({
      data: {
        type: data.type,
        requesterId: requesterId,
        targetUserId: data.targetUserId,
        justification: data.justification,
        status: SecurityRequestStatus.PENDING,
      },
      include: {
        targetUser: {
          select: { name: true, email: true }
        }
      }
    });

    // Notificar Super Admins sobre a nova solicitação
    const superAdmins = await prisma.user.findMany({
      where: { role: Role.SUPER_ADMIN },
      select: { id: true }
    });

    for (const admin of superAdmins) {
      await notificationService.createNotification({
        userId: admin.id,
        type: 'security',
        priority: 'high',
        title: 'Nova Solicitação de Segurança',
        message: `Uma solicitação de ${data.type} para o usuário ${request.targetUser.name} foi criada.`,
        actionUrl: '/security/requests',
        actionText: 'Revisar Solicitação'
      });
    }

    return request;
  }

  /**
   * Lista solicitações pendentes
   */
  async listPending() {
    return prisma.securityRequest.findMany({
      where: { status: SecurityRequestStatus.PENDING },
      include: {
        requester: { select: { name: true, email: true } },
        targetUser: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Revisar uma solicitação (Aprovar/Rejeitar)
   */
  async reviewRequest(reviewerId: string, requestId: string, review: ReviewSecurityRequestInput) {
    const request = await prisma.securityRequest.findUnique({
      where: { id: requestId }
    });

    if (!request) throw new Error('Solicitação não encontrada');
    if (request.status !== SecurityRequestStatus.PENDING) throw new Error('Solicitação já processada');

    if (review.action === 'REJECT') {
      return prisma.securityRequest.update({
        where: { id: requestId },
        data: {
          status: SecurityRequestStatus.REJECTED,
          approvedBy: reviewerId,
          approvedAt: new Date(),
        }
      });
    }

    // Se APPROVE
    return prisma.securityRequest.update({
      where: { id: requestId },
      data: {
        status: SecurityRequestStatus.APPROVED,
        approvedBy: reviewerId,
        approvedAt: new Date(),
      }
    });
  }

  /**
   * Executar uma solicitação aprovada
   */
  async executeRequest(executorId: string, requestId: string) {
    const request = await prisma.securityRequest.findUnique({
      where: { id: requestId },
      include: { targetUser: true }
    });

    if (!request) throw new Error('Solicitação não encontrada');
    if (request.status !== SecurityRequestStatus.APPROVED) throw new Error('Apenas solicitações aprovadas podem ser executadas');

    // Executar a ação baseada no tipo
    if (request.type === '2FA_RESET') {
      await userService.resetTwoFactor(request.targetUserId, executorId);
    }

    return prisma.securityRequest.update({
      where: { id: requestId },
      data: {
        status: SecurityRequestStatus.EXECUTED,
        executedBy: executorId,
        executedAt: new Date(),
      }
    });
  }
}

export const securityRequestService = new SecurityRequestService();
