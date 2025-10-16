import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service.js';


/**
 * Authentication middleware - verifies JWT token
 */
export async function authenticateUser(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      reply.code(401).send({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Token de autorização não fornecido',
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const authService = new AuthService(
      request.server.prisma,
      request.server,
      request.server.redis
    );

    const payload = await authService.verifyToken(token);
    
    if (!payload) {
      reply.code(401).send({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Token inválido ou expirado',
      });
      return;
    }

    // Attach user info to request
    request.user = {
      id: payload.userId,
      email: payload.email,
      tenantId: payload.tenantId,
      isAdm: payload.isAdm,
    };

  } catch (error) {
    reply.code(401).send({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Erro na autenticação',
    });
  }
}

/**
 * Admin authorization middleware - requires isAdm = true
 */
export async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  if (!request.user) {
    reply.code(401).send({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Usuário não autenticado',
    });
    return;
  }

    if (!(request.user as any).isAdm) {
    reply.code(403).send({
      success: false,
      error: 'FORBIDDEN',
      message: 'Acesso negado. Permissões de administrador necessárias.',
    });
    return;
  }
}

/**
 * Optional authentication middleware - doesn't fail if no token
 */
export async function optionalAuth(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return; // No token provided, continue without authentication
    }

    const token = authHeader.substring(7);
    
    const authService = new AuthService(
      request.server.prisma,
      request.server,
      request.server.redis
    );

    const payload = await authService.verifyToken(token);
    
    if (payload) {
      request.user = {
        id: payload.userId,
        email: payload.email,
        tenantId: payload.tenantId,
        isAdm: payload.isAdm,
      };
    }

  } catch (error) {
    // Ignore authentication errors for optional auth
    return;
  }
}
