import bcrypt from 'bcrypt';
import { FastifyInstance } from 'fastify';
import { PrismaClient, User } from '@prisma/client';
import { JWTPayload } from '../types/auth.schemas.js';

export class AuthService {
  constructor(
    private prisma: PrismaClient,
    private fastify: FastifyInstance,
    private redis: any
  ) {}

  /**
   * Hash password using bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Verify password against hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      const result = await bcrypt.compare(password, hash);
      return result;
    } catch (error) {
      this.fastify.log.error({ error }, 'Password verification error');
      throw error;
    }
  }

  /**
   * Generate access and refresh tokens
   */
  async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JWTPayload = {
      userId: user.id,
      tenantId: user.tenant_id,
      email: user.email,
      isAdm: user.is_adm,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (15 * 60), // 15 minutes
    };

    const refreshPayload = {
      userId: user.id,
      tenantId: user.tenant_id,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
    };

    const accessToken = this.fastify.jwt.sign(payload);
    const refreshToken = this.fastify.jwt.sign(refreshPayload);

    // Store refresh token in Redis with expiration
    await this.redis.setex(
      `refresh_token:${user.id}`,
      7 * 24 * 60 * 60, // 7 days in seconds
      refreshToken
    );

    return { accessToken, refreshToken };
  }

  /**
   * Verify and decode JWT token
   */
  async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const decoded = this.fastify.jwt.verify(token) as JWTPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Verify refresh token
   */
  async verifyRefreshToken(token: string): Promise<JWTPayload | null> {
    try {
      const decoded = this.fastify.jwt.verify(token) as any;
      
      // Check if it's a refresh token
      if (decoded.type !== 'refresh') {
        return null;
      }

      // Check if refresh token exists in Redis
      const storedToken = await this.redis.get(`refresh_token:${decoded.userId}`);
      if (storedToken !== token) {
        return null;
      }

      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Revoke refresh token
   */
  async revokeRefreshToken(userId: string): Promise<void> {
    await this.redis.del(`refresh_token:${userId}`);
  }

  /**
   * Authenticate user with email and password
   */
  async authenticateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        include: {
          tenant: true,
        },
      });

      if (!user) {
        return null;
      }

      const isPasswordValid = await this.verifyPassword(password, user.password_hash);
      
      if (!isPasswordValid) {
        return null;
      }

      return user;
    } catch (error) {
      this.fastify.log.error({ error, email }, 'Authentication error');
      throw error;
    }
  }

  /**
   * Get user by ID with tenant information
   */
  async getUserById(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        tenant: true,
      },
    });
  }

  /**
   * Create password reset token
   */
  async createPasswordResetToken(email: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null; // Don't reveal if user exists
    }

    const resetToken = this.fastify.jwt.sign(
      { userId: user.id, type: 'password_reset' },
      { expiresIn: '1h' }
    );

    // Store reset token in Redis with 1 hour expiration
    await this.redis.setex(
      `password_reset:${user.id}`,
      60 * 60, // 1 hour
      resetToken
    );

    return resetToken;
  }

  /**
   * Verify password reset token
   */
  async verifyPasswordResetToken(token: string): Promise<string | null> {
    try {
      const decoded = this.fastify.jwt.verify(token) as any;
      
      if (decoded.type !== 'password_reset') {
        return null;
      }

      // Check if reset token exists in Redis
      const storedToken = await this.redis.get(`password_reset:${decoded.userId}`);
      if (storedToken !== token) {
        return null;
      }

      return decoded.userId;
    } catch (error) {
      return null;
    }
  }

  /**
   * Reset password using token
   */
  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const userId = await this.verifyPasswordResetToken(token);
    if (!userId) {
      return false;
    }

    const hashedPassword = await this.hashPassword(newPassword);
    
    await this.prisma.user.update({
      where: { id: userId },
      data: { password_hash: hashedPassword },
    });

    // Remove reset token from Redis
    await this.redis.del(`password_reset:${userId}`);

    // Revoke all refresh tokens for security
    await this.revokeRefreshToken(userId);

    return true;
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return false;
    }

    const isCurrentPasswordValid = await this.verifyPassword(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      return false;
    }

    const hashedNewPassword = await this.hashPassword(newPassword);
    
    await this.prisma.user.update({
      where: { id: userId },
      data: { password_hash: hashedNewPassword },
    });

    // Revoke all refresh tokens for security
    await this.revokeRefreshToken(userId);

    return true;
  }

  /**
   * Logout user (revoke refresh token)
   */
  async logout(userId: string): Promise<void> {
    await this.revokeRefreshToken(userId);
  }
}
