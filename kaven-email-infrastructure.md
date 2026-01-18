# Manual de Implementação de Infraestrutura de E-mail
## Kaven v2.0 SaaS Platform

**Versão:** 2.0.0  
**Data:** Janeiro 2026  
**Stack Base:** Fastify + Nodemailer + Next.js 16

---

## 📋 Resumo Executivo

Este manual implementa uma infraestrutura de e-mail enterprise-grade para o Kaven v2.0, cobrindo:

- ✅ **Autenticação de Domínio**: SPF, DKIM, DMARC com política `p=reject`
- ✅ **Isolamento de Fluxos**: Subdomínios separados para transacional vs. marketing
- ✅ **Entregabilidade**: Configurações para atingir 83%+ de inbox placement
- ✅ **Segurança**: Validação HMAC de webhooks e proteção contra phishing
- ✅ **Conformidade**: GDPR/LGPD compliance com double opt-in
- ✅ **Monitoramento**: Webhooks para bounces, complaints e engagement

### Arquitetura Proposta

```
┌─────────────────────────────────────────────────────────┐
│                   KAVEN EMAIL ECOSYSTEM                  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────┐         ┌──────────────────┐      │
│  │  TRANSACIONAL    │         │    MARKETING     │      │
│  │ auth.kaven.com   │         │  mail.kaven.com  │      │
│  │                  │         │                  │      │
│  │ • Welcome        │         │ • Newsletters    │      │
│  │ • Password Reset │         │ • Campaigns      │      │
│  │ • Email Verify   │         │ • Announcements  │      │
│  │ • Invoices       │         │ • Lifecycle      │      │
│  └────────┬─────────┘         └────────┬─────────┘      │
│           │                            │                 │
│           └────────────┬───────────────┘                 │
│                        │                                 │
│              ┌─────────▼──────────┐                      │
│              │   EMAIL PROVIDER   │                      │
│              │  (Postmark/Resend) │                      │
│              └─────────┬──────────┘                      │
│                        │                                 │
│              ┌─────────▼──────────┐                      │
│              │   WEBHOOK ENGINE   │                      │
│              │  (Fastify Backend) │                      │
│              └────────────────────┘                      │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 FASE 1: Configuração Externa (DNS/Cloudflare)

### 1.1. Registros DNS Obrigatórios

Configure os seguintes registros no **Cloudflare** ou provedor DNS equivalente:

#### Tabela de Registros DNS

| Tipo  | Nome                | Valor/Conteúdo                                                                 | TTL  | Prioridade |
|-------|---------------------|-------------------------------------------------------------------------------|------|------------|
| **A** | `auth.kaven.com`    | `<IP_DO_SERVIDOR_EMAIL>` (ou CNAME para provedor)                            | 3600 | -          |
| **A** | `mail.kaven.com`    | `<IP_DO_SERVIDOR_EMAIL>` (ou CNAME para provedor)                            | 3600 | -          |
| **MX** | `kaven.com`        | `10 mail.kaven.com`                                                           | 3600 | 10         |
| **TXT** | `kaven.com`       | `v=spf1 include:spf.postmarkapp.com ~all` **(ajustar conforme provedor)**    | 3600 | -          |
| **TXT** | `_dmarc.kaven.com`| `v=DMARC1; p=reject; rua=mailto:dmarc@kaven.com; ruf=mailto:dmarc@kaven.com; aspf=s; adkim=s; pct=100` | 3600 | -          |
| **TXT** | `pm._domainkey.auth.kaven.com` | `<DKIM_PUBLIC_KEY_FROM_PROVIDER>` (fornecido por Postmark/Resend) | 3600 | -          |
| **TXT** | `pm._domainkey.mail.kaven.com` | `<DKIM_PUBLIC_KEY_FROM_PROVIDER>` (fornecido por Postmark/Resend) | 3600 | -          |
| **TXT** | `_mta-sts.kaven.com` | `v=STSv1; id=<TIMESTAMP>` (para TLS enforcement)                         | 3600 | -          |
| **TXT** | `default._bimi.kaven.com` | `v=BIMI1; l=https://kaven.com/logo.svg; a=` (logo verificado)        | 3600 | -          |

#### Notas Importantes

- **SPF**: Substitua `spf.postmarkapp.com` pelo include correto do seu provedor:
  - Postmark: `include:spf.postmarkapp.com`
  - Resend: `include:_spf.resend.com`
  - SendGrid: `include:sendgrid.net`
  - AWS SES: `include:amazonses.com`

