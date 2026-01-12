import { emailService } from '../src/lib/email.service';
import { Decimal } from '@prisma/client/runtime/library';

async function main() {
  console.log('🧪 Testing Email Service...');

  try {
    // ----------------------------------------------------------------
    // SECTION 1: CORE AUTH EMAILS
    // ----------------------------------------------------------------

    // 1a. Welcome Email (PT)
    console.log('📧 Sending Welcome (PT)...');
    await emailService.sendWelcomeEmail({ email: 'test-welcome-pt@kaven.com', name: 'João Silva' }, 'pt');
    
    // 1b. Welcome Email (EN)
    console.log('📧 Sending Welcome (EN)...');
    await emailService.sendWelcomeEmail({ email: 'test-welcome-en@kaven.com', name: 'John Doe' }, 'en');

    // 2a. Verification Email (PT)
    console.log('📧 Sending Verification (PT)...');
    await emailService.sendVerificationEmail({ email: 'test-verify-pt@kaven.com', name: 'João Silva' }, 'token-pt', 'pt');
    
    // 2b. Verification Email (EN)
    console.log('📧 Sending Verification (EN)...');
    await emailService.sendVerificationEmail({ email: 'test-verify-en@kaven.com', name: 'John Doe' }, 'token-en', 'en');

    // 3a. Reset Password Email (PT)
    console.log('📧 Sending Reset Password (PT)...');
    await emailService.sendPasswordResetEmail({ email: 'test-reset-pt@kaven.com', name: 'João Silva' }, 'token-pt', 'pt');

    // 3b. Reset Password Email (EN)
    console.log('📧 Sending Reset Password (EN)...');
    await emailService.sendPasswordResetEmail({ email: 'test-reset-en@kaven.com', name: 'John Doe' }, 'token-en', 'en');

    // ----------------------------------------------------------------
    // SECTION 2: APP NOTIFICATIONS
    // ----------------------------------------------------------------

    // 4a. Invite Email (PT)
    console.log('📧 Sending Invite (PT)...');
    await emailService.sendInviteEmail('test-invite-pt@kaven.com', 'https://kaven.com/invite', 'Acme Corp', 'Admin User', 'pt');

    // 4b. Invite Email (EN)
    console.log('📧 Sending Invite (EN)...');
    await emailService.sendInviteEmail('test-invite-en@kaven.com', 'https://kaven.com/invite', 'Global Inc', 'Admin User', 'en');

    // 5a. Invoice Email (PT)
    console.log('📧 Sending Invoice (PT)...');
    await emailService.sendInvoiceEmail({ email: 'test-invoice-pt@kaven.com', name: 'João Silva' }, {
      invoiceNumber: 'INV-001',
      amountDue: new Decimal(150.00),
      dueDate: new Date(),
    }, 'pt');

    // 5b. Invoice Email (EN)
    console.log('📧 Sending Invoice (EN)...');
    await emailService.sendInvoiceEmail({ email: 'test-invoice-en@kaven.com', name: 'John Doe' }, {
      invoiceNumber: 'INV-002',
      amountDue: new Decimal(50.00),
      dueDate: new Date(),
    }, 'en');

    // ----------------------------------------------------------------
    // SECTION 3: SECURITY & TRANSACTIONAL (NEW)
    // ----------------------------------------------------------------

    // 6a. OTP Email (PT)
    console.log('📧 Sending OTP (PT)...');
    await emailService.sendOtpEmail({ email: 'test-otp-pt@kaven.com', name: 'João Silva' }, '123 456', 'pt');

    // 6b. OTP Email (EN)
    console.log('📧 Sending OTP (EN)...');
    await emailService.sendOtpEmail({ email: 'test-otp-en@kaven.com', name: 'John Doe' }, '654 321', 'en');

    // 7a. Security Alert (PT)
    console.log('📧 Sending Security Alert (PT)...');
    await emailService.sendSecurityAlertEmail(
      { email: 'test-security-pt@kaven.com', name: 'João Silva' },
      { device: 'Chrome on macOS', location: 'São Paulo, Brazil', ip: '200.100.50.25' },
      'pt'
    );

    // 7b. Security Alert (EN)
    console.log('📧 Sending Security Alert (EN)...');
    await emailService.sendSecurityAlertEmail(
      { email: 'test-security-en@kaven.com', name: 'John Doe' },
      { device: 'Safari on iPhone', location: 'New York, USA', ip: '10.0.0.1' },
      'en'
    );

    // 8a. Payment Failed (PT)
    console.log('📧 Sending Payment Failed (PT)...');
    await emailService.sendPaymentFailedEmail({ email: 'test-failed-pt@kaven.com', name: 'João Silva' }, 'pt');

    // 8b. Payment Failed (EN)
    console.log('📧 Sending Payment Failed (EN)...');
    await emailService.sendPaymentFailedEmail({ email: 'test-failed-en@kaven.com', name: 'John Doe' }, 'en');


    console.log('🎉 All emails sent successfully! Check http://localhost:8025');
  } catch (error) {
    console.error('❌ Error sending emails:', error);
    process.exit(1);
  }
}

main();
