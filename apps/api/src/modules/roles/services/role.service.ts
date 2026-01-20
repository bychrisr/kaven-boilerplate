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
   */
  async listRoles(spaceId: string) {
    return prisma.spaceRole.findMany({
      where: {
        spaceId: spaceId,
        deletedAt: null
      },
      include: {
        _count: {
          select: { users: true }
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

    if (!role || role.deletedAt) {
      throw new Error('Role not found');
    }

    return role;
  }

  /**
   * Create a new role with capabilities
   */
  async createRole(data: CreateRoleDto) {
    const { name, description, spaceId, capabilities } = data;

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
          isSystem: false, // Custom roles are never system roles by default
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
    if (!role || role.deletedAt) throw new Error('Role not found');

    if (role.isSystem && name) {
      // Prevent renaming system roles if desired, or allow it. 
      // Usually system roles structure should stay intact, but name might be editable?
      // For now, let's allow editing name/desc but be careful with standard roles.
    }

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
   * Soft delete a role
   */
  async deleteRole(id: string) {
    const role = await prisma.spaceRole.findUnique({
      where: { id },
      include: {
        _count: {
          select: { users: true }
        }
      }
    });

    if (!role || role.deletedAt) throw new Error('Role not found');

    if (role.isSystem) {
      throw new Error('Cannot delete a system role');
    }

    if (role._count.users > 0) {
      throw new Error('Cannot delete role assigned to users. Reassign them first.');
    }

    return prisma.spaceRole.update({
      where: { id },
      data: {
        deletedAt: new Date()
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
