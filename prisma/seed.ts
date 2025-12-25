import { PrismaClient, Role, TenantStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { SeedConfig, DEFAULT_SEED_CONFIG } from '../apps/api/src/types/seed-config';
import { UserMetadata, INTERNAL_ROLE_PERMISSIONS } from '../apps/api/src/types/user-metadata';

const prisma = new PrismaClient();

/**
 * Seed principal - Aceita configuração customizada
 * Usado para popular o banco de dados inicial com Admin Tenant e usuários
 */
async function seedDatabase(config: SeedConfig = DEFAULT_SEED_CONFIG) {
  console.log('🌱 Starting seed with config:', config.companyName);
  console.log('📋 Mode:', config.mode);
  console.log('👥 Modules:', config.modules);
  
  try {
    // 1. Criar Admin Tenant
    console.log('\n📦 Creating Admin Tenant...');
    const adminTenant = await createAdminTenant(config);
    console.log('✅ Admin Tenant created:', adminTenant.name);
    
    // 2. Criar SUPER_ADMIN (obrigatório)
    console.log('\n👑 Creating ARCHITECT (Super Admin)...');
    const architect = await createArchitect(adminTenant.id, config);
    console.log('✅ ARCHITECT created:', architect.email);
    
    // 3. Criar personas condicionais
    if (config.modules.createFinance) {
      console.log('\n💰 Creating FINANCE user...');
      const finance = await createFinanceUser(adminTenant.id);
      console.log('✅ FINANCE created:', finance.email);
    }
    
    if (config.modules.createSupport) {
      console.log('\n🛡️ Creating SUPPORT user...');
      const support = await createSupportUser(adminTenant.id);
      console.log('✅ SUPPORT created:', support.email);
    }
    
    if (config.modules.createMarketing) {
      console.log('\n📈 Creating MARKETING user...');
      const marketing = await createMarketingUser(adminTenant.id);
      console.log('✅ MARKETING created:', marketing.email);
    }
    
    if (config.modules.createDevOps) {
      console.log('\n👨‍💻 Creating DEVOPS user...');
      const devops = await createDevOpsUser(adminTenant.id);
      console.log('✅ DEVOPS created:', devops.email);
    }
    
    console.log('\n✅ Seed completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Admin Tenant: ${adminTenant.name}`);
    console.log(`   - ARCHITECT: ${architect.email}`);
    if (config.modules.createFinance) console.log('   - FINANCE: finance@admin.com');
    if (config.modules.createSupport) console.log('   - SUPPORT: support@admin.com');
    if (config.modules.createMarketing) console.log('   - MARKETING: marketing@admin.com');
    if (config.modules.createDevOps) console.log('   - DEVOPS: devops@admin.com');
    
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Cria o Admin Tenant (Kaven HQ)
 */
async function createAdminTenant(config: SeedConfig) {
  return await prisma.tenant.upsert({
    where: { slug: 'admin' },
    update: {
      name: config.companyName,
      status: TenantStatus.ACTIVE
    },
    create: {
      name: config.companyName,
      slug: 'admin',
      domain: 'admin.kaven.dev',
      status: TenantStatus.ACTIVE
    }
  });
}

/**
 * Cria o ARCHITECT (SUPER_ADMIN) - Obrigatório
 */
async function createArchitect(tenantId: string, config: SeedConfig) {
  const hashedPassword = await bcrypt.hash(config.adminPassword, 12);
  
  const metadata: UserMetadata = {
    internalRole: 'ARCHITECT',
    permissions: INTERNAL_ROLE_PERMISSIONS.ARCHITECT,
    preferences: {
      theme: 'dark',
      language: 'pt-BR'
    }
  };
  
  return await prisma.user.upsert({
    where: { email: config.adminEmail },
    update: {
      password: hashedPassword,
      metadata: metadata as any
    },
    create: {
      email: config.adminEmail,
      name: 'The Architect',
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      tenantId: tenantId,
      metadata: metadata as any,
      emailVerified: true,
      emailVerifiedAt: new Date()
    }
  });
}

/**
 * Cria o usuário FINANCE (CFO) - Condicional
 */
async function createFinanceUser(tenantId: string) {
  const hashedPassword = await bcrypt.hash('Finance@123', 12);
  
  const metadata: UserMetadata = {
    internalRole: 'FINANCE',
    permissions: INTERNAL_ROLE_PERMISSIONS.FINANCE,
    preferences: {
      theme: 'light',
      language: 'pt-BR'
    }
  };
  
  return await prisma.user.upsert({
    where: { email: 'finance@admin.com' },
    update: {
      metadata: metadata as any
    },
    create: {
      email: 'finance@admin.com',
      name: 'CFO - Finance Team',
      password: hashedPassword,
      role: Role.TENANT_ADMIN,
      tenantId: tenantId,
      metadata: metadata as any,
      emailVerified: true,
      emailVerifiedAt: new Date()
    }
  });
}

/**
 * Cria o usuário SUPPORT (Customer Success) - Condicional
 */
async function createSupportUser(tenantId: string) {
  const hashedPassword = await bcrypt.hash('Support@123', 12);
  
  const metadata: UserMetadata = {
    internalRole: 'SUPPORT',
    permissions: INTERNAL_ROLE_PERMISSIONS.SUPPORT,
    preferences: {
      theme: 'light',
      language: 'pt-BR'
    }
  };
  
  return await prisma.user.upsert({
    where: { email: 'support@admin.com' },
    update: {
      metadata: metadata as any
    },
    create: {
      email: 'support@admin.com',
      name: 'Customer Success Team',
      password: hashedPassword,
      role: Role.TENANT_ADMIN,
      tenantId: tenantId,
      metadata: metadata as any,
      emailVerified: true,
      emailVerifiedAt: new Date()
    }
  });
}

/**
 * Cria o usuário MARKETING (Growth) - Condicional
 */
async function createMarketingUser(tenantId: string) {
  const hashedPassword = await bcrypt.hash('Marketing@123', 12);
  
  const metadata: UserMetadata = {
    internalRole: 'MARKETING',
    permissions: INTERNAL_ROLE_PERMISSIONS.MARKETING,
    preferences: {
      theme: 'light',
      language: 'pt-BR'
    }
  };
  
  return await prisma.user.upsert({
    where: { email: 'marketing@admin.com' },
    update: {
      metadata: metadata as any
    },
    create: {
      email: 'marketing@admin.com',
      name: 'Growth - Marketing Team',
      password: hashedPassword,
      role: Role.TENANT_ADMIN,
      tenantId: tenantId,
      metadata: metadata as any,
      emailVerified: true,
      emailVerifiedAt: new Date()
    }
  });
}

/**
 * Cria o usuário DEVOPS (System Health) - Condicional
 */
async function createDevOpsUser(tenantId: string) {
  const hashedPassword = await bcrypt.hash('DevOps@123', 12);
  
  const metadata: UserMetadata = {
    internalRole: 'DEVOPS',
    permissions: INTERNAL_ROLE_PERMISSIONS.DEVOPS,
    preferences: {
      theme: 'dark',
      language: 'pt-BR'
    }
  };
  
  return await prisma.user.upsert({
    where: { email: 'devops@admin.com' },
    update: {
      metadata: metadata as any
    },
    create: {
      email: 'devops@admin.com',
      name: 'DevOps - System Health',
      password: hashedPassword,
      role: Role.TENANT_ADMIN,
      tenantId: tenantId,
      metadata: metadata as any,
      emailVerified: true,
      emailVerifiedAt: new Date()
    }
  });
}

// Executar seed
seedDatabase()
  .catch((error) => {
    console.error('Fatal error during seed:', error);
    process.exit(1);
  });
