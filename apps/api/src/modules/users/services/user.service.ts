import prisma from '../../../lib/prisma';
import { hashPassword } from '../../../lib/bcrypt';
import type { CreateUserInput, UpdateUserInput } from '../../../lib/validation';

export class UserService {
  /**
   * GET /api/users/stats - Obter estatísticas de usuários
   */
  async getStats(tenantId?: string) {
    const where = tenantId ? { tenantId, deletedAt: null } : { deletedAt: null };

    const [total, active, pending, banned, rejected] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.count({ where: { ...where, status: 'ACTIVE' } }),
      prisma.user.count({ where: { ...where, status: 'PENDING' } }),
      prisma.user.count({ where: { ...where, status: 'BANNED' } }),
      prisma.user.count({ where: { ...where, status: 'REJECTED' } }),
    ]);

    return { total, active, pending, banned, rejected };
  }

  /**
   * GET /api/users - Listar usuários (com paginação)
   */
  async listUsers(tenantId?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const where = tenantId ? { tenantId, deletedAt: null } : { deletedAt: null };
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailVerified: true,
          twoFactorEnabled: true,
          phone: true,
          status: true,
          tenantId: true,
          tenant: {
            select: {
              name: true,
              slug: true,
            },
          },
          createdAt: true,
          lastLoginAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * GET /api/users/:id - Buscar usuário por ID
   */
  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        twoFactorEnabled: true,
        tenantId: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        deletedAt: true,
      },
    });

    if (!user || user.deletedAt) {
      throw new Error('Usuário não encontrado');
    }

    return user;
  }

  /**
   * GET /api/users/me - Buscar usuário atual (autenticado)
   */
  async getCurrentUser(userId: string) {
    return this.getUserById(userId);
  }

  /**
   * POST /api/users - Criar novo usuário
   */
  async createUser(data: CreateUserInput & { createOwnTenant?: boolean }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    const hashedPassword = await hashPassword(data.password);

    let tenantId = data.tenantId;

    // Se createOwnTenant = true ou tenantId = 'create-own', criar tenant próprio
    if ((data as any).createOwnTenant || tenantId === 'create-own') {
      const baseSlug = data.name
        .toLowerCase()
        .normalize('NFD')
        .replaceAll(/[\u0300-\u036f]/g, '')
        .replaceAll(/[^a-z0-9]+/g, '-')
        .replaceAll(/(^-+)|(-+$)/g, '');

      // Garantir slug único
      let slug = baseSlug;
      let counter = 1;
      while (await prisma.tenant.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      const tenant = await prisma.tenant.create({
        data: {
          name: data.name,
          slug,
          status: 'ACTIVE',
        },
      });

      tenantId = tenant.id;
    }

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
        role: data.role || 'USER',
        status: data.status || 'ACTIVE',
        tenantId: tenantId || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        status: true,
        tenantId: true,
        tenant: {
          select: {
            name: true,
            slug: true,
          },
        },
        createdAt: true,
      },
    });

    return user;
  }

  /**
   * PUT /api/users/:id - Atualizar usuário
   */
  async updateUser(id: string, data: UpdateUserInput) {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser || existingUser.deletedAt) {
      throw new Error('Usuário não encontrado');
    }

    if (data.email && data.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (emailExists) {
        throw new Error('Email já está em uso');
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        tenantId: true,
        tenant: {
          select: {
            name: true,
            slug: true,
          },
        },
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * DELETE /api/users/:id - Deletar usuário (soft delete)
   */
  async deleteUser(id: string) {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser || existingUser.deletedAt) {
      throw new Error('Usuário não encontrado');
    }

    await prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        email: `deleted_${Date.now()}_${existingUser.email}`,
        status: 'BANNED',
      },
    });

    return { message: 'Usuário deletado com sucesso' };
  }
}

export const userService = new UserService();
