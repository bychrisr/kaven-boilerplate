import { PrismaClient } from '@prisma/client';
import { authService } from '../modules/auth/services/auth.service';
import { hashPassword } from '../lib/password';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting Verification: Auth Security Integration');

  const email = `security-test-${Date.now()}@kaven.dev`;
  const password = 'Password123!';
  const wrongPassword = 'WrongPassword!';

  // 1. Create User directly (to avoid sending emails if email service not mocked)
  // Or use register if email service handles dev mode.
  // Using prisma directly to be safe and fast.
  const hashedPassword = await hashPassword(password);
  
  // We need to handle Tenant creation logic if we insert manually, so let's use service but mock email if needed.
  // Actually, authService.register sends email. Let's create user manually to skip email for this test.
  
  console.log(`1. Creating Test User: ${email}`);
  
  // Tenant logic mimic
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Security Test Tenant',
      slug: `security-test-${Date.now()}`,
      status: 'ACTIVE'
    }
  });

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: 'Security Tester',
      tenantId: tenant.id,
      role: 'USER',
      emailVerified: true,
      loginAttempts: 0
    }
  });

  console.log('✅ User created.');

  // 2. Attempt login with wrong password 5 times
  console.log('2. Attempting 5 failed logins...');
  
  for (let i = 1; i <= 5; i++) {
    try {
      await authService.login({ email, password: wrongPassword }, '127.0.0.1', 'TestRunner');
      console.error(`❌ Attempt ${i} succeded (unexpected!)`);
    } catch (e: any) {
      if (e.message === 'Credenciais inválidas') {
        console.log(`   Attempt ${i}: Failed as expected.`);
      } else {
        console.error(`❌ Attempt ${i} failed with unexpected error: ${e.message}`);
      }
    }
  }

  // 3. Verify Lockout
  console.log('3. Verifying Lockout status...');
  const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });
  
  if (updatedUser?.lockedUntil && updatedUser.lockedUntil > new Date()) {
    console.log(`✅ User is LOCKED until ${updatedUser.lockedUntil.toISOString()}`);
  } else {
    console.error('❌ User is NOT locked (Failed)');
    process.exit(1);
  }

  // 4. Attempt 6th login - Should be blocked
  console.log('4. Attempting 6th login (should be blocked specific error)...');
  try {
    await authService.login({ email, password: wrongPassword }, '127.0.0.1', 'TestRunner');
  } catch (e: any) {
    if (e.message.includes('Conta temporariamente bloqueada')) {
      console.log('✅ Blocked message received correctly.');
    } else {
      console.error(`❌ Unexpected error message: ${e.message}`);
      process.exit(1);
    }
  }

  // 5. Cleanup
  console.log('5. Cleaning up...');
  await prisma.user.delete({ where: { id: user.id } });
  await prisma.tenant.delete({ where: { id: tenant.id } });

  console.log('🎉 Verification Successful!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
