/**
 * Require Capability Middleware
 * 
 * Middleware para proteger rotas com verificação de capabilities.
 * 
 * Uso:
 * ```typescript
 * router.post('/invoices',
 *   requireCapability('invoices.create'),
 *   InvoiceController.create
 * );
 * 
 * router.get('/tickets/:id',
 *   requireCapability('tickets.read', { spaceId: 'SUPPORT' }),
 *   TicketController.show
 * );
 * ```
 */

import { Request, Response, NextFunction } from 'express';
import { CapabilityScope } from '@prisma/client';
import { authorizationService } from '../services/authorization.service';
import { AuthorizationContext, ERROR_MESSAGES } from '../types/authorization.types';
import crypto from 'crypto';

// Estender Request para incluir informações de autorização
declare global {
  namespace Express {
    interface Request {
      authorization?: {
        accessLevel: string;
        grantId?: string;
        reason: string;
      };
    }
  }
}

/**
 * Opções do middleware
 */
interface RequireCapabilityOptions {
  spaceId?: string;
  scope?: CapabilityScope;
}

/**
 * Gera deviceId único baseado em UserAgent e IP
 */
function generateDeviceId(req: Request): string {
  const userAgent = req.headers['user-agent'] || 'unknown';
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  
  return crypto
    .createHash('sha256')
    .update(`${userAgent}:${ip}`)
    .digest('hex');
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
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Verificar se usuário está autenticado
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
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
          id: req.user.id,
          email: req.user.email,
          role: req.user.role,
          twoFactorEnabled: req.user.twoFactorEnabled || false,
        },
        
        // Session info
        session: {
          id: (req as any).session?.id || 'unknown',
          mfaVerified: (req as any).session?.mfaVerified || false,
          mfaVerifiedAt: (req as any).session?.mfaVerifiedAt,
        },
        
        // Request tracking
        ip: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
        deviceId: generateDeviceId(req),
        deviceType: detectDeviceType(req.headers['user-agent'] || ''),
        origin: (req.headers['x-origin'] as any) || 'web',
      };

      // 3. Verificar capability
      const result = await authorizationService.checkCapability({
        userId,
        capabilityCode,
        spaceId: context.spaceId,
        scope: options.scope,
        context,
      });

      // 4. Se negado, retornar 403
      if (!result.allowed) {
        return res.status(403).json({
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

      // 6. Continuar para próximo middleware/controller
      next();
    } catch (error) {
      console.error('Error in requireCapability middleware:', error);
      
      // Fail secure: em caso de erro, negar acesso
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Erro ao verificar permissões. Por favor, tente novamente.',
      });
    }
  };
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
 * Middleware helper para verificar se usuário tem READ_WRITE
 * Útil para endpoints que modificam dados
 */
export function requireReadWrite(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.authorization?.accessLevel === 'READ_ONLY') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Você possui apenas acesso de leitura. Não é possível modificar dados.',
      accessLevel: 'READ_ONLY',
    });
  }
  next();
}

/**
 * Middleware helper para verificar múltiplas capabilities (OR)
 * Usuário precisa ter PELO MENOS UMA das capabilities
 */
export function requireAnyCapability(capabilityCodes: string[], options: RequireCapabilityOptions = {}) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Você precisa estar autenticado para acessar este recurso',
      });
    }

    // Tentar cada capability
    for (const capabilityCode of capabilityCodes) {
      const context: AuthorizationContext = {
        userId,
        spaceId: options.spaceId || req.headers['x-space-id'] as string,
        user: req.user as any,
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
        return next();
      }
    }

    // Nenhuma capability permitida
    return res.status(403).json({
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
export function requireAllCapabilities(capabilityCodes: string[], options: RequireCapabilityOptions = {}) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Você precisa estar autenticado para acessar este recurso',
      });
    }

    const context: AuthorizationContext = {
      userId,
      spaceId: options.spaceId || req.headers['x-space-id'] as string,
      user: req.user as any,
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
        return res.status(403).json({
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
    next();
  };
}
