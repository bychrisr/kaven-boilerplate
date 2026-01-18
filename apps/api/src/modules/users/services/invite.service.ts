import { PrismaClient, Role } from '@prisma/client';
import crypto from 'node:crypto';
import { addHours } from 'date-fns';
import { emailServiceV2 } from '../../../lib/email';
import { EmailType } from '../../../lib/email/types';
import { hashPassword } from '../../../lib/password';

export class InviteService {
  constructor(private prisma: PrismaClient) {}

  async createInvite(data: {
    email: string;
    role: Role;
    tenantId?: string;
    invitedById: string;
  }) {
    // VALIDATION: Strict Multi-Tenancy Rules
    if (data.role === 'SUPER_ADMIN') {
      if (data.tenantId) {
        throw new Error('SUPER_ADMIN invites cannot be associated with a tenant');
      }
    } else {
      // ADMIN or MEMBER must have a tenantId
      if (!data.tenantId) {
        throw new Error('ADMIN and MEMBER invites require a tenantId');
      }
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Usuário já existe');
    }

    // Check for pending invite (same email + same tenant)
    // For SUPER_ADMIN (tenantId=null), check if there is a pending invite with no tenant
    const pendingInvite = await this.prisma.tenantInvite.findFirst({
      where: {
        email: data.email,
        tenantId: data.tenantId || null,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (pendingInvite) {
      throw new Error('Já existe um convite ativo para este e-mail');
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Create invite (expires in 7 days)
    const invite = await this.prisma.tenantInvite.create({
      data: {
        email: data.email,
        role: data.role,
        token,
        expiresAt: addHours(new Date(), 168), // 7 days
        tenantId: data.tenantId || null,
        invitedById: data.invitedById,
      },
      include: {
        tenant: true,
        invitedBy: true,
      },
    });

    // Send email using V2
    const inviteUrl = `${process.env.FRONTEND_URL}/signup?token=${invite.token}`;
    const tenantName = invite.tenant?.name || 'Kaven Platform';
    
    await emailServiceV2.send({
      to: invite.email,
      subject: `Convite para participar de ${tenantName}`,
      template: 'invite',
      templateData: {
        inviterName: invite.invitedBy.name,
        tenantName,
        inviteUrl,
      },
      type: EmailType.TRANSACTIONAL,
      userId: invite.invitedById,
      tenantId: invite.tenantId || undefined,
    });

    return invite;
  }

  async listPendingInvites(filters?: {
    tenantId?: string;
    email?: string;
    role?: Role;
  }) {
    // Determine strict filters
    const where: any = {
      usedAt: null,
      expiresAt: { gt: new Date() },
    };

    if (filters?.tenantId) {
      where.tenantId = filters.tenantId;
    }
    
    // If role is undefined, we return all (subject to tenant filter)
    if (filters?.role) {
      where.role = filters.role;
    }

    if (filters?.email) {
      where.email = { contains: filters.email, mode: 'insensitive' };
    }

    return this.prisma.tenantInvite.findMany({
      where,
      include: {
        tenant: {
          select: { name: true }
        },
        invitedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async cancelInvite(inviteId: string, userId: string, userRole: Role) {
    const invite = await this.prisma.tenantInvite.findUnique({
      where: { id: inviteId },
    });

    if (!invite) {
      throw new Error('Convite não encontrado');
    }

    // Permission Check:
    // 1. SUPER_ADMIN can cancel ANY invite.
    // 2. Otherwise, only the Inviter can cancel.
    if (userRole !== 'SUPER_ADMIN' && invite.invitedById !== userId) {
        throw new Error('Não autorizado: você só pode cancelar convites que você criou');
    }

    if (invite.usedAt) {
      throw new Error('Não é possível cancelar um convite que já foi usado');
    }

    // Hard delete or expire? Plan says Cancel, let's delete to remove clutter or expire.
    // Implementation Plan suggested soft delete by setting expiresAt to now.
    return this.prisma.tenantInvite.update({
      where: { id: inviteId },
      data: {
        expiresAt: new Date(), // Expire immediately
      },
    });
  }

  async validateInvite(token: string) {
    const invite = await this.prisma.tenantInvite.findUnique({
      where: { token },
      include: { tenant: true },
    });

    if (!invite) {
      throw new Error('Token de convite inválido');
    }

    if (invite.usedAt) {
      throw new Error('Convite já utilizado');
    }

    if (invite.expiresAt < new Date()) {
      throw new Error('Convite expirado');
    }

    return invite;
  }

  async acceptInvite(token: string, userData: {
    password: string;
    name: string;
  }) {
    const invite = await this.validateInvite(token);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: invite.email,
        name: userData.name,
        password: await hashPassword(userData.password),
        tenantId: invite.tenantId, // Can be null if SUPER_ADMIN invite
        role: invite.role,
        status: 'ACTIVE',
        emailVerified: true, 
        emailVerifiedAt: new Date(),
        unsubscribeToken: crypto.randomBytes(24).toString('hex'),
      } as any,
    });

    // Mark invite as used
    await this.prisma.tenantInvite.update({
      where: { id: invite.id },
      data: { usedAt: new Date() },
    });

    return user;
  }
}
