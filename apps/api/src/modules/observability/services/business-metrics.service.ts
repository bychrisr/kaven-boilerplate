import {
  userRegistrations,
  loginAttempts,
  activeUsers,
  paymentCounter,
  paymentAmount,
  apiUsageCounter,
  emailSentTotal,
  emailBouncedTotal,
  emailComplaintsTotal,
  emailDeliveryDuration
} from '../../../lib/metrics';

export class BusinessMetricsService {
  /**
   * Track user registration
   */
  trackUserRegistration(userId: string, method: 'email' | 'google' | 'github' = 'email') {
    userRegistrations.inc({ method });
  }

  /**
   * Track login attempt
   */
  trackLogin(success: boolean, method: string = 'email') {
    loginAttempts.inc({ 
      status: success ? 'success' : 'failure',
      method 
    });
  }

  /**
   * Track payment
   */
  trackPayment(amount: number, currency: string, status: 'success' | 'failed', provider: string) {
    paymentCounter.inc({ currency, status, provider });
    if (status === 'success') {
      paymentAmount.observe({ currency, provider }, amount);
    }
  }

  /**
   * Track API usage
   */
  trackAPIUsage(endpoint: string, tenantId?: string) {
    apiUsageCounter.inc({ 
      endpoint,
      tenant: tenantId || 'unknown'
    });
  }

  /**
   * Update active users count
   */
  setActiveUsers(count: number) {
    activeUsers.set(count);
  }

  /**
   * Track email sent
   */
  trackEmailSent(provider: string, template: string, type: string) {
    console.log('[BusinessMetrics] 📧 trackEmailSent chamado:', { provider, template, type });
    emailSentTotal.inc({ provider, template, type });
    console.log('[BusinessMetrics] ✅ emailSentTotal.inc() executado');
  }

  /**
   * Track email bounce
   */
  trackEmailBounce(provider: string, type: string) {
    emailBouncedTotal.inc({ provider, type });
  }

  /**
   * Track email spam complaint
   */
  trackEmailComplaint(provider: string) {
    emailComplaintsTotal.inc({ provider });
  }

  /**
   * Track email delivery duration
   */
  trackEmailDeliveryDuration(provider: string, durationSeconds: number) {
    console.log('[BusinessMetrics] ⏱️ trackEmailDeliveryDuration chamado:', { provider, durationSeconds });
    emailDeliveryDuration.observe({ provider }, durationSeconds);
    console.log('[BusinessMetrics] ✅ emailDeliveryDuration.observe() executado');
  }
}

export const businessMetricsService = new BusinessMetricsService();
