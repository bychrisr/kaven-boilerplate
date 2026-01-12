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
    tenantId: string;
    invitedById: string;
  }) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Check for pending invite
    const pendingInvite = await this.prisma.tenantInvite.findFirst({
      where: {
        email: data.email,
        tenantId: data.tenantId,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (pendingInvite) {
      throw new Error('Invite already sent');
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
        tenantId: data.tenantId,
        invitedById: data.invitedById,
      },
      include: {
        tenant: true,
        invitedBy: true,
      },
    });

    // Send email
    const inviteUrl = `${process.env.FRONTEND_URL}/signup?token=${invite.token}`;
    await emailService.sendInviteEmail(
      invite.email,
      inviteUrl,
      invite.tenant.name,
      invite.invitedBy.name
    );

    return invite;
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
        tenantId: invite.tenantId,
        role: invite.role,
        status: 'ACTIVE',
        emailVerified: true, // Since they verified via email link
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
