import { FastifyRequest, FastifyReply } from 'fastify';
import { productService } from '../services/product.service';
import {
  createProductSchema,
  updateProductSchema,
  listProductsSchema,
} from '../../../lib/validation-plans';

export class ProductController {
  /**
   * GET /api/products
   * Lista todos os produtos
   */
  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const filters = listProductsSchema.parse(request.query);
      const products = await productService.listProducts(filters);
      reply.send({ products });
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  /**
   * GET /api/products/:id
   * Busca produto por ID
   */
  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const product = await productService.getProductById(id);
      reply.send(product);
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
    }
  }

  /**
   * GET /api/products/code/:code
   * Busca produto por código
   */
  async getByCode(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { code } = request.params as { code: string };
      const { tenantId } = request.query as { tenantId?: string };
      const product = await productService.getProductByCode(code, tenantId);
      reply.send(product);
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
    }
  }

  /**
   * POST /api/products
   * Cria novo produto (Admin only)
   */
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = createProductSchema.parse(request.body);
      const product = await productService.createProduct(data);
      reply.status(201).send(product);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  /**
   * PUT /api/products/:id
   * Atualiza produto (Admin only)
   */
  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const data = updateProductSchema.parse(request.body);
      const product = await productService.updateProduct(id, data);
      reply.send(product);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  /**
   * DELETE /api/products/:id
   * Desativa produto (Admin only)
   */
  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const result = await productService.deleteProduct(id);
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  /**
   * POST /api/products/:id/effects
   * Adiciona effect ao produto (Admin only)
   */
  async addEffect(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const { featureCode, effectType, value, isPermanent, durationDays } = request.body as any;
      
      await productService.addEffectsToProduct(id, [{
        featureCode,
        effectType,
        value,
        isPermanent,
        durationDays,
      }]);
      
      const product = await productService.getProductById(id);
      reply.send(product);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  /**
   * PUT /api/products/:id/effects/:featureCode
   * Atualiza effect do produto (Admin only)
   */
  async updateEffect(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id, featureCode } = request.params as { id: string; featureCode: string };
      const data = request.body as any;
      const product = await productService.updateProductEffect(id, featureCode, data);
      reply.send(product);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  /**
   * DELETE /api/products/:id/effects/:featureCode
   * Remove effect do produto (Admin only)
   */
  async removeEffect(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id, featureCode } = request.params as { id: string; featureCode: string };
      const result = await productService.removeProductEffect(id, featureCode);
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }
}

export const productController = new ProductController();
