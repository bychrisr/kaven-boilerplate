import { FastifyRequest, FastifyReply } from 'fastify';
import { TenantService } from '../services/tenant.service.js';
import { 
  CreateTenantInput,
  UpdateTenantInput,
  GetTenantsQuery,
} from '../types/tenant.schemas.js';

export class TenantController {
  constructor(
    private tenantService: TenantService
  ) {}

  /**
   * GET /api/tenants - List tenants (admin only)
   */
  async getTenants(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        reply.code(401).send({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Usuário não autenticado',
        });
        return;
      }

      // Only global admins can list all tenants
      // For now, we'll check if user is admin in their tenant
      // In a real multi-tenant system, you'd have a global admin role
      if (!(request.user as any).isAdm) {
        reply.code(403).send({
          success: false,
          error: 'FORBIDDEN',
          message: 'Apenas administradores podem listar tenants',
        });
        return;
      }

      const query = request.query as GetTenantsQuery;
      const result = await this.tenantService.findTenants(query as any);

      reply.code(200).send({
        success: true,
        data: result,
      });
    } catch (error) {
      request.server.log.error({ error }, 'Error getting tenants');
      reply.code(500).send({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * GET /api/tenants/:id - Get tenant by ID (admin only)
   */
  async getTenantById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      if (!request.user) {
        reply.code(401).send({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Usuário não autenticado',
        });
        return;
      }

      // Only admins can view tenant details
      if (!(request.user as any).isAdm) {
        reply.code(403).send({
          success: false,
          error: 'FORBIDDEN',
          message: 'Apenas administradores podem visualizar detalhes do tenant',
        });
        return;
      }

      const { id } = request.params;
      
      // Check if user is trying to access their own tenant or if they're a global admin
      if (id !== (request.user as any).tenantId && !(request.user as any).isAdm) {
        reply.code(403).send({
          success: false,
          error: 'FORBIDDEN',
          message: 'Acesso negado',
        });
        return;
      }

      const tenant = await this.tenantService.findTenantById(id);

      if (!tenant) {
        reply.code(404).send({
          success: false,
          error: 'TENANT_NOT_FOUND',
          message: 'Tenant não encontrado',
        });
        return;
      }

      reply.code(200).send({
        success: true,
        data: {
          id: tenant.id,
          name: tenant.name,
          subdomain: tenant.subdomain,
          createdAt: tenant.created_at,
          updatedAt: tenant.updated_at,
          plan: (tenant as any).plan ? {
            id: (tenant as any).plan.id,
            name: (tenant as any).plan.name,
            description: (tenant as any).plan.description,
            features: (tenant as any).plan.features,
            price: (tenant as any).plan.price,
          } : null,
          _count: (tenant as any)._count,
        },
      });
    } catch (error) {
      request.server.log.error({ error }, 'Error getting tenant by ID');
      reply.code(500).send({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * POST /api/tenants - Create new tenant (admin only)
   */
  async createTenant(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        reply.code(401).send({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Usuário não autenticado',
        });
        return;
      }

      // Only admins can create tenants
      if (!(request.user as any).isAdm) {
        reply.code(403).send({
          success: false,
          error: 'FORBIDDEN',
          message: 'Apenas administradores podem criar tenants',
        });
        return;
      }

      const body = request.body as CreateTenantInput;
      const tenant = await this.tenantService.createTenant(body as any);

      reply.code(201).send({
        success: true,
        data: {
          id: tenant.id,
          name: tenant.name,
          subdomain: tenant.subdomain,
          createdAt: tenant.created_at,
          updatedAt: tenant.updated_at,
          plan: (tenant as any).plan ? {
            id: (tenant as any).plan.id,
            name: (tenant as any).plan.name,
            description: (tenant as any).plan.description,
            features: (tenant as any).plan.features,
            price: (tenant as any).plan.price,
          } : null,
          _count: (tenant as any)._count,
        },
      });
    } catch (error) {
      request.server.log.error({ error }, 'Error creating tenant');
      
      if (error instanceof Error && error.message.includes('already exists')) {
        reply.code(400).send({
          success: false,
          error: 'TENANT_ALREADY_EXISTS',
          message: error.message,
        });
        return;
      }

      reply.code(500).send({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * PUT /api/tenants/:id - Update tenant (admin only)
   */
  async updateTenant(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      if (!request.user) {
        reply.code(401).send({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Usuário não autenticado',
        });
        return;
      }

      // Only admins can update tenants
      if (!(request.user as any).isAdm) {
        reply.code(403).send({
          success: false,
          error: 'FORBIDDEN',
          message: 'Apenas administradores podem atualizar tenants',
        });
        return;
      }

      const { id } = request.params;
      const body = request.body as UpdateTenantInput;

      // Check if tenant exists
      const existingTenant = await this.tenantService.findTenantById(id);
      if (!existingTenant) {
        reply.code(404).send({
          success: false,
          error: 'TENANT_NOT_FOUND',
          message: 'Tenant não encontrado',
        });
        return;
      }

      // Check if user is trying to update their own tenant or if they're a global admin
      if (id !== (request.user as any).tenantId && !(request.user as any).isAdm) {
        reply.code(403).send({
          success: false,
          error: 'FORBIDDEN',
          message: 'Acesso negado',
        });
        return;
      }

      const tenant = await this.tenantService.updateTenant(id, body as any);

      reply.code(200).send({
        success: true,
        data: {
          id: tenant.id,
          name: tenant.name,
          subdomain: tenant.subdomain,
          createdAt: tenant.created_at,
          updatedAt: tenant.updated_at,
          plan: (tenant as any).plan ? {
            id: (tenant as any).plan.id,
            name: (tenant as any).plan.name,
            description: (tenant as any).plan.description,
            features: (tenant as any).plan.features,
            price: (tenant as any).plan.price,
          } : null,
          _count: (tenant as any)._count,
        },
      });
    } catch (error) {
      request.server.log.error({ error }, 'Error updating tenant');
      
      if (error instanceof Error && error.message.includes('already exists')) {
        reply.code(400).send({
          success: false,
          error: 'TENANT_ALREADY_EXISTS',
          message: error.message,
        });
        return;
      }

      reply.code(500).send({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * DELETE /api/tenants/:id - Delete tenant (admin only)
   */
  async deleteTenant(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      if (!request.user) {
        reply.code(401).send({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Usuário não autenticado',
        });
        return;
      }

      // Only admins can delete tenants
      if (!(request.user as any).isAdm) {
        reply.code(403).send({
          success: false,
          error: 'FORBIDDEN',
          message: 'Apenas administradores podem deletar tenants',
        });
        return;
      }

      const { id } = request.params;

      // Users cannot delete their own tenant
      if (id === (request.user as any).tenantId) {
        reply.code(400).send({
          success: false,
          error: 'CANNOT_DELETE_OWN_TENANT',
          message: 'Não é possível deletar seu próprio tenant',
        });
        return;
      }

      await this.tenantService.deleteTenant(id);

      reply.code(200).send({
        success: true,
        message: 'Tenant deletado com sucesso',
      });
    } catch (error) {
      request.server.log.error({ error }, 'Error deleting tenant');
      
      if (error instanceof Error && error.message.includes('existing users')) {
        reply.code(400).send({
          success: false,
          error: 'TENANT_HAS_USERS',
          message: error.message,
        });
        return;
      }

      reply.code(500).send({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * GET /api/tenants/:id/stats - Get tenant statistics
   */
  async getTenantStats(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      if (!request.user) {
        reply.code(401).send({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Usuário não autenticado',
        });
        return;
      }

      const { id } = request.params;

      // Users can only view stats for their own tenant
      if (id !== (request.user as any).tenantId && !(request.user as any).isAdm) {
        reply.code(403).send({
          success: false,
          error: 'FORBIDDEN',
          message: 'Acesso negado',
        });
        return;
      }

      const stats = await this.tenantService.getTenantStats(id);

      reply.code(200).send({
        success: true,
        data: stats,
      });
    } catch (error) {
      request.server.log.error({ error }, 'Error getting tenant stats');
      reply.code(500).send({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * GET /api/tenants/global/stats - Get global tenant statistics (admin only)
   */
  async getGlobalStats(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        reply.code(401).send({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Usuário não autenticado',
        });
        return;
      }

      // Only admins can view global stats
      if (!(request.user as any).isAdm) {
        reply.code(403).send({
          success: false,
          error: 'FORBIDDEN',
          message: 'Apenas administradores podem visualizar estatísticas globais',
        });
        return;
      }

      const stats = await this.tenantService.getGlobalStats();

      reply.code(200).send({
        success: true,
        data: stats,
      });
    } catch (error) {
      request.server.log.error({ error }, 'Error getting global tenant stats');
      reply.code(500).send({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }
}
