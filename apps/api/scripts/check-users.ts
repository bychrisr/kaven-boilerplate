
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log('Total users:', users.length);
    if (users.length > 0) {
      console.table(users.map(u => ({ id: u.id, email: u.email, role: u.role })));
    } else {
      console.log('No users found.');
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
