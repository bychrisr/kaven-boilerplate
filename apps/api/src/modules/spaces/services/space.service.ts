import { prisma } from '../../../lib/prisma';
import { Space } from '@prisma/client';

export class SpaceService {
  /**
   * List spaces for a given tenant.
   * Includes global spaces (where tenantId is null) if applicable, 
   * or strictly tenant spaces.
   */
  async listSpaces(tenantId?: string) {
    // If tenantId is provided, fetch specific tenant spaces AND global spaces?
    // Usually Admin Panel users want to see the spaces relevant to their context.
    // If I am configured as a User of Tenant X, I see Tenant X spaces + Global Spaces.
    
    // For now, simple logic:
    const whereClause: any = {
       isActive: true
    };
    
    if (tenantId) {
        whereClause.OR = [
            { tenantId: tenantId },
            { tenantId: null }
        ];
    } else {
        // If no tenantId (e.g. platform admin looking at defaults?), maybe just global?
        // Or if extracting from request context failed.
        whereClause.tenantId = null;
    }

    const spaces = await prisma.space.findMany({
      where: whereClause,
      orderBy: {
        sortOrder: 'asc'
      }
    });
    
    return spaces;
  }

  async getSpaceById(id: string) {
    const space = await prisma.space.findUnique({
      where: { id }
    });
    if (!space) throw new Error('Space not found');
    return space;
  }
}

export const spaceService = new SpaceService();
