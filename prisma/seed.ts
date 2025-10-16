import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create default plan
  const defaultPlan = await prisma.plan.upsert({
    where: { name: 'Free' },
    update: {},
    create: {
      name: 'Free',
      description: 'Plano gratuito com funcionalidades básicas',
      features: {
        max_users: 5,
        storage_gb: 1,
        api_calls_per_month: 1000,
      },
      price: 0.00,
    },
  });

  console.log('✅ Default plan created:', defaultPlan.name);

  // Create pro plan
  const proPlan = await prisma.plan.upsert({
    where: { name: 'Pro' },
    update: {},
    create: {
      name: 'Pro',
      description: 'Plano profissional com recursos avançados',
      features: {
        max_users: 50,
        storage_gb: 10,
        api_calls_per_month: 10000,
        priority_support: true,
      },
      price: 29.99,
    },
  });

  console.log('✅ Pro plan created:', proPlan.name);

  // Create enterprise plan
  const enterprisePlan = await prisma.plan.upsert({
    where: { name: 'Enterprise' },
    update: {},
    create: {
      name: 'Enterprise',
      description: 'Plano empresarial com recursos ilimitados',
      features: {
        max_users: -1, // unlimited
        storage_gb: 100,
        api_calls_per_month: -1, // unlimited
        priority_support: true,
        custom_integrations: true,
        sso: true,
      },
      price: 99.99,
    },
  });

  console.log('✅ Enterprise plan created:', enterprisePlan.name);

  // Create default tenant
  const defaultTenant = await prisma.tenant.upsert({
    where: { subdomain: 'default' },
    update: {},
    create: {
      name: 'Default Tenant',
      subdomain: 'default',
      plan_id: defaultPlan.id,
    },
  });

  console.log('✅ Default tenant created:', defaultTenant.name);

  // Create demo tenant
  const demoTenant = await prisma.tenant.upsert({
    where: { subdomain: 'demo' },
    update: {},
    create: {
      name: 'Demo Company',
      subdomain: 'demo',
      plan_id: proPlan.id,
    },
  });

  console.log('✅ Demo tenant created:', demoTenant.name);

  // Create admin user for default tenant
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@kaven.com' },
    update: {},
    create: {
      email: 'admin@kaven.com',
      password_hash: adminPassword,
      first_name: 'Admin',
      last_name: 'User',
      is_adm: true,
      tenant_id: defaultTenant.id,
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create regular user for demo tenant
  const userPassword = await bcrypt.hash('user123', 10);
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@demo.com' },
    update: {},
    create: {
      email: 'user@demo.com',
      password_hash: userPassword,
      first_name: 'Demo',
      last_name: 'User',
      is_adm: false,
      tenant_id: demoTenant.id,
    },
  });

  console.log('✅ Demo user created:', regularUser.email);

  // Create demo admin for demo tenant
  const demoAdminPassword = await bcrypt.hash('demo123', 10);
  const demoAdmin = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      password_hash: demoAdminPassword,
      first_name: 'Demo',
      last_name: 'Admin',
      is_adm: true,
      tenant_id: demoTenant.id,
    },
  });

  console.log('✅ Demo admin created:', demoAdmin.email);

  // Create some sample metrics
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  // Metrics for default tenant
  await prisma.metric.createMany({
    data: [
      {
        tenant_id: defaultTenant.id,
        metric_name: 'time_response_per_tenant',
        value: 150.5,
        timestamp: oneHourAgo,
        labels: {
          endpoint: '/api/users',
          status_code: 200,
        },
      },
      {
        tenant_id: defaultTenant.id,
        metric_name: 'errors_per_tenant',
        value: 2,
        timestamp: oneHourAgo,
        labels: {
          error_type: 'validation_error',
          endpoint: '/api/auth/login',
        },
      },
      {
        tenant_id: defaultTenant.id,
        metric_name: 'queue_length_per_tenant',
        value: 5,
        timestamp: oneHourAgo,
        labels: {
          queue_name: 'email_notifications',
        },
      },
    ],
  });

  // Metrics for demo tenant
  await prisma.metric.createMany({
    data: [
      {
        tenant_id: demoTenant.id,
        metric_name: 'time_response_per_tenant',
        value: 200.3,
        timestamp: oneHourAgo,
        labels: {
          endpoint: '/api/metrics',
          status_code: 200,
        },
      },
      {
        tenant_id: demoTenant.id,
        metric_name: 'cpu_usage_per_tenant',
        value: 45.2,
        timestamp: oneHourAgo,
        labels: {
          instance: 'worker-1',
        },
      },
    ],
  });

  console.log('✅ Sample metrics created');

  console.log('🎉 Database seed completed successfully!');
  console.log('\n📋 Created resources:');
  console.log('   Plans: Free, Pro, Enterprise');
  console.log('   Tenants: Default Tenant (default), Demo Company (demo)');
  console.log('   Users: admin@kaven.com (admin), user@demo.com (user), admin@demo.com (admin)');
  console.log('   Sample metrics for both tenants');
  console.log('\n🔑 Default credentials:');
  console.log('   Admin: admin@kaven.com / admin123');
  console.log('   Demo User: user@demo.com / user123');
  console.log('   Demo Admin: admin@demo.com / demo123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
