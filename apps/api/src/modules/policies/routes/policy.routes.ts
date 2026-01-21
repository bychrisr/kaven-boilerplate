import { FastifyInstance } from 'fastify';
import { PolicyController } from '../controllers/policy.controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { requireCapability } from '../../../middleware/requireCapability';

const policyController = new PolicyController();

export async function policyRoutes(fastify: FastifyInstance) {
  /**
   * @route GET /api/policies
   * @desc Lista policies com filtros
   * @access Requer capability 'policies.read'
   */
  fastify.get('/policies', {
    preHandler: [authMiddleware, requireCapability('policies.read')],
    handler: policyController.listPolicies.bind(policyController),
  });

  /**
   * @route GET /api/policies/:id
   * @desc Busca policy por ID
   * @access Requer capability 'policies.read'
   */
  fastify.get('/policies/:id', {
    preHandler: [authMiddleware, requireCapability('policies.read')],
    handler: policyController.getPolicyById.bind(policyController),
  });

  /**
   * @route POST /api/policies
   * @desc Cria nova policy
   * @access Requer capability 'policies.manage'
   */
  fastify.post('/policies', {
    preHandler: [authMiddleware, requireCapability('policies.manage')],
    handler: policyController.createPolicy.bind(policyController),
  });

  /**
   * @route PUT /api/policies/:id
   * @desc Atualiza policy
   * @access Requer capability 'policies.manage'
   */
  fastify.put('/policies/:id', {
    preHandler: [authMiddleware, requireCapability('policies.manage')],
    handler: policyController.updatePolicy.bind(policyController),
  });

  /**
   * @route DELETE /api/policies/:id
   * @desc Deleta policy
   * @access Requer capability 'policies.manage'
   */
  fastify.delete('/policies/:id', {
    preHandler: [authMiddleware, requireCapability('policies.manage')],
    handler: policyController.deletePolicy.bind(policyController),
  });

  /**
   * @route POST /api/policies/:id/evaluate
   * @desc Avalia uma policy específica
   * @access Requer capability 'policies.read'
   */
  fastify.post('/policies/:id/evaluate', {
    preHandler: [authMiddleware, requireCapability('policies.read')],
    handler: policyController.evaluatePolicy.bind(policyController),
  });

  /**
   * @route POST /api/policies/evaluate
   * @desc Avalia todas as policies de um target
   * @access Requer capability 'policies.read'
   */
  fastify.post('/policies/evaluate', {
    preHandler: [authMiddleware, requireCapability('policies.read')],
    handler: policyController.evaluatePolicies.bind(policyController),
  });
}
