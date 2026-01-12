
import type { FastifyInstance } from 'fastify';
import { InviteService } from '../services/invite.service';
import { InviteController } from '../controllers/invite.controller';
import prisma from '../../../lib/prisma';
import { authMiddleware } from '../../../middleware/auth.middleware';

export async function inviteRoutes(app: FastifyInstance) {
  const inviteService = new InviteService(prisma);
  const inviteController = new InviteController(inviteService);

  // Create invite (Authenticated)
  // Logic inside controller governs permissions (SUPER_ADMIN vs ADMIN)
  app.post('/invites', {
    preHandler: [authMiddleware],
    handler: inviteController.create.bind(inviteController),
  });

  // List pending invites (Authenticated)
  app.get('/invites', {
    preHandler: [authMiddleware],
    handler: inviteController.list.bind(inviteController),
  });

  // Cancel invite (Authenticated)
  app.delete('/invites/:inviteId', {
    preHandler: [authMiddleware],
    handler: inviteController.cancel.bind(inviteController),
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