- **DKIM**: A chave pública será fornecida pelo provedor após você adicionar o domínio no painel deles.

- **DMARC**: A política `p=reject` é o estado final. Inicie com `p=none` por 30 dias para coletar relatórios antes de aplicar enforcement.

### 1.2. Subdomínios Isolados (Critical)

**Por que isolar?**
- Protege a reputação do domínio principal se houver spam complaints em campanhas de marketing
- Permite políticas DMARC diferentes por tipo de e-mail
- Facilita o warm-up de IP separado por fluxo

**Implementação:**

1. **Transacional** (`auth.kaven.com`):
   - Welcome emails
   - Password reset
   - Email verification
   - Invoices
   - Sistema de notificações críticas

2. **Marketing** (`mail.kaven.com`):
   - Newsletters
   - Lifecycle campaigns
   - Announcements
   - Product updates

### 1.3. Warm-up de Domínio (30 dias)

Antes de enviar volume completo, siga este cronograma:

| Dia       | Volume Diário | Tipo de E-mail               |
|-----------|---------------|------------------------------|
| 1-3       | 500-1000      | Transacionais (alta taxa de abertura) |
| 4-7       | 2000-3000     | Mix transacional + engajamento |
| 8-14      | 5000-8000     | Adicionar campanhas controladas |
| 15-30     | Escalar até volume normal | Monitorar métricas diariamente |

**Métricas de Validação:**
- Bounce rate < 2%
- Spam complaint rate < 0.1%
- Open rate > 20%

---

## 💻 FASE 2: Implementação no Código (Kaven Backend)

### 2.1. Estrutura de Pastas Proposta

```
apps/api/src/
├── lib/
│   ├── email/
│   │   ├── index.ts                 # Singleton Service
│   │   ├── providers/
│   │   │   ├── postmark.provider.ts # Postmark API
│   │   │   ├── resend.provider.ts   # Resend API (opcional)
│   │   │   └── ses.provider.ts      # AWS SES (opcional)
│   │   ├── templates/
│   │   │   ├── welcome.html
│   │   │   ├── password-reset.html
│   │   │   ├── email-verify.html
│   │   │   └── invoice.html
│   │   ├── types.ts                 # TypeScript interfaces
│   │   └── constants.ts             # Configurações
│   ├── webhooks/
│   │   ├── email-events.handler.ts  # Processa bounces/complaints
│   │   └── hmac-validator.ts        # Validação de assinatura
```

### 2.2. Email Service Singleton

```typescript
// apps/api/src/lib/email/index.ts

import { PostmarkProvider } from './providers/postmark.provider';
import type { EmailPayload, EmailProvider } from './types';

class EmailService {
  private static instance: EmailService;
  private provider: EmailProvider;

  private constructor() {
    // Seleciona provedor baseado em ENV
    const providerName = process.env.EMAIL_PROVIDER || 'postmark';
    
    switch (providerName) {
      case 'postmark':
        this.provider = new PostmarkProvider({
          serverToken: process.env.POSTMARK_SERVER_TOKEN!,
          messageStream: {
            transactional: 'outbound',
            marketing: 'broadcasts'
          }
        });
        break;
      // Adicione outros provedores aqui
      default:
        throw new Error(`Provedor de e-mail desconhecido: ${providerName}`);
    }
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async send(payload: EmailPayload): Promise<{ messageId: string }> {
    // Validações
    this.validatePayload(payload);
    
    // Adiciona idempotency key
    const idempotencyKey = payload.idempotencyKey || this.generateIdempotencyKey(payload);
    
    // Dispara via provider
    const result = await this.provider.send({
      ...payload,
      idempotencyKey
    });
    
    // Log para observabilidade
    console.log(`[EMAIL] Sent ${payload.template} to ${payload.to} - MessageID: ${result.messageId}`);
    
    return result;
  }

  private validatePayload(payload: EmailPayload): void {
    if (!payload.to || !payload.subject || !payload.template) {
      throw new Error('Payload de e-mail incompleto');
    }
    
    // Valida tamanho do payload para Server Actions (Next.js)
    const payloadSize = JSON.stringify(payload).length;
    if (payloadSize > 1024 * 1024) { // 1MB
      throw new Error('Payload excede 1MB - considere usar URLs para anexos');
    }
  }

  private generateIdempotencyKey(payload: EmailPayload): string {
    const data = `${payload.to}-${payload.template}-${Date.now()}`;
    return Buffer.from(data).toString('base64');
  }
}

export const emailService = EmailService.getInstance();
```

