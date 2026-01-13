
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // In a real app, use a DI container or shared instance

export class ProjectsService {
  async findAll(tenantId: string, spaceId?: string | null, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const where: any = { tenantId };
    
    // Space filter: if specific spaceId is provided, filter by it.
    // If explicit null is provided (Global Space), filter where spaceId is null.
    // If undefined is provided, returning ALL projects (or default behavior). 
    // Let's assume strict filtering: Pass spaceId or 'GLOBAL' (null).
    
    if (spaceId) {
        where.spaceId = spaceId;
    } else {
        // If no space provides, usually implies 'Global View' or User Preference.
        // For now, let's keep it loose, but ideally we match the active Space.
        // If spaceId is explicitly undefined, we might fetch everything?
        // Let's filter by spaceId if present.
    }

    const [data, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
           _count: {
             select: { tasks: true }
           },
           createdBy: {
             select: { id: true, name: true, avatar: true }
           },
           space: {
             select: { id: true, name: true, color: true }
           }
        },
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.project.count({ where })
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(id: string, tenantId: string) {
    return prisma.project.findFirst({
      where: { id, tenantId }, // SECURITY: Always enforce tenantId
      include: {
        tasks: {
           orderBy: { createdAt: 'desc' }
        },
        createdBy: {
             select: { id: true, name: true, avatar: true }
        },
        space: {
             select: { id: true, name: true, color: true }
        }
      }
    });
  }

  async create(data: any, tenantId: string, userId: string) {
    // Extract spaceId from data if present
    const { spaceId, ...rest } = data;
    
    return prisma.project.create({
      data: {
        ...rest,
        tenantId,
        createdById: userId,
        spaceId: spaceId || null // Optional relation
      }
    });
  }

  async update(id: string, data: any, tenantId: string) {
    // Check if exists and belongs to tenant
    const exists = await this.findOne(id, tenantId);
    if (!exists) throw new Error('Project not found');

    return prisma.project.update({
      where: { id },
      data
    });
  }

  async delete(id: string, tenantId: string) {
     // Check if exists and belongs to tenant
    const exists = await this.findOne(id, tenantId);
    if (!exists) throw new Error('Project not found');

    return prisma.project.delete({
      where: { id }
    });
  }
}

export const projectsService = new ProjectsService();
