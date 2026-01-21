import { prisma } from '../../../lib/prisma';
import { SpaceRole } from '@prisma/client';

interface CreateRoleDto {
  name: string;
  description?: string;
  spaceId: string;
  capabilities: string[]; // Capability IDs (codes)
}

interface UpdateRoleDto {
  name?: string;
  description?: string;
  capabilities?: string[];
}

export class RoleService {
  /**
   * List roles for a specific space
   * @param spaceIdOrCode - Space ID (UUID) or Space Code (e.g., 'ADMIN', 'FINANCE')
   */
  async listRoles(spaceIdOrCode: string) {
    // Verificar se é um UUID ou um código
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(spaceIdOrCode);
    
    let spaceId: string;
    
    if (isUUID) {
      // Já é um UUID, usar diretamente
      spaceId = spaceIdOrCode;
    } else {
      // É um código, buscar o Space pelo código
      const space = await prisma.space.findFirst({
        where: { code: spaceIdOrCode },
        select: { id: true }
      });
      
      if (!space) {
        throw new Error(`Space with code '${spaceIdOrCode}' not found`);
      }
      
      spaceId = space.id;
    }
    
    return prisma.spaceRole.findMany({
      where: {
        spaceId: spaceId,
        isActive: true // Usar isActive ao invés de deletedAt
      },
      include: {
        _count: {
          select: { userAssignments: true }
        },
        capabilities: {
          include: {
            capability: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
  }

  /**
   * Get role details by ID
   */
  async getRoleById(id: string) {
    const role = await prisma.spaceRole.findUnique({
      where: { id },
      include: {
        capabilities: {
          include: {
            capability: true
          }
        }
      }
    });

    if (!role || !role.isActive) {
      throw new Error('Role not found');
    }

    return role;
  }

  /**
   * Create a new role with capabilities
   */
  async createRole(data: CreateRoleDto) {
    const { name, description, spaceId: spaceIdOrCode, capabilities } = data;

    // Verificar se é um UUID ou um código
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(spaceIdOrCode);
    
    let spaceId: string;
    
    if (isUUID) {
      spaceId = spaceIdOrCode;
    } else {
      const space = await prisma.space.findFirst({
        where: { code: spaceIdOrCode },
        select: { id: true }
      });
      
      if (!space) {
        throw new Error(`Space with code '${spaceIdOrCode}' not found`);
      }
      
      spaceId = space.id;
    }

    // Validate if capabilities exist
    if (capabilities.length > 0) {
      const validCaps = await prisma.capability.count({
        where: { id: { in: capabilities } }
      });
      if (validCaps !== capabilities.length) {
        throw new Error('One or more capabilities are invalid');
      }
    }

    return prisma.$transaction(async (tx) => {
      const role = await tx.spaceRole.create({
        data: {
          name,
          description,
          spaceId,
          code: name.toUpperCase().replace(/\s+/g, '_'), // Gerar código a partir do nome
        }
      });

      if (capabilities.length > 0) {
        await tx.roleCapability.createMany({
          data: capabilities.map(capId => ({
            roleId: role.id,
            capabilityId: capId
          }))
        });
      }

      return role;
    });
  }

  /**
   * Update role details and capabilities
   */
  async updateRole(id: string, data: UpdateRoleDto) {
    const { name, description, capabilities } = data;

    const role = await prisma.spaceRole.findUnique({ where: { id } });
    if (!role || !role.isActive) throw new Error('Role not found');



    return prisma.$transaction(async (tx) => {
      // 1. Update basic info
      await tx.spaceRole.update({
        where: { id },
        data: {
          name,
          description,
        }
      });

      // 2. Update capabilities if provided
      if (capabilities) {
        // Remove existing
        await tx.roleCapability.deleteMany({
          where: { roleId: id }
        });

        // Add new
        if (capabilities.length > 0) {
          await tx.roleCapability.createMany({
            data: capabilities.map(capId => ({
              roleId: id,
              capabilityId: capId
            }))
          });
        }
      }

      return tx.spaceRole.findUnique({
        where: { id },
        include: {
          capabilities: {
            include: {
              capability: true
            }
          }
        }
      });
    });
  }

  /**
   * Soft delete a role (desativar)
   */
  async deleteRole(id: string) {
    const role = await prisma.spaceRole.findUnique({
      where: { id },
      include: {
        _count: {
          select: { userAssignments: true } // Corrigido: userAssignments ao invés de users
        }
      }
    });

    if (!role || !role.isActive) throw new Error('Role not found');

    if (role._count.userAssignments > 0) {
      throw new Error('Cannot delete role assigned to users. Reassign them first.');
    }

    // Desativar ao invés de soft delete
    return prisma.spaceRole.update({
      where: { id },
      data: {
        isActive: false
      }
    });
  }

  /**
   * List all available capabilities
   */
  async listCapabilities() {
    return prisma.capability.findMany({
      where: {
        isActive: true
      },
      orderBy: [
        { category: 'asc' },
        { code: 'asc' }
      ]
    });
  }
}

export const roleService = new RoleService();
