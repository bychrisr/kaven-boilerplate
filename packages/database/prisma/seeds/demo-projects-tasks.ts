import { PrismaClient, ProjectStatus, TaskStatus, TaskPriority } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDemoProjectsAndTasks() {
  console.log('🌱 Seeding demo projects and tasks...');

  // Buscar primeiro tenant ativo
  const tenant = await prisma.tenant.findFirst({
    where: { status: 'ACTIVE' },
  });

  if (!tenant) {
    console.error('❌ No active tenant found. Please create a tenant first.');
    return;
  }

  console.log(`✅ Found tenant: ${tenant.name} (${tenant.id})`);

  // Buscar primeiro usuário do tenant
  const user = await prisma.user.findFirst({
    where: { tenantId: tenant.id },
  });

  if (!user) {
    console.error('❌ No user found for tenant. Please create a user first.');
    return;
  }

  console.log(`✅ Found user: ${user.name} (${user.id})`);

  // Buscar spaces (opcional)
  const spaces = await prisma.space.findMany({
    where: { tenantId: tenant.id },
    take: 3,
  });

  console.log(`✅ Found ${spaces.length} spaces`);

  // Criar projetos demo
  const projectsData = [
    {
      name: 'Website Redesign',
      description: 'Complete redesign of company website with modern UI/UX',
      status: ProjectStatus.ACTIVE,
      color: '#3B82F6',
      spaceId: spaces[0]?.id || null,
    },
    {
      name: 'Mobile App Development',
      description: 'Native iOS and Android app for customer engagement',
      status: ProjectStatus.ACTIVE,
      color: '#10B981',
      spaceId: spaces[1]?.id || null,
    },
    {
      name: 'API Migration',
      description: 'Migrate legacy REST API to GraphQL',
      status: ProjectStatus.IN_PROGRESS,
      color: '#F59E0B',
      spaceId: spaces[2]?.id || null,
    },
    {
      name: 'Security Audit',
      description: 'Comprehensive security review and penetration testing',
      status: ProjectStatus.ACTIVE,
      color: '#EF4444',
      spaceId: null, // Global project
    },
    {
      name: 'Documentation Portal',
      description: 'Internal documentation hub for all teams',
      status: ProjectStatus.COMPLETED,
      color: '#8B5CF6',
      spaceId: null,
    },
  ];

  const createdProjects = [];

  for (const projectData of projectsData) {
    const project = await prisma.project.create({
      data: {
        ...projectData,
        tenantId: tenant.id,
        createdById: user.id,
      },
    });
    createdProjects.push(project);
    console.log(`  ✅ Created project: ${project.name}`);
  }

  // Criar tasks para cada projeto
  const tasksData = [
    // Website Redesign tasks
    {
      projectId: createdProjects[0].id,
      title: 'Design mockups for homepage',
      description: 'Create high-fidelity mockups in Figma',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      dueDate: new Date('2026-01-15'),
    },
    {
      projectId: createdProjects[0].id,
      title: 'Implement responsive navigation',
      description: 'Build mobile-first navigation component',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      dueDate: new Date('2026-01-20'),
    },
    {
      projectId: createdProjects[0].id,
      title: 'Setup analytics tracking',
      description: 'Integrate Google Analytics 4',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date('2026-01-25'),
    },
    
    // Mobile App tasks
    {
      projectId: createdProjects[1].id,
      title: 'Setup React Native project',
      description: 'Initialize project with Expo',
      status: TaskStatus.DONE,
      priority: TaskPriority.URGENT,
      dueDate: new Date('2026-01-10'),
    },
    {
      projectId: createdProjects[1].id,
      title: 'Implement authentication flow',
      description: 'OAuth 2.0 with biometric support',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      dueDate: new Date('2026-01-18'),
    },
    {
      projectId: createdProjects[1].id,
      title: 'Design push notification system',
      description: 'Firebase Cloud Messaging integration',
      status: TaskStatus.IN_REVIEW,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date('2026-01-22'),
    },
    {
      projectId: createdProjects[1].id,
      title: 'App Store submission',
      description: 'Prepare assets and submit to stores',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      dueDate: new Date('2026-02-01'),
    },

    // API Migration tasks
    {
      projectId: createdProjects[2].id,
      title: 'Audit existing REST endpoints',
      description: 'Document all current API endpoints',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      dueDate: new Date('2026-01-12'),
    },
    {
      projectId: createdProjects[2].id,
      title: 'Design GraphQL schema',
      description: 'Define types, queries, and mutations',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.URGENT,
      dueDate: new Date('2026-01-16'),
    },
    {
      projectId: createdProjects[2].id,
      title: 'Implement resolvers',
      description: 'Build GraphQL resolvers for all queries',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      dueDate: new Date('2026-01-20'),
    },

    // Security Audit tasks
    {
      projectId: createdProjects[3].id,
      title: 'Run automated security scan',
      description: 'Use OWASP ZAP for vulnerability scanning',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.URGENT,
      dueDate: new Date('2026-01-14'),
    },
    {
      projectId: createdProjects[3].id,
      title: 'Manual penetration testing',
      description: 'Hire external security firm',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      dueDate: new Date('2026-01-25'),
    },

    // Documentation Portal tasks
    {
      projectId: createdProjects[4].id,
      title: 'Setup Docusaurus',
      description: 'Initialize documentation site',
      status: TaskStatus.DONE,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date('2025-12-20'),
    },
    {
      projectId: createdProjects[4].id,
      title: 'Write API documentation',
      description: 'Document all public APIs',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      dueDate: new Date('2025-12-28'),
    },
    {
      projectId: createdProjects[4].id,
      title: 'Deploy to production',
      description: 'Deploy docs site to Vercel',
      status: TaskStatus.DONE,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date('2026-01-05'),
    },
  ];

  let tasksCreated = 0;
  for (const taskData of tasksData) {
    await prisma.task.create({
      data: {
        ...taskData,
        tenantId: tenant.id,
        createdById: user.id,
        assigneeId: Math.random() > 0.5 ? user.id : null, // 50% chance of being assigned
      },
    });
    tasksCreated++;
  }

  console.log(`  ✅ Created ${tasksCreated} tasks`);

  console.log('\n🎉 Demo data seeded successfully!');
  console.log(`\n📊 Summary:`);
  console.log(`   - Tenant: ${tenant.name}`);
  console.log(`   - Projects: ${createdProjects.length}`);
  console.log(`   - Tasks: ${tasksCreated}`);
  console.log(`   - Spaces: ${spaces.length}`);
}

seedDemoProjectsAndTasks()
  .catch((error) => {
    console.error('❌ Error seeding demo data:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
