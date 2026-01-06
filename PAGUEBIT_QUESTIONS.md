# Perguntas Técnicas - Integração PagueBit API

## 🎯 Contexto

Estamos integrando a API Pública do PagueBit em nossa plataforma SaaS multi-tenant. Durante a análise da documentação, identificamos algumas inconsistências e informações faltantes que estão bloqueando nossa implementação.

---

## 🔴 PERGUNTAS CRÍTICAS (Bloqueiam Implementação)

### 1. Validação de Assinatura do Webhook

**Problema:** A documentação apresenta **dois formatos diferentes** para validar a assinatura do webhook.

**Versão 1 (Seção "Webhooks"):**

```javascript
// Header: x-webhook-signature (lowercase)
const signature = crypto
  .createHmac('sha256', webhookSecret)
  .update(body)
  .digest('hex');
```

**Versão 2 (Seção "Testando Webhooks"):**

```javascript
// Headers: X-Paguebit-Signature, X-Paguebit-Timestamp (CamelCase)
const signedPayload = `${timestamp}.${rawBody}`;
const signature = crypto
  .createHmac('sha256', webhookSecret)
  .update(signedPayload)
  .digest('hex');
```

**❓ PERGUNTA:**

- Qual é o formato correto de validação?
- Os headers são `x-webhook-signature` (lowercase) ou `X-Paguebit-Signature` (CamelCase)?
- A assinatura é calculada sobre o `body` direto ou sobre `timestamp.body`?

**Nossa Implementação Planejada:**

```typescript
// apps/api/src/modules/payments/providers/paguebit/paguebit.webhook.ts
export function validateWebhookSignature(
  headers: Record<string, string>,
  rawBody: string,
  secret: string,
): boolean {
  // ⚠️ QUAL IMPLEMENTAÇÃO USAR?

  // Opção A:
  const signature = headers['x-webhook-signature'];
  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  // Opção B:
  const signature = headers['X-Paguebit-Signature'];
  const timestamp = headers['X-Paguebit-Timestamp'];
  const signedPayload = `${timestamp}.${rawBody}`;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
```

---

### 2. Expiração do QR Code

**Problema:** A documentação não menciona o tempo de expiração do QR Code Pix.

**Referência na Documentação:**

- ❌ Campo `expiresAt` não aparece na response de `POST /api-public/payments`
- ❌ Não há menção ao tempo de validade

**Nossa Necessidade:**

```typescript
// Frontend precisa exibir countdown
interface PixPaymentResponse {
  id: string;
  qrCodeUrl: string;
  qrCopyPaste: string;
  expiresAt: string; // ⚠️ Este campo existe?
}

// Componente React
<PaymentModal>
  <QRCode src={payment.qrCodeUrl} />
  <Countdown expiresAt={payment.expiresAt} /> {/* Precisa do timestamp */}
</PaymentModal>
```

**❓ PERGUNTAS:**

- Qual é o tempo de expiração do QR Code? (assumimos 30 minutos, está correto?)
- A API retorna o campo `expiresAt` na response?
- Se não, como sabemos quando o pagamento expirou?

---

### 3. Ambiente Sandbox/Testes

**Problema:** Não encontramos informações sobre ambiente de testes.

**Nossa Necessidade:**

- Testar integração sem usar dinheiro real
- Simular diferentes cenários (sucesso, falha, timeout)
- Executar testes automatizados em CI/CD

**❓ PERGUNTAS:**

- Existe ambiente sandbox/staging?
- Se sim, qual é a URL base?
- Como simular pagamentos aprovados/rejeitados em testes?
- Existem tokens de teste específicos?

**Nossa Configuração Planejada:**

```typescript
// apps/api/src/config/paguebit.config.ts
export const pagueBitConfig = {
  production: {
    baseUrl: 'https://public-api-prod.paguebit.com',
    apiToken: process.env.PAGUEBIT_API_TOKEN,
  },
  sandbox: {
    baseUrl: '???', // ⚠️ Qual URL?
    apiToken: process.env.PAGUEBIT_SANDBOX_TOKEN,
  },
};
```

