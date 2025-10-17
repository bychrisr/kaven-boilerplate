import { FastifyInstance } from 'fastify';
import { PrismaClient, Tenant, Prisma } from '@prisma/client';

export class TenantService {
  constructor(
    private prisma: PrismaClient,
    private fastify: FastifyInstance
  ) {}

  /**
   * Create a new tenant
   */
  async createTenant(data: {
    name: string;
    subdomain: string;
    planId?: string;
  }): Promise<Tenant> {
    try {
      // Check if tenant with same name or subdomain already exists
      const existingTenant = await this.prisma.tenant.findFirst({
        where: {
          OR: [
            { name: data.name },
            { subdomain: data.subdomain },
          ],
        },
      });

      if (existingTenant) {
        if (existingTenant.name === data.name) {
          throw new Error('Tenant with this name already exists');
        }
        if (existingTenant.subdomain === data.subdomain) {
          throw new Error('Tenant with this subdomain already exists');
        }
      }

      // Create tenant
      const tenant = await this.prisma.tenant.create({
        data: {
          name: data.name,
          subdomain: data.subdomain,
          plan_id: data.planId || null,
        },
        include: {
          plan: true,
          _count: {
            select: {
              users: true,
              metrics: true,
            },
          },
        },
      });

      this.fastify.log.info({ tenantId: tenant.id, name: tenant.name, subdomain: tenant.subdomain }, 'Tenant created successfully');
      return tenant;
    } catch (error) {
      this.fastify.log.error({ error, name: data.name, subdomain: data.subdomain }, 'Error creating tenant');
      throw error;
    }
  }

