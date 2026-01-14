
import { PrismaClient, Role, TenantStatus, DesignSystemType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// --- TYPES (Ported from apps/api/src/types) ---

export type InternalRole = 
  | 'ARCHITECT'   // Super Admin
  | 'SUPPORT'     // Customer Success
  | 'FINANCE'     // CFO
  | 'MARKETING'   // Growth
  | 'DEVOPS';     // System Health

export interface UserMetadata {
  internalRole?: InternalRole;
  permissions?: string[];
  preferences?: {
    theme?: 'light' | 'dark';
    language?: 'pt-BR' | 'en-US';
  };
}

export const INTERNAL_ROLE_PERMISSIONS: Record<InternalRole, string[]> = {
  ARCHITECT: ['*'],
  SUPPORT: [
    'view:tenants', 'view:users', 'action:impersonate', 'action:reset_2fa', 'view:audit_logs'
  ],
  FINANCE: [
    'view:banking_dashboard', 'manage:stripe_plans', 'action:refund', 'view:invoices', 'view:subscriptions', 'manage:payments'
  ],
  MARKETING: [
    'view:analytics', 'manage:crm', 'manage:referrals', 'action:send_broadcast', 'view:user_metrics'
  ],
  DEVOPS: [
    'view:grafana', 'view:logs', 'view:health_check', 'view:audit_logs', 'view:security_logs'
  ]
};

// --- CONFIG ---

const SEED_CONFIG = {
  companyName: 'Kaven HQ',
  adminEmail: 'admin@kaven.dev',
  adminPassword: 'Admin@123',
  modules: {
    createFinance: true,
    createSupport: true,
    createMarketing: true,
    createDevOps: true
  }
};

// --- LOGIC ---

async function main() {
  console.log('🌱 Kaven Boilerplate - Robust Database Seeding');
  console.log('=============================================');
  console.log('📋 Config:', SEED_CONFIG.companyName);

  // 0. Platform Config
  await prisma.platformConfig.upsert({
    where: { id: 'default-config' },
    update: {},
    create: {
      id: 'default-config',
      companyName: SEED_CONFIG.companyName,
      description: 'The Ultimate SaaS Boilerplate',
      primaryColor: '#00A76F',
      logoUrl: '/logo.svg',
      faviconUrl: '/favicon.ico',
      language: 'pt-BR',
      currency: 'BRL',
      numberFormat: '1.000,00',
      timezone: 'UTC',
      dateFormat: 'Y-m-d',
      timeFormat: 'g:i A',
    }
  });
  console.log('✅ Platform Config ensured.');

  // 0.1 Currencies
  const currencies = [
    // Moedas Fiat
    {
      code: 'BRL',
      name: 'Real Brasileiro',
      symbol: 'R$',
      iconType: 'TEXT' as const,
      decimals: 2,
      isActive: true,
      isCrypto: false,
      sortOrder: 1,
    },
    {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      iconType: 'TEXT' as const,
      decimals: 2,
      isActive: true,
      isCrypto: false,
      sortOrder: 2,
    },
    {
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
      iconType: 'TEXT' as const,
      decimals: 2,
      isActive: true,
      isCrypto: false,
      sortOrder: 3,
    },
    {
      code: 'GBP',
      name: 'British Pound',
      symbol: '£',
      iconType: 'TEXT' as const,
      decimals: 2,
      isActive: true,
      isCrypto: false,
      sortOrder: 4,
    },
    // Criptomoedas
    {
      code: 'SATS',
      name: 'Bitcoin (sats)',
      symbol: null,
      iconType: 'SVG' as const,
      iconSvgPath: 'M12.75 3V5.5H11.25V3H12.75ZM17 8.75H7V7.25H17V8.75ZM17 12.7499H7V11.2499H17V12.7499ZM17 16.75H7V15.25H17V16.75ZM12.75 18.5V21H11.25V18.5H12.75Z',
      decimals: 0,
      isActive: true,
      isCrypto: true,
      sortOrder: 10,
      metadata: {
        coingeckoId: 'bitcoin',
        tradingviewSymbol: 'BTC',
        satsPerBtc: 100000000, // 1 BTC = 100 milhões de sats
      },
    },
    {
      code: 'USDT',
      name: 'Tether',
      symbol: null,
      iconType: 'SVG' as const,
      iconSvgPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.08-2.26-.39-2.26-.82 0-.39.39-.66 1.03-.66.64 0 1.12.2 1.44.61.06.08.15.13.25.13h.83c.13 0 .24-.11.24-.24v-.02c-.03-.53-.32-1.03-.83-1.36v-.91c0-.13-.11-.24-.24-.24h-.83c-.13 0-.24.11-.24.24v.85c-.79.13-1.42.66-1.42 1.42 0 .91.66 1.48 2.25 1.56 1.77.08 2.14.48 2.14.87 0 .39-.39.79-1.29.79-.9 0-1.51-.27-1.77-.79-.05-.08-.13-.13-.22-.13h-.89c-.13 0-.24.11-.24.24v.03c.11.7.59 1.29 1.53 1.52v.9c0 .13.11.24.24.24h.83c.13 0 .24-.11.24-.24v-.88c.79-.13 1.42-.66 1.42-1.45 0-1.18-.95-1.54-2.37-1.62z',
      decimals: 2,
      isActive: true,
      isCrypto: true,
      sortOrder: 11,
      metadata: {
        coingeckoId: 'tether',
        tradingviewSymbol: 'USDT',
      },
    },
  ];

  for (const currency of currencies) {
    await prisma.currency.upsert({
      where: { code: currency.code },
      update: {},
      create: currency,
    });
  }
  console.log('✅ Currencies seeded (BRL, USD, EUR, GBP, SATS, USDT).');

  // 1. Admin Tenant
  const adminTenant = await prisma.tenant.upsert({
    where: { slug: 'admin' },
    update: { name: SEED_CONFIG.companyName, status: TenantStatus.ACTIVE },
    create: {
      name: SEED_CONFIG.companyName,
      slug: 'admin',
      domain: 'admin.kaven.dev',
      status: TenantStatus.ACTIVE
    }
  });
  console.log(`✅ Admin Tenant ensured: ${adminTenant.name}`);

  // 2. Architect (Super Admin)
  const architectHash = await bcrypt.hash(SEED_CONFIG.adminPassword, 12);
  const architectMeta: UserMetadata = {
    internalRole: 'ARCHITECT',
    permissions: INTERNAL_ROLE_PERMISSIONS.ARCHITECT,
    preferences: { theme: 'dark', language: 'pt-BR' }
  };

  const architect = await prisma.user.upsert({
    where: { email: SEED_CONFIG.adminEmail },
    update: { 
        password: architectHash, 
        metadata: architectMeta as any,
        role: Role.SUPER_ADMIN 
    },
    create: {
      email: SEED_CONFIG.adminEmail,
      name: 'The Architect',
      password: architectHash,
      role: Role.SUPER_ADMIN,
      tenantId: adminTenant.id,
      metadata: architectMeta as any,
      emailVerified: true,
      emailVerifiedAt: new Date(),
      status: 'ACTIVE',
      designSystemCustomization: {
        create: {
            designSystem: DesignSystemType.SHADCN,
            mode: 'dark',
            colorPrimary: '#00A76F'
        }
      }
    }
  });
  console.log(`✅ ARCHITECT seeded: ${architect.email}`);

  // 3. Personas
  const personas = [
    {
      if: SEED_CONFIG.modules.createFinance,
      email: 'finance@admin.com',
      name: 'CFO - Finance Team',
      role: 'FINANCE',
      pass: 'Finance@123',
      theme: 'light'
    },
    {
      if: SEED_CONFIG.modules.createSupport,
      email: 'support@admin.com',
      name: 'Customer Success Team',
      role: 'SUPPORT',
      pass: 'Support@123',
      theme: 'light'
    },
    {
      if: SEED_CONFIG.modules.createMarketing,
      email: 'marketing@admin.com',
      name: 'Growth - Marketing Team',
      role: 'MARKETING',
      pass: 'Marketing@123',
      theme: 'light'
    },
    {
      if: SEED_CONFIG.modules.createDevOps,
      email: 'devops@admin.com',
      name: 'DevOps - System Health',
      role: 'DEVOPS',
      pass: 'DevOps@123',
      theme: 'dark'
    }
  ];

  for (const p of personas) {
    if (!p.if) continue;

    const hash = await bcrypt.hash(p.pass, 12);
    const meta: UserMetadata = {
        internalRole: p.role as InternalRole,
        permissions: INTERNAL_ROLE_PERMISSIONS[p.role as InternalRole],
        preferences: { theme: p.theme as any, language: 'pt-BR' }
    };

    await prisma.user.upsert({
        where: { email: p.email },
        update: { metadata: meta as any },
        create: {
            email: p.email,
            name: p.name,
            password: hash,
            role: Role.TENANT_ADMIN,
            tenantId: adminTenant.id,
            metadata: meta as any,
            emailVerified: true,
            emailVerifiedAt: new Date(),
            status: 'ACTIVE'
        }
    });
    console.log(`✅ Persona ${p.role} ensured: ${p.email}`);
  }

  // 4. Features & Plans
  // 4.1 Features
  const usersFeature = await prisma.feature.upsert({
    where: { code: 'USERS' }, 
    update: {},
    create: { code: 'USERS', name: 'Usuários', description: 'Limite de usuários ativos', type: 'QUOTA', unit: 'users', category: 'general', sortOrder: 1 }
  });
  
  const storageFeature = await prisma.feature.upsert({
    where: { code: 'STORAGE' }, 
    update: {},
    create: { code: 'STORAGE', name: 'Armazenamento', description: 'Espaço em disco', type: 'QUOTA', unit: 'GB', category: 'general', sortOrder: 2 }
  });

  // 4.2 Plans (Using findFirst logic to avoid nullable key issues)
  const plans = [
      { 
          code: 'free', name: 'Free', price: 0, 
          features: [{ id: usersFeature.id, limit: 3 }, { id: storageFeature.id, limit: 1 }] 
      },
      { 
          code: 'pro', name: 'Pro', price: 49.90, 
          features: [{ id: usersFeature.id, limit: 10 }, { id: storageFeature.id, limit: 10 }] 
      },
      { 
          code: 'enterprise', name: 'Enterprise', price: 199.90, 
          features: [{ id: usersFeature.id, limit: -1 }, { id: storageFeature.id, limit: 100 }] 
      }
  ];

  for (const plan of plans) {
    const existing = await prisma.plan.findFirst({
        where: { code: plan.code, tenantId: null }
    });

    if (!existing) {
        await prisma.plan.create({
            data: {
                code: plan.code,
                name: plan.name,
                description: `${plan.name} Plan`,
                isActive: true,
                isPublic: true,
                features: {
                    create: plan.features.map(f => ({ featureId: f.id, limitValue: f.limit }))
                },
                prices: {
                    create: [
                        { interval: 'MONTHLY', amount: plan.price, currency: 'BRL' }
                    ]
                }
            }
        });
        console.log(`✅ Plan created: ${plan.name}`);
    } else {
        console.log(`ℹ️ Plan exists: ${plan.name}`);
    }
  }

  // 5. Spaces & Assignments (Tenant App Features)
  const SPACES = [
      { code: 'ADMIN', name: 'Admin', icon: 'Crown', color: 'purple' },
      { code: 'FINANCE', name: 'Finance', icon: 'DollarSign', color: 'green' },
      { code: 'SUPPORT', name: 'Support', icon: 'Headphones', color: 'blue' },
      { code: 'MARKETING', name: 'Marketing', icon: 'TrendingUp', color: 'orange' },
      { code: 'DEVOPS', name: 'DevOps', icon: 'Server', color: 'red' }
  ];

  for (const s of SPACES) {
      const space = await prisma.space.upsert({
          where: { tenantId_code: { tenantId: adminTenant.id, code: s.code } },
          update: {},
          create: {
              tenantId: adminTenant.id,
              code: s.code,
              name: s.name,
              icon: s.icon,
              color: s.color,
              defaultPermissions: []
          }
      });
      console.log(`✅ Space ensured: ${s.name} (${space.id})`);

      // Assign users based on Role-to-Space mapping
      // ARCHITECT -> ALL
      // FINANCE User -> FINANCE Space
      
      // 5.1 Assign Architect to ALL spaces
      await prisma.userSpace.upsert({
          where: { userId_spaceId: { userId: architect.id, spaceId: space.id } },
          update: {},
          create: { userId: architect.id, spaceId: space.id, customPermissions: ['*'] }
      });

      // 5.2 Assign Persona Users
      const targetRole = s.code as InternalRole;
      if (['FINANCE', 'SUPPORT', 'MARKETING', 'DEVOPS'].includes(targetRole)) {
          // Find the user for this role
          const personaUser = await prisma.user.findFirst({
             where: { email: `${targetRole.toLowerCase()}@admin.com` }
          });

          if (personaUser) {
              await prisma.userSpace.upsert({
                  where: { userId_spaceId: { userId: personaUser.id, spaceId: space.id } },
                  update: {},
                  create: { userId: personaUser.id, spaceId: space.id, customPermissions: [] }
              });
              console.log(`   Linked ${personaUser.email} to ${s.name}`);
          }
      }
  }

  console.log('\n=============================================');
  console.log('✅ Seed Finished Successfully');
  await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
