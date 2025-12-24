
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function restore() {
  const email = 'admin@test.com';
  console.log(`🚑 Restoring user: ${email}`);

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.error('❌ User not found.');
    return;
  }

  if (!user.deletedAt) {
    console.log('✅ User is ACTIVE (not deleted).');
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { deletedAt: null, status: 'ACTIVE' }
  });

  console.log('✅ User RESTORED successfully.');
}

restore()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
