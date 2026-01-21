import { Router } from 'express';
import { PolicyController } from '../controllers/policy.controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { requireCapability } from '../../../middleware/require-capability.middleware';

const router = Router();
const policyController = new PolicyController();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

/**
 * @route GET /api/policies
 * @desc Lista policies com filtros
 * @access Requer capability 'policies.read'
 */
router.get(
  '/',
  requireCapability('policies.read'),
  (req, res) => policyController.listPolicies(req, res)
);

/**
 * @route GET /api/policies/:id
 * @desc Busca policy por ID
 * @access Requer capability 'policies.read'
 */
router.get(
  '/:id',
  requireCapability('policies.read'),
  (req, res) => policyController.getPolicyById(req, res)
);

/**
 * @route POST /api/policies
 * @desc Cria nova policy
 * @access Requer capability 'policies.manage'
 */
router.post(
  '/',
  requireCapability('policies.manage'),
  (req, res) => policyController.createPolicy(req, res)
);

/**
 * @route PUT /api/policies/:id
 * @desc Atualiza policy
 * @access Requer capability 'policies.manage'
 */
router.put(
  '/:id',
  requireCapability('policies.manage'),
  (req, res) => policyController.updatePolicy(req, res)
);

/**
 * @route DELETE /api/policies/:id
 * @desc Deleta policy
 * @access Requer capability 'policies.manage'
 */
router.delete(
  '/:id',
  requireCapability('policies.manage'),
  (req, res) => policyController.deletePolicy(req, res)
);

/**
 * @route POST /api/policies/:id/evaluate
 * @desc Avalia uma policy específica
 * @access Requer capability 'policies.read'
 */
router.post(
  '/:id/evaluate',
  requireCapability('policies.read'),
  (req, res) => policyController.evaluatePolicy(req, res)
);

/**
 * @route POST /api/policies/evaluate
 * @desc Avalia todas as policies de um target
 * @access Requer capability 'policies.read'
 */
router.post(
  '/evaluate',
  requireCapability('policies.read'),
  (req, res) => policyController.evaluatePolicies(req, res)
);

export default router;
