import { FastifyInstance } from 'fastify';
import { userController } from '../controllers/user.controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { requireTenantAdmin, requireResourceOwnership } from '../../../middleware/rbac.middleware';

export async function userRoutes(fastify: FastifyInstance) {
  // GET /api/users/stats - Obter estatísticas
  fastify.get('/stats', {
    preHandler: [authMiddleware],
    handler: userController.getStats.bind(userController),
  });

  // GET /api/users - Listar usuários (requer TENANT_ADMIN ou SUPER_ADMIN)
  fastify.get('/', {
    preHandler: [authMiddleware, requireTenantAdmin],
    handler: userController.list.bind(userController),
  });

  // GET /api/users/me - Usuário atual (requer autenticação)
  fastify.get('/me', {
    preHandler: [authMiddleware],
    handler: userController.getCurrent.bind(userController),
  });

  // GET /api/users/:id - Buscar usuário (requer ownership ou TENANT_ADMIN)
  fastify.get('/:id', {
    preHandler: [authMiddleware, requireResourceOwnership('id')],
    handler: userController.getById.bind(userController),
  });

  // POST /api/users - Criar usuário (requer TENANT_ADMIN)
  fastify.post('/', {
    preHandler: [authMiddleware, requireTenantAdmin],
    handler: userController.create.bind(userController),
  });

  // PUT /api/users/:id - Atualizar usuário (requer ownership ou TENANT_ADMIN)
  fastify.put('/:id', {
    preHandler: [authMiddleware, requireResourceOwnership('id')],
    handler: userController.update.bind(userController),
  });

  // POST /api/users/:id/avatar - Upload de avatar (requer ownership ou TENANT_ADMIN)
  fastify.post('/:id/avatar', {
    preHandler: [authMiddleware, requireResourceOwnership('id')],
    handler: userController.uploadAvatar.bind(userController),
  });

  // DELETE /api/users/:id - Deletar usuário (requer TENANT_ADMIN)
  fastify.delete('/:id', {
    preHandler: [authMiddleware, requireTenantAdmin],
    handler: userController.delete.bind(userController),
  });
}