---

## 🟡 PERGUNTAS IMPORTANTES (Afetam Qualidade)

### 4. Rate Limiting

**❓ PERGUNTA:**

- Existe limite de requisições por minuto/hora?
- Se sim, quais são os limites?
- Qual header retorna informações de rate limit?

**Nossa Implementação:**

```typescript
// Precisamos implementar retry com backoff
async function createPaymentWithRetry(params: CreatePaymentDto) {
  try {
    return await pagueBitClient.post('/payments', params);
  } catch (error) {
    if (error.status === 429) {
      // ⚠️ Quanto tempo esperar?
      await sleep(???);
      return retry();
    }
  }
}
```

---

### 5. Retry Policy de Webhooks

**❓ PERGUNTAS:**

- Quantas retentativas são feitas se nosso endpoint retornar erro (5xx)?
- Qual é o intervalo entre retentativas?
- Após quanto tempo o webhook é considerado falho?
- Existe um painel para reenviar webhooks manualmente?

**Nossa Implementação:**

```typescript
// Precisamos saber se devemos implementar idempotência
export async function handleWebhook(payload: WebhookPayload) {
  const eventId = payload.eventId; // ⚠️ Pode receber duplicado?

  // Verificar se já processamos este evento
  const processed = await db.webhookEvents.findUnique({ where: { eventId } });
  if (processed) return; // Idempotência

  // Processar...
}
```

---

### 6. Cancelamento/Estorno

**❓ PERGUNTAS:**

- É possível cancelar um pagamento pendente via API?
- É possível estornar um pagamento aprovado via API?
- Se sim, quais são os endpoints?

**Cenários de Uso:**

- Cliente solicita cancelamento antes de pagar
- Lojista precisa estornar pagamento por erro
- Pagamento duplicado

---

## 🟢 PERGUNTAS DESEJÁVEIS (Melhoram Produto)

### 7. Conversão para Criptomoedas

A documentação não menciona a conversão para Bitcoin/USDT, que é o diferencial do PagueBit.

**❓ PERGUNTAS:**

- A API retorna o valor convertido em BTC/USDT?
- É possível escolher a moeda de recebimento (BTC ou USDT)?
- A cotação utilizada é informada na response?
- Existe endpoint para consultar cotação atual?

---

### 8. Multi-Tenancy

Nossa plataforma é multi-tenant (múltiplas lojas).

**❓ PERGUNTAS:**

- Como gerenciar múltiplos tokens (um por loja)?
- É possível criar sub-contas via API?
- Existe limite de lojas por conta principal?

**Nossa Arquitetura:**

```typescript
// Cada tenant tem seu próprio token
interface TenantPagueBitConfig {
  tenantId: string;
  apiToken: string; // Token específico da loja
  webhookSecret: string; // Secret específico da loja
  storeId: string; // ID da loja no PagueBit
}
```

---

## 📝 Informações Adicionais

**Documentação Analisada:**

- ✅ https://docs.paguebit.com/public-api
- ✅ https://docs.paguebit.com/public-api/webhooks
- ✅ https://docs.paguebit.com/api-reference/*

**Nossa Stack:**

- Backend: Node.js 20 + Fastify
- Database: PostgreSQL 16
- Frontend: Next.js 14 + React

**Timeline:**

- Início da implementação: Semana de 06/01/2026
- Deploy previsto: Final de janeiro/2026

---

## 🙏 Agradecimentos

Agradecemos antecipadamente pela atenção e aguardamos retorno sobre essas questões para darmos continuidade à integração.

**Prioridade de Resposta:**

1. 🔴 Perguntas 1, 2 e 3 (bloqueiam implementação)
2. 🟡 Perguntas 4, 5 e 6 (afetam qualidade)
3. 🟢 Perguntas 7 e 8 (melhoram produto)
