
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { addHours } from 'date-fns';
import { emailService } from '../../../lib/email.service';

export class PasswordResetService {
  constructor(private prisma: PrismaClient) {}

  async requestReset(email: string) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists
      return { message: 'If email exists, reset link sent' };
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Store token (expires in 1 hour)
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt: addHours(new Date(), 1),
      },
    });

    // Send email
    await emailService.sendPasswordResetEmail({ email: user.email, name: user.name }, token);

    return { message: 'If email exists, reset link sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    // Hash token to compare
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find valid token
    const resetToken = await this.prisma.passwordResetToken.findFirst({
      where: {
        token: hashedToken,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!resetToken) {
      throw new Error('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    // Mark token as used
    await this.prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    });

    // Invalidate all other tokens for this user (security best practice)
    await this.prisma.passwordResetToken.updateMany({
      where: {
        userId: resetToken.userId,
        usedAt: null,
      },
      data: { usedAt: new Date() },
    });

    return { message: 'Password reset successfully' };
  }
}
