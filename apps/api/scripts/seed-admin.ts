import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@kaven.com';
  const password = 'adminpassword123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      emailVerified: true,
      twoFactorEnabled: false
    },
    create: {
      email,
      name: 'Super Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      emailVerified: true,
      twoFactorEnabled: false
    },
  });

  console.log('Super Admin User:', { email, password });
  console.log('User ID:', user.id);
}

void (async () => {
  try {
    await main();
    await prisma.$disconnect();
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
