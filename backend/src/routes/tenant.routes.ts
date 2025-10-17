import { FastifyInstance } from 'fastify';
import { TenantService } from '../services/tenant.service.js';
import { TenantController } from '../controllers/tenant.controller.js';
import { authenticateUser, requireAdmin } from '../middleware/auth.middleware.js';
import { 
  CreateTenantSchema,
  UpdateTenantSchema,
  GetTenantsQuerySchema,
} from '../types/tenant.schemas.js';

export default async function tenantRoutes(fastify: FastifyInstance) {
  // Initialize services and controller
  const tenantService = new TenantService(
    fastify.prisma,
    fastify
  );
  const tenantController = new TenantController(tenantService);

  // GET /api/tenants - List tenants (admin only)
  fastify.get('/', {
    preHandler: [authenticateUser, requireAdmin],
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', minimum: 1, default: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
          search: { type: 'string' },
          planId: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, tenantController.getTenants.bind(tenantController));

  // GET /api/tenants/global/stats - Get global tenant statistics (admin only)
  fastify.get('/global/stats', {
    preHandler: [authenticateUser, requireAdmin],
  }, tenantController.getGlobalStats.bind(tenantController));

  // GET /api/tenants/:id - Get tenant by ID (admin only)
  fastify.get('/:id', {
    preHandler: [authenticateUser, requireAdmin],
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, tenantController.getTenantById.bind(tenantController) as any);

  // GET /api/tenants/:id/stats - Get tenant statistics
  fastify.get('/:id/stats', {
    preHandler: [authenticateUser],
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, tenantController.getTenantStats.bind(tenantController) as any);

  // POST /api/tenants - Create new tenant (admin only)
  fastify.post('/', {
    preHandler: [authenticateUser, requireAdmin],
    schema: {
      body: {
        type: 'object',
        required: ['name', 'subdomain'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          subdomain: { type: 'string', minLength: 3, maxLength: 50, pattern: '^[a-z0-9-]+$' },
          planId: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, tenantController.createTenant.bind(tenantController));

  // PUT /api/tenants/:id - Update tenant (admin only)
  fastify.put('/:id', {
    preHandler: [authenticateUser, requireAdmin],
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          subdomain: { type: 'string', minLength: 3, maxLength: 50, pattern: '^[a-z0-9-]+$' },
          planId: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, tenantController.updateTenant.bind(tenantController) as any);

  // DELETE /api/tenants/:id - Delete tenant (admin only)
  fastify.delete('/:id', {
    preHandler: [authenticateUser, requireAdmin],
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, tenantController.deleteTenant.bind(tenantController) as any);
}
