import { PrismaClient, Role, TenantInvite, User } from '@prisma/client';
import crypto from 'crypto';
import { addHours } from 'date-fns';
import bcrypt from 'bcrypt';
import { emailService } from '../../../lib/email.service';

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
      throw new Error('User already exists');
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
      throw new Error('Active invite already sent to this email for this scope');
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

    // Send email
    const inviteUrl = `${process.env.FRONTEND_URL}/signup?token=${invite.token}`;
    const tenantName = invite.tenant?.name || 'Kaven Platform';
    
    await emailService.sendInviteEmail(
      invite.email,
      inviteUrl,
      tenantName,
      invite.invitedBy.name
    );

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
      throw new Error('Invite not found');
    }

    // Permission Check:
    // 1. SUPER_ADMIN can cancel ANY invite.
    // 2. Otherwise, only the Inviter can cancel.
    if (userRole !== 'SUPER_ADMIN' && invite.invitedById !== userId) {
        throw new Error('Unauthorized: You can only cancel invites you created');
    }

    if (invite.usedAt) {
      throw new Error('Cannot cancel an invite that has already been used');
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
      throw new Error('Invalid invite token');
    }

    if (invite.usedAt) {
      throw new Error('Invite already used');
    }

    if (invite.expiresAt < new Date()) {
      throw new Error('Invite expired');
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
        password: await this.hashPassword(userData.password),
        tenantId: invite.tenantId, // Can be null if SUPER_ADMIN invite
        role: invite.role,
        status: 'ACTIVE',
        emailVerified: true, 
      },
    });

    // Mark invite as used
    await this.prisma.tenantInvite.update({
      where: { id: invite.id },
      data: { usedAt: new Date() },
    });

    return user;
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
