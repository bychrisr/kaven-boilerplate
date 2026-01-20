import { FastifyInstance } from 'fastify';
import { roleController } from '../controllers/role.controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { requireCapability } from '../../../middleware/requireCapability';

export async function roleRoutes(fastify: FastifyInstance) {
  // GET /api/spaces/:spaceId/roles - Listar roles de um space
  fastify.get('/spaces/:spaceId/roles', {
    preHandler: [authMiddleware, requireCapability('roles.read')],
    handler: roleController.list.bind(roleController),
  });

  // GET /api/capabilities - Listar todas capabilities (para formulários)
  fastify.get('/capabilities', {
    preHandler: [authMiddleware, requireCapability('roles.read')],
    handler: roleController.listCapabilities.bind(roleController),
  });

  // POST /api/spaces/:spaceId/roles - Criar role em um space
  fastify.post('/spaces/:spaceId/roles', {
    preHandler: [authMiddleware, requireCapability('roles.create')],
    handler: roleController.create.bind(roleController),
  });

  // GET /api/roles/:id - Obter role por ID
  fastify.get('/roles/:id', {
    preHandler: [authMiddleware, requireCapability('roles.read')],
    handler: roleController.getById.bind(roleController),
  });

  // PUT /api/roles/:id - Atualizar role
  fastify.put('/roles/:id', {
    preHandler: [authMiddleware, requireCapability('roles.update')],
    handler: roleController.update.bind(roleController),
  });

  // DELETE /api/roles/:id - Deletar role
  fastify.delete('/roles/:id', {
    preHandler: [authMiddleware, requireCapability('roles.delete')],
    handler: roleController.delete.bind(roleController),
  });
}
