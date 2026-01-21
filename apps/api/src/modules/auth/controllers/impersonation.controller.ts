import { FastifyRequest, FastifyReply } from 'fastify';
import { impersonationService } from '../../../services/impersonation.service';
import { authorizationService } from '../../../services/authorization.service';

export class ImpersonationController {
  /**
   * Inicia uma sessão de impersonation
   * POST /api/auth/impersonate/start
   */
  async start(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { targetUserId, justification } = request.body as { 
        targetUserId: string; 
        justification: string; 
      };

      if (!targetUserId || !justification) {
        return reply.status(400).send({ 
          error: 'targetUserId and justification are required' 
        });
      }

      const admin = (request as any).user;
      if (!admin) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      // 1. Validar se o admin tem a capability impersonation.start
      const capabilities = await authorizationService.getUserCapabilities(admin.id);
      const hasCapability = capabilities.includes('impersonation.start') || capabilities.includes('*');

      if (!hasCapability) {
        return reply.status(403).send({ 
          error: 'You do not have permission to start impersonation' 
        });
      }

      // 2. Criar a sessão
      const session = await impersonationService.startSession({
        impersonatorId: admin.id,
        impersonatedId: targetUserId,
        justification,
        ipAddress: request.ip,
        userAgent: request.headers['user-agent']
      });

      return reply.status(201).send({ 
        message: 'Impersonation session started',
        session 
      });
    } catch (error: any) {
      console.error('Error starting impersonation:', error);
      return reply.status(500).send({ error: error.message || 'Failed to start impersonation' });
    }
  }

  /**
   * Encerra a sessão de impersonation atual
   * POST /api/auth/impersonate/stop
   */
  async stop(request: FastifyRequest, reply: FastifyReply) {
    try {
      const admin = (request as any).user;
      if (!admin) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const session = await impersonationService.getActiveSession(admin.id);
      
      if (!session) {
        return reply.status(404).send({ error: 'No active impersonation session found' });
      }

      await impersonationService.endSession(session.id);

      return reply.send({ message: 'Impersonation session ended' });
    } catch (error: any) {
      console.error('Error stopping impersonation:', error);
      return reply.status(500).send({ error: 'Failed to stop impersonation' });
    }
  }

  /**
   * Retorna a sessão ativa do admin (se houver)
   * GET /api/auth/impersonate/status
   */
  async getStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const admin = (request as any).user;
      if (!admin) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const session = await impersonationService.getActiveSession(admin.id);
      
      return reply.send({ 
        isActive: !!session,
        session: session || null
      });
    } catch (error) {
      console.error('Error getting impersonation status:', error);
      return reply.status(500).send({ error: 'Failed to get status' });
    }
  }
}

export const impersonationController = new ImpersonationController();
