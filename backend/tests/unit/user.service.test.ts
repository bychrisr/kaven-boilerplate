import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from '../../src/services/user.service.js';
import { getTestPrisma, getTestRedis, seedTestDatabase } from '../setup.js';

describe('UserService', () => {
  let userService: UserService;
  let testPrisma: any;
  let testRedis: any;
  let testData: any;

  beforeEach(async () => {
    testPrisma = getTestPrisma();
    testRedis = getTestRedis();
    
    // Seed test data
    testData = await seedTestDatabase();
    
    // Create user service instance
    userService = new UserService(testPrisma, testRedis);
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'newuser@test.com',
        password: 'testpassword123',
        firstName: 'New',
        lastName: 'User',
        tenantId: testData.tenants.tenant1.id,
        isAdm: false,
      };

      const user = await userService.createUser(userData);

      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.tenantId).toBe(userData.tenantId);
      expect(user.isAdm).toBe(userData.isAdm);
      expect(user.passwordHash).toBeDefined();
      expect(user.passwordHash).not.toBe(userData.password); // Should be hashed
    });

    it('should hash password before storing', async () => {
      const userData = {
        email: 'hashtest@test.com',
        password: 'plaintextpassword',
        tenantId: testData.tenants.tenant1.id,
      };

      const user = await userService.createUser(userData);

      expect(user.passwordHash).not.toBe(userData.password);
      expect(user.passwordHash.length).toBeGreaterThan(20); // bcrypt hashes are longer
    });

    it('should throw error for duplicate email', async () => {
      const userData = {
        email: testData.users.admin.email, // Already exists
        password: 'testpassword123',
        tenantId: testData.tenants.tenant1.id,
      };

      await expect(userService.createUser(userData)).rejects.toThrow();
    });

    it('should throw error for non-existent tenant', async () => {
      const userData = {
        email: 'newuser@test.com',
        password: 'testpassword123',
        tenantId: 'non-existent-tenant',
      };

      await expect(userService.createUser(userData)).rejects.toThrow();
    });

    it('should create admin user when isAdm is true', async () => {
      const userData = {
        email: 'admin@test.com',
        password: 'testpassword123',
        tenantId: testData.tenants.tenant1.id,
        isAdm: true,
      };

      const user = await userService.createUser(userData);

      expect(user.isAdm).toBe(true);
    });
  });

  describe('findUsersByTenantId', () => {
    it('should return users for specific tenant', async () => {
      const tenantId = testData.tenants.tenant1.id;
      const users = await userService.findUsersByTenantId(tenantId);

      expect(users).toBeDefined();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
      
      // All users should belong to the same tenant
      users.forEach(user => {
        expect(user.tenantId).toBe(tenantId);
      });
    });

    it('should return empty array for tenant with no users', async () => {
      // Create a new tenant with no users
      const newTenant = await testPrisma.tenant.create({
        data: {
          id: 'empty-tenant',
          name: 'Empty Tenant',
          subdomain: 'empty',
        },
      });

      const users = await userService.findUsersByTenantId(newTenant.id);
      expect(users).toEqual([]);
    });

    it('should apply pagination correctly', async () => {
      const tenantId = testData.tenants.tenant1.id;
      const page = 1;
      const limit = 1;

      const result = await userService.findUsersByTenantId(tenantId, { page, limit });

      expect(result.users).toBeDefined();
      expect(result.total).toBeDefined();
      expect(result.page).toBe(page);
      expect(result.limit).toBe(limit);
      expect(result.users.length).toBeLessThanOrEqual(limit);
    });

    it('should filter by search term', async () => {
      const tenantId = testData.tenants.tenant1.id;
      const searchTerm = 'Admin'; // Should match admin user

      const result = await userService.findUsersByTenantId(tenantId, { search: searchTerm });

      expect(result.users).toBeDefined();
      expect(result.users.length).toBeGreaterThan(0);
      
      // Check that at least one user matches the search term
      const hasMatchingUser = result.users.some(user => 
        user.firstName?.includes(searchTerm) || 
        user.lastName?.includes(searchTerm) || 
        user.email.includes(searchTerm.toLowerCase())
      );
      expect(hasMatchingUser).toBe(true);
    });

    it('should filter by admin status', async () => {
      const tenantId = testData.tenants.tenant1.id;
      const isAdm = true;

      const result = await userService.findUsersByTenantId(tenantId, { isAdm });

      expect(result.users).toBeDefined();
      
      // All returned users should be admins
      result.users.forEach(user => {
        expect(user.isAdm).toBe(true);
      });
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const userId = testData.users.regular.id;
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        email: 'updated@test.com',
      };

      const updatedUser = await userService.updateUser(userId, updateData);

      expect(updatedUser).toBeDefined();
      expect(updatedUser.firstName).toBe(updateData.firstName);
      expect(updatedUser.lastName).toBe(updateData.lastName);
      expect(updatedUser.email).toBe(updateData.email);
    });

    it('should update password when provided', async () => {
      const userId = testData.users.regular.id;
      const newPassword = 'newpassword123';
      const updateData = { password: newPassword };

      const updatedUser = await userService.updateUser(userId, updateData);

      expect(updatedUser).toBeDefined();
      expect(updatedUser.passwordHash).toBeDefined();
      expect(updatedUser.passwordHash).not.toBe(newPassword); // Should be hashed
    });

    it('should throw error for non-existent user', async () => {
      const userId = 'non-existent-user';
      const updateData = { firstName: 'Updated' };

      await expect(userService.updateUser(userId, updateData)).rejects.toThrow();
    });

    it('should throw error for duplicate email', async () => {
      const userId = testData.users.regular.id;
      const updateData = { email: testData.users.admin.email }; // Already exists

      await expect(userService.updateUser(userId, updateData)).rejects.toThrow();
    });

    it('should not update password when not provided', async () => {
      const userId = testData.users.regular.id;
      const originalPasswordHash = testData.users.regular.passwordHash;
      const updateData = { firstName: 'Updated' };

      const updatedUser = await userService.updateUser(userId, updateData);

      expect(updatedUser.passwordHash).toBe(originalPasswordHash);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const userId = testData.users.regular.id;

      await userService.deleteUser(userId);

      // Verify user is deleted
      const deletedUser = await testPrisma.user.findUnique({
        where: { id: userId },
      });
      expect(deletedUser).toBeNull();
    });

    it('should throw error for non-existent user', async () => {
      const userId = 'non-existent-user';

      await expect(userService.deleteUser(userId)).rejects.toThrow();
    });

    it('should handle cascade deletion properly', async () => {
      // Create a user with related data (if any)
      const userData = {
        email: 'cascade@test.com',
        password: 'testpassword123',
        tenantId: testData.tenants.tenant1.id,
      };

      const user = await userService.createUser(userData);
      const userId = user.id;

      // Delete the user
      await userService.deleteUser(userId);

      // Verify user is deleted
      const deletedUser = await testPrisma.user.findUnique({
        where: { id: userId },
      });
      expect(deletedUser).toBeNull();
    });
  });

  describe('getUserStats', () => {
    it('should return correct user statistics', async () => {
      const tenantId = testData.tenants.tenant1.id;
      const stats = await userService.getUserStats(tenantId);

      expect(stats).toBeDefined();
      expect(stats.total).toBeGreaterThanOrEqual(0);
      expect(stats.admins).toBeGreaterThanOrEqual(0);
      expect(stats.regular).toBeGreaterThanOrEqual(0);
      expect(stats.recent).toBeGreaterThanOrEqual(0);
      expect(stats.total).toBe(stats.admins + stats.regular);
    });

    it('should return zero stats for tenant with no users', async () => {
      // Create a new tenant with no users
      const newTenant = await testPrisma.tenant.create({
        data: {
          id: 'stats-tenant',
          name: 'Stats Tenant',
          subdomain: 'stats',
        },
      });

      const stats = await userService.getUserStats(newTenant.id);

      expect(stats.total).toBe(0);
      expect(stats.admins).toBe(0);
      expect(stats.regular).toBe(0);
      expect(stats.recent).toBe(0);
    });

    it('should count recent users correctly', async () => {
      const tenantId = testData.tenants.tenant1.id;
      const stats = await userService.getUserStats(tenantId);

      // Recent users should be created in the last 7 days
      expect(stats.recent).toBeGreaterThanOrEqual(0);
      expect(stats.recent).toBeLessThanOrEqual(stats.total);
    });
  });

  describe('findUserByEmail', () => {
    it('should find user by email', async () => {
      const email = testData.users.admin.email;
      const user = await userService.findUserByEmail(email);

      expect(user).toBeDefined();
      expect(user.email).toBe(email);
    });

    it('should return null for non-existent email', async () => {
      const email = 'nonexistent@test.com';
      const user = await userService.findUserByEmail(email);

      expect(user).toBeNull();
    });

    it('should be case insensitive', async () => {
      const email = testData.users.admin.email.toUpperCase();
      const user = await userService.findUserByEmail(email);

      expect(user).toBeDefined();
      expect(user.email.toLowerCase()).toBe(testData.users.admin.email.toLowerCase());
    });
  });

  describe('findUserById', () => {
    it('should find user by ID', async () => {
      const userId = testData.users.admin.id;
      const user = await userService.findUserById(userId);

      expect(user).toBeDefined();
      expect(user.id).toBe(userId);
    });

    it('should return null for non-existent ID', async () => {
      const userId = 'non-existent-id';
      const user = await userService.findUserById(userId);

      expect(user).toBeNull();
    });
  });
});
