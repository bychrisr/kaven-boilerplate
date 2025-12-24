import { generateAccessToken, verifyToken } from '../apps/api/src/lib/jwt';
import { env } from '../apps/api/src/config/env';

async function testJWT() {
  console.log('--- JWT DEBUG START ---');
  console.log('ENV JWT_SECRET:', env.JWT_SECRET.substring(0, 5) + '...');
  
  const payload = {
    sub: 'test-user-id',
    email: 'test@example.com',
    role: 'USER'
  };

  console.log('Generating token...');
  const token = await generateAccessToken(payload);
  console.log('Token generated:', token.substring(0, 10) + '...');

  console.log('Verifying token...');
  try {
    const decoded = await verifyToken(token);
    console.log('✅ Verification SUCCESS:', decoded);
  } catch (error) {
    console.error('❌ Verification FAILED:', error);
  }
  console.log('--- JWT DEBUG END ---');
}

testJWT();
