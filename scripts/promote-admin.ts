
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.update({
    where: { email: 'testadmin@kaven.com' },
    data: { role: 'SUPER_ADMIN' },
  });
  console.log('User promoted to SUPER_ADMIN');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
