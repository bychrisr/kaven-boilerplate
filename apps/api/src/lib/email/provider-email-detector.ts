import axios from 'axios';
import { EmailProvider } from './types';

export interface ProviderEmailResult {
  email: string;
  source: 'verified' | 'configured' | 'sandbox' | 'fallback';
  isVerified: boolean;
  providerMessage?: string;
}

export interface EmailIntegrationForDetection {
  id: string;
  provider: EmailProvider;
  apiKey?: string | null;
  apiSecret?: string | null;
  fromEmail?: string | null;
  testEmail?: string | null; // Email para testes (Resend)
  region?: string | null;
}

export class ProviderEmailDetector {
  /**
   * Detecta o email apropriado para envio de teste baseado no provider
   */
  async detectEmail(
    integration: EmailIntegrationForDetection,
    mode: 'sandbox' | 'custom',
    fallbackEmail: string
  ): Promise<ProviderEmailResult> {
    try {
      switch (integration.provider) {
        case EmailProvider.RESEND:
          return await this.detectResendEmail(integration, mode, fallbackEmail);
        
        case EmailProvider.POSTMARK:
          return await this.detectPostmarkEmail(integration, fallbackEmail);
        
        case EmailProvider.AWS_SES:
          return await this.detectAWSSESEmail(integration, fallbackEmail);
        
        case EmailProvider.SMTP:
          return this.detectSMTPEmail(integration, fallbackEmail);
        
        default:
          return {
            email: fallbackEmail,
            source: 'fallback',
            isVerified: false,
            providerMessage: 'Provider não suportado'
          };
      }
    } catch (error) {
      console.error('[ProviderEmailDetector] Erro ao detectar email:', error);
      return {
        email: fallbackEmail,
        source: 'fallback',
        isVerified: false,
        providerMessage: 'Erro ao detectar email do provider'
      };
    }
  }

  /**
   * Resend: Não tem API para buscar email da conta
   * Estratégia: testEmail configurado, sandbox ou fromEmail
   */
  private async detectResendEmail(
    integration: EmailIntegrationForDetection,
    mode: 'sandbox' | 'custom',
    fallbackEmail: string
  ): Promise<ProviderEmailResult> {
    // Se tem testEmail configurado, usar (prioridade máxima)
    if (integration.testEmail) {
      return {
        email: integration.testEmail,
        source: 'verified',
        isVerified: true,
        providerMessage: 'Usando email de teste configurado'
      };
    }

    // Modo sandbox: usar email de fallback (admin)
    if (mode === 'sandbox') {
      return {
        email: fallbackEmail,
        source: 'sandbox',
        isVerified: true,
        providerMessage: 'Usando modo sandbox - apenas seu email é permitido'
      };
    }

    // Modo custom: usar fromEmail configurado
    if (integration.fromEmail) {
      return {
        email: fallbackEmail,
        source: 'configured',
        isVerified: false,
        providerMessage: 'Usando email configurado - verifique seu domínio no Resend'
      };
    }

    // Fallback
    return {
      email: fallbackEmail,
      source: 'fallback',
      isVerified: false,
      providerMessage: 'Configure testEmail ou fromEmail na integração'
    };
  }

  /**
   * Postmark: Tem API /senders para listar emails verificados
   */
  private async detectPostmarkEmail(
    integration: EmailIntegrationForDetection,
    fallbackEmail: string
  ): Promise<ProviderEmailResult> {
    if (!integration.apiKey) {
      return {
        email: fallbackEmail,
        source: 'fallback',
        isVerified: false,
        providerMessage: 'API Key não configurada'
      };
    }

    try {
      // Chamar API do Postmark para listar sender signatures
      const response = await axios.get('https://api.postmarkapp.com/senders', {
        headers: {
          'Accept': 'application/json',
          'X-Postmark-Account-Token': integration.apiKey
        },
        timeout: 5000
      });

      const senders = response.data.SenderSignatures || [];
      
      // Buscar primeiro email confirmado
      const confirmedSender = senders.find((s: any) => s.Confirmed === true);
      
      if (confirmedSender) {
        return {
          email: confirmedSender.EmailAddress,
          source: 'verified',
          isVerified: true,
          providerMessage: 'Email verificado encontrado no Postmark'
        };
      }

      // Se não encontrou confirmado, usar fromEmail ou fallback
      if (integration.fromEmail) {
        return {
          email: fallbackEmail,
          source: 'configured',
          isVerified: false,
          providerMessage: 'Nenhum email verificado encontrado - usando configurado'
        };
      }

      return {
        email: fallbackEmail,
        source: 'fallback',
        isVerified: false,
        providerMessage: 'Nenhum email verificado no Postmark'
      };
    } catch (error: any) {
      console.error('[ProviderEmailDetector] Erro ao buscar senders do Postmark:', error.message);
      
      // Fallback para fromEmail ou email do admin
      if (integration.fromEmail) {
        return {
          email: fallbackEmail,
          source: 'configured',
          isVerified: false,
          providerMessage: 'Erro ao verificar Postmark - usando email configurado'
        };
      }

      return {
        email: fallbackEmail,
        source: 'fallback',
        isVerified: false,
        providerMessage: 'Erro ao conectar com Postmark'
      };
    }
  }

  /**
   * AWS SES: Tem API ListEmailIdentities
   * Nota: Requer AWS SDK, implementação simplificada
   */
  private async detectAWSSESEmail(
    integration: EmailIntegrationForDetection,
    fallbackEmail: string
  ): Promise<ProviderEmailResult> {
    // AWS SES requer SDK específico, por enquanto usar fromEmail
    // TODO: Implementar com AWS SDK quando necessário
    
    if (integration.fromEmail) {
      return {
        email: fallbackEmail,
        source: 'configured',
        isVerified: false,
        providerMessage: 'Usando email configurado - verifique no AWS SES Console'
      };
    }

    return {
      email: fallbackEmail,
      source: 'fallback',
      isVerified: false,
      providerMessage: 'Configure fromEmail para AWS SES'
    };
  }

  /**
   * SMTP: Não tem API, usar fromEmail configurado
   */
  private detectSMTPEmail(
    integration: EmailIntegrationForDetection,
    fallbackEmail: string
  ): ProviderEmailResult {
    if (integration.fromEmail) {
      return {
        email: fallbackEmail,
        source: 'configured',
        isVerified: false,
        providerMessage: 'Usando email configurado do SMTP'
      };
    }

    return {
      email: fallbackEmail,
      source: 'fallback',
      isVerified: false,
      providerMessage: 'Configure fromEmail para SMTP'
    };
  }
}

export const providerEmailDetector = new ProviderEmailDetector();