### 2.3. Postmark Provider Implementation

```typescript
// apps/api/src/lib/email/providers/postmark.provider.ts

import * as postmark from 'postmark';
import type { EmailPayload, EmailProvider } from '../types';

export class PostmarkProvider implements EmailProvider {
  private client: postmark.ServerClient;
  private messageStreams: Record<string, string>;

  constructor(config: {
    serverToken: string;
    messageStream: Record<string, string>;
  }) {
    this.client = new postmark.ServerClient(config.serverToken);
    this.messageStreams = config.messageStream;
  }

  async send(payload: EmailPayload): Promise<{ messageId: string }> {
    const messageStream = payload.type === 'marketing' 
      ? this.messageStreams.marketing 
      : this.messageStreams.transactional;

    const result = await this.client.sendEmail({
      From: payload.from || 'noreply@auth.kaven.com',
      To: payload.to,
      Subject: payload.subject,
      HtmlBody: payload.html,
      TextBody: payload.text,
      MessageStream: messageStream,
      Tag: payload.template,
      Metadata: {
        tenantId: payload.tenantId,
        userId: payload.userId,
        idempotencyKey: payload.idempotencyKey
      },
      TrackOpens: true,
      TrackLinks: 'HtmlAndText'
    });

    return { messageId: result.MessageID };
  }
}
```

### 2.4. Template System

```typescript
// apps/api/src/lib/email/templates/index.ts

import fs from 'fs/promises';
import path from 'path';
import Handlebars from 'handlebars';

export class TemplateEngine {
  private cache = new Map<string, HandlebarsTemplateDelegate>();

  async render(templateName: string, data: Record<string, any>): Promise<string> {
    // Cache do template compilado
    if (!this.cache.has(templateName)) {
      const templatePath = path.join(__dirname, `${templateName}.html`);
      const source = await fs.readFile(templatePath, 'utf-8');
      const template = Handlebars.compile(source);
      this.cache.set(templateName, template);
    }

    const template = this.cache.get(templateName)!;
    return template(data);
  }
}

export const templateEngine = new TemplateEngine();
```

### 2.5. Webhook Handler (Bounces & Complaints)

```typescript
// apps/api/src/lib/webhooks/email-events.handler.ts

import type { FastifyRequest, FastifyReply } from 'fastify';
import { validateHMAC } from './hmac-validator';
import { prisma } from '@kaven/database';

export async function emailWebhookHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // 1. Validar assinatura HMAC
  const isValid = validateHMAC(
    request.rawBody!,
    request.headers['x-pm-signature'] as string,
    process.env.POSTMARK_WEBHOOK_SECRET!
  );

  if (!isValid) {
    return reply.status(401).send({ error: 'Invalid signature' });
  }

  // 2. Processar evento
  const event = request.body as PostmarkWebhookEvent;

  switch (event.RecordType) {
    case 'Bounce':
      await handleBounce(event);
      break;
    case 'SpamComplaint':
      await handleSpamComplaint(event);
      break;
    case 'Open':
    case 'Click':
      await handleEngagement(event);
      break;
  }

  // 3. Responder imediatamente (critical)
  return reply.status(200).send({ received: true });
}

async function handleBounce(event: PostmarkWebhookEvent) {
  const { Email, Type, TypeCode } = event;

  // Hard bounce = desativar envios permanentemente
  if (TypeCode === 1) {
    await prisma.user.update({
      where: { email: Email },
      data: { 
        emailBounced: true,
        emailVerified: false 
      }
    });
    
    console.error(`[BOUNCE] Hard bounce para ${Email} - removido da lista`);
  }

  // Registrar no audit log
  await prisma.auditLog.create({
    data: {
      action: 'EMAIL_BOUNCED',
      metadata: { email: Email, type: Type },
      ipAddress: event.ServerID
    }
  });
}

async function handleSpamComplaint(event: PostmarkWebhookEvent) {
  const { Email } = event;

  // Unsubscribe automático
  await prisma.user.update({
    where: { email: Email },
    data: { 
      emailOptOut: true,
      emailBounced: true 
    }
  });

  // Alerta crítico
  console.error(`[SPAM] Complaint recebido de ${Email} - usuário removido`);
}
```