  /**
   * Find tenants with pagination and filters (admin only)
   */
  async findTenants(options: {
    page?: number;
    limit?: number;
    search?: string;
    planId?: string;
  } = {}): Promise<{
    tenants: Tenant[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const { page = 1, limit = 10, search, planId } = options;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: Prisma.TenantWhereInput = {};

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { subdomain: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (planId) {
        where.plan_id = planId;
      }

      // Get tenants and total count
      const [tenants, total] = await Promise.all([
        this.prisma.tenant.findMany({
          where,
          skip,
          take: limit,
          include: {
            plan: true,
            _count: {
              select: {
                users: true,
                metrics: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
        }),
        this.prisma.tenant.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        tenants,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      this.fastify.log.error({ error }, 'Error finding tenants');
      throw error;
    }
  }

  /**
   * Find tenant by ID
   */
  async findTenantById(id: string): Promise<Tenant | null> {
    try {
      const tenant = await this.prisma.tenant.findUnique({
        where: { id },
        include: {
          plan: true,
          _count: {
            select: {
              users: true,
              metrics: true,
            },
          },
        },
      });

      return tenant;
    } catch (error) {
      this.fastify.log.error({ error, tenantId: id }, 'Error finding tenant by ID');
      throw error;
    }
  }

  /**
   * Find tenant by subdomain
   */
  async findTenantBySubdomain(subdomain: string): Promise<Tenant | null> {
    try {
      const tenant = await this.prisma.tenant.findUnique({
        where: { subdomain },
        include: {
          plan: true,
          _count: {
            select: {
              users: true,
              metrics: true,
            },
          },
        },
      });

      return tenant;
    } catch (error) {
      this.fastify.log.error({ error, subdomain }, 'Error finding tenant by subdomain');
      throw error;
    }
  }

  /**
   * Update tenant
   */
  async updateTenant(
    id: string,
    data: {
      name?: string;
      subdomain?: string;
      planId?: string;
    }
  ): Promise<Tenant> {
    try {
      // Check if tenant exists
      const existingTenant = await this.prisma.tenant.findUnique({
        where: { id },
      });

      if (!existingTenant) {
        throw new Error('Tenant not found');
      }

      // Check if name or subdomain is being changed and if they already exist
      if (data.name && data.name !== existingTenant.name) {
        const nameExists = await this.prisma.tenant.findFirst({
          where: {
            name: data.name,
            id: { not: id },
          },
        });

        if (nameExists) {
          throw new Error('Tenant with this name already exists');
        }
      }

      if (data.subdomain && data.subdomain !== existingTenant.subdomain) {
        const subdomainExists = await this.prisma.tenant.findFirst({
          where: {
            subdomain: data.subdomain,
            id: { not: id },
          },
        });

        if (subdomainExists) {
          throw new Error('Tenant with this subdomain already exists');
        }
      }

      // Prepare update data
      const updateData: any = {
        name: data.name,
        subdomain: data.subdomain,
        plan_id: data.planId || null,
      };

      const tenant = await this.prisma.tenant.update({
        where: { id },
        data: updateData,
        include: {
          plan: true,
          _count: {
            select: {
              users: true,
              metrics: true,
            },
          },
        },
      });

      this.fastify.log.info({ tenantId: id, name: tenant.name, subdomain: tenant.subdomain }, 'Tenant updated successfully');
      return tenant;
    } catch (error) {
      this.fastify.log.error({ error, tenantId: id }, 'Error updating tenant');
      throw error;
    }
  }

  /**
   * Delete tenant (admin only)
   */
  async deleteTenant(id: string): Promise<void> {
    try {
      // Check if tenant exists
      const existingTenant = await this.prisma.tenant.findUnique({
        where: { id },
      });

      if (!existingTenant) {
        throw new Error('Tenant not found');
      }

      // Check if tenant has users
      const userCount = await this.prisma.user.count({
        where: { tenant_id: id },
      });

      if (userCount > 0) {
        throw new Error('Cannot delete tenant with existing users. Delete users first.');
      }

      // Delete tenant (cascade will handle related records)
      await this.prisma.tenant.delete({
        where: { id },
      });

      this.fastify.log.info({ tenantId: id }, 'Tenant deleted successfully');
    } catch (error) {
      this.fastify.log.error({ error, tenantId: id }, 'Error deleting tenant');
      throw error;
    }
  }

  /**
   * Get tenant statistics
   */
  async getTenantStats(tenantId: string): Promise<{
    users: {
      total: number;
      admins: number;
      regular: number;
      recent: number;
    };
    metrics: {
      total: number;
      last24h: number;
      last7d: number;
    };
    plan: {
      name: string;
      features: any;
    } | null;
  }> {
    try {
      const tenant = await this.prisma.tenant.findUnique({
        where: { id: tenantId },
        include: {
          plan: true,
          users: true,
          metrics: true,
        },
      });

      if (!tenant) {
        throw new Error('Tenant not found');
      }

      const now = new Date();
      const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const [userStats, metricStats] = await Promise.all([
        // User statistics
        {
          total: tenant.users.length,
          admins: tenant.users.filter(u => u.is_adm).length,
          regular: tenant.users.filter(u => !u.is_adm).length,
          recent: tenant.users.filter(u => u.created_at >= last30d).length,
        },
        // Metric statistics
        {
          total: tenant.metrics.length,
          last24h: tenant.metrics.filter(m => m.timestamp >= last24h).length,
          last7d: tenant.metrics.filter(m => m.timestamp >= last7d).length,
        },
      ]);

      return {
        users: userStats,
        metrics: metricStats,
        plan: tenant.plan ? {
          name: tenant.plan.name,
          features: tenant.plan.features,
        } : null,
      };
    } catch (error) {
      this.fastify.log.error({ error, tenantId }, 'Error getting tenant stats');
      throw error;
    }
  }

  /**
   * Get global tenant statistics (admin only)
   */
  async getGlobalStats(): Promise<{
    total: number;
    active: number;
    byPlan: Array<{ planName: string; count: number }>;
    recent: number;
  }> {
    try {
      const now = new Date();
      const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const [total, recent, planStats] = await Promise.all([
        this.prisma.tenant.count(),
        this.prisma.tenant.count({
          where: { created_at: { gte: last30d } },
        }),
        this.prisma.tenant.groupBy({
          by: ['plan_id'],
          _count: { plan_id: true },
        }),
      ]);

      const byPlan = planStats.map(stat => ({
        planName: 'No Plan', // Simplified for now
        count: stat._count.plan_id,
      }));

      return {
        total,
        active: total, // All tenants are considered active for now
        byPlan,
        recent,
      };
    } catch (error) {
      this.fastify.log.error({ error }, 'Error getting global tenant stats');
      throw error;
    }
  }
}
