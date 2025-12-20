import prisma from '../../../lib/prisma';
import { hashPassword } from '../../../lib/bcrypt';
import type { CreateUserInput, UpdateUserInput } from '../../../lib/validation';

export class UserService {
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
          tenantId: true,
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
  async createUser(data: CreateUserInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role || 'USER',
        tenantId: data.tenantId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        tenantId: true,
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
      data: { deletedAt: new Date() },
    });

    return { message: 'Usuário deletado com sucesso' };
  }
}

export const userService = new UserService();