### 2.6. HMAC Validator (Security Critical)

```typescript
// apps/api/src/lib/webhooks/hmac-validator.ts

import crypto from 'crypto';

export function validateHMAC(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('base64');

  // Comparação em tempo constante (timing attack protection)
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

### 2.7. Fastify Route Registration

```typescript
// apps/api/src/modules/webhooks/routes.ts

import type { FastifyInstance } from 'fastify';
import { emailWebhookHandler } from '../../lib/webhooks/email-events.handler';

export async function webhookRoutes(fastify: FastifyInstance) {
  // CRITICAL: Capturar raw body para validação HMAC
  fastify.addContentTypeParser(
    'application/json',
    { parseAs: 'string' },
    (req, body, done) => {
      req.rawBody = body as string;
      try {
        done(null, JSON.parse(body as string));
      } catch (err) {
        done(err as Error, undefined);
      }
    }
  );

  fastify.post('/webhooks/email', emailWebhookHandler);
}
```

---

## 🔒 FASE 3: Segurança e Conformidade

### 3.1. Variáveis de Ambiente (.env)

```bash
# Email Provider
EMAIL_PROVIDER=postmark
POSTMARK_SERVER_TOKEN=your-server-token-here
POSTMARK_WEBHOOK_SECRET=your-webhook-secret-here

# Domínios
EMAIL_DOMAIN_TRANSACTIONAL=auth.kaven.com
EMAIL_DOMAIN_MARKETING=mail.kaven.com
EMAIL_FROM_NAME=Kaven Platform

# DMARC Reporting
DMARC_REPORT_EMAIL=dmarc@kaven.com

# Feature Flags
EMAIL_TRACK_OPENS=true
EMAIL_TRACK_CLICKS=true
EMAIL_DRY_RUN=false # true em dev para não enviar realmente
```

### 3.2. Double Opt-in Implementation (GDPR/LGPD)

```typescript
// apps/api/src/modules/auth/services/signup.service.ts

export async function signupUser(data: SignupInput) {
  // 1. Criar usuário com emailVerified=false
  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash: await hashPassword(data.password),
      emailVerified: false,
      emailOptIn: false // Requer confirmação explícita
    }
  });

  // 2. Gerar token de verificação
  const verificationToken = generateSecureToken();
  await prisma.verificationToken.create({
    data: {
      userId: user.id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
    }
  });

  // 3. Enviar e-mail de verificação
  await emailService.send({
    to: user.email,
    subject: 'Confirme seu e-mail - Kaven',
    template: 'email-verify',
    type: 'transactional',
    data: {
      userName: user.name,
      verificationLink: `${process.env.APP_URL}/verify-email?token=${verificationToken}`
    },
    userId: user.id,
    idempotencyKey: `verify-${user.id}-${Date.now()}`
  });

  return user;
}
```

### 3.3. Unsubscribe Implementation (One-Click)

```typescript
// apps/api/src/modules/users/routes.ts

fastify.post('/unsubscribe/:token', async (request, reply) => {
  const { token } = request.params;

  // Decode token seguro
  const userId = decodeUnsubscribeToken(token);

  // Atualizar preferências
  await prisma.user.update({
    where: { id: userId },
    data: { 
      emailOptOut: true,
      emailOptOutDate: new Date()
    }
  });

  return reply.status(200).send({ 
    success: true,
    message: 'Você foi removido da nossa lista de e-mails.'
  });
});
```

**Importante**: Adicione o header `List-Unsubscribe` em todos os e-mails de marketing:

```typescript
{
  'List-Unsubscribe': `<https://kaven.com/unsubscribe/${unsubscribeToken}>`,
  'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
}
```

---

## ✅ FASE 4: Validação e Testes

### 4.1. Checklist de Pré-Produção

- [ ] **DNS Propagado**: Aguardar 24-48h após configurar DNS
- [ ] **SPF Validado**: Teste em https://mxtoolbox.com/spf.aspx
- [ ] **DKIM Ativo**: Verificar assinatura em e-mails de teste
- [ ] **DMARC Configurado**: Iniciar com `p=none` por 30 dias
- [ ] **Subdomínios Resolvendo**: `dig auth.kaven.com` deve retornar IP
- [ ] **Webhooks Registrados**: Verificar no painel do provedor
- [ ] **HMAC Validation Working**: Testar com webhook de teste
- [ ] **Templates Renderizando**: Testar todos os templates HTML
- [ ] **Bounce Handling**: Simular hard bounce e verificar desativação
- [ ] **Spam Complaint**: Simular complaint e verificar opt-out automático

### 4.2. Ferramentas de Validação

#### DNS e Autenticação

```bash
# Verificar SPF
dig TXT kaven.com +short

