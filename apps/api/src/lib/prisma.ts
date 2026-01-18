import { PrismaClient } from '@prisma/client';
import { env } from '../config/env';
import { secureLog } from '../utils/secure-logger';

// Singleton pattern para Prisma Client
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'stdout', level: 'error' },
      { emit: 'stdout', level: 'info' },
      { emit: 'stdout', level: 'warn' },
    ],
  });

// @ts-ignore
prisma.$on('query', (e: any) => {
  secureLog.debug('[DB_QUERY]', {
    query: e.query,
    params: e.params,
    duration: `${e.duration}ms`,
  });
});

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// ===========================
// PRISMA RLS MIDDLEWARE
// ===========================
// Row-Level Security: Auto-injeta tenantId em queries para garantir isolamento

// Modelos que têm tenantId e devem ter RLS aplicado
const TENANT_SCOPED_MODELS = [
  'User',
  'Subscription',
  'Invoice',
  'Order',
  'AuditLog',
  'EmailQueue',
  'EmailEvent',
  // Adicione outros modelos conforme necessário
];

// Middleware para auto-injetar tenantId
prisma.$use(async (params, next) => {
  // Pega tenantId do contexto (será setado via middleware HTTP)
  const tenantId = (params as any).tenantId;
  
  // Se não há tenantId ou modelo não é tenant-scoped, continua normalmente
  if (!tenantId || !TENANT_SCOPED_MODELS.includes(params.model || '')) {
    return next(params);
  }

  // Aplica filtro de tenantId em queries
  if (params.action === 'findUnique' || params.action === 'findFirst') {
    params.action = 'findFirst';
    params.args.where = {
      ...params.args.where,
      tenantId,
    };
  }

  if (params.action === 'findMany') {
    if (params.args.where) {
      if (params.args.where.tenantId === undefined) {
        params.args.where.tenantId = tenantId;
      }
    } else {
      params.args.where = { tenantId };
    }
  }

  if (params.action === 'update') {
    params.args.where = {
      ...params.args.where,
      tenantId,
    };
  }

  if (params.action === 'updateMany') {
    if (params.args.where) {
      params.args.where.tenantId = tenantId;
    } else {
      params.args.where = { tenantId };
    }
  }

  if (params.action === 'delete') {
    params.args.where = {
      ...params.args.where,
      tenantId,
    };
  }

  if (params.action === 'deleteMany') {
    if (params.args.where) {
      params.args.where.tenantId = tenantId;
    } else {
      params.args.where = { tenantId };
    }
  }

  if (params.action === 'create') {
    if (params.args.data.tenantId === undefined) {
      params.args.data.tenantId = tenantId;
    }
  }

  if (params.action === 'createMany') {
    if (Array.isArray(params.args.data)) {
      params.args.data = params.args.data.map((item: any) => ({
        ...item,
        tenantId: item.tenantId || tenantId,
      }));
    }
  }

  return next(params);
});

export default prisma;
