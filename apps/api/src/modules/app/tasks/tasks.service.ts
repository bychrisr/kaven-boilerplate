
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TasksService {
  async findAll(tenantId: string, projectId?: string, spaceId?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const where: any = { tenantId };
    if (projectId) where.projectId = projectId;
    
    // NOTE: Tasks should also respect Space indirectly via Project, or directly if they had spaceId (they do in schema).
    // Let's filter by Task's tenantId first.
    if (spaceId) {
        where.tenant = {
             // In schema, Task has relation to Tenant, but also Project has relation to Space.
             // If we want to filter tasks by space, we can do:
             // project: { spaceId: spaceId }
        };
        // OR add where condition on related project
        where.project = { spaceId };
    }

    const [data, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
           assignee: {
             select: { id: true, name: true, avatarUrl: true }
           },
           project: {
             select: { id: true, name: true, color: true, spaceId: true }
           }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.task.count({ where })
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
    return prisma.task.findFirst({
      where: { id, tenantId },
      include: {
        assignee: true,
        project: true
      }
    });
  }

  async create(data: any, tenantId: string, userId: string) {
    return prisma.task.create({
      data: {
        ...data,
        tenantId,
        createdById: userId
      }
    });
  }

  async update(id: string, data: any, tenantId: string) {
    const exists = await this.findOne(id, tenantId);
    if (!exists) throw new Error('Task not found');
    
    return prisma.task.update({
      where: { id },
      data
    });
  }

  async delete(id: string, tenantId: string) {
    const exists = await this.findOne(id, tenantId);
    if (!exists) throw new Error('Task not found');

    return prisma.task.delete({ where: { id } });
  }
}

export const tasksService = new TasksService();
