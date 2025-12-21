import { FastifyInstance } from 'fastify';
import { orderController } from '../controllers/order.controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { requireTenantAdmin } from '../../../middleware/rbac.middleware';

export async function orderRoutes(fastify: FastifyInstance) {
  // GET /api/orders - Listar orders
  fastify.get('/', {
    preHandler: [authMiddleware, requireTenantAdmin],
    handler: orderController.list.bind(orderController),
  });

  // GET /api/orders/:id - Buscar order
  fastify.get('/:id', {
    preHandler: [authMiddleware],
    handler: orderController.getById.bind(orderController),
  });

  // POST /api/orders - Criar order
  fastify.post('/', {
    preHandler: [authMiddleware, requireTenantAdmin],
    handler: orderController.create.bind(orderController),
  });

  // PUT /api/orders/:id/status - Atualizar status
  fastify.put('/:id/status', {
    preHandler: [authMiddleware, requireTenantAdmin],
    handler: orderController.updateStatus.bind(orderController),
  });

  // DELETE /api/orders/:id - Deletar order
  fastify.delete('/:id', {
    preHandler: [authMiddleware, requireTenantAdmin],
    handler: orderController.delete.bind(orderController),
  });
}
