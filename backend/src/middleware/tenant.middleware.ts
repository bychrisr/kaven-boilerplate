import { FastifyRequest, FastifyReply } from 'fastify';


/**
 * Tenant middleware - extracts tenantId from authenticated user
 */
export async function extractTenant(
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

  request.tenantId = (request.user as any).tenantId;
}

/**
 * RLS middleware - sets tenant context for database queries
 */
export async function setTenantContext(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  if (!request.user) {
    return;
  }

  try {
    // Set tenant context for Row Level Security
    await request.server.prisma.$executeRaw`SET app.current_tenant_id = ${(request.user as any).tenantId}`;
    await request.server.prisma.$executeRaw`SET app.current_user_id = ${(request.user as any).id}`;
  } catch (error) {
    request.server.log.error({ error }, 'Error setting tenant context');
    // Continue without failing - RLS will be handled at database level
  }
}

/**
 * Global tenant context middleware - runs after authentication
 */
export async function globalTenantContext(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  if (request.user) {
    await setTenantContext(request, reply);
  }
}
