# RELATÓRIO COMPLETO: Integração PagueBit no Kaven Boilerplate

> **Versão:** 1.0.0  
> **Data:** 31 de dezembro de 2025  
> **Autor:** Claude (Assistente de IA)  
> **Status:** ✅ DOCUMENTAÇÃO COMPLETA ANALISADA

---

## 📋 ÍNDICE

1. [Resumo Executivo](#1-resumo-executivo)
2. [Documentação Analisada](#2-documentação-analisada)
3. [Especificação Técnica Completa](#3-especificação-técnica-completa)
4. [Análise de Gaps e Inconsistências](#4-análise-de-gaps-e-inconsistências)
5. [Perguntas para o Time de Dev](#5-perguntas-para-o-time-de-dev)
6. [Alinhamento com Kaven Boilerplate](#6-alinhamento-com-kaven-boilerplate)
7. [Proposta de Implementação](#7-proposta-de-implementação)
8. [Código de Implementação](#8-código-de-implementação)
9. [Testes](#9-testes)
10. [Checklist de Implementação](#10-checklist-de-implementação)

---

## 1. RESUMO EXECUTIVO

### 1.1 O Que é o PagueBit

O PagueBit é um gateway de pagamentos Pix focado em **conversão automática para criptomoedas** (Bitcoin/USDT). O diferencial principal:

- **Cliente paga em BRL** via Pix
- **Lojista recebe em Bitcoin ou USDT**
- API RESTful simples e direta
- Webhook com assinatura HMAC-SHA256

### 1.2 Adequação ao Kaven Boilerplate

| Aspecto       | Status        | Observação                     |
| ------------- | ------------- | ------------------------------ |
| API REST      | ✅ Compatível | Fastify suporta nativamente    |
| Autenticação  | ✅ Compatível | Bearer Token simples           |
| Webhooks      | ✅ Compatível | HMAC-SHA256 padrão             |
| Multi-tenancy | ⚠️ Adaptação  | Token por loja, não por tenant |
| Limites       | ⚠️ Atenção    | R$3.000 máx por pagamento      |

### 1.3 Avaliação Geral da Documentação

| Critério            | Nota | Justificativa                 |
| ------------------- | ---- | ----------------------------- |
| Completude          | 7/10 | Funcional mas faltam detalhes |
| Clareza             | 8/10 | Bem escrita e com exemplos    |
| Exemplos            | 8/10 | Bons exemplos em Node.js      |
| Referência de Erros | 9/10 | Excelente documentação        |
| Webhooks            | 6/10 | Inconsistências detectadas    |

---

## 2. DOCUMENTAÇÃO ANALISADA

### 2.1 Páginas Acessadas

| Página          | URL                                       | Status |
| --------------- | ----------------------------------------- | ------ |
| API Overview    | /public-api                               | ✅     |
| Autenticação    | /public-api/authentication                | ✅     |
| Fluxo Completo  | /public-api/fluxo-completo                | ✅     |
| Limites         | /public-api/limits                        | ✅     |
| Erros           | /public-api/errors                        | ✅     |
| Endpoints       | /public-api/endpoints                     | ✅     |
| Status          | /public-api/status                        | ✅     |
| Webhooks        | /public-api/webhooks                      | ✅     |
| API Ref: Listar | /api-reference/listar-pagamentos-por-loja | ✅     |
| API Ref: Criar  | /api-reference/criar-pagamento-dinamico   | ✅     |
| API Ref: Buscar | /api-reference/buscar-pagamento-por-id    | ✅     |

### 2.2 Informações Extraídas

**Total de endpoints documentados:** 3
**Eventos de webhook:** 2
**Status de pagamento:** 8
**Códigos de erro:** 6

---

## 3. ESPECIFICAÇÃO TÉCNICA COMPLETA

### 3.1 Informações Gerais

```yaml
Base URL (Produção): https://public-api-prod.paguebit.com
API Path: /api-public/payments (nota: docs menciona /public-api/v1/payments também)
Autenticação: Bearer Token
Content-Type: application/json
```

### 3.2 Autenticação

```http
Authorization: Bearer <token>
```

**Características:**

- Token vinculado a uma **loja específica**
- Gerado no painel administrativo
- Ao criar token, recebe também um `webhookSecret`
- Token não expira (não mencionado expiração)

### 3.3 Endpoints

#### 3.3.1 Criar Pagamento

```http
POST /api-public/payments
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```typescript
interface CreatePaymentRequest {
  amount: number; // Obrigatório: R$ 5.00 - R$ 3.000.00
  email?: string; // Opcional: email do cliente
  observation?: string; // Opcional: texto livre (max 2048 chars)
  webhookUrl?: string; // Opcional: URL para receber webhooks
}
```

**Response (201 Created):**

```typescript
interface PaymentResponse {
  id: string; // ID do pagamento (ex: "pay_123")
  status: PaymentStatus;
  amount: number;
  storeId: string;
  createdAt: string; // ISO 8601
  webhookUrl?: string;
  observation?: string;
  email?: string;
  qrCodeUrl?: string; // URL da imagem do QR Code
  qrCopyPaste?: string; // Código EMV para copia e cola
  isPublic: boolean; // Sempre true via API pública
}
```

#### 3.3.2 Buscar Pagamento por ID

```http
GET /api-public/payments/{id}
Authorization: Bearer <token>
```

**Response:** Mesmo formato de `PaymentResponse`

#### 3.3.3 Listar Pagamentos

```http
GET /api-public/payments
Authorization: Bearer <token>
```

**Query Parameters:**

```typescript
interface ListPaymentsQuery {
  page?: number; // Default: 1, Min: 1
  limit?: number; // Default: 50, Min: 1, Max: 200
  status?: 'pending' | 'approved' | 'review' | 'not_approved';
}
```

**Response:**

```typescript
interface ListPaymentsResponse {
  items: PaymentResponse[];
  page: number;
  limit: number;
  total: number;
}
```

### 3.4 Status de Pagamentos

```typescript
enum PaymentStatus {
  // Status principais (público)
  PENDING = 'pending', // Aguardando pagamento
  APPROVED = 'approved', // ✅ ÚNICO que confirma recebimento
  REVIEW = 'review', // Em análise (NÃO significa aprovado!)
  NOT_APPROVED = 'not_approved', // Não aprovado/cancelado/expirado

  // Status internos (uso interno PagueBit)
  PAID = 'paid', // Consolidado
  WITHDRAWAL_PROCESSING = 'withdrawal_processing', // Processando saque
  RECEIPT_SENT = 'receipt_sent', // Comprovante enviado
  REJECTED = 'rejected', // Rejeitado
}
```

**⚠️ REGRA CRÍTICA:**

> Somente o status `approved` indica que o valor foi confirmado.
> Pagamentos em `review` por mais de 30 minutos são **automaticamente reembolsados**.

### 3.5 Limites

| Tipo                       | Valor       |
| -------------------------- | ----------- |
| Valor mínimo por pagamento | R$ 5,00     |
| Valor máximo por pagamento | R$ 3.000,00 |
| Limite diário por CPF      | R$ 6.000,00 |

**Comportamento ao ultrapassar limite diário:**

1. Pagamento pode ser criado e pago
2. Vai para status `review`
3. Automaticamente reembolsado
4. Status final: `not_approved`

### 3.6 Webhooks

#### Headers Enviados

```typescript
interface WebhookHeaders {
  'X-Paguebit-Signature': string; // HMAC-SHA256 do payload
  'X-Paguebit-Timestamp': string; // Unix timestamp
  'X-Paguebit-Event-Id': string; // ID único do evento
}
```

#### Eventos

**1. payment.created**

```typescript
interface PaymentCreatedEvent {
  event: 'payment.created';
  id: string;
  status: PaymentStatus;
  amount: number;
  storeId: string;
  createdAt: string;
  email?: string;
  observation?: string;
  qrCodeUrl?: string;
  qrCopyPaste?: string;
  isPublic: boolean;
  // NÃO inclui webhookUrl
}
```

**2. payment.status_changed**

```typescript
interface PaymentStatusChangedEvent extends PaymentCreatedEvent {
  event: 'payment.status_changed';
  previousStatus: PaymentStatus;
}
```

#### Validação da Assinatura

```typescript
// Formato da assinatura
const signedPayload = `${timestamp}.${rawBody}`;
const signature = HMAC_SHA256(webhookSecret, signedPayload);
```

**⚠️ IMPORTANTE:** Usar raw body, NÃO fazer JSON.parse + JSON.stringify antes de validar.

### 3.7 Erros

| HTTP Code | Mensagem                       | Causa                      |
| --------- | ------------------------------ | -------------------------- |
| 400       | Valor mínimo permitido...      | amount < 5                 |
| 400       | Valor máximo permitido...      | amount > 3000              |
| 400       | email must be an email         | Email inválido             |
| 400       | observation must be shorter... | observation > 2048 chars   |
| 400       | webhookUrl must be a URL       | URL inválida               |
| 401       | Bearer token ausente           | Header Authorization vazio |
| 401       | Token inválido ou expirado     | Token errado/desativado    |
| 403       | Loja inativa                   | Loja associada desativada  |
| 404       | Pagamento não encontrado       | ID não existe/não pertence |

---

## 4. ANÁLISE DE GAPS E INCONSISTÊNCIAS

### 4.1 🔴 CRÍTICO: Inconsistências na Documentação de Webhooks

**Problema 1: Dois formatos diferentes de validação de assinatura**

A documentação apresenta **duas versões diferentes** de como validar a assinatura:

**Versão 1 (simples):**

```javascript
// Header: x-webhook-signature (lowercase)
const signature = HMAC_SHA256(webhookSecret, body);
```

**Versão 2 (com timestamp):**

```javascript
// Headers: X-Paguebit-Signature, X-Paguebit-Timestamp
const signedPayload = `${timestamp}.${rawBody}`;
const signature = HMAC_SHA256(webhookSecret, signedPayload);
```

**Impacto:** Implementação incorreta causará rejeição de todos os webhooks.

**Pergunta para dev:** Qual é o formato correto? Headers são lowercase ou CamelCase?

---

**Problema 2: Nome dos headers inconsistente**

| Local na Docs | Header de Assinatura   |
| ------------- | ---------------------- |
| Seção inicial | `x-webhook-signature`  |
| Seção Headers | `X-Paguebit-Signature` |

**Pergunta para dev:** Qual é o header correto?

---

### 4.2 🟡 IMPORTANTE: Informações Faltantes

#### 4.2.1 Tempo de Expiração do QR Code

**Problema:** A documentação **não menciona** quanto tempo o QR Code é válido.

**Referência no projeto Kaven:**

```json
// 7__API_SPECIFICATION.md linha 1550
"expiresAt": "2025-12-16T12:30:00Z" // 30 minutes
```

**Pergunta para dev:** Qual é o tempo de expiração do QR Code? É configurável?

---

#### 4.2.2 Campo `expiresAt` Ausente na Response

**Problema:** A response de criação de pagamento não inclui `expiresAt`.

**Necessário para:**

- Exibir countdown para o cliente
- Invalidar pagamentos expirados no frontend
- Evitar polling desnecessário

**Pergunta para dev:** O campo `expiresAt` existe? Se não, como saber quando expira?

---

#### 4.2.3 Rate Limiting

**Problema:** Não há menção a rate limiting na documentação.

**Necessário para:**

- Implementar backoff em caso de 429
- Dimensionar polling de status
- Evitar bloqueio da aplicação

**Pergunta para dev:** Existe rate limiting? Se sim, quais são os limites?

---

#### 4.2.4 Ambiente Sandbox

**Problema:** Não há menção a ambiente de testes/sandbox.

**Necessário para:**

- Testar integração sem usar dinheiro real
- Simular diferentes cenários (sucesso, falha, timeout)
- CI/CD e testes automatizados

**Pergunta para dev:** Existe ambiente sandbox? Qual a URL? Como simular pagamentos?

---

#### 4.2.5 Cancelamento/Estorno

**Problema:** Não há endpoint para cancelar ou estornar pagamentos.

**Cenários não cobertos:**

- Cliente solicita cancelamento antes de pagar
- Lojista precisa estornar pagamento aprovado
- Pagamento duplicado

**Pergunta para dev:** É possível cancelar/estornar via API? Qual endpoint?

---

#### 4.2.6 Retry Policy de Webhooks

**Problema:** Não há informação sobre retentativas de webhook.

**Necessário para:**

- Saber se precisa implementar idempotência
- Entender comportamento em caso de falha (5xx)
- Dimensionar timeout do endpoint

**Pergunta para dev:**

- Quantas retentativas são feitas?
- Qual é o intervalo entre retentativas?
- Após quanto tempo o webhook é considerado falho?

---

## 4.3 ✅ RESPOSTAS CONFIRMADAS (05/01/2026)

### 4.3.1 Validação de Webhook

**✅ CONFIRMADO:** Usar Versão 2 (com timestamp)

```typescript
const signature = headers['X-Paguebit-Signature'];
const timestamp = headers['X-Paguebit-Timestamp'];
const signedPayload = `${timestamp}.${rawBody}`;
const expected = crypto
  .createHmac('sha256', webhookSecret)
  .update(signedPayload)
  .digest('hex');
```

### 4.3.2 Expiração de QR Code

**✅ CONFIRMADO:** 10 minutos

**Comportamento:**

- Após 10 minutos → status muda para `not_approved` (não existe status `expired`)
- Se cliente pagar QR expirado → **estornado automaticamente**

**Implementação:**

```typescript
// Frontend calcula expiração
const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
```

### 4.3.3 Status de Revisão

**✅ CONFIRMADO:**

- Recebemos webhook em **todas as trocas de status** (pending, review, approved, not_approved)
- Reembolso demora **no máximo 1 hora** (pode levar até 1 dia em casos específicos)

**Implementação:**

```typescript
switch (payload.status) {
  case 'review':
    // Em análise - NÃO confirmar ainda
    // Aguardar approved ou not_approved
    break;
  case 'approved':
    // ✅ ÚNICO que confirma recebimento
    break;
}
```

### 4.3.4 Cancelamento

**✅ CONFIRMADO:**

- ❌ Não existe endpoint de cancelamento
- Sistema cancela automaticamente após expiração do QR Code (10 minutos)
- Status final: `not_approved`

### 4.3.5 Rate Limiting

**✅ CONFIRMADO:**

- Limite: 300 requisições por minuto por IP
- ❌ API **não retorna** headers informativos (`X-RateLimit-*`)

**Implementação:**

```typescript
// Retry com backoff exponencial
async function callPagueBitAPI(endpoint, data, retries = 3) {
  try {
    return await axios.post(endpoint, data);
  } catch (error) {
    if (error.response?.status === 429 && retries > 0) {
      const delay = Math.pow(2, 4 - retries) * 1000; // 2s, 4s, 8s
      await sleep(delay);
      return callPagueBitAPI(endpoint, data, retries - 1);
    }
    throw error;
  }
}
```

### 4.3.6 Ambiente Sandbox

**⏸️ PENDENTE:** Não existe ambiente sandbox no momento.

**Estratégia:**

- Implementar Mock Mode completo para desenvolvimento
- Testes em produção com valores mínimos (R$ 5,00)

### 4.3.7 QR Code Estático e Loja Virtual

**⏸️ AGUARDANDO RESPOSTA:**

- API para buscar QR Code Estático
- API para gerenciar produtos da Loja Virtual

---

---

### 4.3 🟢 MENOR: Sugestões de Melhoria

#### 4.3.1 URL Base Inconsistente

A documentação menciona dois paths diferentes:

- `/api-public/payments` (nos exemplos curl)
- `/public-api/v1/payments` (no fluxo completo)

**Pergunta para dev:** Qual é o path canônico? Ambos funcionam?

---

#### 4.3.2 Formato do ID

O ID de pagamento é mostrado como `pay_123` mas não há especificação formal.

**Pergunta para dev:** Qual é o formato exato? UUID? Prefixo `pay_` sempre presente?

---

#### 4.3.3 Conversão para Cripto

**Grande ausência:** A documentação não menciona **nada** sobre a conversão para Bitcoin/USDT, que é o principal diferencial do produto.

**Perguntas para dev:**

- A API retorna a cotação utilizada?
- O valor em cripto é informado em algum momento?
- É possível escolher entre BTC e USDT?
- A conversão é imediata ou há delay?

---

## 5. PERGUNTAS PARA O TIME DE DEV

### 5.1 Lista Consolidada de Perguntas

```markdown
## CRÍTICAS (bloqueiam implementação)

1. **Webhook Signature:** Qual é o formato correto de validação?
   - Opção A: HMAC_SHA256(secret, body) com header `x-webhook-signature`
   - Opção B: HMAC_SHA256(secret, `${timestamp}.${body}`) com header `X-Paguebit-Signature`

2. **QR Code Expiration:** Quanto tempo o QR Code é válido? O campo `expiresAt` existe na response?

3. **Sandbox:** Existe ambiente de testes? Qual URL? Como simular pagamentos?

## IMPORTANTES (afetam qualidade)

4. **Rate Limiting:** Existe limite de requisições? Qual?

5. **Webhook Retry:** Quantas retentativas? Qual intervalo? Timeout?

6. **Cancelamento:** É possível cancelar pagamento pendente via API?

7. **Estorno:** É possível estornar pagamento aprovado via API?

8. **URL Path:** Qual é o path canônico? `/api-public/` ou `/public-api/v1/`?

## DESEJÁVEIS (melhoram produto)

9. **Conversão Cripto:**
   - A API retorna valor em BTC/USDT?
   - É possível escolher a moeda de recebimento?
   - A cotação usada é informada?

10. **ID Format:** O ID sempre tem prefixo `pay_`? Qual tamanho máximo?

11. **Múltiplas Lojas:** Como gerenciar múltiplos tokens (multi-tenant)?

12. **Logs/Debug:** Existe endpoint para consultar logs de webhook enviados?
```

### 5.2 Template de Email/Mensagem

```markdown
Olá time PagueBit,

Estou integrando a API Pública no meu projeto e identifiquei algumas dúvidas na documentação:

**1. Validação de Webhook**
A documentação apresenta dois formatos diferentes para validar a assinatura. Qual é o correto?

- Formato 1: header `x-webhook-signature`, assinatura = HMAC(secret, body)
- Formato 2: header `X-Paguebit-Signature`, assinatura = HMAC(secret, timestamp.body)

**2. Expiração do QR Code**
Qual é o tempo de expiração? A response inclui campo `expiresAt`?

**3. Ambiente Sandbox**
Existe ambiente de testes para desenvolvimento?

**4. Cancelamento/Estorno**
É possível cancelar ou estornar pagamentos via API?

**5. Rate Limiting**
Qual é o limite de requisições por minuto/hora?

**6. Webhook Retry**
Quantas retentativas são feitas em caso de falha?

Agradeço a atenção!
```

---

## 6. ALINHAMENTO COM KAVEN BOILERPLATE

### 6.1 Comparação com Especificação Existente

| Aspecto         | Kaven (7\_\_API_SPECIFICATION) | PagueBit                      | Status        |
| --------------- | ------------------------------ | ----------------------------- | ------------- |
| Endpoint criar  | POST /api/payments/pix         | POST /api-public/payments     | ⚠️ Adaptar    |
| Endpoint status | GET /api/payments/pix/:id      | GET /api-public/payments/{id} | ✅ Similar    |
| Webhook         | POST /api/webhooks/pix         | Configurado por pagamento     | ⚠️ Adaptar    |
| Campo expiresAt | Sim (30 min)                   | Não documentado               | ❓ Verificar  |
| Status PENDING  | ✅                             | ✅ pending                    | ✅            |
| Status PAID     | ✅                             | ✅ approved                   | ✅ Mapear     |
| Status EXPIRED  | ✅                             | ❌ not_approved               | ⚠️ Adaptar    |
| Status REFUNDED | ✅                             | ❌ Não disponível             | ❓ Verificar  |
| QR Code base64  | ✅                             | ❌ URL                        | ⚠️ Adaptar    |
| Valor máximo    | Não definido                   | R$ 3.000                      | ⚠️ Considerar |

### 6.2 Adaptações Necessárias no Projeto

#### 6.2.1 Mapeamento de Status

```typescript
// src/modules/payments/providers/paguebit/paguebit.mapper.ts

export const mapPagueBitStatus = (status: string): PaymentStatus => {
  const mapping: Record<string, PaymentStatus> = {
    pending: 'PENDING',
    approved: 'PAID',
    review: 'PROCESSING', // Status intermediário
    not_approved: 'FAILED', // Agrupa expired, cancelled, rejected
    // Status internos (não devem chegar via webhook público)
    paid: 'PAID',
    rejected: 'FAILED',
  };

  return mapping[status] ?? 'UNKNOWN';
};
```

#### 6.2.2 Resposta Normalizada

```typescript
// Kaven espera:
interface KavenPixResponse {
  id: string;
  qrCode: string; // Base64 da imagem
  qrCodeText: string; // EMV copia e cola
  amount: number;
  expiresAt: string; // ISO timestamp
}

// PagueBit retorna:
interface PagueBitResponse {
  id: string;
  qrCodeUrl: string; // URL da imagem (não base64)
  qrCopyPaste: string;
  amount: number;
  // expiresAt não existe
}

// Adaptação necessária:
async function adaptResponse(
  paguebit: PagueBitResponse,
): Promise<KavenPixResponse> {
  // 1. Baixar imagem e converter para base64
  const imageBuffer = await fetch(paguebit.qrCodeUrl).then((r) =>
    r.arrayBuffer(),
  );
  const qrCodeBase64 = `data:image/png;base64,${Buffer.from(imageBuffer).toString('base64')}`;

  // 2. Calcular expiresAt (assumindo 30 min - CONFIRMAR COM DEV)
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  return {
    id: paguebit.id,
    qrCode: qrCodeBase64,
    qrCodeText: paguebit.qrCopyPaste,
    amount: paguebit.amount,
    expiresAt,
  };
}
```

### 6.3 Impacto no Multi-Tenancy (Camaleão)

**Problema:** O PagueBit usa token por **loja**, não por tenant.

**Cenários:**

| Modo Kaven                   | Config PagueBit                                      |
| ---------------------------- | ---------------------------------------------------- |
| Single-tenant                | 1 token global                                       |
| Multi-tenant (compartilhado) | 1 token global + observation para identificar tenant |
| Multi-tenant (isolado)       | 1 token por tenant (cada um tem sua loja)            |

**Recomendação:** Multi-tenant isolado (1 token por tenant) para máxima separação.

```typescript
// src/modules/payments/providers/paguebit/paguebit.config.ts

interface PagueBitTenantConfig {
  apiToken: string;
  webhookSecret: string;
  storeId: string;
}

// No banco de dados:
// TenantSettings.pagueBitConfig: JSON (PagueBitTenantConfig)
```

---

## 7. PROPOSTA DE IMPLEMENTAÇÃO

### 7.1 Arquitetura de Arquivos

```
src/
├── modules/
│   └── payments/
│       ├── providers/
│       │   ├── pix.interface.ts          # Interface agnóstica
│       │   ├── pix.factory.ts            # Factory pattern
│       │   ├── paguebit/
│       │   │   ├── paguebit.module.ts
│       │   │   ├── paguebit.service.ts   # Implementação principal
│       │   │   ├── paguebit.webhook.ts   # Handler de webhooks
│       │   │   ├── paguebit.types.ts     # Types/DTOs
│       │   │   ├── paguebit.mapper.ts    # Mapeadores
│       │   │   ├── paguebit.config.ts    # Configuração
│       │   │   └── paguebit.client.ts    # HTTP client
│       │   └── mercadopago/              # Alternativa (existente)
│       ├── webhooks/
│       │   └── pix.webhook.controller.ts
│       ├── payments.module.ts
│       ├── payments.controller.ts
│       └── payments.service.ts
├── config/
│   └── paguebit.config.ts
└── shared/
    └── utils/
        └── hmac.util.ts
```

### 7.2 Fluxo de Integração

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FLUXO DE PAGAMENTO PIX                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────┐      ┌──────────────┐      ┌───────────────┐      ┌────────────┐
│ Frontend│      │ Kaven API    │      │ PagueBit API  │      │  Cliente   │
│         │      │              │      │               │      │  (Banco)   │
└────┬────┘      └──────┬───────┘      └───────┬───────┘      └─────┬──────┘
     │                  │                      │                    │
     │ 1. POST /api/    │                      │                    │
     │   payments/pix   │                      │                    │
     │ ────────────────>│                      │                    │
     │                  │ 2. POST /api-public/ │                    │
     │                  │    payments          │                    │
     │                  │ ────────────────────>│                    │
     │                  │                      │                    │
     │                  │ 3. Response com      │                    │
     │                  │    QR Code           │                    │
     │                  │ <────────────────────│                    │
     │ 4. QR Code +     │                      │                    │
     │    countdown     │                      │                    │
     │ <────────────────│                      │                    │
     │                  │                      │                    │
     │ 5. Exibe QR      │                      │                    │
     │    para cliente  │                      │                    │
     │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─>│
     │                  │                      │                    │
     │                  │                      │ 6. Cliente paga    │
     │                  │                      │<───────────────────│
     │                  │                      │                    │
     │                  │ 7. Webhook           │                    │
     │                  │    payment.status_   │                    │
     │                  │    changed           │                    │
     │                  │<─────────────────────│                    │
     │                  │                      │                    │
     │                  │ 8. Valida signature  │                    │
     │                  │    Atualiza status   │                    │
     │                  │    Ativa assinatura  │                    │
     │                  │ ────────┐            │                    │
     │                  │         │            │                    │
     │                  │ <───────┘            │                    │
     │                  │                      │                    │
     │ 9. WebSocket/    │                      │                    │
     │    Polling       │                      │                    │
     │<─────────────────│                      │                    │
     │                  │                      │                    │
     │ 10. Mostra       │                      │                    │
     │     sucesso      │                      │                    │
     ▼                  ▼                      ▼                    ▼
```

---

## 8. CÓDIGO DE IMPLEMENTAÇÃO

### 8.1 Types e DTOs

```typescript
// src/modules/payments/providers/paguebit/paguebit.types.ts

// ============================================
// ENUMS
// ============================================

export enum PagueBitStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REVIEW = 'review',
  NOT_APPROVED = 'not_approved',
  // Status internos
  PAID = 'paid',
  WITHDRAWAL_PROCESSING = 'withdrawal_processing',
  RECEIPT_SENT = 'receipt_sent',
  REJECTED = 'rejected',
}

export enum PagueBitWebhookEvent {
  PAYMENT_CREATED = 'payment.created',
  PAYMENT_STATUS_CHANGED = 'payment.status_changed',
}

// ============================================
// REQUEST DTOs
// ============================================

export interface CreatePagueBitPaymentDto {
  /** Valor em BRL (R$ 5.00 - R$ 3.000.00) */
  amount: number;
  /** Email do cliente (opcional) */
  email?: string;
  /** Observação/descrição (max 2048 chars) */
  observation?: string;
  /** URL para receber webhooks */
  webhookUrl?: string;
}

export interface ListPagueBitPaymentsDto {
  /** Página (min: 1, default: 1) */
  page?: number;
  /** Itens por página (min: 1, max: 200, default: 50) */
  limit?: number;
  /** Filtrar por status */
  status?: 'pending' | 'approved' | 'review' | 'not_approved';
}

// ============================================
// RESPONSE DTOs
// ============================================

export interface PagueBitPaymentResponse {
  id: string;
  status: PagueBitStatus;
  amount: number;
  storeId: string;
  createdAt: string;
  webhookUrl?: string | null;
  observation?: string | null;
  email?: string | null;
  qrCodeUrl?: string | null;
  qrCopyPaste?: string | null;
  isPublic: boolean;
}

export interface PagueBitListResponse {
  items: PagueBitPaymentResponse[];
  page: number;
  limit: number;
  total: number;
}

// ============================================
// WEBHOOK DTOs
// ============================================

export interface PagueBitWebhookHeaders {
  'x-paguebit-signature': string;
  'x-paguebit-timestamp': string;
  'x-paguebit-event-id': string;
}

export interface PagueBitWebhookPayload {
  event: PagueBitWebhookEvent;
  id: string;
  status: PagueBitStatus;
  amount: number;
  storeId: string;
  createdAt: string;
  email?: string;
  observation?: string;
  qrCodeUrl?: string;
  qrCopyPaste?: string;
  isPublic: boolean;
  /** Presente apenas em payment.status_changed */
  previousStatus?: PagueBitStatus;
}

// ============================================
// ERROR DTOs
// ============================================

export interface PagueBitErrorResponse {
  statusCode: number;
  message: string;
}

// ============================================
// CONFIG
// ============================================

export interface PagueBitConfig {
  apiToken: string;
  webhookSecret: string;
  baseUrl: string;
  /** Tempo de expiração do QR em ms (default: 30 min) */
  qrExpirationMs: number;
}
```

### 8.2 HTTP Client

```typescript
// src/modules/payments/providers/paguebit/paguebit.client.ts

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  CreatePagueBitPaymentDto,
  ListPagueBitPaymentsDto,
  PagueBitPaymentResponse,
  PagueBitListResponse,
  PagueBitErrorResponse,
  PagueBitConfig,
} from './paguebit.types';

@Injectable()
export class PagueBitClient {
  private readonly logger = new Logger(PagueBitClient.name);
  private readonly client: AxiosInstance;
  private readonly config: PagueBitConfig;

  constructor(private configService: ConfigService) {
    this.config = {
      apiToken: this.configService.getOrThrow('PAGUEBIT_API_TOKEN'),
      webhookSecret: this.configService.getOrThrow('PAGUEBIT_WEBHOOK_SECRET'),
      baseUrl: this.configService.get(
        'PAGUEBIT_BASE_URL',
        'https://public-api-prod.paguebit.com',
      ),
      qrExpirationMs: this.configService.get(
        'PAGUEBIT_QR_EXPIRATION_MS',
        30 * 60 * 1000, // 30 minutos
      ),
    };

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiToken}`,
      },
      timeout: 30000, // 30 segundos
    });

    // Interceptor para logging
    this.client.interceptors.response.use(
      (response) => {
        this.logger.debug(
          `PagueBit API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`,
        );
        return response;
      },
      (error: AxiosError<PagueBitErrorResponse>) => {
        this.logger.error(
          `PagueBit API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status} - ${error.response?.data?.message}`,
        );
        throw error;
      },
    );
  }

  /**
   * Criar pagamento Pix
   */
  async createPayment(
    data: CreatePagueBitPaymentDto,
  ): Promise<PagueBitPaymentResponse> {
    const response = await this.client.post<PagueBitPaymentResponse>(
      '/api-public/payments',
      data,
    );
    return response.data;
  }

  /**
   * Buscar pagamento por ID
   */
  async getPayment(id: string): Promise<PagueBitPaymentResponse> {
    const response = await this.client.get<PagueBitPaymentResponse>(
      `/api-public/payments/${id}`,
    );
    return response.data;
  }

  /**
   * Listar pagamentos
   */
  async listPayments(
    params?: ListPagueBitPaymentsDto,
  ): Promise<PagueBitListResponse> {
    const response = await this.client.get<PagueBitListResponse>(
      '/api-public/payments',
      { params },
    );
    return response.data;
  }

  /**
   * Obter configuração
   */
  getConfig(): PagueBitConfig {
    return { ...this.config };
  }
}
```

### 8.3 Mapper

```typescript
// src/modules/payments/providers/paguebit/paguebit.mapper.ts

import {
  PagueBitPaymentResponse,
  PagueBitStatus,
  PagueBitWebhookPayload,
} from './paguebit.types';
import {
  PixPaymentResponse,
  PixPaymentStatus,
  WebhookResult,
} from '../pix.interface';

/**
 * Mapeia status do PagueBit para status interno do Kaven
 */
export function mapPagueBitStatus(status: PagueBitStatus): PixPaymentStatus {
  const mapping: Record<PagueBitStatus, PixPaymentStatus> = {
    [PagueBitStatus.PENDING]: 'PENDING',
    [PagueBitStatus.APPROVED]: 'PAID',
    [PagueBitStatus.REVIEW]: 'PROCESSING',
    [PagueBitStatus.NOT_APPROVED]: 'FAILED',
    // Status internos (não devem chegar via API pública)
    [PagueBitStatus.PAID]: 'PAID',
    [PagueBitStatus.WITHDRAWAL_PROCESSING]: 'PROCESSING',
    [PagueBitStatus.RECEIPT_SENT]: 'PAID',
    [PagueBitStatus.REJECTED]: 'FAILED',
  };

  return mapping[status] ?? 'UNKNOWN';
}

/**
 * Mapeia resposta do PagueBit para formato interno do Kaven
 */
export async function mapPagueBitResponse(
  response: PagueBitPaymentResponse,
  qrExpirationMs: number,
): Promise<PixPaymentResponse> {
  // Calcular expiresAt (PagueBit não retorna este campo)
  const createdAt = new Date(response.createdAt);
  const expiresAt = new Date(createdAt.getTime() + qrExpirationMs);

  // Converter qrCodeUrl para base64 se disponível
  let qrCodeBase64: string | undefined;
  if (response.qrCodeUrl) {
    try {
      const imageResponse = await fetch(response.qrCodeUrl);
      const arrayBuffer = await imageResponse.arrayBuffer();
      qrCodeBase64 = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
    } catch (error) {
      // Se falhar, retorna a URL original
      qrCodeBase64 = response.qrCodeUrl;
    }
  }

  return {
    id: response.id,
    externalId: response.id,
    status: mapPagueBitStatus(response.status as PagueBitStatus),
    amount: response.amount,
    qrCode: qrCodeBase64 ?? '',
    qrCodeText: response.qrCopyPaste ?? '',
    expiresAt,
    createdAt,
    paidAt:
      response.status === PagueBitStatus.APPROVED ? new Date() : undefined,
    metadata: {
      storeId: response.storeId,
      email: response.email,
      observation: response.observation,
      isPublic: response.isPublic,
    },
  };
}

/**
 * Mapeia webhook payload para resultado interno
 */
export function mapWebhookPayload(
  payload: PagueBitWebhookPayload,
): WebhookResult {
  return {
    paymentId: payload.id,
    status: mapPagueBitStatus(payload.status),
    previousStatus: payload.previousStatus
      ? mapPagueBitStatus(payload.previousStatus)
      : undefined,
    event: payload.event,
    amount: payload.amount,
    processedAt: new Date(),
  };
}
```

### 8.4 Service Principal

```typescript
// src/modules/payments/providers/paguebit/paguebit.service.ts

import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { PagueBitClient } from './paguebit.client';
import {
  CreatePagueBitPaymentDto,
  PagueBitWebhookPayload,
  PagueBitWebhookHeaders,
  PagueBitConfig,
} from './paguebit.types';
import {
  mapPagueBitResponse,
  mapPagueBitStatus,
  mapWebhookPayload,
} from './paguebit.mapper';
import {
  PixProvider,
  CreatePixPaymentDto,
  PixPaymentResponse,
  WebhookResult,
} from '../pix.interface';

@Injectable()
export class PagueBitService implements PixProvider {
  private readonly logger = new Logger(PagueBitService.name);
  private readonly config: PagueBitConfig;

  constructor(
    private readonly client: PagueBitClient,
    private readonly configService: ConfigService,
  ) {
    this.config = this.client.getConfig();
  }

  /**
   * Criar pagamento Pix
   */
  async createPayment(data: CreatePixPaymentDto): Promise<PixPaymentResponse> {
    // Validação de limites PagueBit
    if (data.amount < 5) {
      throw new BadRequestException('Valor mínimo é R$ 5,00');
    }
    if (data.amount > 3000) {
      throw new BadRequestException('Valor máximo é R$ 3.000,00');
    }

    const webhookUrl = this.configService.get('PAGUEBIT_WEBHOOK_URL');

    const payload: CreatePagueBitPaymentDto = {
      amount: data.amount,
      email: data.customerEmail,
      observation: data.description,
      webhookUrl,
    };

    const response = await this.client.createPayment(payload);
    return mapPagueBitResponse(response, this.config.qrExpirationMs);
  }

  /**
   * Buscar pagamento por ID
   */
  async getPayment(id: string): Promise<PixPaymentResponse> {
    const response = await this.client.getPayment(id);
    return mapPagueBitResponse(response, this.config.qrExpirationMs);
  }

  /**
   * Cancelar pagamento (não implementado no PagueBit)
   */
  async cancelPayment(id: string): Promise<void> {
    this.logger.warn(`Cancel payment not supported by PagueBit: ${id}`);
    throw new BadRequestException(
      'Cancelamento de pagamento não suportado pelo PagueBit',
    );
  }

  /**
   * Processar webhook
   */
  async handleWebhook(
    rawBody: string,
    headers: Record<string, string>,
  ): Promise<WebhookResult> {
    // Extrair headers (case-insensitive)
    const signature =
      headers['x-paguebit-signature'] || headers['X-Paguebit-Signature'];
    const timestamp =
      headers['x-paguebit-timestamp'] || headers['X-Paguebit-Timestamp'];
    const eventId =
      headers['x-paguebit-event-id'] || headers['X-Paguebit-Event-Id'];

    if (!signature || !timestamp) {
      throw new BadRequestException('Missing webhook signature headers');
    }

    // Validar assinatura
    // NOTA: Formato confirmado com time PagueBit: timestamp.body
    const signedPayload = `${timestamp}.${rawBody}`;
    const expectedSignature = crypto
      .createHmac('sha256', this.config.webhookSecret)
      .update(signedPayload)
      .digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    );

    if (!isValid) {
      this.logger.warn(`Invalid webhook signature for event ${eventId}`);
      throw new BadRequestException('Invalid webhook signature');
    }

    // Parse do payload
    const payload: PagueBitWebhookPayload = JSON.parse(rawBody);

    this.logger.log(
      `Webhook received: ${payload.event} - Payment ${payload.id} - Status: ${payload.status}`,
    );

    return mapWebhookPayload(payload);
  }

  /**
   * Verificar se pagamento está confirmado
   */
  isPaymentConfirmed(status: string): boolean {
    return status === 'approved' || status === 'PAID';
  }

  /**
   * Verificar se pagamento está pendente
   */
  isPaymentPending(status: string): boolean {
    return status === 'pending' || status === 'PENDING';
  }

  /**
   * Verificar se pagamento falhou
   */
  isPaymentFailed(status: string): boolean {
    return (
      status === 'not_approved' || status === 'rejected' || status === 'FAILED'
    );
  }
}
```

### 8.5 Webhook Controller

```typescript
// src/modules/payments/webhooks/paguebit.webhook.controller.ts

import {
  Controller,
  Post,
  Headers,
  RawBody,
  HttpCode,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import { PagueBitService } from '../providers/paguebit/paguebit.service';
import { PaymentsService } from '../payments.service';

@ApiTags('Webhooks')
@Controller('webhooks')
export class PagueBitWebhookController {
  private readonly logger = new Logger(PagueBitWebhookController.name);

  constructor(
    private readonly pagueBitService: PagueBitService,
    private readonly paymentsService: PaymentsService,
  ) {}

  @Post('paguebit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook endpoint for PagueBit' })
  @ApiExcludeEndpoint() // Não expor no Swagger público
  async handlePagueBitWebhook(
    @RawBody() rawBody: Buffer,
    @Headers() headers: Record<string, string>,
  ): Promise<{ received: boolean }> {
    try {
      const bodyString = rawBody.toString('utf8');

      // Processar webhook
      const result = await this.pagueBitService.handleWebhook(
        bodyString,
        headers,
      );

      // Atualizar pagamento no banco de dados
      await this.paymentsService.handlePixWebhook(result);

      this.logger.log(
        `Webhook processed: Payment ${result.paymentId} - ${result.status}`,
      );

      return { received: true };
    } catch (error) {
      this.logger.error(`Webhook processing failed: ${error.message}`);

      // Retornar 200 mesmo em erro para evitar retentativas desnecessárias
      // em caso de erros de validação
      if (error instanceof BadRequestException) {
        return { received: true };
      }

      throw error;
    }
  }
}
```

### 8.6 Interface Agnóstica

```typescript
// src/modules/payments/providers/pix.interface.ts

export type PixPaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'PAID'
  | 'FAILED'
  | 'EXPIRED'
  | 'REFUNDED'
  | 'UNKNOWN';

export interface CreatePixPaymentDto {
  amount: number;
  description?: string;
  customerEmail?: string;
  externalReference?: string;
}

export interface PixPaymentResponse {
  id: string;
  externalId: string;
  status: PixPaymentStatus;
  amount: number;
  qrCode: string;
  qrCodeText: string;
  expiresAt: Date;
  createdAt: Date;
  paidAt?: Date;
  metadata?: Record<string, unknown>;
}

export interface WebhookResult {
  paymentId: string;
  status: PixPaymentStatus;
  previousStatus?: PixPaymentStatus;
  event: string;
  amount: number;
  processedAt: Date;
}

export interface PixProvider {
  createPayment(data: CreatePixPaymentDto): Promise<PixPaymentResponse>;
  getPayment(id: string): Promise<PixPaymentResponse>;
  cancelPayment(id: string): Promise<void>;
  handleWebhook(
    rawBody: string,
    headers: Record<string, string>,
  ): Promise<WebhookResult>;
}
```

### 8.7 Factory Pattern

```typescript
// src/modules/payments/providers/pix.factory.ts

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PagueBitService } from './paguebit/paguebit.service';
// import { MercadoPagoService } from './mercadopago/mercadopago.service';
import { PixProvider } from './pix.interface';

export type PixProviderType = 'paguebit' | 'mercadopago';

@Injectable()
export class PixProviderFactory {
  private readonly logger = new Logger(PixProviderFactory.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly pagueBitService: PagueBitService,
    // private readonly mercadoPagoService: MercadoPagoService,
  ) {}

  getProvider(type?: PixProviderType): PixProvider {
    const providerType =
      type ??
      this.configService.get<PixProviderType>('PIX_PROVIDER', 'paguebit');

    this.logger.debug(`Using Pix provider: ${providerType}`);

    switch (providerType) {
      case 'paguebit':
        return this.pagueBitService;
      // case 'mercadopago':
      //   return this.mercadoPagoService;
      default:
        throw new Error(`Unknown Pix provider: ${providerType}`);
    }
  }

  /**
   * Obter provider específico para um tenant
   * Usado em cenário multi-tenant com providers diferentes
   */
  getProviderForTenant(tenantId: string): PixProvider {
    // TODO: Buscar configuração do tenant no banco
    // const tenantConfig = await this.tenantService.getPixConfig(tenantId);
    // return this.getProvider(tenantConfig.provider);
    return this.getProvider();
  }
}
```

### 8.8 Configuração de Ambiente

```bash
# .env.example

# ============================================
# PAGUEBIT CONFIGURATION
# ============================================

# API Token (obrigatório) - obtido no painel PagueBit
PAGUEBIT_API_TOKEN=seu_token_aqui

# Webhook Secret (obrigatório) - obtido ao criar o token
PAGUEBIT_WEBHOOK_SECRET=seu_webhook_secret_aqui

# URL base da API (opcional, tem default)
PAGUEBIT_BASE_URL=https://public-api-prod.paguebit.com

# URL do seu webhook endpoint (para enviar ao PagueBit)
PAGUEBIT_WEBHOOK_URL=https://api.seusite.com/webhooks/paguebit

# Tempo de expiração do QR em ms (opcional, default: 30min)
PAGUEBIT_QR_EXPIRATION_MS=1800000

# Provider Pix ativo (paguebit ou mercadopago)
PIX_PROVIDER=paguebit
```

---

## 9. TESTES

### 9.1 Testes Unitários

```typescript
// src/modules/payments/providers/paguebit/__tests__/paguebit.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { PagueBitService } from '../paguebit.service';
import { PagueBitClient } from '../paguebit.client';
import { PagueBitStatus } from '../paguebit.types';

describe('PagueBitService', () => {
  let service: PagueBitService;
  let client: jest.Mocked<PagueBitClient>;

  const mockConfig = {
    apiToken: 'test_token',
    webhookSecret: 'test_secret',
    baseUrl: 'https://api.test.com',
    qrExpirationMs: 1800000,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagueBitService,
        {
          provide: PagueBitClient,
          useValue: {
            createPayment: jest.fn(),
            getPayment: jest.fn(),
            listPayments: jest.fn(),
            getConfig: jest.fn().mockReturnValue(mockConfig),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('https://webhook.url'),
          },
        },
      ],
    }).compile();

    service = module.get<PagueBitService>(PagueBitService);
    client = module.get(PagueBitClient);
  });

  describe('createPayment', () => {
    it('should create payment successfully', async () => {
      const mockResponse = {
        id: 'pay_123',
        status: PagueBitStatus.PENDING,
        amount: 100,
        storeId: 'store_abc',
        createdAt: new Date().toISOString(),
        qrCodeUrl: 'https://qr.test.com/qr.png',
        qrCopyPaste: '00020126...',
        isPublic: true,
      };

      client.createPayment.mockResolvedValue(mockResponse);

      const result = await service.createPayment({
        amount: 100,
        description: 'Test payment',
      });

      expect(result.id).toBe('pay_123');
      expect(result.status).toBe('PENDING');
      expect(result.amount).toBe(100);
    });

    it('should throw error for amount below minimum', async () => {
      await expect(service.createPayment({ amount: 4 })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw error for amount above maximum', async () => {
      await expect(service.createPayment({ amount: 3001 })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('handleWebhook', () => {
    it('should validate signature correctly', async () => {
      const timestamp = Date.now().toString();
      const body = JSON.stringify({
        event: 'payment.status_changed',
        id: 'pay_123',
        status: 'approved',
        previousStatus: 'pending',
        amount: 100,
        storeId: 'store_abc',
        createdAt: new Date().toISOString(),
        isPublic: true,
      });

      const crypto = require('crypto');
      const signedPayload = `${timestamp}.${body}`;
      const signature = crypto
        .createHmac('sha256', mockConfig.webhookSecret)
        .update(signedPayload)
        .digest('hex');

      const result = await service.handleWebhook(body, {
        'x-paguebit-signature': signature,
        'x-paguebit-timestamp': timestamp,
        'x-paguebit-event-id': 'evt_123',
      });

      expect(result.paymentId).toBe('pay_123');
      expect(result.status).toBe('PAID');
      expect(result.previousStatus).toBe('PENDING');
    });

    it('should throw error for invalid signature', async () => {
      await expect(
        service.handleWebhook('{}', {
          'x-paguebit-signature': 'invalid',
          'x-paguebit-timestamp': Date.now().toString(),
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
```

### 9.2 Testes de Integração

```typescript
// src/modules/payments/providers/paguebit/__tests__/paguebit.e2e.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../app.module';

describe('PagueBit Integration (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/payments/pix', () => {
    it('should create pix payment', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/payments/pix')
        .set('Authorization', 'Bearer valid_token')
        .send({
          amount: 100,
          description: 'Test payment',
        })
        .expect(201);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('qrCode');
      expect(response.body.data).toHaveProperty('qrCodeText');
      expect(response.body.data).toHaveProperty('expiresAt');
    });

    it('should reject payment below minimum', async () => {
      await request(app.getHttpServer())
        .post('/api/payments/pix')
        .set('Authorization', 'Bearer valid_token')
        .send({
          amount: 4,
        })
        .expect(400);
    });
  });

  describe('POST /webhooks/paguebit', () => {
    it('should process valid webhook', async () => {
      const crypto = require('crypto');
      const timestamp = Date.now().toString();
      const body = JSON.stringify({
        event: 'payment.status_changed',
        id: 'pay_123',
        status: 'approved',
        amount: 100,
        storeId: 'store_abc',
        createdAt: new Date().toISOString(),
        isPublic: true,
      });

      const signedPayload = `${timestamp}.${body}`;
      const signature = crypto
        .createHmac('sha256', process.env.PAGUEBIT_WEBHOOK_SECRET)
        .update(signedPayload)
        .digest('hex');

      const response = await request(app.getHttpServer())
        .post('/webhooks/paguebit')
        .set('x-paguebit-signature', signature)
        .set('x-paguebit-timestamp', timestamp)
        .set('x-paguebit-event-id', 'evt_123')
        .set('Content-Type', 'application/json')
        .send(body)
        .expect(200);

      expect(response.body.received).toBe(true);
    });
  });
});
```

---

## 10. CHECKLIST DE IMPLEMENTAÇÃO

### 10.1 Pré-Requisitos

```markdown
- [ ] Obter API Token no painel PagueBit
- [ ] Obter Webhook Secret ao criar token
- [ ] Confirmar perguntas com time de dev (Seção 5)
- [ ] Configurar domínio para webhook (HTTPS obrigatório)
```

### 10.2 Implementação Backend

```markdown
- [ ] Criar tipos e DTOs (paguebit.types.ts)
- [ ] Implementar HTTP Client (paguebit.client.ts)
- [ ] Implementar Mapper (paguebit.mapper.ts)
- [ ] Implementar Service (paguebit.service.ts)
- [ ] Implementar Webhook Controller
- [ ] Implementar Factory Pattern
- [ ] Configurar variáveis de ambiente
- [ ] Escrever testes unitários
- [ ] Escrever testes de integração
```

### 10.3 Configuração

```markdown
- [ ] Adicionar variáveis ao .env
- [ ] Configurar webhook URL no PagueBit (via payload na criação)
- [ ] Configurar CORS para receber webhooks
- [ ] Configurar raw body parsing no Fastify
```

### 10.4 Testes em Ambiente Real

```markdown
- [ ] Testar criação de pagamento (sandbox se existir)
- [ ] Testar recebimento de webhook payment.created
- [ ] Testar recebimento de webhook payment.status_changed
- [ ] Testar pagamento real de R$ 5,00
- [ ] Verificar status no painel PagueBit
```

### 10.5 Documentação

```markdown
- [ ] Atualizar API_SPECIFICATION.md
- [ ] Atualizar README do projeto
- [ ] Documentar processo de onboarding para novos tenants
```

---

## APÊNDICE A: DIAGRAMA DE SEQUÊNCIA COMPLETO

```
┌─────────┐ ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ Frontend│ │ Backend │ │ PagueBit │ │  Banco  │ │  Redis  │ │Postgres │
└────┬────┘ └────┬────┘ └────┬─────┘ └────┬────┘ └────┬────┘ └────┬────┘
     │           │            │            │           │           │
     │ 1. Criar  │            │            │           │           │
     │ pagamento │            │            │           │           │
     │──────────>│            │            │           │           │
     │           │            │            │           │           │
     │           │ 2. Validar │            │           │           │
     │           │    tenant  │            │           │           │
     │           │───────────────────────────────────────────────>│
     │           │<───────────────────────────────────────────────│
     │           │            │            │           │           │
     │           │ 3. POST    │            │           │           │
     │           │ /payments  │            │           │           │
     │           │───────────>│            │           │           │
     │           │            │            │           │           │
     │           │ 4. QR Code │            │           │           │
     │           │<───────────│            │           │           │
     │           │            │            │           │           │
     │           │ 5. Salvar  │            │           │           │
     │           │ pagamento  │            │           │           │
     │           │───────────────────────────────────────────────>│
     │           │            │            │           │           │
     │           │ 6. Cache   │            │           │           │
     │           │ status     │            │           │           │
     │           │──────────────────────────────────>│            │
     │           │            │            │           │           │
     │ 7. QR +   │            │            │           │           │
     │ expiresAt │            │            │           │           │
     │<──────────│            │            │           │           │
     │           │            │            │           │           │
     │ 8. Exibir │            │            │           │           │
     │ QR Code   │            │            │           │           │
     ├───────────┤            │            │           │           │
     │           │            │            │           │           │
     │           │            │ 9. Cliente │           │           │
     │           │            │    paga    │           │           │
     │           │            │<───────────────────────│           │
     │           │            │            │           │           │
     │           │ 10. Webhook│            │           │           │
     │           │<───────────│            │           │           │
     │           │            │            │           │           │
     │           │ 11. Validar│            │           │           │
     │           │ assinatura │            │           │           │
     │           │────┐       │            │           │           │
     │           │    │       │            │           │           │
     │           │<───┘       │            │           │           │
     │           │            │            │           │           │
     │           │ 12. Update │            │           │           │
     │           │ pagamento  │            │           │           │
     │           │───────────────────────────────────────────────>│
     │           │            │            │           │           │
     │           │ 13. Ativar │            │           │           │
     │           │ subscription            │           │           │
     │           │───────────────────────────────────────────────>│
     │           │            │            │           │           │
     │           │ 14. Invalidar           │           │           │
     │           │ cache      │            │           │           │
     │           │──────────────────────────────────>│            │
     │           │            │            │           │           │
     │ 15. Polling│            │           │           │           │
     │ /status   │            │            │           │           │
     │──────────>│            │            │           │           │
     │           │            │            │           │           │
     │           │ 16. Check  │            │           │           │
     │           │ cache      │            │           │           │
     │           │──────────────────────────────────>│            │
     │           │<──────────────────────────────────│            │
     │           │            │            │           │           │
     │ 17. PAID  │            │            │           │           │
     │<──────────│            │            │           │           │
     │           │            │            │           │           │
     │ 18. Redirect           │            │           │           │
     │ success   │            │            │           │           │
     ▼           ▼            ▼            ▼           ▼           ▼
```

---

**FIM DO DOCUMENTO**

_Documento gerado automaticamente. Última atualização: 31/12/2025_
