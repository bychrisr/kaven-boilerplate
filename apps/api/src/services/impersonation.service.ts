import { prisma } from '../lib/prisma';
import { ImpersonationStatus } from '@prisma/client';
import { addMinutes } from 'date-fns';

export class ImpersonationService {
  /**
   * Inicia uma nova sessão de impersonation
   */
  async startSession(data: {
    impersonatorId: string;
    impersonatedId: string;
    justification: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    // Definir expiração padrão: 30 minutos
    const expiresAt = addMinutes(new Date(), 30);

    // Encerrar sessões ativas anteriores do mesmo admin (opcional, mas recomendado por segurança)
    await prisma.impersonationSession.updateMany({
      where: {
        impersonatorId: data.impersonatorId,
        status: 'ACTIVE'
      },
      data: {
        status: 'ENDED',
        endedAt: new Date()
      }
    });

    return prisma.impersonationSession.create({
      data: {
        impersonatorId: data.impersonatorId,
        impersonatedId: data.impersonatedId,
        justification: data.justification,
        expiresAt,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        status: 'ACTIVE'
      },
      include: {
        impersonated: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });
  }

  /**
   * Valida se uma sessão ainda é válida e retorna os dados
   */
  async validateSession(sessionId: string) {
    const session = await prisma.impersonationSession.findUnique({
      where: { id: sessionId },
      include: {
        impersonated: true,
        impersonator: true
      }
    });

    if (!session || session.status !== 'ACTIVE') return null;

    // Verificar expiração
    if (new Date() > session.expiresAt) {
      await prisma.impersonationSession.update({
        where: { id: sessionId },
        data: { status: 'EXPIRED' }
      });
      return null;
    }

    return session;
  }

  /**
   * Encerra uma sessão manualmente
   */
  async endSession(sessionId: string) {
    return prisma.impersonationSession.update({
      where: { id: sessionId },
      data: {
        status: 'ENDED',
        endedAt: new Date()
      }
    });
  }

  /**
   * Lista sessões ativas (para o admin logado)
   */
  async getActiveSession(adminId: string) {
    return prisma.impersonationSession.findFirst({
      where: {
        impersonatorId: adminId,
        status: 'ACTIVE',
        expiresAt: { gt: new Date() }
      },
      include: {
        impersonated: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }
}

export const impersonationService = new ImpersonationService();
