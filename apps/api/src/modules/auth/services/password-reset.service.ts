import { PrismaClient } from '@prisma/client';
import crypto from 'node:crypto';
import { addHours } from 'date-fns';
import { emailServiceV2 } from '../../../lib/email';
import { EmailType } from '../../../lib/email/types';
import { hashPassword, validatePasswordStrength } from '../../../lib/password';

export class PasswordResetService {
  constructor(private prisma: PrismaClient) {}

  async requestReset(email: string) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists
      return { message: 'Se o e-mail existir, um link de recuperação será enviado' };
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Store token (expires in 1 hour)
    await (this.prisma as any).passwordResetToken.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt: addHours(new Date(), 1),
      },
    });

    // Send email using V2
    await emailServiceV2.send({
      to: user.email,
      subject: 'Redefinição de senha',
      template: 'password-reset',
      templateData: {
        name: user.name,
        resetUrl: `${process.env.FRONTEND_URL}/reset-password?token=${token}`,
      },
      type: EmailType.TRANSACTIONAL,
      userId: user.id,
      tenantId: user.tenantId || undefined,
    });

    return { message: 'Se o e-mail existir, um link de recuperação será enviado' };
  }

  async resetPassword(token: string, newPassword: string) {
    // Hash token to compare
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find valid token
    const resetToken = await (this.prisma as any).passwordResetToken.findFirst({
      where: {
        token: hashedToken,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!resetToken) {
      throw new Error('Token de redefinição inválido ou expirado');
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message || 'Senha fraca');
    }

    // Hash new password using project utility
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await this.prisma.user.update({
      where: { id: resetToken.userId },
      data: { 
        password: hashedPassword,
        loginAttempts: 0,
        lockedUntil: null
      },
    });

    // Mark token as used
    await (this.prisma as any).passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    });

    // Invalidate all other tokens for this user
    await (this.prisma as any).passwordResetToken.updateMany({
      where: {
        userId: resetToken.userId,
        usedAt: null,
      },
      data: { usedAt: new Date() },
    });

    return { message: 'Senha redefinida com sucesso' };
  }
}
