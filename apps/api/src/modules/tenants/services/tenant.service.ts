import prisma from '../../../lib/prisma';
import type { CreateTenantInput, UpdateTenantInput } from '../../../lib/validation';

export class TenantService {
  /**
   * GET /api/tenants/stats - Obter estatísticas globais de tenants
   */
  async getStats() {
    const [total, active, suspended] = await Promise.all([
      prisma.tenant.count({ where: { deletedAt: null } }),
      prisma.tenant.count({ where: { status: 'ACTIVE', deletedAt: null } }),
      prisma.tenant.count({ where: { status: 'SUSPENDED', deletedAt: null } }),
    ]);

    return {
      total,
      active,
      suspended,
      deleted: 0,
    };
  }

  /**
   * GET /api/tenants - Listar tenants (Super Admin only)
   */
  async listTenants(page: number = 1, limit: number = 10, search?: string, status?: string) {
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { domain: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }
    
    const [tenants, total] = await Promise.all([
      prisma.tenant.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          domain: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          // logo: true, // Campo talvez não exista ainda, removendo para fixar build
          _count: {
            select: { users: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.tenant.count({ where }),
    ]);

    const formattedTenants = tenants.map(t => ({
      ...t,
      // Opcional: Flatten user count if needed for UI consistency
    }));

    return {
      tenants: formattedTenants,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * GET /api/tenants/:id - Buscar tenant por ID
   */
  async getTenantById(id: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            subscriptions: true,
          },
        },
      },
    });

    if (!tenant || tenant.deletedAt) {
      throw new Error('Tenant não encontrado');
    }

    return tenant;
  }

  /**
   * GET /api/tenants/:id/spaces - Listar spaces de um tenant
   */
  async getTenantSpaces(tenantId: string) {
    // Verificar se o tenant existe
    await this.getTenantById(tenantId);
    
    // Buscar global spaces (tenantId: null) e spaces do tenant
    const spaces = await prisma.space.findMany({
      where: {
        OR: [
          { tenantId: null },
          { tenantId },
        ],
        isActive: true,
      },
      orderBy: { sortOrder: 'asc' },
    });
    
    return spaces;
  }

  /**
   * POST /api/tenants - Criar novo tenant
   */
  async createTenant(data: CreateTenantInput) {
    const existingTenant = await prisma.tenant.findFirst({
      where: {
        OR: [
          { slug: data.slug },
          ...(data.domain ? [{ domain: data.domain }] : []),
        ],
      },
    });

    if (existingTenant) {
      throw new Error('Slug ou domínio já está em uso');
    }

    const tenant = await prisma.tenant.create({
      data: {
        name: data.name,
        slug: data.slug,
        domain: data.domain,
        status: 'ACTIVE',
      },
    });

    return tenant;
  }

  /**
   * PUT /api/tenants/:id - Atualizar tenant
   */
  async updateTenant(id: string, data: UpdateTenantInput) {
    const existingTenant = await prisma.tenant.findUnique({
      where: { id },
    });

    if (!existingTenant || existingTenant.deletedAt) {
      throw new Error('Tenant não encontrado');
    }

    if (data.slug && data.slug !== existingTenant.slug) {
      const slugExists = await prisma.tenant.findUnique({
        where: { slug: data.slug },
      });
      if (slugExists) {
        throw new Error('Slug já está em uso');
      }
    }

    if (data.domain && data.domain !== existingTenant.domain) {
      const domainExists = await prisma.tenant.findUnique({
        where: { domain: data.domain },
      });
      if (domainExists) {
        throw new Error('Domínio já está em uso');
      }
    }

    const tenant = await prisma.tenant.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return tenant;
  }

  /**
   * DELETE /api/tenants/:id - Deletar tenant (soft delete)
   */
  async deleteTenant(id: string) {
    const existingTenant = await prisma.tenant.findUnique({
      where: { id },
    });

    if (!existingTenant || existingTenant.deletedAt) {
      throw new Error('Tenant não encontrado');
    }

    const now = Date.now();
    await prisma.tenant.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        slug: `deleted_${now}_${existingTenant.slug}`,
        domain: existingTenant.domain ? `deleted_${now}_${existingTenant.domain}` : undefined,
        status: 'DELETED',
      },
    });

    return { message: 'Tenant deletado com sucesso' };
  }
}

export const tenantService = new TenantService();