# Verificar DKIM
dig TXT pm._domainkey.auth.kaven.com +short

# Verificar DMARC
dig TXT _dmarc.kaven.com +short

# Verificar MX
dig MX kaven.com +short
```

#### Teste de Envio

```typescript
// apps/api/src/scripts/test-email.ts

import { emailService } from '../lib/email';

async function testEmailInfrastructure() {
  try {
    // 1. Enviar e-mail de teste
    const result = await emailService.send({
      to: 'your-test@email.com',
      subject: 'Teste de Infraestrutura - Kaven',
      template: 'welcome',
      type: 'transactional',
      data: {
        userName: 'Test User'
      }
    });

    console.log('✅ E-mail enviado:', result.messageId);

    // 2. Verificar inbox placement
    console.log('📧 Verifique:');
    console.log('- E-mail chegou na caixa de entrada (não spam)?');
    console.log('- DKIM passou? (ver headers do e-mail)');
    console.log('- SPF passou? (ver headers do e-mail)');
    console.log('- Logo BIMI apareceu? (Gmail/Yahoo)');

  } catch (error) {
    console.error('❌ Erro ao enviar:', error);
  }
}

testEmailInfrastructure();
```

#### Monitoramento de Reputação

```typescript
// apps/api/src/lib/observability/email-health.ts

export async function getEmailHealthMetrics() {
  const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const metrics = await prisma.$queryRaw`
    SELECT 
      COUNT(*) FILTER (WHERE "emailBounced" = true) as bounces,
      COUNT(*) FILTER (WHERE "emailOptOut" = true) as opt_outs,
      COUNT(*) as total_users,
      (COUNT(*) FILTER (WHERE "emailBounced" = true)::float / COUNT(*)::float) as bounce_rate
    FROM "User"
    WHERE "createdAt" >= ${last7Days}
  `;

  return metrics;
}
```

### 4.3. Testes de Spam Score

Use o **Mail Tester** (https://www.mail-tester.com/):

1. Envie um e-mail para o endereço gerado
2. Verifique o score (target: 10/10)
3. Corrija os warnings apontados

**Principais causas de baixo score:**
- SPF/DKIM/DMARC não configurado
- Texto vs. HTML desbalanceado
- Links encurtados suspeitos
- Imagens sem alt text
- Ratio de links muito alto

---

## 📊 FASE 5: Monitoramento e KPIs

### 5.1. Métricas Críticas

| Métrica | Target | Crítico | Ação se Exceder |
|---------|--------|---------|-----------------|
| **Bounce Rate** | < 2% | > 5% | Pausar envios, investigar lista |
| **Spam Complaint** | < 0.1% | > 0.3% | Remover opt-outs, revisar conteúdo |
| **Inbox Placement** | > 83% | < 70% | Verificar DMARC, revisar reputação |
| **Open Rate** | > 20% | < 10% | Revisar assuntos, segmentação |
| **Unsubscribe Rate** | < 0.5% | > 2% | Revisar frequência, relevância |

### 5.2. Dashboard de Observabilidade

Integre estas métricas ao sistema de observability existente:

```typescript
// apps/api/src/lib/observability/email-metrics.ts

import { metrics } from '../metrics'; // Prometheus client

