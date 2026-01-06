import { FastifyRequest, FastifyReply } from 'fastify';
import { planService } from '../services/plan.service';
import {
  createPlanSchema,
  updatePlanSchema,
  listPlansSchema,
} from '../../../lib/validation-plans';

export class PlanController {
  /**
   * GET /api/plans
   * Lista todos os planos
   */
  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const filters = listPlansSchema.parse(request.query);
      const plans = await planService.listPlans(filters);
      reply.send({ plans });
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  /**
   * GET /api/plans/:id
   * Busca plano por ID
   */
  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const plan = await planService.getPlanById(id);
      reply.send(plan);
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
    }
  }

  /**
   * GET /api/plans/code/:code
   * Busca plano por código
   */
  async getByCode(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { code } = request.params as { code: string };
      const { tenantId } = request.query as { tenantId?: string };
      const plan = await planService.getPlanByCode(code, tenantId);
      reply.send(plan);
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
    }
  }

  /**
   * POST /api/plans
   * Cria novo plano (Admin only)
   */
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = createPlanSchema.parse(request.body);
      const plan = await planService.createPlan(data);
      reply.status(201).send(plan);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  /**
   * PUT /api/plans/:id
   * Atualiza plano (Admin only)
   */
  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const data = updatePlanSchema.parse(request.body);
      const plan = await planService.updatePlan(id, data);
      reply.send(plan);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  /**
   * DELETE /api/plans/:id
   * Desativa plano (Admin only)
   */
  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const result = await planService.deletePlan(id);
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  /**
   * POST /api/plans/:id/features
   * Adiciona feature ao plano (Admin only)
   */
  async addFeature(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const { featureCode, enabled, limitValue, customValue, displayOverride } = request.body as any;
      
      await planService.addFeaturesToPlan(id, [{
        featureCode,
        enabled,
        limitValue,
        customValue,
        displayOverride,
      }]);
      
      const plan = await planService.getPlanById(id);
      reply.send(plan);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  /**
   * PUT /api/plans/:id/features/:featureCode
   * Atualiza feature do plano (Admin only)
   */
  async updateFeature(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id, featureCode } = request.params as { id: string; featureCode: string };
      const data = request.body as any;
      const plan = await planService.updatePlanFeature(id, featureCode, data);
      reply.send(plan);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  /**
   * DELETE /api/plans/:id/features/:featureCode
   * Remove feature do plano (Admin only)
   */
  async removeFeature(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id, featureCode } = request.params as { id: string; featureCode: string };
      const result = await planService.removePlanFeature(id, featureCode);
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }
}

export const planController = new PlanController();
