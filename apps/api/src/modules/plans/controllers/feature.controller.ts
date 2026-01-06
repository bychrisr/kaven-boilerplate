import { FastifyRequest, FastifyReply } from 'fastify';
import { featureService } from '../services/feature.service';
import {
  createFeatureSchema,
  updateFeatureSchema,
} from '../../../lib/validation-plans';

export class FeatureController {
  /**
   * GET /api/features
   * Lista todas as features
   */
  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { isActive, category } = request.query as { isActive?: string; category?: string };
      
      const filters: any = {};
      if (isActive !== undefined) {
        filters.isActive = isActive === 'true';
      }
      if (category) {
        filters.category = category;
      }

      const features = await featureService.listFeatures(filters);
      reply.send({ features });
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  /**
   * GET /api/features/categories
   * Lista categorias de features
   */
  async listCategories(request: FastifyRequest, reply: FastifyReply) {
    try {
      const categories = await featureService.listCategories();
      reply.send({ categories });
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  /**
   * GET /api/features/:id
   * Busca feature por ID
   */
  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const feature = await featureService.getFeatureById(id);
      reply.send(feature);
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
    }
  }

  /**
   * GET /api/features/code/:code
   * Busca feature por código
   */
  async getByCode(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { code } = request.params as { code: string };
      const feature = await featureService.getFeatureByCode(code);
      reply.send(feature);
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
    }
  }

  /**
   * POST /api/features
   * Cria nova feature (Admin only)
   */
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = createFeatureSchema.parse(request.body);
      const feature = await featureService.createFeature(data);
      reply.status(201).send(feature);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  /**
   * PUT /api/features/:id
   * Atualiza feature (Admin only)
   */
  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const data = updateFeatureSchema.parse(request.body);
      const feature = await featureService.updateFeature(id, data);
      reply.send(feature);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  /**
   * DELETE /api/features/:id
   * Desativa feature (Admin only)
   */
  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const result = await featureService.deleteFeature(id);
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }
}

export const featureController = new FeatureController();
