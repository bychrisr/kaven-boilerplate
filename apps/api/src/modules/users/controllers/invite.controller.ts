
import { FastifyRequest, FastifyReply } from 'fastify';
import { InviteService } from '../services/invite.service';

export class InviteController {
  constructor(private inviteService: InviteService) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    const { email, role } = request.body as {
      email: string;
      role: 'ADMIN' | 'MEMBER'; // Frontend sends "MEMBER", mapped to USER in service/model if needed, but schema uses USER now.
    };
    
    // Map MEMBER to USER if necessary, or just use USER. 
    // The frontend dialog uses MEMBER/ADMIN. 
    // The Schema uses USER/TENANT_ADMIN/SUPER_ADMIN.
    // We should probably map frontend roles to Schema roles.
    
    let dbRole: 'USER' | 'TENANT_ADMIN' = 'USER';
    if (role === 'ADMIN') dbRole = 'TENANT_ADMIN';
    
    // Assuming request.user is populated by auth middleware
    const user = request.user as { id: string; tenantId: string };
    
    if (!user.tenantId) {
        return reply.status(400).send({ error: 'User does not belong to a tenant' });
    }

    const invite = await this.inviteService.createInvite({
      email,
      role: dbRole,
      tenantId: user.tenantId,
      invitedById: user.id,
    });

    return reply.code(201).send({
      message: 'Invite sent successfully',
      invite: {
        id: invite.id,
        email: invite.email,
        role: invite.role,
        expiresAt: invite.expiresAt,
      },
    });
  }

  async validate(request: FastifyRequest, reply: FastifyReply) {
    const { token } = request.params as { token: string };

    try {
      const invite = await this.inviteService.validateInvite(token);

      return reply.send({
        valid: true,
        email: invite.email,
        tenant: invite.tenant.name,
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
  }
}
