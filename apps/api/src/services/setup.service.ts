import { PrismaClient, Role, TenantStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { SeedConfig } from '../types/seed-config';
import { UserMetadata, INTERNAL_ROLE_PERMISSIONS } from '../types/user-metadata';

const prisma = new PrismaClient();

/**
 * Setup Service
 * Serviço reutilizável para configuração inicial do sistema
 * Pode ser usado tanto via CLI (seed.ts) quanto via API (/api/setup/init)
 */
// Default password for seed users if not provided in env
const DEFAULT_SEED_PASSWORD = process.env.SEED_DEFAULT_PASSWORD || 'Dev@123456';

export class SetupService {
  /**
   * Executa o seed completo do banco de dados
   * @param config Configuração do setup
   * @returns Tenant e usuários criados
   */
  static async seedDatabase(config: SeedConfig) {
    console.log('🌱 Starting seed with config:', config.companyName);
    console.log('📋 Mode:', config.mode);
    console.log('👥 Modules:', config.modules);
    
    try {
      // 1. Criar Admin Tenant
      console.log('\n📦 Creating Admin Tenant...');
      const adminTenant = await this.createAdminTenant(config);
      console.log('✅ Admin Tenant created:', adminTenant.name);
      
      // 2. Criar SUPER_ADMIN (obrigatório)
      console.log('\n👑 Creating ARCHITECT (Super Admin)...');
      const architect = await this.createArchitect(adminTenant.id, config);
      console.log('✅ ARCHITECT created:', architect.email);
      
      const users = [architect];
      
      // 3. Criar personas condicionais
      if (config.modules.createFinance) {
        console.log('\n💰 Creating FINANCE user...');
        const finance = await this.createFinanceUser(adminTenant.id);
        console.log('✅ FINANCE created:', finance.email);
        users.push(finance);
      }
      
      if (config.modules.createSupport) {
        console.log('\n🛡️ Creating SUPPORT user...');
        const support = await this.createSupportUser(adminTenant.id);
        console.log('✅ SUPPORT created:', support.email);
        users.push(support);
      }
      
      if (config.modules.createMarketing) {
        console.log('\n📈 Creating MARKETING user...');
        const marketing = await this.createMarketingUser(adminTenant.id);
        console.log('✅ MARKETING created:', marketing.email);
        users.push(marketing);
      }
      
      if (config.modules.createDevOps) {
        console.log('\n👨‍💻 Creating DEVOPS user...');
        const devops = await this.createDevOpsUser(adminTenant.id);
        console.log('✅ DEVOPS created:', devops.email);
        users.push(devops);
      }
      
      console.log('✅ Plans created successfully');
      
      // 5. Create Email Infrastructure
      console.log('\n📧 Seeding Email Infrastructure...');
      await this.seedEmailInfrastructure(config);
      console.log('✅ Email infrastructure seeded successfully');
      
      console.log('\n✅ Seed completed successfully!');
      console.log('📊 Summary:');
      console.log(`   - Admin Tenant: ${adminTenant.name}`);
      console.log(`   - Users created: ${users.length}`);
      users.forEach(user => console.log(`     - ${user.email} (${user.role})`));
      
      return {
        tenant: adminTenant,
        users
      };
      
    } catch (error) {
      console.error('❌ Seed failed:', error);
      throw error;
    }
  }
  
  /**
   * Cria o Admin Tenant (Kaven HQ)
   */
  private static async createAdminTenant(config: SeedConfig) {
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
  private static async createArchitect(tenantId: string, config: SeedConfig) {
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
  private static async createFinanceUser(tenantId: string) {
    const hashedPassword = await bcrypt.hash(DEFAULT_SEED_PASSWORD, 12);
    
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
  private static async createSupportUser(tenantId: string) {
    const hashedPassword = await bcrypt.hash(DEFAULT_SEED_PASSWORD, 12);
    
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
  private static async createMarketingUser(tenantId: string) {
    const hashedPassword = await bcrypt.hash(DEFAULT_SEED_PASSWORD, 12);
    
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
  private static async createDevOpsUser(tenantId: string) {
    const hashedPassword = await bcrypt.hash(DEFAULT_SEED_PASSWORD, 12);
    
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
  
  /**
   * Desconecta o Prisma Client
   */
  static async disconnect() {
    await prisma.$disconnect();
  }


  /**
   * Cria os Planos e Features iniciais
   */
  private static async createPlans(tenantId: string) {
    // 1. Create Features
    const usersFeature = await prisma.feature.upsert({
      where: { code: 'USERS' },
      update: {},
      create: {
        code: 'USERS',
        name: 'Usuários',
        description: 'Limite de usuários ativos',
        type: 'QUOTA',
        unit: 'users',
        category: 'general',
        sortOrder: 1
      }
    });

    const storageFeature = await prisma.feature.upsert({
      where: { code: 'STORAGE' },
      update: {},
      create: {
        code: 'STORAGE',
        name: 'Armazenamento',
        description: 'Espaço em disco',
        type: 'QUOTA',
        unit: 'GB',
        category: 'general',
        sortOrder: 2
      }
    });

    // 2. Create Plans
    
    // Helper for Global Plans
    const upsertGlobalPlan = async (data: any) => {
      const existing = await prisma.plan.findFirst({
        where: { code: data.code, tenantId: null }
      });
      
      if (existing) {
        console.log(`   - Plan ${data.name} already exists.`);
        return existing;
      }
      
      console.log(`   - Creating Plan ${data.name}...`);
      return await prisma.plan.create({
        data: {
          ...data,
          tenantId: null
        }
      });
    };

    // FREE
    const freePlan = await upsertGlobalPlan({
      code: 'free',
      name: 'Free',
      description: 'Para começar',
      isDefault: true,
      sortOrder: 1,
      features: {
        create: [
          { featureId: usersFeature.id, limitValue: 3 },
          { featureId: storageFeature.id, limitValue: 1 }
        ]
      },
      prices: {
        create: [
          { interval: 'MONTHLY', amount: 0, currency: 'BRL' },
          { interval: 'YEARLY', amount: 0, currency: 'BRL' }
        ]
      }
    });

    // PRO
    const proPlan = await upsertGlobalPlan({
      code: 'pro',
      name: 'Pro',
      description: 'Para times em crescimento',
      badge: 'Popular',
      sortOrder: 2,
      features: {
        create: [
          { featureId: usersFeature.id, limitValue: 10 },
          { featureId: storageFeature.id, limitValue: 10 }
        ]
      },
      prices: {
        create: [
          { interval: 'MONTHLY', amount: 49.90, currency: 'BRL' },
          { interval: 'YEARLY', amount: 499.00, currency: 'BRL', originalAmount: 598.80 }
        ]
      }
    });

    // ENTERPRISE
    const enterprisePlan = await upsertGlobalPlan({
      code: 'enterprise',
      name: 'Enterprise',
      description: 'Para grandes empresas',
      sortOrder: 3,
      features: {
        create: [
          { featureId: usersFeature.id, limitValue: -1 }, // Unlimited
          { featureId: storageFeature.id, limitValue: 100 }
        ]
      },
      prices: {
        create: [
          { interval: 'MONTHLY', amount: 199.90, currency: 'BRL' },
          { interval: 'YEARLY', amount: 1999.00, currency: 'BRL', originalAmount: 2398.80 }
        ]
      }
    });

    return { freePlan, proPlan, enterprisePlan };
  }

  /**
   * Seeds email infrastructure (templates and default integration)
   */
  private static async seedEmailInfrastructure(config: SeedConfig) {
    // 1. Create Default Email Templates
    const emailTemplates = [
      {
        code: 'welcome',
        name: 'Boas-vindas',
        type: 'TRANSACTIONAL' as const,
        subjectPt: 'Bem-vindo ao {{companyName}}!',
        subjectEn: 'Welcome to {{companyName}}!',
        htmlContentPt: '<p>Olá {{name}},</p><p>Bem-vindo à plataforma {{companyName}}!</p>',
        htmlContentEn: '<p>Hello {{name}},</p><p>Welcome to the {{companyName}} platform!</p>',
        variables: ['name', 'companyName'],
      },
      {
        code: 'email-verify',
        name: 'Verificação de E-mail',
        type: 'TRANSACTIONAL' as const,
        subjectPt: 'Confirme seu e-mail',
        subjectEn: 'Verify your email',
        htmlContentPt: '<p>Olá {{name}},</p><p>Clique no link para verificar seu e-mail: <a href="{{verificationUrl}}">Verificar E-mail</a></p>',
        htmlContentEn: '<p>Hello {{name}},</p><p>Click the link to verify your email: <a href="{{verificationUrl}}">Verify Email</a></p>',
        variables: ['name', 'verificationUrl'],
      },
      {
        code: 'password-reset',
        name: 'Redefinição de Senha',
        type: 'TRANSACTIONAL' as const,
        subjectPt: 'Redefinir sua senha',
        subjectEn: 'Reset your password',
        htmlContentPt: '<p>Olá {{name}},</p><p>Clique aqui para redefinir sua senha: <a href="{{resetUrl}}">Redefinir Senha</a></p>',
        htmlContentEn: '<p>Hello {{name}},</p><p>Click here to reset your password: <a href="{{resetUrl}}">Reset Password</a></p>',
        variables: ['name', 'resetUrl'],
      },
      {
        code: 'invoice',
        name: 'Fatura',
        type: 'TRANSACTIONAL' as const,
        subjectPt: 'Sua fatura de {{month}} está disponível',
        subjectEn: 'Your {{month}} invoice is available',
        htmlContentPt: '<p>Olá {{name}},</p><p>Sua fatura de {{month}} no valor de {{amount}} está disponível para pagamento.</p>',
        htmlContentEn: '<p>Hello {{name}},</p><p>Your {{month}} invoice for {{amount}} is available for payment.</p>',
        variables: ['name', 'month', 'amount'],
      }
    ];

    for (const template of emailTemplates) {
      await (prisma as any).emailTemplate.upsert({
        where: { code: template.code },
        update: {},
        create: {
          code: template.code,
          name: template.name,
          type: template.type,
          subjectPt: template.subjectPt,
          subjectEn: template.subjectEn,
          htmlContentPt: template.htmlContentPt,
          htmlContentEn: template.htmlContentEn,
          variables: template.variables as any,
          status: 'ACTIVE'
        }
      });
    }
    console.log('   ✅ Default email templates ensured.');

    // 2. Create Default Email Integration (SMTP Fallback/Dev)
    // Use upsert with unique constraint on isPrimary if possible, or just check existence
    const existingPrimary = await (prisma as any).emailIntegration.findFirst({
      where: { isPrimary: true }
    });

    if (!existingPrimary) {
      await (prisma as any).emailIntegration.create({
        data: {
          provider: 'SMTP',
          isActive: true,
          isPrimary: true,
          smtpHost: 'localhost',
          smtpPort: 1025,
          smtpSecure: false,
          transactionalDomain: 'localhost',
          fromName: config?.companyName || 'Kaven Platform',
          fromEmail: 'noreply@localhost',
        }
      });
      console.log('   ✅ Default SMTP integration created.');
    } else {
      console.log('   ℹ️ Primary e-mail integration already exists.');
    }
  }
}
