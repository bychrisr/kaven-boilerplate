
import { PrismaClient } from '@prisma/client';
import { hashPassword } from './apps/api/src/lib/bcrypt'; // Assuming strict path checking needed, might need adjustment or relative path based on execution context.
// Better to just reimplement simple hash or rely on the service if accessible, but script is standalone.
// Actually, let's just use the api's auth service logic or bcrypt directly if installed.
// The project uses `bcryptjs` or `bcrypt`. Let's assume the helper is available or just use bcryptjs directly.
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('adminpassword123', 10);
  await prisma.user.update({
    where: { email: 'testadmin@kaven.com' },
    data: { password: hashedPassword },
  });
  console.log('Password updated to adminpassword123');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
