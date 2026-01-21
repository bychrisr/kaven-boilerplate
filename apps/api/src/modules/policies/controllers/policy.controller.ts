import { Request, Response } from 'express';
import { PolicyService } from '../../../services/policy.service';
import { PolicyType, PolicyTargetType, PolicyEnforcement } from '@prisma/client';

const policyService = new PolicyService();

export class PolicyController {
  /**
   * Lista policies com filtros
   * GET /api/policies
   */
  async listPolicies(req: Request, res: Response) {
    try {
      const { type, targetType, targetId, isActive } = req.query;

      const filters: any = {};
      if (type) filters.type = type as PolicyType;
      if (targetType) filters.targetType = targetType as PolicyTargetType;
      if (targetId) filters.targetId = targetId as string;
      if (isActive !== undefined) filters.isActive = isActive === 'true';

      const policies = await policyService.listPolicies(filters);

      return res.status(200).json({ policies });
    } catch (error) {
      console.error('Error listing policies:', error);
      return res.status(500).json({ error: 'Failed to list policies' });
    }
  }

  /**
   * Busca policy por ID
   * GET /api/policies/:id
   */
  async getPolicyById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const policy = await policyService.getPolicyById(id);

      return res.status(200).json({ policy });
    } catch (error: any) {
      if (error.message === 'Policy not found') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Error getting policy:', error);
      return res.status(500).json({ error: 'Failed to get policy' });
    }
  }

  /**
   * Cria nova policy
   * POST /api/policies
   */
  async createPolicy(req: Request, res: Response) {
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
      } = req.body;

      // Validações básicas
      if (!name || !type || !targetType || !conditions || !enforcement) {
        return res.status(400).json({
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

      return res.status(201).json({ policy });
    } catch (error: any) {
      console.error('Error creating policy:', error);
      return res.status(400).json({ error: error.message || 'Failed to create policy' });
    }
  }

  /**
   * Atualiza policy
   * PUT /api/policies/:id
   */
  async updatePolicy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, conditions, enforcement, isActive } = req.body;

      const policy = await policyService.updatePolicy(id, {
        name,
        description,
        conditions,
        enforcement: enforcement as PolicyEnforcement | undefined,
        isActive,
      });

      return res.status(200).json({ policy });
    } catch (error: any) {
      if (error.message === 'Policy not found') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Error updating policy:', error);
      return res.status(400).json({ error: error.message || 'Failed to update policy' });
    }
  }

  /**
   * Deleta policy
   * DELETE /api/policies/:id
   */
  async deletePolicy(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await policyService.deletePolicy(id);

      return res.status(200).json({ message: 'Policy deleted successfully' });
    } catch (error: any) {
      if (error.message === 'Policy not found') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Error deleting policy:', error);
      return res.status(500).json({ error: 'Failed to delete policy' });
    }
  }

  /**
   * Avalia uma policy específica
   * POST /api/policies/:id/evaluate
   */
  async evaluatePolicy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId, ipAddress, deviceId, timestamp, userAgent } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const result = await policyService.evaluatePolicy(id, {
        userId,
        ipAddress,
        deviceId,
        timestamp: timestamp ? new Date(timestamp) : undefined,
        userAgent,
      });

      return res.status(200).json({ result });
    } catch (error: any) {
      if (error.message === 'Policy not found') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Error evaluating policy:', error);
      return res.status(500).json({ error: 'Failed to evaluate policy' });
    }
  }

  /**
   * Avalia todas as policies de um target
   * POST /api/policies/evaluate
   */
  async evaluatePolicies(req: Request, res: Response) {
    try {
      const { targetType, targetId, userId, ipAddress, deviceId, timestamp, userAgent } =
        req.body;

      if (!targetType || !targetId || !userId) {
        return res.status(400).json({
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

      return res.status(200).json({ result });
    } catch (error) {
      console.error('Error evaluating policies:', error);
      return res.status(500).json({ error: 'Failed to evaluate policies' });
    }
  }
}
