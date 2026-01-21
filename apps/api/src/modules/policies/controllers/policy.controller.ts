import { FastifyRequest, FastifyReply } from 'fastify';
import { PolicyService } from '../../../services/policy.service';
import { PolicyType, PolicyTargetType, PolicyEnforcement } from '@prisma/client';
import { MASKING_CONFIG } from '../../../config/masking.config';

const policyService = new PolicyService();

export class PolicyController {
  /**
   * Lista policies com filtros
   * GET /api/policies
   */
  async listPolicies(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { type, targetType, targetId, isActive } = request.query as any;

      const filters: any = {};
      if (type) filters.type = type as PolicyType;
      if (targetType) filters.targetType = targetType as PolicyTargetType;
      if (targetId) filters.targetId = targetId as string;
      if (isActive !== undefined) filters.isActive = isActive === 'true';

      const policies = await policyService.listPolicies(filters);

      return reply.send({ policies });
    } catch (error) {
      console.error('Error listing policies:', error);
      return reply.status(500).send({ error: 'Failed to list policies' });
    }
  }

  /**
   * Busca policy por ID
   * GET /api/policies/:id
   */
  async getPolicyById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;

      const policy = await policyService.getPolicyById(id);

      return reply.send({ policy });
    } catch (error: any) {
      if (error.message === 'Policy not found') {
        return reply.status(404).send({ error: error.message });
      }
      console.error('Error getting policy:', error);
      return reply.status(500).send({ error: 'Failed to get policy' });
    }
  }

  /**
   * Cria nova policy
   * POST /api/policies
   */
  async createPolicy(request: FastifyRequest, reply: FastifyReply) {
    try {
      const {
        name,
        description,
        type,
        targetType,
        targetId,
        conditions,
        enforcement,
        isActive,
      } = request.body as any;

      // Validações básicas
      if (!name || !type || !targetType || !conditions || !enforcement) {
        return reply.status(400).send({
          error: 'Missing required fields: name, type, targetType, conditions, enforcement',
        });
      }

      const policy = await policyService.createPolicy({
        name,
        description,
        type: type as PolicyType,
        targetType: targetType as PolicyTargetType,
        targetId,
        conditions,
        enforcement: enforcement as PolicyEnforcement,
        isActive,
      });

      return reply.status(201).send({ policy });
    } catch (error: any) {
      console.error('Error creating policy:', error);
      return reply.status(400).send({ error: error.message || 'Failed to create policy' });
    }
  }

  /**
   * Atualiza policy
   * PUT /api/policies/:id
   */
  async updatePolicy(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;
      const { name, description, conditions, enforcement, isActive } = request.body as any;

      const policy = await policyService.updatePolicy(id, {
        name,
        description,
        conditions,
        enforcement: enforcement as PolicyEnforcement | undefined,
        isActive,
      });

      return reply.send({ policy });
    } catch (error: any) {
      if (error.message === 'Policy not found') {
        return reply.status(404).send({ error: error.message });
      }
      console.error('Error updating policy:', error);
      return reply.status(400).send({ error: error.message || 'Failed to update policy' });
    }
  }

  /**
   * Deleta policy
   * DELETE /api/policies/:id
   */
  async deletePolicy(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;

      await policyService.deletePolicy(id);

      return reply.send({ message: 'Policy deleted successfully' });
    } catch (error: any) {
      if (error.message === 'Policy not found') {
        return reply.status(404).send({ error: error.message });
      }
      console.error('Error deleting policy:', error);
      return reply.status(500).send({ error: 'Failed to delete policy' });
    }
  }

  /**
   * Avalia uma policy específica
   * POST /api/policies/:id/evaluate
   */
  async evaluatePolicy(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;
      const { userId, ipAddress, deviceId, timestamp, userAgent } = request.body as any;

      if (!userId) {
        return reply.status(400).send({ error: 'userId is required' });
      }

      const result = await policyService.evaluatePolicy(id, {
        userId,
        ipAddress,
        deviceId,
        timestamp: timestamp ? new Date(timestamp) : undefined,
        userAgent,
      });

      return reply.send({ result });
    } catch (error: any) {
      if (error.message === 'Policy not found') {
        return reply.status(404).send({ error: error.message });
      }
      console.error('Error evaluating policy:', error);
      return reply.status(500).send({ error: 'Failed to evaluate policy' });
    }
  }

  /**
   * Avalia todas as policies de um target
   * POST /api/policies/evaluate
   */
  async evaluatePolicies(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { targetType, targetId, userId, ipAddress, deviceId, timestamp, userAgent } =
        request.body as any;

      if (!targetType || !targetId || !userId) {
        return reply.status(400).send({
          error: 'targetType, targetId, and userId are required',
        });
      }

      const result = await policyService.evaluatePolicies(
        targetType as PolicyTargetType,
        targetId,
        {
          userId,
          ipAddress,
          deviceId,
          timestamp: timestamp ? new Date(timestamp) : undefined,
          userAgent,
        }
      );

      return reply.send({ result });
    } catch (error) {
      console.error('Error evaluating policies:', error);
      return reply.status(500).send({ error: 'Failed to evaluate policies' });
    }
  }

  /**
   * Retorna a configuração de Data Masking
   * GET /api/policies/masking-config
   */
  async getMaskingConfig(request: FastifyRequest, reply: FastifyReply) {
    try {
      return reply.send({ config: MASKING_CONFIG });
    } catch (error) {
      console.error('Error getting masking config:', error);
      return reply.status(500).send({ error: 'Failed to get masking config' });
    }
  }
}
