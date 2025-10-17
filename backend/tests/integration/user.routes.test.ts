import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app-factory.js';
import { getTestPrisma, getTestRedis, seedTestDatabase } from '../setup.js';

describe('User Routes Integration Tests', () => {
  let app: any;
  let testPrisma: any;
  let testRedis: any;
  let testData: any;
  let adminToken: string;
  let userToken: string;
  let otherTenantToken: string;

  beforeAll(async () => {
    // Set test environment variables
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test-secret-key';
    process.env.JWT_EXPIRES_IN = '1h';
    process.env.REFRESH_TOKEN_EXPIRES_IN = '7d';
    process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
    process.env.REDIS_URL = process.env.TEST_REDIS_URL;

    // Create test app
    app = await createApp();
    
    testPrisma = getTestPrisma();
    testRedis = getTestRedis();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  beforeEach(async () => {
    // Seed test data
    testData = await seedTestDatabase();
    
    // Get authentication tokens
    const bcrypt = await import('bcrypt');
    const password = 'testpassword123';
    const passwordHash = await bcrypt.hash(password, 10);

    // Update users with known password
    await testPrisma.user.updateMany({
      where: { id: { in: [testData.users.admin.id, testData.users.regular.id, testData.users.otherTenant.id] } },
      data: { password_hash: passwordHash },
    });

    // Get admin token
    const adminResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: testData.users.admin.email, password });
    adminToken = adminResponse.body.data.accessToken;

    // Get regular user token
    const userResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: testData.users.regular.email, password });
    userToken = userResponse.body.data.accessToken;

    // Get other tenant user token
    const otherTenantResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: testData.users.otherTenant.email, password });
    otherTenantToken = otherTenantResponse.body.data.accessToken;
  });

  describe('GET /api/users', () => {
    it('should return users for authenticated admin', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('users');
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('page');
      expect(response.body.data).toHaveProperty('limit');
      expect(Array.isArray(response.body.data.users)).toBe(true);
    });

    it('should return users for authenticated regular user', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toBeDefined();
      
      // Regular user should only see users from their own tenant
      response.body.data.users.forEach((user: any) => {
        expect(user.tenantId).toBe(testData.users.regular.tenantId);
      });
    });

    it('should reject unauthenticated requests', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('UNAUTHORIZED');
    });

    it('should apply pagination', async () => {
      const response = await request(app)
        .get('/api/users?page=1&limit=1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.page).toBe(1);
      expect(response.body.data.limit).toBe(1);
      expect(response.body.data.users.length).toBeLessThanOrEqual(1);
    });

    it('should filter by search term', async () => {
      const response = await request(app)
        .get('/api/users?search=Admin')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      
      // Should find users matching the search term
      const hasMatchingUser = response.body.data.users.some((user: any) =>
        user.firstName?.includes('Admin') ||
        user.lastName?.includes('Admin') ||
        user.email.includes('admin')
      );
      expect(hasMatchingUser).toBe(true);
    });

    it('should filter by admin status', async () => {
      const response = await request(app)
        .get('/api/users?isAdm=true')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      
      // All returned users should be admins
      response.body.data.users.forEach((user: any) => {
        expect(user.isAdm).toBe(true);
      });
    });

    it('should respect tenant isolation', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${otherTenantToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      
      // User from other tenant should only see users from their tenant
      response.body.data.users.forEach((user: any) => {
        expect(user.tenantId).toBe(testData.users.otherTenant.tenantId);
      });
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user by ID for admin', async () => {
      const userId = testData.users.regular.id;
      
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(userId);
      expect(response.body.data.email).toBe(testData.users.regular.email);
    });

    it('should return user by ID for same tenant user', async () => {
      const userId = testData.users.regular.id;
      
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(userId);
    });

    it('should reject access to user from different tenant', async () => {
      const userId = testData.users.otherTenant.id;
      
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('FORBIDDEN');
    });

    it('should return 404 for non-existent user', async () => {
      const userId = 'non-existent-user-id';
      
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('NOT_FOUND');
    });

    it('should reject unauthenticated requests', async () => {
      const userId = testData.users.regular.id;
      
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('UNAUTHORIZED');
    });
  });

  describe('POST /api/users', () => {
    it('should create user for admin', async () => {
      const userData = {
        email: 'newuser@test.com',
        password: 'testpassword123',
        firstName: 'New',
        lastName: 'User',
        isAdm: false,
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.data.firstName).toBe(userData.firstName);
      expect(response.body.data.lastName).toBe(userData.lastName);
      expect(response.body.data.isAdm).toBe(userData.isAdm);
    });

    it('should create user for regular user in same tenant', async () => {
      const userData = {
        email: 'newuser2@test.com',
        password: 'testpassword123',
        firstName: 'New',
        lastName: 'User',
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${userToken}`)
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tenantId).toBe(testData.users.regular.tenantId);
    });

    it('should reject invalid email format', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'testpassword123',
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should reject duplicate email', async () => {
      const userData = {
        email: testData.users.admin.email, // Already exists
        password: 'testpassword123',
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('CONFLICT');
    });

    it('should reject weak password', async () => {
      const userData = {
        email: 'weakpass@test.com',
        password: '123', // Too short
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should reject unauthenticated requests', async () => {
      const userData = {
        email: 'newuser@test.com',
        password: 'testpassword123',
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('UNAUTHORIZED');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user for admin', async () => {
      const userId = testData.users.regular.id;
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        email: 'updated@test.com',
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.firstName).toBe(updateData.firstName);
      expect(response.body.data.lastName).toBe(updateData.lastName);
      expect(response.body.data.email).toBe(updateData.email);
    });

    it('should update own profile for regular user', async () => {
      const userId = testData.users.regular.id;
      const updateData = {
        firstName: 'Self Updated',
        lastName: 'User',
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.firstName).toBe(updateData.firstName);
    });

    it('should reject update of user from different tenant', async () => {
      const userId = testData.users.otherTenant.id;
      const updateData = {
        firstName: 'Hacker',
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('FORBIDDEN');
    });

    it('should update password when provided', async () => {
      const userId = testData.users.regular.id;
      const updateData = {
        password: 'newpassword123',
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      
      // Password should be hashed (not returned in response)
      expect(response.body.data.passwordHash).toBeUndefined();
    });

    it('should return 404 for non-existent user', async () => {
      const userId = 'non-existent-user-id';
      const updateData = {
        firstName: 'Updated',
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('NOT_FOUND');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user for admin', async () => {
      // Create a user to delete
      const userData = {
        email: 'todelete@test.com',
        password: 'testpassword123',
        firstName: 'To',
        lastName: 'Delete',
      };

      const createResponse = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData);

      const userId = createResponse.body.data.id;

      const response = await request(app)
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBeDefined();
    });

    it('should reject deletion by regular user', async () => {
      const userId = testData.users.regular.id;

      const response = await request(app)
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('FORBIDDEN');
    });

    it('should reject deletion of user from different tenant', async () => {
      const userId = testData.users.otherTenant.id;

      const response = await request(app)
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('FORBIDDEN');
    });

    it('should return 404 for non-existent user', async () => {
      const userId = 'non-existent-user-id';

      const response = await request(app)
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('NOT_FOUND');
    });

    it('should reject unauthenticated requests', async () => {
      const userId = testData.users.regular.id;

      const response = await request(app)
        .delete(`/api/users/${userId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('UNAUTHORIZED');
    });
  });

  describe('GET /api/users/stats', () => {
    it('should return user statistics for admin', async () => {
      const response = await request(app)
        .get('/api/users/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('admins');
      expect(response.body.data).toHaveProperty('regular');
      expect(response.body.data).toHaveProperty('recent');
      expect(typeof response.body.data.total).toBe('number');
      expect(typeof response.body.data.admins).toBe('number');
      expect(typeof response.body.data.regular).toBe('number');
    });

    it('should return tenant-specific statistics for regular user', async () => {
      const response = await request(app)
        .get('/api/users/stats')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.total).toBeGreaterThanOrEqual(0);
    });

    it('should reject unauthenticated requests', async () => {
      const response = await request(app)
        .get('/api/users/stats')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('UNAUTHORIZED');
    });
  });

  describe('Row Level Security Tests', () => {
    it('should enforce tenant isolation at database level', async () => {
      // This test verifies that RLS is working correctly
      // Users from different tenants should not see each other's data
      
      const response1 = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      const response2 = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${otherTenantToken}`)
        .expect(200);

      // Users from different tenants should see different user lists
      const tenant1UserIds = response1.body.data.users.map((u: any) => u.id);
      const tenant2UserIds = response2.body.data.users.map((u: any) => u.id);

      // Should not have any common user IDs
      const commonIds = tenant1UserIds.filter((id: string) => tenant2UserIds.includes(id));
      expect(commonIds.length).toBe(0);
    });
  });
});
