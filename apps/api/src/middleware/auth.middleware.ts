import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken } from '../lib/jwt';
import { prisma } from '../lib/prisma';
import { Role } from '@prisma/client';

/**
 * Auth Middleware - Verifica JWT e injeta user no request
 * 
 * Extrai token do header Authorization: Bearer <token>
 * Verifica validade do token
 * Busca usuário no banco
 * Injeta user no request.user
 */

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      role: Role;
      tenantId: string | null;
    };
  }
}

/**
 * Middleware de autenticação JWT
 */
export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    // Extrair token do header Authorization
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      reply.status(401).send({
        error: 'Token não fornecido',
        message: 'Header Authorization com Bearer token é obrigatório',
      });
      return;
    }

    const token = authHeader.substring(7); // Remove "Bearer "

    // Verificar token JWT
    const payload = await verifyToken(token);

    if (!payload || !payload.userId) {
      reply.status(401).send({
        error: 'Token inválido',
        message: 'Token JWT inválido ou expirado',
      });
      return;
    }

    // Buscar usuário no banco
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
        tenantId: true,
        deletedAt: true,
      },
    });

    if (!user || user.deletedAt) {
      reply.status(401).send({
        error: 'Usuário não encontrado',
        message: 'Usuário não existe ou foi deletado',
      });
      return;
    }

    // Injetar user no request
    request.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };

    // Continuar para próximo handler
  } catch (error) {
    request.log.error({ error }, 'Erro no auth middleware');
    reply.status(401).send({
      error: 'Erro de autenticação',
      message: 'Falha ao verificar token',
    });
  }
}

/**
 * Middleware opcional de autenticação
 * Não retorna erro se token não for fornecido, apenas não injeta user
 */
export async function optionalAuthMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Sem token, continua sem user
      return;
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);

    if (!payload || !payload.userId) {
      // Token inválido, continua sem user
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
        tenantId: true,
        deletedAt: true,
      },
    });

    if (user && !user.deletedAt) {
      request.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      };
    }
  } catch (error) {
    // Ignora erros, continua sem user
    request.log.warn({ error }, 'Erro no optional auth middleware');
  }
}
