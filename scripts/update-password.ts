
import { PrismaClient } from '@prisma/client';
import { hashPassword } from './apps/api/src/lib/bcrypt'; // Assuming strict path checking needed, might need adjustment or relative path based on execution context.
// Better to just reimplement simple hash or rely on the service if accessible, but script is standalone.
// Actually, let's just use the api's auth service logic or bcrypt directly if installed.
// The project uses `bcryptjs` or `bcrypt`. Let's assume the helper is available or just use bcryptjs directly.
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const newPassword = process.env.NEW_ADMIN_PASSWORD;
  if (!newPassword) {
    throw new Error('NEW_ADMIN_PASSWORD environment variable is required');
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { email: 'testadmin@kaven.com' },
    data: { password: hashedPassword },
  });
  console.log('✅ Admin password updated successfully');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
