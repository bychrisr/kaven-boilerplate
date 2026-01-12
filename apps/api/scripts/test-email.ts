
import { emailService } from '../src/lib/email.service';

async function main() {
  console.log('🧪 Testing Email Service...');

  try {
    // 1. Welcome Email
    console.log('📧 Sending Welcome Email...');
    await emailService.sendWelcomeEmail({
      email: 'test@kaven.com',
      name: 'Test Benz',
    });
    console.log('✅ Welcome Email sent');

    // 2. Verification Email
    console.log('📧 Sending Verification Email...');
    await emailService.sendVerificationEmail({
      email: 'test@kaven.com',
      name: 'Test Benz',
    }, 'test-verification-token');
    console.log('✅ Verification Email sent');

    // 3. Password Reset Email
    console.log('📧 Sending Password Reset Email...');
    await emailService.sendPasswordResetEmail({
      email: 'test@kaven.com',
      name: 'Test Benz',
    }, 'test-reset-token');
    console.log('✅ Password Reset Email sent');

    console.log('🎉 All emails sent successfully! Check http://localhost:8025');
  } catch (error) {
    console.error('❌ Error sending emails:', error);
    process.exit(1);
  }
}

main();
