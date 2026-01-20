/**
 * Require Capability Middleware (Fastify)
 * 
 * Middleware para proteger rotas com verificação de capabilities.
 * 
 * Uso:
 * ```typescript
 * fastify.post('/invoices', {
 *   preHandler: requireCapability('invoices.create')
 * }, InvoiceController.create);
 * 
 * fastify.get('/tickets/:id', {
 *   preHandler: requireCapability('tickets.read', { spaceId: 'SUPPORT' })
 * }, TicketController.show);
 * ```
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { authorizationService } from '../services/authorization.service';
import { AuthorizationContext, ERROR_MESSAGES } from '../types/authorization.types';
import crypto from 'crypto';

// Estender FastifyRequest para incluir informações de autorização
declare module 'fastify' {
  interface FastifyRequest {
    authorization?: {
      accessLevel: string;
      grantId?: string;
      reason: string;
    };
  }
}

/**
 * Opções do middleware
 */
interface RequireCapabilityOptions {
  spaceId?: string;
  scope?: string;
}

/**
 * Gera deviceId único baseado em UserAgent e IP
 */
function generateDeviceId(req: FastifyRequest): string {
  const userAgent = req.headers['user-agent'] || 'unknown';
  const ip = req.ip || 'unknown';
  
  return crypto
    .createHash('sha256')
    .update(`${userAgent}:${ip}`)
    .digest('hex');
}

/**
 * Detecta tipo de dispositivo pelo UserAgent
 */
function detectDeviceType(userAgent: string): 'desktop' | 'mobile' | 'tablet' {
  const ua = userAgent.toLowerCase();
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'mobile';
  }
  if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'tablet';
  }
  return 'desktop';
}

/**
 * Valida origem da requisição
 */
function parseOrigin(origin?: string): 'web' | 'mobile' | 'api' {
  if (!origin) return 'web';
  if (origin === 'mobile' || origin === 'api') return origin;
  return 'web';
}

/**
 * Middleware para exigir capability
 * 
 * @param capabilityCode - Código da capability (ex: 'tickets.read')
 * @param options - Opções adicionais
 * @returns Middleware function
 */
export function requireCapability(
  capabilityCode: string,
  options: RequireCapabilityOptions = {}
) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      // 1. Verificar se usuário está autenticado
      const userId = (req as any).user?.id;
      if (!userId) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'Você precisa estar autenticado para acessar este recurso',
        });
      }

      // 2. Montar contexto de autorização
      const context: AuthorizationContext = {
        userId,
        tenantId: (req as any).tenantContext?.tenantId,
        spaceId: options.spaceId || req.headers['x-space-id'] as string,
        
        // User info
        user: {
          id: (req as any).user.id,
          email: (req as any).user.email,
          role: (req as any).user.role,
          twoFactorEnabled: (req as any).user.twoFactorEnabled || false,
        },
        
        // Session info
        session: {
          id: (req as any).session?.id || 'unknown',
          mfaVerified: (req as any).session?.mfaVerified || false,
          mfaVerifiedAt: (req as any).session?.mfaVerifiedAt,
        },
        
        // Request tracking
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        deviceId: generateDeviceId(req),
        deviceType: detectDeviceType(req.headers['user-agent'] || ''),
        origin: parseOrigin(req.headers['x-origin'] as string | undefined),
      };

      // 3. Verificar capability
      const result = await authorizationService.checkCapability({
        userId,
        capabilityCode,
        spaceId: context.spaceId,
        scope: options.scope as any,
        context,
      });

      // 4. Se negado, retornar 403
      if (!result.allowed) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: ERROR_MESSAGES[result.reason] || 'Acesso negado',
          reason: result.reason,
          capability: capabilityCode,
          metadata: result.metadata,
        });
      }

      // 5. Anexar informações de autorização ao request
      req.authorization = {
        accessLevel: result.accessLevel || 'READ_WRITE',
        grantId: result.grantId,
        reason: result.reason,
      };

      // 6. Continuar para próximo handler
      return;
    } catch (error) {
      console.error('Error in requireCapability middleware:', error);
      
      // Fail secure: em caso de erro, negar acesso
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Erro ao verificar permissões. Por favor, tente novamente.',
      });
    }
  };
}

/**
 * Middleware helper para verificar se usuário tem READ_WRITE
 * Útil para endpoints que modificam dados
 */
export function requireReadWrite() {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    if (req.authorization?.accessLevel === 'READ_ONLY') {
      return reply.status(403).send({
        error: 'Forbidden',
        message: 'Você possui apenas acesso de leitura. Não é possível modificar dados.',
        accessLevel: 'READ_ONLY',
      });
    }
    return;
  };
}

/**
 * Middleware helper para verificar múltiplas capabilities (OR)
 * Usuário precisa ter PELO MENOS UMA das capabilities
 */
export function requireAnyCapability(
  capabilityCodes: string[],
  options: RequireCapabilityOptions = {}
) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = (req as any).user?.id;
    if (!userId) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'Você precisa estar autenticado para acessar este recurso',
      });
    }

    // Tentar cada capability
    for (const capabilityCode of capabilityCodes) {
      const context: AuthorizationContext = {
        userId,
        spaceId: options.spaceId || req.headers['x-space-id'] as string,
        user: (req as any).user,
        session: (req as any).session,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        deviceId: generateDeviceId(req),
        origin: 'web',
      };

      const result = await authorizationService.checkCapability({
        userId,
        capabilityCode,
        spaceId: context.spaceId,
        context,
      });

      if (result.allowed) {
        req.authorization = {
          accessLevel: result.accessLevel || 'READ_WRITE',
          grantId: result.grantId,
          reason: result.reason,
        };
        return;
      }
    }

    // Nenhuma capability permitida
    return reply.status(403).send({
      error: 'Forbidden',
      message: 'Você não possui nenhuma das permissões necessárias',
      requiredCapabilities: capabilityCodes,
    });
  };
}

/**
 * Middleware helper para verificar múltiplas capabilities (AND)
 * Usuário precisa ter TODAS as capabilities
 */
export function requireAllCapabilities(
  capabilityCodes: string[],
  options: RequireCapabilityOptions = {}
) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = (req as any).user?.id;
    if (!userId) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'Você precisa estar autenticado para acessar este recurso',
      });
    }

    const context: AuthorizationContext = {
      userId,
      spaceId: options.spaceId || req.headers['x-space-id'] as string,
      user: (req as any).user,
      session: (req as any).session,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      deviceId: generateDeviceId(req),
      origin: 'web',
    };

    // Verificar todas capabilities
    for (const capabilityCode of capabilityCodes) {
      const result = await authorizationService.checkCapability({
        userId,
        capabilityCode,
        spaceId: context.spaceId,
        context,
      });

      if (!result.allowed) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: ERROR_MESSAGES[result.reason] || 'Acesso negado',
          missingCapability: capabilityCode,
          requiredCapabilities: capabilityCodes,
        });
      }
    }

    // Todas capabilities permitidas
    req.authorization = {
      accessLevel: 'READ_WRITE',
      reason: 'ROLE_CAPABILITY',
    };
    return;
  };
}
