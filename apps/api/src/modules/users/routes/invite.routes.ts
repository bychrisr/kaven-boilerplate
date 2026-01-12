
import { FastifyInstance } from 'fastify';
import { InviteController } from '../controllers/invite.controller';
import { InviteService } from '../services/invite.service';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { requireTenantAdmin } from '../../../middleware/rbac.middleware';
import { prisma } from '../../../lib/prisma';

export async function inviteRoutes(app: FastifyInstance) {
  const inviteService = new InviteService(prisma);
  const inviteController = new InviteController(inviteService);

  // Create invite (authenticated, admin only)
  app.post('/invites', {
    preHandler: [authMiddleware, requireTenantAdmin],
    handler: inviteController.create.bind(inviteController),
  });

  // Validate invite (public)
  app.get('/invites/:token/validate', {
    handler: inviteController.validate.bind(inviteController),
  });

  // Accept invite (public)
  app.post('/invites/:token/accept', {
    handler: inviteController.accept.bind(inviteController),
  });
}
