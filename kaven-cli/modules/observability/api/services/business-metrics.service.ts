import {
  userRegistrations,
  loginAttempts,
  activeUsers,
  paymentCounter,
  paymentAmount,
  apiUsageCounter
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
}

export const businessMetricsService = new BusinessMetricsService();
