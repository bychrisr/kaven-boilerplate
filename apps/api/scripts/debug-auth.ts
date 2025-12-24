
import { PrismaClient } from '@prisma/client';
import { generateAccessToken, verifyToken } from '../src/lib/jwt';
import { env } from '../src/config/env';

// Ponto de entrada
async function main() {
  console.log('🕵️ STARTING AUTH DEBUG 🕵️');
  console.log('--------------------------------');

  const prisma = new PrismaClient();

  try {
    const email = 'admin@test.com';
    console.log(`1. Searching for user: ${email}`);
    
    const user = await prisma.user.findUnique({
      where: { email },
      include: { tenant: true }
    });

    if (!user) {
      console.error('❌ CRITICAL: User not found in database!');
      console.log('   Checking if ANY users exist...');
      const count = await prisma.user.count();
      console.log(`   Total users in DB: ${count}`);
      return;
    }

    console.log('✅ User found in DB:', {
      id: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      deletedAt: user.deletedAt
    });
    
    if (typeof user.id !== 'string') {
        console.warn('⚠️ WARNING: User ID is NOT a string. Type:', typeof user.id);
    }

    console.log('--------------------------------');
    console.log('2. Testing Token Generation...');
    
    const token = await generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId || undefined
    });

    console.log('✅ Token Generated. Length:', token.length);
    console.log('   Preview:', token.substring(0, 20) + '...');

    console.log('--------------------------------');
    console.log('3. Testing Token Verification...');

    try {
      const payload = await verifyToken(token);
      console.log('✅ Token Verified Successfully!');
      console.log('   Payload:', payload);

      if (payload.sub !== user.id) {
        console.error('❌ FATAL: Payload SUB mismatch!');
        console.error(`   Token sub: ${payload.sub}`);
        console.error(`   User ID:   ${user.id}`);
      } else {
        console.log('✅ Payload SUB matches User ID.');
      }
    } catch (e: any) {
      console.error('❌ Token Verification FAILED:', e.message);
    }
    
    console.log('--------------------------------');
    console.log('4. Checking Refresh Token...');
    
    const refreshTokens = await prisma.refreshToken.findMany({
        where: { userId: user.id }
    });
    console.log(`   Found ${refreshTokens.length} refresh tokens for user.`);
    if (refreshTokens.length > 0) {
        console.log('   Latest token expires:', refreshTokens[refreshTokens.length - 1].expiresAt);
    }

  } catch (err: any) {
    console.error('❌ UNHANDLED ERROR:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
