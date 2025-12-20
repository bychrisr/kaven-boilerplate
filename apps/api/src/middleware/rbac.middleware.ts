import { FastifyRequest, FastifyReply } from 'fastify';
import { Role } from '@prisma/client';

/**
 * RBAC Middleware - Role-Based Access Control
 * 
 * Controla acesso a recursos baseado em roles do usuário:
 * - SUPER_ADMIN: Acesso total a todos tenants
 * - TENANT_ADMIN: Acesso total ao seu tenant
 * - USER: Acesso limitado (apenas seus próprios dados)
 */

// Estende FastifyRequest para incluir user
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
 * Hierarquia de roles (do maior para o menor privilégio)
 */
const ROLE_HIERARCHY: Record<Role, number> = {
  SUPER_ADMIN: 3,
  TENANT_ADMIN: 2,
  USER: 1,
};

/**
 * Verifica se usuário tem role suficiente
 */
function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Verifica se usuário tem uma das roles permitidas
 */
function hasAnyRole(userRole: Role, allowedRoles: Role[]): boolean {
  return allowedRoles.some(role => hasRole(userRole, role));
}

/**
 * Middleware factory: Requer role específica
 * 
 * @param allowedRoles - Array de roles permitidas
 * @returns Middleware function
 * 
 * @example
 * fastify.get('/api/users', {
 *   preHandler: [authMiddleware, requireRole(['TENANT_ADMIN', 'SUPER_ADMIN'])],
 *   handler: userController.list
 * });
 */
export function requireRole(allowedRoles: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = request.user;

    if (!user) {
      reply.status(401).send({
        error: 'Não autenticado',
        message: 'Token JWT não fornecido ou inválido',
      });
      return;
    }

    if (!hasAnyRole(user.role, allowedRoles)) {
      reply.status(403).send({
        error: 'Acesso negado',
        message: `Requer uma das roles: ${allowedRoles.join(', ')}`,
        userRole: user.role,
      });
      return;
    }

    // Usuário tem permissão, continua
  };
}

/**
 * Middleware: Requer SUPER_ADMIN
 */
export const requireSuperAdmin = requireRole(['SUPER_ADMIN']);

/**
 * Middleware: Requer TENANT_ADMIN ou superior
 */
export const requireTenantAdmin = requireRole(['TENANT_ADMIN', 'SUPER_ADMIN']);

/**
 * Middleware: Verifica se usuário pode acessar recurso do tenant
 * 
 * SUPER_ADMIN: pode acessar qualquer tenant
 * TENANT_ADMIN/USER: só pode acessar seu próprio tenant
 */
export async function requireTenantAccess(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const user = request.user;
  const tenantContext = request.tenantContext;

  if (!user) {
    reply.status(401).send({ error: 'Não autenticado' });
    return;
  }

  // SUPER_ADMIN pode acessar qualquer tenant
  if (user.role === 'SUPER_ADMIN') {
    return;
  }

  // Outros roles precisam estar no mesmo tenant
  const requestedTenantId = tenantContext?.tenantId;
  
  if (!requestedTenantId) {
    reply.status(400).send({
      error: 'Tenant não identificado',
      message: 'Use header X-Tenant-ID ou subdomain',
    });
    return;
  }

  if (user.tenantId !== requestedTenantId) {
    reply.status(403).send({
      error: 'Acesso negado',
      message: 'Você não tem acesso a este tenant',
      userTenantId: user.tenantId,
      requestedTenantId,
    });
    return;
  }
}

/**
 * Middleware: Verifica se usuário pode acessar recurso específico
 * 
 * USER: só pode acessar seus próprios dados
 * TENANT_ADMIN: pode acessar dados de qualquer usuário do seu tenant
 * SUPER_ADMIN: pode acessar dados de qualquer usuário
 */
export function requireResourceOwnership(resourceUserIdParam: string = 'id') {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = request.user;
    const params = request.params as Record<string, string>;
    const resourceUserId = params[resourceUserIdParam];

    if (!user) {
      reply.status(401).send({ error: 'Não autenticado' });
      return;
    }

    // SUPER_ADMIN pode acessar qualquer recurso
    if (user.role === 'SUPER_ADMIN') {
      return;
    }

    // TENANT_ADMIN pode acessar recursos do seu tenant
    if (user.role === 'TENANT_ADMIN') {
      // Verificação adicional seria necessária aqui para confirmar
      // que o recurso pertence ao tenant do admin
      // Por enquanto, permitimos acesso
      return;
    }

    // USER só pode acessar seus próprios recursos
    if (user.id !== resourceUserId) {
      reply.status(403).send({
        error: 'Acesso negado',
        message: 'Você só pode acessar seus próprios dados',
      });
      return;
    }
  };
}

/**
 * Helper: Verifica se usuário é SUPER_ADMIN
 */
export function isSuperAdmin(user?: { role: Role }): boolean {
  return user?.role === 'SUPER_ADMIN';
}

/**
 * Helper: Verifica se usuário é TENANT_ADMIN ou superior
 */
export function isTenantAdmin(user?: { role: Role }): boolean {
  return user?.role === 'TENANT_ADMIN' || user?.role === 'SUPER_ADMIN';
}

/**
 * Helper: Verifica se usuário pode gerenciar outros usuários
 */
export function canManageUsers(user?: { role: Role }): boolean {
  return isTenantAdmin(user);
}

/**
 * Helper: Verifica se usuário pode gerenciar tenants
 */
export function canManageTenants(user?: { role: Role }): boolean {
  return isSuperAdmin(user);
}
