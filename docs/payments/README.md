# Métodos de Pagamento - Kaven

Documentação centralizada de todos os métodos de pagamento integrados ao sistema Kaven.

---

## 📋 Providers Disponíveis

### ✅ PagueBit (Implementado)

- **Tipo:** PIX (Brasil)
- **Status:** ✅ Produção
- **Documentação:** [./paguebit/README.md](./paguebit/README.md)
- **Features:**
  - QR Code Dinâmico
  - Webhooks HMAC v2
  - Retry automático
  - Idempotência

### 🔄 Stripe (Parcial)

- **Tipo:** Cartão de Crédito (Internacional)
- **Status:** 🔄 Implementação básica
- **Documentação:** [./stripe/README.md](./stripe/README.md)
- **Features:**
  - Subscriptions
  - Payment Methods
  - Webhooks

### ⏸️ Mercado Pago (Planejado)

- **Tipo:** PIX + Cartão (Brasil)
- **Status:** ⏸️ Aguardando
- **Documentação:** [./mercadopago/README.md](./mercadopago/README.md)

---

## 🏗️ Arquitetura

### Interface Agnóstica

Todos os providers implementam `IPixProvider`:

```typescript
export interface IPixProvider {
  createDynamicQRCode(params: CreateQRCodeParams): Promise<QRCodeResponse>;
  getPaymentStatus(paymentId: string): Promise<PaymentStatus>;
  validateWebhook(signature: string, body: string, timestamp: string): boolean;
  processWebhook(payload: WebhookPayload): Promise<void>;
}
```

**Benefícios:**

- Trocar provider sem alterar código
- Múltiplos providers simultâneos
- Testes mais fáceis

### Estrutura de Pastas

```
apps/api/src/modules/payments/
├── providers/
│   ├── pix.interface.ts          # Interface agnóstica
│   ├── paguebit/                 # Provider PagueBit
│   ├── stripe/                   # Provider Stripe
│   └── mercadopago/              # Provider Mercado Pago (futuro)
├── controllers/
│   └── payment.controller.ts
└── routes/
    └── payment.routes.ts
```

---

## 🚀 Quick Start

### 1. Configurar Variáveis de Ambiente

```bash
# .env
PAGUEBIT_API_TOKEN=seu-token
PAGUEBIT_WEBHOOK_SECRET=seu-secret

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Criar Pagamento

```bash
curl -X POST http://localhost:8000/api/payments/paguebit/create \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "uuid",
    "tenantId": "uuid",
    "planId": "uuid"
  }'
```

### 3. Configurar Webhook

**PagueBit:**

```
https://seu-dominio.com/api/webhooks/paguebit
```

**Stripe:**

```
https://seu-dominio.com/api/webhooks/stripe
```

---

## 📊 Comparação de Providers

| Feature       | PagueBit | Stripe | Mercado Pago |
| ------------- | -------- | ------ | ------------ |
| PIX           | ✅       | ❌     | ✅           |
| Cartão        | ❌       | ✅     | ✅           |
| Boleto        | ❌       | ❌     | ✅           |
| Internacional | ❌       | ✅     | ❌           |
| Taxa          | ~1%      | ~4%    | ~3%          |
| Webhooks      | ✅       | ✅     | ✅           |
| Retry         | ✅       | ✅     | ⏸️           |

---

## 🔒 Segurança

### Checklist Geral

- [x] Validação de webhooks (HMAC)
- [x] Idempotência implementada
- [x] Secrets em variáveis de ambiente
- [x] HTTPS obrigatório
- [x] Rate limiting
- [x] Logs de auditoria

### Validação de Webhooks

**PagueBit (HMAC-SHA256 v2):**

```typescript
const payload = timestamp + body;
const signature = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');
```

**Stripe:**

```typescript
const event = stripe.webhooks.constructEvent(body, signature, secret);
```

---

## 📚 Documentação Detalhada

- **PagueBit:** [./paguebit/README.md](./paguebit/README.md)
- **Stripe:** [./stripe/README.md](./stripe/README.md)
- **Mercado Pago:** [./mercadopago/README.md](./mercadopago/README.md)

---

**Última Atualização:** 05/01/2026  
**Versão:** 1.0.0
