import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';
import { env } from '../config/env';

/**
 * Middleware Camaleão - Detecção automática de tenant
 * 
 * Suporta 3 métodos de detecção:
 * 1. Subdomain: empresa1.app.com -> busca tenant por domain
 * 2. Header: X-Tenant-ID: uuid -> busca tenant por ID
 * 3. Path: /tenants/:slug/... -> busca tenant por slug
 * 
 * Injeta tenantId no request.tenantContext para uso em services
 */

// Estende o tipo FastifyRequest para incluir tenantContext
declare module 'fastify' {
  interface FastifyRequest {
    tenantContext?: {
      tenantId: string | null;
      tenantSlug: string | null;
      isSingleTenant: boolean;
    };
  }
}

/**
 * Detecta tenant via subdomain
 * Ex: empresa1.app.com -> busca tenant com domain = "empresa1.app.com"
 */
async function detectTenantFromSubdomain(hostname: string): Promise<string | null> {
  // Ignora localhost e IPs
  if (hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return null;
  }

  const tenant = await prisma.tenant.findFirst({
    where: {
      domain: hostname,
      status: 'ACTIVE',
      deletedAt: null,
    },
    select: { id: true },
  });

  return tenant?.id || null;
}

/**
 * Detecta tenant via header X-Tenant-ID
 */
async function detectTenantFromHeader(tenantId: string): Promise<string | null> {
  const tenant = await prisma.tenant.findFirst({
    where: {
      id: tenantId,
      status: 'ACTIVE',
      deletedAt: null,
    },
    select: { id: true },
  });

  return tenant?.id || null;
}

/**
 * Detecta tenant via path /tenants/:slug/...
 * Ex: /tenants/empresa1/api/users -> busca tenant com slug = "empresa1"
 */
async function detectTenantFromPath(path: string): Promise<{ tenantId: string; slug: string } | null> {
  const match = path.match(/^\/tenants\/([^\/]+)/);
  if (!match) return null;

  const slug = match[1];
  const tenant = await prisma.tenant.findFirst({
    where: {
      slug,
      status: 'ACTIVE',
      deletedAt: null,
    },
    select: { id: true, slug: true },
  });

  return tenant ? { tenantId: tenant.id, slug: tenant.slug } : null;
}

/**
 * Middleware principal de detecção de tenant
 */
export async function tenantMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  let tenantId: string | null = null;
  let tenantSlug: string | null = null;

  // Modo SINGLE TENANT (via env var)
  const isSingleTenant = env.MULTI_TENANT_MODE !== 'true';
  
  if (isSingleTenant) {
    // Em modo single tenant, não detecta tenant
    request.tenantContext = {
      tenantId: null,
      tenantSlug: null,
      isSingleTenant: true,
    };
    return;
  }

  // Método 1: Detectar via header X-Tenant-ID (prioridade alta)
  const headerTenantId = request.headers['x-tenant-id'] as string | undefined;
  if (headerTenantId) {
    tenantId = await detectTenantFromHeader(headerTenantId);
    if (tenantId) {
      request.tenantContext = {
        tenantId,
        tenantSlug: null,
        isSingleTenant: false,
      };
      return;
    }
  }

  // Método 2: Detectar via path /tenants/:slug
  const pathTenant = await detectTenantFromPath(request.url);
  if (pathTenant) {
    request.tenantContext = {
      tenantId: pathTenant.tenantId,
      tenantSlug: pathTenant.slug,
      isSingleTenant: false,
    };
    return;
  }

  // Método 3: Detectar via subdomain
  const hostname = request.hostname;
  tenantId = await detectTenantFromSubdomain(hostname);
  if (tenantId) {
    request.tenantContext = {
      tenantId,
      tenantSlug: null,
      isSingleTenant: false,
    };
    return;
  }

  // Nenhum tenant detectado em modo multi-tenant
  request.tenantContext = {
    tenantId: null,
    tenantSlug: null,
    isSingleTenant: false,
  };
}

/**
 * Helper para verificar se request tem tenant válido
 */
export function requireTenant(request: FastifyRequest, reply: FastifyReply): void {
  if (!request.tenantContext?.tenantId && !request.tenantContext?.isSingleTenant) {
    reply.status(400).send({
      error: 'Tenant não identificado. Use header X-Tenant-ID, subdomain ou path /tenants/:slug',
    });
  }
}
