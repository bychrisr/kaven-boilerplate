import { beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { execSync } from 'child_process';

// Global test database and Redis instances
let testPrisma: PrismaClient;
let testRedis: Redis;

// Test database URL - using a separate test database
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://kaven:kaven123@localhost:5433/kaven_test';
const TEST_REDIS_URL = process.env.TEST_REDIS_URL || 'redis://localhost:6379/1'; // Using DB 1 for tests

beforeAll(async () => {
  // Initialize test database connection
  testPrisma = new PrismaClient({
    datasources: {
      db: {
        url: TEST_DATABASE_URL,
      },
    },
  });

  // Initialize test Redis connection
  testRedis = new Redis(TEST_REDIS_URL);

  // Connect to test database
  await testPrisma.$connect();
  await testRedis.ping();

  // Reset test database
  await resetTestDatabase();
});

afterAll(async () => {
  // Clean up test database
  await testPrisma.$disconnect();
  testRedis.disconnect();
});

beforeEach(async () => {
  // Clean database before each test
  await cleanDatabase();
});

afterEach(async () => {
  // Clean Redis cache after each test
  await testRedis.flushdb();
});

/**
 * Reset the test database by running migrations
 */
async function resetTestDatabase() {
  try {
    // Run Prisma migrations on test database
    execSync(`npx prisma migrate deploy --schema=./prisma/schema.prisma`, {
      env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
      stdio: 'inherit',
    });
  } catch (error) {
    console.warn('Failed to run migrations on test database:', error);
  }
}

/**
 * Clean all data from test database
 */
async function cleanDatabase() {
  // Delete in order to respect foreign key constraints
  await testPrisma.metric.deleteMany();
  await testPrisma.user.deleteMany();
  await testPrisma.tenant.deleteMany();
  await testPrisma.plan.deleteMany();
}

/**
 * Seed test database with initial data
 */
export async function seedTestDatabase() {
  // Create test plans
  const basicPlan = await testPrisma.plan.create({
    data: {
      id: 'test-plan-basic',
      name: 'Basic Plan',
      description: 'Basic plan for testing',
      features: { max_users: 5, storage_gb: 1 },
      price: 9.99,
    },
  });

  const premiumPlan = await testPrisma.plan.create({
    data: {
      id: 'test-plan-premium',
      name: 'Premium Plan',
      description: 'Premium plan for testing',
      features: { max_users: 50, storage_gb: 10 },
      price: 29.99,
    },
  });

  // Create test tenants
  const tenant1 = await testPrisma.tenant.create({
    data: {
      id: 'test-tenant-1',
      name: 'Test Tenant 1',
      subdomain: 'test1',
      plan_id: basicPlan.id,
    },
  });

  const tenant2 = await testPrisma.tenant.create({
    data: {
      id: 'test-tenant-2',
      name: 'Test Tenant 2',
      subdomain: 'test2',
      plan_id: premiumPlan.id,
    },
  });

  // Create test users
  const adminUser = await testPrisma.user.create({
    data: {
      id: 'test-user-admin',
      email: 'admin@test.com',
      password_hash: '$2b$10$test.hash.for.admin.user',
      first_name: 'Admin',
      last_name: 'User',
      is_adm: true,
      tenant_id: tenant1.id,
    },
  });

  const regularUser = await testPrisma.user.create({
    data: {
      id: 'test-user-regular',
      email: 'user@test.com',
      password_hash: '$2b$10$test.hash.for.regular.user',
      first_name: 'Regular',
      last_name: 'User',
      is_adm: false,
      tenant_id: tenant1.id,
    },
  });

  const userFromOtherTenant = await testPrisma.user.create({
    data: {
      id: 'test-user-other-tenant',
      email: 'other@test.com',
      password_hash: '$2b$10$test.hash.for.other.tenant.user',
      first_name: 'Other',
      last_name: 'User',
      is_adm: false,
      tenant_id: tenant2.id,
    },
  });

  // Create test metrics
  await testPrisma.metric.createMany({
    data: [
      {
        id: 'test-metric-1',
        tenant_id: tenant1.id,
        metric_name: 'api_requests',
        value: 100,
        timestamp: new Date('2024-01-01T10:00:00Z'),
        labels: { endpoint: '/api/users', status_code: '200' },
      },
      {
        id: 'test-metric-2',
        tenant_id: tenant1.id,
        metric_name: 'api_requests',
        value: 50,
        timestamp: new Date('2024-01-01T11:00:00Z'),
        labels: { endpoint: '/api/auth', status_code: '200' },
      },
      {
        id: 'test-metric-3',
        tenant_id: tenant2.id,
        metric_name: 'api_requests',
        value: 75,
        timestamp: new Date('2024-01-01T12:00:00Z'),
        labels: { endpoint: '/api/metrics', status_code: '200' },
      },
    ],
  });

  return {
    plans: { basic: basicPlan, premium: premiumPlan },
    tenants: { tenant1, tenant2 },
    users: { admin: adminUser, regular: regularUser, otherTenant: userFromOtherTenant },
  };
}

/**
 * Create a test JWT token
 */
export function createTestJWT(payload: { id: string; tenantId: string; isAdm: boolean }) {
  // This is a mock JWT for testing - in real tests, you'd use the actual JWT library
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = 'test-signature';
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Get test database instance
 */
export function getTestPrisma() {
  return testPrisma;
}

/**
 * Get test Redis instance
 */
export function getTestRedis() {
  return testRedis;
}

/**
 * Mock request object for testing
 */
export function createMockRequest(overrides: any = {}) {
  return {
    user: null,
    tenantId: null,
    ip: '127.0.0.1',
    method: 'GET',
    url: '/test',
    headers: {},
    query: {},
    params: {},
    body: {},
    ...overrides,
  };
}

/**
 * Mock reply object for testing
 */
export function createMockReply() {
  const reply = {
    code: vi.fn().mockReturnThis(),
    status: vi.fn().mockReturnThis(),
    header: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
    type: vi.fn().mockReturnThis(),
    sent: false,
  };
  
  return reply;
}

// Export test utilities
export {
  testPrisma,
  testRedis,
  TEST_DATABASE_URL,
  TEST_REDIS_URL,
};
