import prisma from '../../../lib/prisma';
import { hashPassword } from '../../../lib/password';
import type { CreateUserInput, UpdateUserInput } from '../../../lib/validation';
import { auditService } from '../../audit/services/audit.service';


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
   * GET /api/users - Listar usuários (com paginação e filtros)
   */
  async listUsers(
    tenantId?: string, 
    page: number = 1, 
    limit: number = 10,
    search?: string,
    status?: string
  ) {
    const skip = (page - 1) * limit;
    
    // Build where clause with filters
    const where: any = { deletedAt: null };
    
    // Tenant filter
    if (tenantId) {
      where.tenantId = tenantId;
    }
    
    // Status filter
    if (status) {
      where.status = status;
    }
    
    // Search filter (name OR email)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    
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
        phone: true, 
        role: true,
        status: true,
        emailVerified: true,
        twoFactorEnabled: true,
        tenantId: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        deletedAt: true,
        metadata: true,
      },
    });

    if (!user || user.deletedAt) {
      throw new Error('Usuário não encontrado');
    }

    // Flatten metadata for frontend consumption
    const metadata = (user.metadata as any) || {};
    return {
      ...user,
      ...metadata,
      metadata: undefined, // Hide raw metadata if desired, or keep it
    };
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

    console.log('🔍 [USER SERVICE] Creating user with data:', {
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: data.role,
      status: data.status,
      tenantId,
      metadata: {
        country: (data as any).country,
        state: (data as any).state,
        city: (data as any).city,
        address: (data as any).address,
        zipcode: (data as any).zipcode,
        company: (data as any).company,
        avatarUrl: (data as any).avatarUrl,
      }
    });

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
        role: data.role || 'USER',
        status: data.status || 'ACTIVE',
        emailVerified: (data as any).emailVerified || false,
        tenantId: tenantId || null,
        metadata: {
           country: (data as any).country,
           state: (data as any).state,
           city: (data as any).city,
           address: (data as any).address,
           zipcode: (data as any).zipcode,
           company: (data as any).company,
           avatarUrl: (data as any).avatarUrl,
        }
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

    // Log Audit
    await auditService.log({
      action: 'user.created',
      entity: 'User',
      entityId: user.id,
      actorId: user.id, 
      tenantId: user.tenantId || undefined,
      metadata: { role: user.role, email: user.email }
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

    // Extract metadata fields
    const { 
      country, 
      state, 
      city, 
      address, 
      zipcode, 
      company, 
      avatarUrl, 
      emailVerified,
      ...coreData 
    } = data as any;

    const currentMetadata = (existingUser.metadata as any) || {};
    const newMetadata = {
      ...currentMetadata,
      ...(country !== undefined && { country }),
      ...(state !== undefined && { state }),
      ...(city !== undefined && { city }),
      ...(address !== undefined && { address }),
      ...(zipcode !== undefined && { zipcode }),
      ...(company !== undefined && { company }),
      ...(avatarUrl !== undefined && { avatarUrl }),
    };

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...coreData,
        ...(emailVerified !== undefined && { emailVerified }),
        metadata: newMetadata,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        tenantId: true,
        metadata: true, // Select metadata to verify
        tenant: {
          select: {
            name: true,
            slug: true,
          },
        },
        updatedAt: true,
      },
    });

    // Log Audit
    await auditService.log({
      action: 'user.updated',
      entity: 'User',
      entityId: user.id,
      actorId: undefined, // TODO
      tenantId: user.tenantId || undefined,
      metadata: { updatedFields: Object.keys(data) }
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

    // Log Audit
    await auditService.log({
      action: 'user.deleted',
      entity: 'User',
      entityId: id,
      actorId: undefined, // TODO: passar actorId
      metadata: { originalEmail: existingUser.email }
    });

    return { message: 'Usuário deletado com sucesso' };
  }

  /**
   * POST /api/users/:id/avatar - Upload de avatar
   */
  async uploadAvatar(userId: string, buffer: Buffer, filename: string): Promise<string> {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    const crypto = await import('node:crypto');
    const sharp = (await import('sharp')).default;

    // Verificar se usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Criar diretório de uploads se não existir
    const uploadsDir = path.join(process.cwd(), 'uploads', 'avatars');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Gerar nome único para o arquivo (sempre .webp)
    const uniqueName = `${userId}_${crypto.randomBytes(8).toString('hex')}.webp`;
    const filePath = path.join(uploadsDir, uniqueName);

    console.log('🖼️ [USER SERVICE] Converting image to WebP...');

    // Processar imagem: redimensionar e converter para WebP
    await sharp(buffer)
      .resize(400, 400, {
        fit: 'cover',
        position: 'center',
      })
      .webp({
        quality: 85, // Boa qualidade com compressão
        effort: 6,   // Esforço de compressão (0-6, maior = melhor compressão)
      })
      .toFile(filePath);

    console.log('✅ [USER SERVICE] Image converted to WebP');

    // URL pública do avatar
    const avatarUrl = `/uploads/avatars/${uniqueName}`;

    // Atualizar usuário com URL do avatar
    await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
    });

    // Log Audit
    await auditService.log({
      action: 'user.avatar_updated',
      entity: 'User',
      entityId: userId,
      actorId: undefined, // TODO: passar actorId
      metadata: { avatarUrl }
    });

    console.log('✅ [USER SERVICE] Avatar uploaded:', { userId, avatarUrl });

    return avatarUrl;
  }
}

export const userService = new UserService();
