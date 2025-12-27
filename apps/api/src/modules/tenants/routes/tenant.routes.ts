import { FastifyInstance } from 'fastify';
import { tenantController } from '../controllers/tenant.controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { requireSuperAdmin, requireTenantAdmin } from '../../../middleware/rbac.middleware';

export async function tenantRoutes(fastify: FastifyInstance) {
  // GET /api/tenants - Listar tenants (requer TENANT_ADMIN ou SUPER_ADMIN)
  fastify.get('/', {
    preHandler: [authMiddleware, requireTenantAdmin],
    handler: tenantController.list.bind(tenantController),
  });

  fastify.get('/stats', {
    preHandler: [authMiddleware, requireTenantAdmin],
    handler: tenantController.getStats.bind(tenantController),
  });

  // GET /api/tenants/:id - Buscar tenant (requer TENANT_ADMIN)
  fastify.get('/:id', {
    preHandler: [authMiddleware, requireTenantAdmin],
    handler: tenantController.getById.bind(tenantController),
  });

  // POST /api/tenants - Criar tenant (requer SUPER_ADMIN)
  fastify.post('/', {
    preHandler: [authMiddleware, requireSuperAdmin],
    handler: tenantController.create.bind(tenantController),
  });

  // PUT /api/tenants/:id - Atualizar tenant (requer SUPER_ADMIN)
  fastify.put('/:id', {
    preHandler: [authMiddleware, requireSuperAdmin],
    handler: tenantController.update.bind(tenantController),
  });

  // DELETE /api/tenants/:id - Deletar tenant (requer SUPER_ADMIN)
  fastify.delete('/:id', {
    preHandler: [authMiddleware, requireSuperAdmin],
    handler: tenantController.delete.bind(tenantController),
  });
}
