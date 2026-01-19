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
   * Test an email integration
   */
  test: async (id: string, to?: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    const { data } = await api.post('/api/settings/email/test', { id, to });
    return data;
  },
};
