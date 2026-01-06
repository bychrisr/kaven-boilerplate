import { FastifyInstance } from 'fastify';
import { productController } from '../controllers/product.controller';

export async function productRoutes(fastify: FastifyInstance) {
  // Public routes
  fastify.get('/products', productController.list.bind(productController));
  fastify.get('/products/:id', productController.getById.bind(productController));
  fastify.get('/products/code/:code', productController.getByCode.bind(productController));

  // Admin routes (TODO: adicionar middleware de autorização)
  fastify.post('/products', productController.create.bind(productController));
  fastify.put('/products/:id', productController.update.bind(productController));
  fastify.delete('/products/:id', productController.delete.bind(productController));

  // Effect management (Admin only)
  fastify.post('/products/:id/effects', productController.addEffect.bind(productController));
  fastify.put('/products/:id/effects/:featureCode', productController.updateEffect.bind(productController));
  fastify.delete('/products/:id/effects/:featureCode', productController.removeEffect.bind(productController));
}
