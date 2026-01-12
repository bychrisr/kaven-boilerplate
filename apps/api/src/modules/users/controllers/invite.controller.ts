
import { FastifyRequest, FastifyReply } from 'fastify';
import { InviteService } from '../services/invite.service';

export class InviteController {
  constructor(private inviteService: InviteService) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    const { email, role, tenantId } = request.body as {
      email: string;
      role: 'SUPER_ADMIN' | 'ADMIN' | 'MEMBER';
      tenantId?: string;
    };

    // MAP frontend roles to Schema roles
    // Frontend: ADMIN -> Backend: TENANT_ADMIN
    // Frontend: MEMBER -> Backend: USER
    // Frontend: SUPER_ADMIN -> Backend: SUPER_ADMIN
    let dbRole: 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'USER' = 'USER';
    if (role === 'ADMIN') dbRole = 'TENANT_ADMIN';
    else if (role === 'SUPER_ADMIN') dbRole = 'SUPER_ADMIN';

    const currentUser = request.user; // Assuming request.user is populated by authMiddleware

    // 1. AUTHORIZATION CHECKS 🛡️
    if (role === 'SUPER_ADMIN') {
      // Only SUPER_ADMIN can invite SUPER_ADMIN
      if (currentUser.role !== 'SUPER_ADMIN') {
        return reply.code(403).send({
          error: 'Only SUPER_ADMIN can invite platform admins',
        });
      }
    } else {
      // ADMIN/MEMBER invites
      if (!tenantId) {
        return reply.code(400).send({
          error: 'tenantId is required for ADMIN and MEMBER roles',
        });
      }

      // Check permissions
      if (currentUser.role === 'SUPER_ADMIN') {
        // Super admin can invite to ANY tenant
      } else if (currentUser.role === 'ADMIN' || currentUser.role === 'TENANT_ADMIN') {
        // Admin can only invite to ORG they belong to
        if (currentUser.tenantId !== tenantId) {
          return reply.code(403).send({
            error: 'You can only invite users to your own tenant',
          });
        }
      } else {
        // MEMBER cannot invite
        return reply.code(403).send({
          error: 'You do not have permission to invite users',
        });
      }
    }

    // 2. ACTION
    // Use mapped dbRole for persistence
    const invite = await this.inviteService.createInvite({
      email,
      role: dbRole,
      tenantId,
      invitedById: currentUser.id,
    });

    return reply.code(201).send({
      message: 'Invite sent successfully',
      invite: {
        id: invite.id,
        email: invite.email,
        role: invite.role,
        tenantId: invite.tenantId,
        expiresAt: invite.expiresAt,
      },
    });
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const { tenantId, email, role } = request.query as {
      tenantId?: string;
      email?: string;
      role?: 'SUPER_ADMIN' | 'ADMIN' | 'MEMBER';
    };

    const currentUser = request.user;

    // Filter Security
    let filters: any = {};

    if (currentUser.role === 'SUPER_ADMIN') {
      // Super admin sees all, or filters by query
      filters = { tenantId, email, role };
    } else if (currentUser.role === 'ADMIN' || currentUser.role === 'TENANT_ADMIN') {
      // Admin sees only their tenant's invites
      filters = {
        tenantId: currentUser.tenantId,
        email,
        role,
      };
    } else {
      return reply.code(403).send({
        error: 'You do not have permission to view invites',
      });
    }

    const invites = await this.inviteService.listPendingInvites(filters);
    return reply.send({ invites });
  }

  async cancel(request: FastifyRequest, reply: FastifyReply) {
    const { inviteId } = request.params as { inviteId: string };
    const currentUser = request.user;

    try {
        await this.inviteService.cancelInvite(inviteId, currentUser.id, currentUser.role);
        return reply.send({ message: 'Invite cancelled successfully' });
    } catch (error: any) {
        if (error.message.includes('Unauthorized')) {
            return reply.code(403).send({ error: error.message });
        }
        throw error;
    }
  }

  async validate(request: FastifyRequest, reply: FastifyReply) {
    const { token } = request.params as { token: string };

    try {
      const invite = await this.inviteService.validateInvite(token);

      return reply.send({
        valid: true,
        email: invite.email,
        tenant: invite.tenant ? invite.tenant.name : 'Kaven Platform',
        role: invite.role,
      });
    } catch (error: any) {
      return reply.code(400).send({
        valid: false,
        error: error.message,
      });
    }
  }

  async accept(request: FastifyRequest, reply: FastifyReply) {
    const { token } = request.params as { token: string };
    const { password, name } = request.body as {
      password: string;
      name: string;
    };

    try {
        const user = await this.inviteService.acceptInvite(token, {
        password,
        name,
        });

        return reply.send({
        message: 'Account created successfully',
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
        });
    } catch (error: any) {
         return reply.code(400).send({
            error: error.message,
         });
    }
  }
}
