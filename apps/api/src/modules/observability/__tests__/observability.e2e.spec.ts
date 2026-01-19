import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../../../app';
import { generateAccessToken } from '../../../lib/jwt';
import { prisma } from '../../../lib/prisma';
import { randomUUID } from 'node:crypto';
import { initCacheProtection } from '../../../lib/cache-protection';
import { initRateLimitMonitor } from '../../../lib/rate-limit-monitor';
import Redis from 'ioredis';

describe('Observability Stack E2E', () => {
  let authToken: string;

  beforeAll(async () => {
    // Deserialize services
    const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      family: 4, // Força IPv4 (evita tentativa de IPv6)
    });
    initCacheProtection(redis, { enabled: true, ttl: 60, strategy: 'LRU' });
    initRateLimitMonitor();

    await app.ready();
    
    const email = `superadmin-${randomUUID()}@kaven.com`;
    const userId = randomUUID();

    // Create a temporary super admin user
    // Fixed field name to 'password' as per schema error feedback
    await prisma.user.create({
      data: {
        id: userId,
        email,
        name: 'Super Admin E2E',
        role: 'SUPER_ADMIN',
        password: 'placeholder'
      }
    });

    // Generate token - generateAccessToken returns a string, not an object
    const token = await generateAccessToken({
      sub: userId,
      email,
      role: 'SUPER_ADMIN',
      tenantId: undefined 
    });

    authToken = `Bearer ${token}`;
  });

  describe('Hardware Metrics', () => {
    it('should return hardware metrics', async () => {
      const response = await request(app.server)
        .get('/api/observability/hardware')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('cpu');
      expect(response.body.data).toHaveProperty('memory');
      expect(response.body.data).toHaveProperty('disk');
      expect(response.body.data).toHaveProperty('network');
      
      const cpu = response.body.data.cpu;
      expect(typeof cpu.usage).toBe('number');
    });
  });

  describe('External APIs', () => {
    it('should check external APIs', async () => {
      const response = await request(app.server)
        .get('/api/observability/external-apis')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      
      if (response.body.data.length > 0) {
        const api = response.body.data[0];
        expect(api).toHaveProperty('name');
        expect(api).toHaveProperty('status');
      }
    });
  });

  describe('Alerts', () => {
    it('should return active alerts', async () => {
      const response = await request(app.server)
        .get('/api/observability/alerts')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('active');
    });
  });

  describe('Protection Systems', () => {
    it('should return cache metrics', async () => {
      const response = await request(app.server)
        .get('/api/observability/metrics/cache')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('hitCount');
    });

    it('should return rate limit metrics', async () => {
      const response = await request(app.server)
        .get('/api/observability/metrics/rate-limit')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalRequests');
    });
  });
});
