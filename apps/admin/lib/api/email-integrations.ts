import { api } from '@/lib/api';

export interface EmailIntegration {
  id: string;
  provider: 'SMTP' | 'RESEND' | 'POSTMARK' | 'AWS_SES';
  isActive: boolean;
  isPrimary: boolean;
  apiKey?: string | null;
  apiSecret?: string | null;
  webhookSecret?: string | null;
  smtpHost?: string | null;
  smtpPort?: number | null;
  smtpSecure?: boolean | null;
  smtpUser?: string | null;
  smtpPassword?: string | null;
  transactionalDomain?: string | null;
  marketingDomain?: string | null;
  fromName?: string | null;
  fromEmail?: string | null;
  trackOpens: boolean;
  trackClicks: boolean;
  dailyLimit?: number | null;
  hourlyLimit?: number | null;
  // Campos avançados adicionados
  transactionalStream?: string | null;
  marketingStream?: string | null;
  enableDkim?: boolean;
  enableBimi?: boolean;
  region?: string | null;
  
  // Health Check fields
  healthStatus?: string | null;
  healthMessage?: string | null;
  lastHealthCheck?: string | null;
  
  createdAt: string;
  updatedAt: string;
}

export interface EmailIntegrationInput {
  provider: 'SMTP' | 'RESEND' | 'POSTMARK' | 'AWS_SES';
  isActive?: boolean;
  isPrimary?: boolean;
  apiKey?: string | null;
  apiSecret?: string | null;
  webhookSecret?: string | null;
  smtpHost?: string | null;
  smtpPort?: number | null;
  smtpSecure?: boolean | null;
  smtpUser?: string | null;
  smtpPassword?: string | null;
  transactionalDomain?: string | null;
  marketingDomain?: string | null;
  fromName?: string | null;
  fromEmail?: string | null;
  trackOpens?: boolean;
  trackClicks?: boolean;
  dailyLimit?: number | null;
  hourlyLimit?: number | null;
  // Campos avançados adicionados
  transactionalStream?: string | null;
  marketingStream?: string | null;
  enableDkim?: boolean;
  enableBimi?: boolean;
  region?: string | null;
}

export const emailIntegrationsApi = {
  /**
   * List all email integrations
   */
  list: async (): Promise<EmailIntegration[]> => {
    const { data } = await api.get('/api/settings/email');
    return data;
  },

  /**
   * Create a new email integration
   */
  create: async (integration: EmailIntegrationInput): Promise<EmailIntegration> => {
    const { data } = await api.post('/api/settings/email', integration);
    return data;
  },

  /**
   * Update an existing email integration
   */
  update: async (id: string, integration: Partial<EmailIntegrationInput>): Promise<EmailIntegration> => {
    const { data } = await api.put(`/api/settings/email/${id}`, integration);
    return data;
  },

  /**
   * Delete an email integration
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/settings/email/${id}`);
  },

  /**
   * Test an email integration (send real test email)
   */
  test: async (id: string, mode?: 'sandbox' | 'custom'): Promise<{ 
    success: boolean; 
    message?: string; 
    messageEn?: string;
    error?: string; 
    mode?: string;
    isInfo?: boolean;
    provider?: string;
    healthy?: boolean;
  }> => {
    try {
      const { data } = await api.post(`/api/settings/email/test`, {
        id,
        mode: mode || 'custom',
      });
      
      return {
        success: true,
        message: data.message || 'Test email sent successfully',
        ...data,
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: { error?: string; message?: string } }; message?: string };
      return {
        success: false,
        error: axiosError.response?.data?.error || axiosError.response?.data?.message || axiosError.message || 'Failed to send test email',
      };
    }
  },
};
