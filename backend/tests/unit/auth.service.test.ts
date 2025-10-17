import { describe, it, expect, beforeEach, vi } from 'vitest';
import bcrypt from 'bcrypt';
import { AuthService } from '../../src/services/auth.service.js';
import { getTestPrisma, getTestRedis, seedTestDatabase } from '../setup.js';

describe('AuthService', () => {
  let authService: AuthService;
  let testPrisma: any;
  let testRedis: any;
  let testData: any;

  beforeEach(async () => {
    testPrisma = getTestPrisma();
    testRedis = getTestRedis();
    
    // Seed test data
    testData = await seedTestDatabase();
    
    // Create auth service instance
    authService = new AuthService(testPrisma, testRedis);
  });

  describe('hashPassword', () => {
    it('should hash a password correctly', async () => {
      const password = 'testpassword123';
      const hash = await authService.hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
      
      // Verify the hash can be used to verify the original password
      const isValid = await bcrypt.compare(password, hash);
      expect(isValid).toBe(true);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'testpassword123';
      const hash1 = await authService.hashPassword(password);
      const hash2 = await authService.hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
      
      // But both should verify correctly
      const isValid1 = await bcrypt.compare(password, hash1);
      const isValid2 = await bcrypt.compare(password, hash2);
      expect(isValid1).toBe(true);
      expect(isValid2).toBe(true);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'testpassword123';
      const hash = await bcrypt.hash(password, 10);
      
      const isValid = await authService.verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'testpassword123';
      const wrongPassword = 'wrongpassword';
      const hash = await bcrypt.hash(password, 10);
      
      const isValid = await authService.verifyPassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });

    it('should handle empty password', async () => {
      const hash = await bcrypt.hash('testpassword', 10);
      
      const isValid = await authService.verifyPassword('', hash);
      expect(isValid).toBe(false);
    });
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', async () => {
      const userId = testData.users.admin.id;
      const tenantId = testData.tenants.tenant1.id;
      const isAdm = true;
      
      const tokens = await authService.generateTokens(userId, tenantId, isAdm);
      
      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');
      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      expect(typeof tokens.accessToken).toBe('string');
      expect(typeof tokens.refreshToken).toBe('string');
    });

    it('should generate different tokens for different users', async () => {
      const tokens1 = await authService.generateTokens('user1', 'tenant1', false);
      const tokens2 = await authService.generateTokens('user2', 'tenant2', true);
      
      expect(tokens1.accessToken).not.toBe(tokens2.accessToken);
      expect(tokens1.refreshToken).not.toBe(tokens2.refreshToken);
    });

    it('should include user information in tokens', async () => {
      const userId = testData.users.admin.id;
      const tenantId = testData.tenants.tenant1.id;
      const isAdm = true;
      
      const tokens = await authService.generateTokens(userId, tenantId, isAdm);
      
      // Decode JWT payload (without verification for testing)
      const accessTokenPayload = JSON.parse(
        Buffer.from(tokens.accessToken.split('.')[1], 'base64').toString()
      );
      
      expect(accessTokenPayload.userId).toBe(userId);
      expect(accessTokenPayload.tenantId).toBe(tenantId);
      expect(accessTokenPayload.isAdm).toBe(isAdm);
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', async () => {
      const userId = testData.users.admin.id;
      const tenantId = testData.tenants.tenant1.id;
      const isAdm = true;
      
      const { accessToken } = await authService.generateTokens(userId, tenantId, isAdm);
      const payload = await authService.verifyToken(accessToken);
      
      expect(payload).toBeDefined();
      expect(payload.userId).toBe(userId);
      expect(payload.tenantId).toBe(tenantId);
      expect(payload.isAdm).toBe(isAdm);
    });

    it('should reject invalid token', async () => {
      const invalidToken = 'invalid.jwt.token';
      
      await expect(authService.verifyToken(invalidToken)).rejects.toThrow();
    });

    it('should reject expired token', async () => {
      // Mock a very short expiration time
      const originalExpiresIn = process.env.JWT_EXPIRES_IN;
      process.env.JWT_EXPIRES_IN = '1ms';
      
      const userId = testData.users.admin.id;
      const tenantId = testData.tenants.tenant1.id;
      const { accessToken } = await authService.generateTokens(userId, tenantId, true);
      
      // Wait for token to expire
      await new Promise(resolve => setTimeout(resolve, 10));
      
      await expect(authService.verifyToken(accessToken)).rejects.toThrow();
      
      // Restore original expiration time
      process.env.JWT_EXPIRES_IN = originalExpiresIn;
    });
  });

  describe('authenticateUser', () => {
    it('should authenticate valid user', async () => {
      const email = testData.users.admin.email;
      const password = 'testpassword123';
      
      // Update user with known password hash
      const passwordHash = await bcrypt.hash(password, 10);
      await testPrisma.user.update({
        where: { id: testData.users.admin.id },
        data: { password_hash: passwordHash },
      });
      
      const user = await authService.authenticateUser(email, password);
      
      expect(user).toBeDefined();
      expect(user.email).toBe(email);
      expect(user.id).toBe(testData.users.admin.id);
    });

    it('should reject invalid email', async () => {
      const email = 'nonexistent@test.com';
      const password = 'testpassword123';
      
      await expect(authService.authenticateUser(email, password)).rejects.toThrow('Invalid credentials');
    });

    it('should reject invalid password', async () => {
      const email = testData.users.admin.email;
      const password = 'wrongpassword';
      
      await expect(authService.authenticateUser(email, password)).rejects.toThrow('Invalid credentials');
    });

    it('should reject empty credentials', async () => {
      await expect(authService.authenticateUser('', '')).rejects.toThrow();
    });
  });

  describe('refreshToken', () => {
    it('should refresh valid token', async () => {
      const userId = testData.users.admin.id;
      const tenantId = testData.tenants.tenant1.id;
      const isAdm = true;
      
      const { refreshToken } = await authService.generateTokens(userId, tenantId, isAdm);
      
      // Store refresh token in Redis
      await testRedis.set(`refresh_token:${userId}`, refreshToken);
      
      const newTokens = await authService.refreshToken(refreshToken);
      
      expect(newTokens).toHaveProperty('accessToken');
      expect(newTokens).toHaveProperty('refreshToken');
      expect(newTokens.accessToken).toBeDefined();
      expect(newTokens.refreshToken).toBeDefined();
    });

    it('should reject invalid refresh token', async () => {
      const invalidToken = 'invalid.refresh.token';
      
      await expect(authService.refreshToken(invalidToken)).rejects.toThrow();
    });

    it('should reject token not in Redis', async () => {
      const userId = testData.users.admin.id;
      const tenantId = testData.tenants.tenant1.id;
      const { refreshToken } = await authService.generateTokens(userId, tenantId, true);
      
      // Don't store in Redis
      await expect(authService.refreshToken(refreshToken)).rejects.toThrow();
    });
  });

  describe('revokeRefreshToken', () => {
    it('should revoke refresh token', async () => {
      const userId = testData.users.admin.id;
      const refreshToken = 'test-refresh-token';
      
      // Store refresh token in Redis
      await testRedis.set(`refresh_token:${userId}`, refreshToken);
      
      await authService.revokeRefreshToken(userId);
      
      // Check that token was removed
      const storedToken = await testRedis.get(`refresh_token:${userId}`);
      expect(storedToken).toBeNull();
    });

    it('should handle non-existent user', async () => {
      const userId = 'non-existent-user';
      
      // Should not throw error
      await expect(authService.revokeRefreshToken(userId)).resolves.not.toThrow();
    });
  });
});