export const emailMetrics = {
  sent: new metrics.Counter({
    name: 'email_sent_total',
    help: 'Total de e-mails enviados',
    labelNames: ['type', 'template']
  }),

  bounces: new metrics.Counter({
    name: 'email_bounces_total',
    help: 'Total de bounces',
    labelNames: ['type']
  }),

  complaints: new metrics.Counter({
    name: 'email_complaints_total',
    help: 'Total de spam complaints'
  }),

  deliveryTime: new metrics.Histogram({
    name: 'email_delivery_seconds',
    help: 'Tempo de entrega do e-mail',
    buckets: [0.1, 0.5, 1, 2, 5, 10]
  })
};
```

### 5.3. Alertas Automáticos

Configure alertas no Grafana para:

- Bounce rate > 3% em janela de 1 hora
- Spam complaint rate > 0.2% em janela de 1 hora
- Queda de inbox placement > 10% em 24h
- Falha de webhook > 5 vezes consecutivas

---

## 🚀 FASE 6: Roadmap de Melhorias

### Q1 2026

- [ ] Implementar AMP for Email (forms interativos)
- [ ] Adicionar suporte a BIMI com VMC certificate
- [ ] Implementar AI-powered send time optimization
- [ ] A/B testing automatizado de assuntos

### Q2 2026

- [ ] Sistema de reputação por tenant (multi-tenant scoring)
- [ ] Warm-up automático de novos domínios
- [ ] Progressive profiling via e-mail
- [ ] Dashboard de health score por tenant

### Q3 2026

- [ ] Integração com Customer.io para lifecycle avançado
- [ ] Suporte a SMS via Twilio (fallback)
- [ ] E-mails transacionais com i18n automático
- [ ] Compliance automation (GDPR/LGPD)

---

## 📚 Referências e Recursos

### Documentação Oficial

- **Postmark**: https://postmarkapp.com/developer
- **Resend**: https://resend.com/docs
- **DMARC**: https://dmarc.org/overview/
- **Mail Tester**: https://www.mail-tester.com/

### Ferramentas de Validação

- **MXToolbox**: https://mxtoolbox.com/
- **DMARC Analyzer**: https://www.dmarcanalyzer.com/
- **SPF Flattener**: https://dmarcian.com/spf-survey/
- **Email on Acid**: https://www.emailonacid.com/

### Monitoramento de Reputação

- **Google Postmaster Tools**: https://postmaster.google.com/
- **Microsoft SNDS**: https://sendersupport.olc.protection.outlook.com/snds/
- **Spamhaus**: https://www.spamhaus.org/

---

## ⚠️ Troubleshooting Comum

### E-mails caindo em spam

**Causas:**
1. DMARC não configurado ou com `p=none`
2. Warm-up insuficiente
3. Conteúdo com palavras spam-trigger
4. Ratio texto/imagem desbalanceado

**Solução:**
- Aplicar `p=quarantine` após 30 dias de monitoramento
- Reduzir volume e fazer warm-up gradual
- Usar ferramentas como Mail Tester para validar conteúdo
- Manter ratio de 60% texto / 40% imagens

### Webhooks não chegando

**Causas:**
1. Firewall bloqueando IP do provedor
2. HMAC validation falhando (body modificado)
3. Timeout no processamento (>30s)

**Solução:**
- Whitelist os IPs do provedor no Cloudflare
- Capturar raw body antes de parsing
- Responder imediatamente e processar em background

### Hard bounces frequentes

**Causas:**
1. Lista de e-mails com typos
2. Endereços desatualizados
3. Domínios inexistentes

**Solução:**
- Implementar validação de e-mail no signup (regex + MX lookup)
- Verificar com serviço de validação (ZeroBounce, NeverBounce)
- Remover automaticamente hard bounces da lista ativa

---

## 🎯 Conclusão

Este manual estabelece uma infraestrutura de e-mail enterprise-grade para o Kaven v2.0, cobrindo todos os aspectos críticos desde configuração DNS até monitoramento em produção.

### Checklist Final de Implementação

**Infraestrutura Externa (Pré-Deploy):**
- [ ] Registros DNS configurados no Cloudflare (SPF, DKIM, DMARC)
- [ ] Subdomínios isolados criados (auth.kaven.com, mail.kaven.com)
- [ ] Conta do provedor configurada (Postmark/Resend)
- [ ] Domínios verificados no painel do provedor
- [ ] Webhooks registrados com HTTPS endpoints
- [ ] DMARC iniciado em modo `p=none` para coleta de relatórios

**Código (Backend Fastify):**
- [ ] Email Service Singleton implementado
- [ ] Provider abstraction layer criada
- [ ] Template engine com cache configurado
- [ ] Webhook handler com validação HMAC
- [ ] Bounce/Complaint handlers automáticos
- [ ] Idempotency keys em todos os envios
- [ ] Double opt-in flow implementado
- [ ] One-click unsubscribe habilitado

**Segurança e Conformidade:**
- [ ] Variáveis de ambiente configuradas
- [ ] HMAC validation em todos os webhooks
- [ ] Isolamento de fluxos transacional/marketing
- [ ] GDPR/LGPD compliance (opt-in explícito)
- [ ] Audit logs de bounces e complaints
- [ ] Rate limiting em endpoints de envio

**Monitoramento e Validação:**
- [ ] Métricas Prometheus exportadas
- [ ] Dashboard Grafana configurado
- [ ] Alertas automáticos para métricas críticas
- [ ] Testes de spam score (target: 10/10)
- [ ] Validação de inbox placement
- [ ] Health checks de reputação configurados

### Próximos Passos Imediatos

**Semana 1: Setup Infraestrutura**
1. Configurar todos os registros DNS
2. Aguardar propagação (24-48h)
3. Verificar resolução DNS com `dig`
4. Validar SPF/DKIM/DMARC em ferramentas online

**Semana 2: Implementação Código**
1. Criar estrutura de pastas proposta
2. Implementar Email Service com provider escolhido
3. Configurar templates HTML responsivos
4. Implementar webhook handlers com validação HMAC

**Semana 3: Testes e Validação**
1. Testar envio de todos os templates
2. Simular bounces e complaints
3. Verificar inbox placement em Gmail/Outlook/Yahoo
4. Validar score em Mail Tester (target: 10/10)

**Semana 4: Warm-up e Monitoramento**
1. Iniciar warm-up gradual (500-1000/dia)
2. Monitorar métricas diariamente
3. Ajustar volume baseado em bounce/complaint rates
4. Aplicar `p=quarantine` no DMARC após validação

### Métricas de Sucesso (90 dias)

Ao final de 3 meses, você deve atingir:

| Métrica | Target | Status Elite |
|---------|--------|--------------|
| **Inbox Placement Rate** | > 83% | > 90% |
| **Bounce Rate** | < 2% | < 1% |
| **Spam Complaint Rate** | < 0.1% | < 0.05% |
| **Open Rate (Transacional)** | > 40% | > 60% |
| **Open Rate (Marketing)** | > 20% | > 30% |
| **DMARC Pass Rate** | 100% | 100% |
| **Time to Inbox** | < 2s | < 1s |
| **Webhook Delivery Rate** | > 99% | 99.9% |

### Riscos Críticos e Mitigações

**Risco 1: Bloqueio Total do Domínio**
- **Causa**: Warm-up inadequado ou spam complaints > 0.3%
- **Mitigação**: Iniciar com volume baixo (500/dia) e escalar gradualmente
- **Plano B**: Ter domínio backup pré-configurado (backup.kaven.com)

**Risco 2: Webhooks Comprometidos**
- **Causa**: HMAC validation falha por body modificado
- **Mitigação**: Capturar raw body antes de qualquer parsing
- **Plano B**: Implementar retry mechanism com backoff exponencial

**Risco 3: Hard Bounces Excessivos**
- **Causa**: Lista com e-mails inválidos ou typos
- **Mitigação**: Validação no signup + verificação MX lookup
- **Plano B**: Integrar serviço de validação (ZeroBounce/NeverBounce)

**Risco 4: Não Conformidade GDPR/LGPD**
- **Causa**: Opt-in implícito ou falta de one-click unsubscribe
- **Mitigação**: Double opt-in obrigatório + List-Unsubscribe header
- **Plano B**: Audit trail completo de consentimentos com timestamp

### Suporte e Recursos Adicionais

**Comunidade Kaven:**
- Discord: https://discord.gg/kaven
- GitHub Issues: https://github.com/your-org/kaven-boilerplate/issues
- Documentação: http://localhost:3002/platform/email-infrastructure

**Consultoria Especializada:**
- Para implementação personalizada ou migração complexa
- Para auditoria de segurança e conformidade
- Para otimização de entregabilidade enterprise
- Contato: support@kaven.com

---

## 📞 Contato e Suporte

**Dúvidas Técnicas:**
- GitHub: https://github.com/your-org/kaven-boilerplate
- Discord: #email-infrastructure channel
- Email: tech@kaven.com

**Emergências de Produção:**
- Status Page: https://status.kaven.com
- Incident Response: incidents@kaven.com
- Phone: +55 (11) 9999-9999

---

**Desenvolvido pela equipe Kaven**  
**Versão:** 2.0.0 | **Última Atualização:** Janeiro 2026

> **Nota Importante**: Este manual é um documento vivo. À medida que você implementa e descobre edge cases específicos do seu negócio, contribua de volta com pull requests na documentação oficial do Kaven.

---

## 🔐 Apêndice A: Templates HTML Responsivos

### Template: Welcome Email

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo ao Kaven</title>
  <style>
    body { 
      margin: 0; 
      padding: 0; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
    }
    .content {
      padding: 40px 30px;
      line-height: 1.6;
      color: #333333;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff !important;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      background: #f8f9fa;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Bem-vindo ao Kaven!</h1>
    </div>
    <div class="content">
      <p>Olá {{userName}},</p>
      <p>É um prazer tê-lo(a) conosco! Sua conta foi criada com sucesso e você já pode começar a explorar todos os recursos da plataforma.</p>
      <p>Para garantir a segurança da sua conta, por favor confirme seu endereço de e-mail:</p>
      <center>
        <a href="{{verificationLink}}" class="cta-button">Confirmar E-mail</a>
      </center>
      <p><small>Este link expira em 24 horas.</small></p>
      <p>Se você não criou esta conta, pode ignorar este e-mail com segurança.</p>
      <p>Abraços,<br><strong>Equipe Kaven</strong></p>
    </div>
    <div class="footer">
      <p>© 2026 Kaven Platform. Todos os direitos reservados.</p>
      <p>Você recebeu este e-mail porque criou uma conta em kaven.com</p>
    </div>
  </div>
</body>
</html>
```

