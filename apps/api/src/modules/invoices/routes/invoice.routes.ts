import { FastifyInstance } from 'fastify';
import { invoiceController } from '../controllers/invoice.controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { requireTenantAdmin, requireTenantAccess } from '../../../middleware/rbac.middleware';

export async function invoiceRoutes(fastify: FastifyInstance) {
  // GET /api/invoices/stats - Obter estatísticas
  fastify.get('/stats', {
    preHandler: [authMiddleware, requireTenantAccess, requireTenantAdmin],
    handler: invoiceController.getStats.bind(invoiceController),
  });

  // GET /api/invoices - Listar invoices
  fastify.get('/', {
    preHandler: [authMiddleware, requireTenantAccess, requireTenantAdmin],
    handler: invoiceController.list.bind(invoiceController),
  });

  // GET /api/invoices/:id - Buscar invoice
  fastify.get('/:id', {
    preHandler: [authMiddleware, requireTenantAccess],
    handler: invoiceController.getById.bind(invoiceController),
  });

  // POST /api/invoices - Criar invoice
  fastify.post('/', {
    preHandler: [authMiddleware, requireTenantAccess, requireTenantAdmin],
    handler: invoiceController.create.bind(invoiceController),
  });

  // PUT /api/invoices/:id - Atualizar invoice
  fastify.put('/:id', {
    preHandler: [authMiddleware, requireTenantAccess, requireTenantAdmin],
    handler: invoiceController.update.bind(invoiceController),
  });

  // POST /api/invoices/:id/send - Enviar invoice
  fastify.post('/:id/send', {
    preHandler: [authMiddleware, requireTenantAccess, requireTenantAdmin],
    handler: invoiceController.send.bind(invoiceController),
  });

  // DELETE /api/invoices/:id - Deletar invoice
  fastify.delete('/:id', {
    preHandler: [authMiddleware, requireTenantAccess, requireTenantAdmin],
    handler: invoiceController.delete.bind(invoiceController),
  });
}
