
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
      code: 'BTC',
      name: 'Bitcoin',
      symbol: '₿',
      iconType: 'SVG' as const,
      // SVG path extraído do bitcoin-btc-logo.svg (monocromático)
      iconSvgPath: 'M23.638 14.904c-273.24 1096.01-1383.32 1763.02-2479.46 1489.71-1095.68-273.24-1762.69-1383.39-1489.33-2479.31 273.12-1096.13 1383.2-1763.19 2479-1489.95 1096.06 273.24 1763.03 1383.51 1489.76 2479.57l.02-.02zm-1082.29-786.39c40.72-272.26-166.56-418.61-450-516.24l91.95-368.8-224.5-55.94-89.51 359.09c-59.02-14.72-119.63-28.59-179.87-42.34l90.16-361.46-224.36-55.94-92 368.68c-48.84-11.12-96.81-22.11-143.35-33.69l.26-1.16-309.59-77.31-59.72 239.78s166.56 38.18 163.05 40.53c90.91 22.69 107.35 82.87 104.62 130.57l-104.74 420.15c6.26 1.59 14.38 3.89 23.34 7.49-7.49-1.86-15.46-3.89-23.73-5.87l-146.81 588.57c-11.11 27.62-39.31 69.07-102.87 53.33 2.25 3.26-163.17-40.72-163.17-40.72l-111.46 256.98 292.15 72.83c54.35 13.63 107.61 27.89 160.06 41.3l-92.9 373.03 224.24 55.94 92-369.07c61.26 16.63 120.71 31.97 178.91 46.43l-91.69 367.33 224.51 55.94 92.89-372.33c382.82 72.45 670.67 43.24 791.83-303.02 97.63-278.78-4.86-439.58-206.26-544.44 146.69-33.83 257.18-130.31 286.64-329.61l-.07-.05zm-512.93 719.26c-69.38 278.78-538.76 128.08-690.94 90.29l123.28-494.2c152.17 37.99 640.17 113.17 567.67 403.91zm69.43-723.3c-63.29 253.58-453.96 124.75-580.69 93.16l111.77-448.21c126.73 31.59 534.85 90.55 468.94 355.05l-.02 0z',
      decimals: 8,
      isActive: true,
      isCrypto: true,
      sortOrder: 10,
      metadata: {
        coingeckoId: 'bitcoin',
        tradingviewSymbol: 'BTC',
      },
    },
    {
      code: 'SATS',
      name: 'Bitcoin (sats)',
      symbol: null,
      iconType: 'SVG' as const,
      iconSvgPath: 'M12.75 3V5.5H11.25V3H12.75ZM17 8.75H7V7.25H17V8.75ZM17 12.7499H7V11.2499H17V12.7499ZM17 16.75H7V15.25H17V16.75ZM12.75 18.5V21H11.25V18.5H12.75Z',
      decimals: 0, // Sats sempre inteiro
      isActive: true,
      isCrypto: true,
      sortOrder: 11,
      metadata: {
        coingeckoId: 'bitcoin',
        tradingviewSymbol: 'BTC',
        satsPerBtc: 100000000, // 1 BTC = 100 milhões de sats
        displayUnit: 'sats', // Indica que é unidade de display, não moeda base
      },
    },
    {
      code: 'USDT',
      name: 'Tether',
      symbol: '₮',
      iconType: 'SVG' as const,
      // SVG path extraído do tether-usdt-logo.svg (monocromático)
      iconSvgPath: 'M62.15 1.45l-61.89 130a2.52 2.52 0 00.54 2.94L167.95 294.56a2.55 2.55 0 003.53 0L338.63 134.4a2.52 2.52 0 00.54-2.94l-61.89-130A2.5 2.5 0 00275 0H64.45a2.5 2.5 0 00-2.3 1.45h0zm129.04 143.35v0c-1.2.09-7.4.46-21.23.46-11 0-18.81-.33-21.55-.46v0c-42.51-1.87-74.24-9.27-74.24-18.13s31.73-16.25 74.24-18.15v28.91c2.78.2 10.74.67 21.74.67 13.2 0 19.81-.55 21-.66v-28.9c42.42 1.89 74.08 9.29 74.08 18.13s-31.65 16.24-74.08 18.12h0zm0-39.25V79.68h59.2V40.23H89.21v39.45h59.19v25.86c-48.11 2.21-84.29 11.74-84.29 23.16s36.18 20.94 84.29 23.16v82.9h42.78v-82.93c48-2.21 84.12-11.73 84.12-23.14s-36.09-20.93-84.12-23.15h0zm0 0h0z',
      decimals: 2,
      isActive: true,
      isCrypto: true,
      sortOrder: 12,
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