### Template: Password Reset

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redefinição de Senha</title>
  <style>
    body { 
      margin: 0; 
      padding: 0; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f8f9fa;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    .header {
      background: #dc3545;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 40px 30px;
      line-height: 1.6;
      color: #333333;
    }
    .otp-code {
      background: #f8f9fa;
      border: 2px dashed #dc3545;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: 8px;
      color: #dc3545;
      margin: 20px 0;
    }
    .warning {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 12px;
      margin: 20px 0;
      font-size: 14px;
    }
    .footer {
      background: #f8f9fa;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔒 Redefinição de Senha</h1>
    </div>
    <div class="content">
      <p>Olá {{userName}},</p>
      <p>Recebemos uma solicitação para redefinir a senha da sua conta Kaven.</p>
      <p>Use o código abaixo para criar uma nova senha:</p>
      <div class="otp-code">{{resetCode}}</div>
      <p><small>Este código expira em 1 hora e só pode ser usado uma vez.</small></p>
      <div class="warning">
        <strong>⚠️ Atenção:</strong> Se você não solicitou esta redefinição, ignore este e-mail. Sua senha atual permanecerá inalterada.
      </div>
      <p>Por segurança, recomendamos escolher uma senha forte com pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números.</p>
      <p>Atenciosamente,<br><strong>Equipe Kaven</strong></p>
    </div>
    <div class="footer">
      <p>© 2026 Kaven Platform. Todos os direitos reservados.</p>
      <p>Este é um e-mail de segurança automático. Não responda.</p>
    </div>
  </div>
</body>
</html>
```

---

## 🔐 Apêndice B: Tipos TypeScript

```typescript
// apps/api/src/lib/email/types.ts

export interface EmailPayload {
  to: string;
  from?: string;
  subject: string;
  template: EmailTemplate;
  type: 'transactional' | 'marketing';
  data: Record<string, any>;
  tenantId?: string;
  userId?: string;
  idempotencyKey?: string;
  html?: string;
  text?: string;
  attachments?: EmailAttachment[];
}

export type EmailTemplate = 
  | 'welcome'
  | 'password-reset'
  | 'email-verify'
  | 'invoice'
  | 'notification'
  | 'trial-ending'
  | 'subscription-updated';

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
}

export interface EmailProvider {
  send(payload: EmailPayload): Promise<{ messageId: string }>;
}

export interface PostmarkWebhookEvent {
  RecordType: 'Bounce' | 'SpamComplaint' | 'Open' | 'Click' | 'Delivery';
  Type?: string;
  TypeCode?: number;
  Email: string;
  BouncedAt?: string;
  MessageID: string;
  ServerID: number;
  Tag?: string;
  Metadata?: Record<string, any>;
}

export interface EmailMetrics {
  sent: number;
  delivered: number;
  bounced: number;
  complaints: number;
  opened: number;
  clicked: number;
  bounceRate: number;
  complaintRate: number;
  openRate: number;
  clickRate: number;
}
```

---

**FIM DO MANUAL** ✅

Este guia completo está pronto para implementação imediata no Kaven v2.0!