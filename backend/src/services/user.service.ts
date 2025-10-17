import { FastifyInstance } from 'fastify';
import { PrismaClient, User, Prisma } from '@prisma/client';
import { AuthService } from './auth.service.js';

export class UserService {
  constructor(
    private prisma: PrismaClient,
    private fastify: FastifyInstance,
    private authService: AuthService
  ) {}

  /**
   * Create a new user
   */
  async createUser(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    tenantId: string;
    isAdm?: boolean;
  }): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await this.authService.hashPassword(data.password);

      // Create user
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          password_hash: hashedPassword,
          first_name: data.firstName || null,
          last_name: data.lastName || null,
          tenant_id: data.tenantId,
          is_adm: data.isAdm || false,
        },
        include: {
          tenant: true,
        },
      });

      this.fastify.log.info({ userId: user.id, email: user.email, tenantId: user.tenant_id }, 'User created successfully');
      return user;
    } catch (error) {
      this.fastify.log.error({ error, email: data.email }, 'Error creating user');
      throw error;
    }
  }

  /**
   * Find users by tenant ID with pagination and filters
   */
  async findUsersByTenantId(
    tenantId: string,
    options: {
      page?: number;
      limit?: number;
      search?: string;
      isAdm?: boolean;
    } = {}
  ): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const { page = 1, limit = 10, search, isAdm } = options;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: Prisma.UserWhereInput = {
        tenant_id: tenantId,
      };

      if (search) {
        where.OR = [
          { email: { contains: search, mode: 'insensitive' } },
          { first_name: { contains: search, mode: 'insensitive' } },
          { last_name: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (isAdm !== undefined) {
        where.is_adm = isAdm;
      }

      // Get users and total count
      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          skip,
          take: limit,
          include: {
            tenant: true,
          },
          orderBy: {
            created_at: 'desc',
          },
        }),
        this.prisma.user.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        users,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      this.fastify.log.error({ error, tenantId }, 'Error finding users by tenant');
      throw error;
    }
  }

  /**
   * Find user by ID
   */
  async findUserById(id: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          tenant: true,
        },
      });

      return user;
    } catch (error) {
      this.fastify.log.error({ error, userId: id }, 'Error finding user by ID');
      throw error;
    }
  }

  /**
   * Update user
   */
  async updateUser(
    id: string,
    data: {
      email?: string;
      firstName?: string;
      lastName?: string;
      isAdm?: boolean;
      password?: string;
    }
  ): Promise<User> {
    try {
      // Check if user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new Error('User not found');
      }

      // Check if email is being changed and if it already exists
      if (data.email && data.email !== existingUser.email) {
        const emailExists = await this.prisma.user.findUnique({
          where: { email: data.email },
        });

        if (emailExists) {
          throw new Error('User with this email already exists');
        }
      }

      // Prepare update data
      const updateData: any = {
        email: data.email,
        first_name: data.firstName || undefined,
        last_name: data.lastName || undefined,
        is_adm: data.isAdm,
      };

      // Hash new password if provided
      if (data.password) {
        updateData.password_hash = await this.authService.hashPassword(data.password);
      }

      const user = await this.prisma.user.update({
        where: { id },
        data: updateData,
        include: {
          tenant: true,
        },
      });

      this.fastify.log.info({ userId: id, email: user.email }, 'User updated successfully');
      return user;
    } catch (error) {
      this.fastify.log.error({ error, userId: id }, 'Error updating user');
      throw error;
    }
  }

  /**
   * Delete user (soft delete by setting deleted_at timestamp)
   */
  async deleteUser(id: string): Promise<void> {
    try {
      // Check if user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new Error('User not found');
      }

      // For now, we'll do a hard delete since we don't have deleted_at field
      // In production, you might want to add a deleted_at field for soft delete
      await this.prisma.user.delete({
        where: { id },
      });

      // Revoke all refresh tokens for this user
      await this.authService.revokeRefreshToken(id);

      this.fastify.log.info({ userId: id }, 'User deleted successfully');
    } catch (error) {
      this.fastify.log.error({ error, userId: id }, 'Error deleting user');
      throw error;
    }
  }

  /**
   * Get user statistics for a tenant
   */
  async getUserStats(tenantId: string): Promise<{
    total: number;
    admins: number;
    regular: number;
    recent: number; // users created in last 30 days
  }> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [total, admins, regular, recent] = await Promise.all([
        this.prisma.user.count({
          where: { tenant_id: tenantId },
        }),
        this.prisma.user.count({
          where: { tenant_id: tenantId, is_adm: true },
        }),
        this.prisma.user.count({
          where: { tenant_id: tenantId, is_adm: false },
        }),
        this.prisma.user.count({
          where: {
            tenant_id: tenantId,
            created_at: { gte: thirtyDaysAgo },
          },
        }),
      ]);

      return {
        total,
        admins,
        regular,
        recent,
      };
    } catch (error) {
      this.fastify.log.error({ error, tenantId }, 'Error getting user stats');
      throw error;
    }
  }
}
