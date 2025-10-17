import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/user.service.js';
import { 
  CreateUserInput,
  UpdateUserInput,
  GetUsersQuery,
} from '../types/user.schemas.js';

export class UserController {
  constructor(
    private userService: UserService
  ) {}

  /**
   * GET /api/users - List users for current tenant
   */
  async getUsers(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        reply.code(401).send({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Usuário não autenticado',
        });
        return;
      }

      const query = request.query as GetUsersQuery;
      const result = await this.userService.findUsersByTenantId((request.user as any).tenantId, query as any);

      reply.code(200).send({
        success: true,
        data: result,
      });
    } catch (error) {
      request.server.log.error({ error }, 'Error getting users');
      reply.code(500).send({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * GET /api/users/:id - Get user by ID
   */
  async getUserById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
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
      const user = await this.userService.findUserById(id);

      if (!user) {
        reply.code(404).send({
          success: false,
          error: 'USER_NOT_FOUND',
          message: 'Usuário não encontrado',
        });
        return;
      }

      // Check if user belongs to the same tenant
      if (user.tenant_id !== (request.user as any).tenantId) {
        reply.code(403).send({
          success: false,
          error: 'FORBIDDEN',
          message: 'Acesso negado',
        });
        return;
      }

      reply.code(200).send({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          isAdm: user.is_adm,
          tenantId: user.tenant_id,
          tenant: {
            id: (user as any).tenant.id,
            name: (user as any).tenant.name,
            subdomain: (user as any).tenant.subdomain,
          },
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        },
      });
    } catch (error) {
      request.server.log.error({ error }, 'Error getting user by ID');
      reply.code(500).send({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * POST /api/users - Create new user
   */
  async createUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        reply.code(401).send({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Usuário não autenticado',
        });
        return;
      }

      const body = request.body as CreateUserInput;
      
      // Only admins can create users
      if (!(request.user as any).isAdm) {
        reply.code(403).send({
          success: false,
          error: 'FORBIDDEN',
          message: 'Apenas administradores podem criar usuários',
        });
        return;
      }

      // Ensure user is created in the same tenant
      const userData = {
        ...body,
        tenantId: (request.user as any).tenantId,
        firstName: body.firstName || undefined,
        lastName: body.lastName || undefined,
      };

      const user = await this.userService.createUser(userData as any);

      reply.code(201).send({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          isAdm: user.is_adm,
          tenantId: user.tenant_id,
          tenant: {
            id: (user as any).tenant.id,
            name: (user as any).tenant.name,
            subdomain: (user as any).tenant.subdomain,
          },
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        },
      });
    } catch (error) {
      request.server.log.error({ error }, 'Error creating user');
      
      if (error instanceof Error && error.message.includes('already exists')) {
        reply.code(400).send({
          success: false,
          error: 'USER_ALREADY_EXISTS',
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
   * PUT /api/users/:id - Update user
   */
  async updateUser(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
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
      const body = request.body as UpdateUserInput;

      // Check if user exists and belongs to the same tenant
      const existingUser = await this.userService.findUserById(id);
      if (!existingUser) {
        reply.code(404).send({
          success: false,
          error: 'USER_NOT_FOUND',
          message: 'Usuário não encontrado',
        });
        return;
      }

      if (existingUser.tenant_id !== (request.user as any).tenantId) {
        reply.code(403).send({
          success: false,
          error: 'FORBIDDEN',
          message: 'Acesso negado',
        });
        return;
      }

      // Users can update themselves, admins can update anyone
      if ((request.user as any).id !== id && !(request.user as any).isAdm) {
        reply.code(403).send({
          success: false,
          error: 'FORBIDDEN',
          message: 'Apenas administradores podem atualizar outros usuários',
        });
        return;
      }

      // Non-admins cannot change admin status or password
      if (!(request.user as any).isAdm) {
        delete body.isAdm;
        delete body.password;
      }

      const user = await this.userService.updateUser(id, body as any);

      reply.code(200).send({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          isAdm: user.is_adm,
          tenantId: user.tenant_id,
          tenant: {
            id: (user as any).tenant.id,
            name: (user as any).tenant.name,
            subdomain: (user as any).tenant.subdomain,
          },
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        },
      });
    } catch (error) {
      request.server.log.error({ error }, 'Error updating user');
      
      if (error instanceof Error && error.message.includes('already exists')) {
        reply.code(400).send({
          success: false,
          error: 'USER_ALREADY_EXISTS',
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
   * DELETE /api/users/:id - Delete user
   */
  async deleteUser(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
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

      // Check if user exists and belongs to the same tenant
      const existingUser = await this.userService.findUserById(id);
      if (!existingUser) {
        reply.code(404).send({
          success: false,
          error: 'USER_NOT_FOUND',
          message: 'Usuário não encontrado',
        });
        return;
      }

      if (existingUser.tenant_id !== (request.user as any).tenantId) {
        reply.code(403).send({
          success: false,
          error: 'FORBIDDEN',
          message: 'Acesso negado',
        });
        return;
      }

      // Only admins can delete users
      if (!(request.user as any).isAdm) {
        reply.code(403).send({
          success: false,
          error: 'FORBIDDEN',
          message: 'Apenas administradores podem deletar usuários',
        });
        return;
      }

      // Users cannot delete themselves
      if ((request.user as any).id === id) {
        reply.code(400).send({
          success: false,
          error: 'CANNOT_DELETE_SELF',
          message: 'Não é possível deletar seu próprio usuário',
        });
        return;
      }

      await this.userService.deleteUser(id);

      reply.code(200).send({
        success: true,
        message: 'Usuário deletado com sucesso',
      });
    } catch (error) {
      request.server.log.error({ error }, 'Error deleting user');
      reply.code(500).send({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * GET /api/users/stats - Get user statistics for current tenant
   */
  async getUserStats(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        reply.code(401).send({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Usuário não autenticado',
        });
        return;
      }

      const stats = await this.userService.getUserStats((request.user as any).tenantId);

      reply.code(200).send({
        success: true,
        data: stats,
      });
    } catch (error) {
      request.server.log.error({ error }, 'Error getting user stats');
      reply.code(500).send({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }
}
