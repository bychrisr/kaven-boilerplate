# Plans & Products System - Documentação Técnica

**Versão:** 1.0.0  
**Data:** 05 de janeiro de 2026  
**Status:** ✅ IMPLEMENTADO (Database Schema) | 🔄 EM IMPLEMENTAÇÃO (API Endpoints)

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Modelos de Dados](#modelos-de-dados)
4. [API Endpoints](#api-endpoints)
5. [Fluxos de Negócio](#fluxos-de-negócio)
6. [Exemplos de Uso](#exemplos-de-uso)
7. [Guias de Implementação](#guias-de-implementação)

---

## 1. Visão Geral

### 1.1 Objetivo

Sistema completo de **Plans & Products** para monetização SaaS que suporta:

- ✅ **Subscription Plans** (Free, Basic, Pro, Enterprise)
- ✅ **One-time Products** (Add-ons, Créditos, Licenças)
- ✅ **Feature Flags** (Controle de acesso por features)
- ✅ **Quotas** (Limites configuráveis por plano)
- ✅ **Multi-tenant** (Planos globais ou por tenant)
- ✅ **Multi-provider** (Stripe, PagueBit, MercadoPago)

### 1.2 Componentes Principais

```
┌─────────────────────────────────────────────────────────────┐
│                    PLANS & PRODUCTS SYSTEM                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────────┐          │
│  │  Feature │───▶│   Plan   │───▶│ Subscription │          │
│  │ (Catalog)│    │(Template)│    │   (Active)   │          │
│  └──────────┘    └──────────┘    └──────────────┘          │
│       │               │                                      │
│       │               ▼                                      │
│       │          ┌──────────┐                               │
│       │          │  Price   │                               │
│       │          │(Variants)│                               │
│       │          └──────────┘                               │
│       │                                                      │
│       ▼                                                      │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐             │
│  │ Product  │───▶│  Effect  │───▶│ Purchase │             │
│  │(One-time)│    │ (Impact) │    │ (Record) │             │
│  └──────────┘    └──────────┘    └──────────┘             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Arquitetura

### 2.1 Estrutura de Arquivos

```
apps/api/src/modules/
├── plans/
│   ├── controllers/
│   │   └── plan.controller.ts       # HTTP handlers
│   ├── services/
│   │   ├── plan.service.ts          # Business logic
│   │   └── feature.service.ts       # Feature management
│   ├── routes/
│   │   └── plan.routes.ts           # Route definitions
│   ├── dto/
│   │   ├── create-plan.dto.ts       # Input validation
│   │   ├── update-plan.dto.ts
│   │   └── plan-response.dto.ts     # Output formatting
│   └── types/
│       └── plan.types.ts            # TypeScript types
│
├── products/
│   ├── controllers/
│   │   └── product.controller.ts
│   ├── services/
│   │   └── product.service.ts
│   ├── routes/
│   │   └── product.routes.ts
│   ├── dto/
│   │   ├── create-product.dto.ts
│   │   ├── update-product.dto.ts
│   │   └── product-response.dto.ts
│   └── types/
│       └── product.types.ts
│
└── subscriptions/
    ├── controllers/
    │   └── subscription.controller.ts
    ├── services/
    │   ├── subscription.service.ts
    │   └── entitlement.service.ts   # Feature access control
    ├── routes/
    │   └── subscription.routes.ts
    ├── dto/
    │   ├── upgrade-plan.dto.ts
    │   └── subscription-response.dto.ts
    └── types/
        └── subscription.types.ts
```

### 2.2 Camadas de Abstração

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Frontend)                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  ROUTES (Fastify)                        │
│  - Validation (Zod schemas)                              │
│  - Authentication (JWT middleware)                       │
│  - Authorization (RBAC middleware)                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 CONTROLLERS                              │
│  - Request/Response handling                             │
│  - DTO transformation                                    │
│  - Error handling                                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  SERVICES                                │
│  - Business logic                                        │
│  - Transaction management                                │
│  - Event emission                                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              PRISMA CLIENT (ORM)                         │
│  - Database queries                                      │
│  - Type safety                                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              POSTGRESQL DATABASE                         │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Modelos de Dados

### 3.1 Feature (Catálogo de Funcionalidades)

```prisma
model Feature {
  id           String      @id @default(uuid())
  code         String      @unique          // Ex: "USERS", "STORAGE_MB"
  name         String                       // Ex: "Usuários", "Armazenamento"
  description  String?
  type         FeatureType @default(BOOLEAN) // BOOLEAN | QUOTA | CUSTOM
  defaultValue String?
  unit         String?                      // Ex: "users", "MB", "calls"
  category     String?                      // Ex: "Limits", "Features"
  sortOrder    Int         @default(0)
  isActive     Boolean     @default(true)

  planFeatures   PlanFeature[]
  productEffects ProductEffect[]
  usageRecords   UsageRecord[]
}

enum FeatureType {
  BOOLEAN   // On/Off (ex: "API Access")
  QUOTA     // Numeric limit (ex: "5 users")
  CUSTOM    // Custom value (ex: "Custom domain: example.com")
}
```

**Exemplos de Features:**

| Code                  | Name                | Type    | Unit  | Default |
| --------------------- | ------------------- | ------- | ----- | ------- |
| `USERS`               | Usuários            | QUOTA   | users | 1       |
| `STORAGE_MB`          | Armazenamento       | QUOTA   | MB    | 100     |
| `API_CALLS_MONTH`     | Chamadas API/mês    | QUOTA   | calls | 1000    |
| `DASHBOARD_ANALYTICS` | Dashboard Analytics | BOOLEAN | -     | false   |
| `EXPORT_CSV`          | Exportar CSV        | BOOLEAN | -     | false   |
| `CUSTOM_DOMAIN`       | Domínio Customizado | BOOLEAN | -     | false   |

### 3.2 Plan (Plano de Assinatura)

```prisma
model Plan {
  id              String   @id @default(uuid())
  tenantId        String?                    // null = plano global
  code            String                     // Ex: "free", "pro"
  name            String                     // Ex: "Plano Pro"
  description     String?
  type            PlanType @default(SUBSCRIPTION)
  trialDays       Int      @default(0)
  isDefault       Boolean  @default(false)  // Plano padrão para novos tenants
  isPublic        Boolean  @default(true)   // Visível na pricing page
  isActive        Boolean  @default(true)
  sortOrder       Int      @default(0)
  badge           String?                    // Ex: "Popular", "Best Value"
  stripeProductId String?  @unique
  metadata        Json?

  prices        Price[]
  features      PlanFeature[]
  subscriptions Subscription[]
}

enum PlanType {
  SUBSCRIPTION  // Recorrente
  LIFETIME      // Pagamento único, acesso vitalício
}
```

### 3.3 Price (Variações de Preço)

```prisma
model Price {
  id             String          @id @default(uuid())
  planId         String
  code           String?
  interval       BillingInterval @default(MONTHLY)
  intervalCount  Int             @default(1)  // Ex: 3 para trimestral
  amount         Decimal         @db.Decimal(10, 2)
  currency       String          @default("BRL")
  originalAmount Decimal?        @db.Decimal(10, 2)  // Para mostrar desconto
  isActive       Boolean         @default(true)
  stripePriceId  String?         @unique
  pagueBitPriceId String?
  metadata       Json?

  plan          Plan
  subscriptions Subscription[]
}

enum BillingInterval {
  DAILY
  WEEKLY
  MONTHLY
  QUARTERLY
  YEARLY
  LIFETIME
  FOREVER       // Free tier
}
```

### 3.4 PlanFeature (Features do Plano)

```prisma
model PlanFeature {
  id              String   @id @default(uuid())
  planId          String
  featureId       String
  enabled         Boolean  @default(true)     // Para BOOLEAN features
  limitValue      Int?                        // Para QUOTA features (-1 = unlimited)
  customValue     String?                     // Para CUSTOM features
  displayOverride String?                     // Override de texto na UI

  plan    Plan
  feature Feature

  @@unique([planId, featureId])
}
```

**Exemplo de Configuração:**

```typescript
// Plano Pro
{
  planId: "plan_pro_uuid",
  features: [
    { featureId: "USERS", limitValue: 25 },
    { featureId: "STORAGE_MB", limitValue: 10000 },
    { featureId: "API_CALLS_MONTH", limitValue: 100000 },
    { featureId: "DASHBOARD_ANALYTICS", enabled: true },
    { featureId: "EXPORT_CSV", enabled: true },
    { featureId: "CUSTOM_DOMAIN", enabled: true },
  ]
}
```

### 3.5 Product (Produto One-time)

```prisma
model Product {
  id              String      @id @default(uuid())
  tenantId        String?                      // null = produto global
  code            String                       // Ex: "extra_storage_10gb"
  name            String                       // Ex: "Armazenamento Extra (10GB)"
  description     String?
  type            ProductType @default(ONE_TIME)
  price           Decimal     @db.Decimal(10, 2)
  currency        String      @default("BRL")
  originalPrice   Decimal?    @db.Decimal(10, 2)
  isActive        Boolean     @default(true)
  isPublic        Boolean     @default(true)
  sortOrder       Int         @default(0)
  stock           Int         @default(-1)     // -1 = ilimitado
  maxPerTenant    Int         @default(-1)     // -1 = ilimitado
  stripeProductId String?     @unique
  stripePriceId   String?     @unique
  imageUrl        String?
  metadata        Json?

  effects   ProductEffect[]
  purchases Purchase[]
}

enum ProductType {
  ONE_TIME    // Compra única
  CONSUMABLE  // Pode comprar múltiplas vezes
  ADD_ON      // Adiciona à subscription
}
```

### 3.6 ProductEffect (Efeito do Produto)

```prisma
model ProductEffect {
  id           String     @id @default(uuid())
  productId    String
  featureId    String
  effectType   EffectType @default(ADD)
  value        Int?
  isPermanent  Boolean    @default(false)  // Sobrevive a mudanças de plano
  durationDays Int?                        // null = permanente

  product Product
  feature Feature

  @@unique([productId, featureId])
}

enum EffectType {
  ADD      // Adiciona ao limite atual
  SET      // Define valor absoluto
  MULTIPLY // Multiplica limite atual
  ENABLE   // Habilita feature boolean
}
```

**Exemplo:**

```typescript
// Produto: "Armazenamento Extra (10GB)"
{
  productId: "prod_storage_uuid",
  effects: [
    {
      featureId: "STORAGE_MB",
      effectType: "ADD",
      value: 10000,  // +10GB
      isPermanent: false,
      durationDays: 365  // Válido por 1 ano
    }
  ]
}
```

### 3.7 Subscription (Assinatura Ativa)

```prisma
model Subscription {
  id                     String             @id @default(uuid())
  tenantId               String             @unique
  planId                 String
  priceId                String?
  stripeCustomerId       String?            @unique
  stripeSubscriptionId   String?            @unique
  status                 SubscriptionStatus @default(TRIALING)
  currentPeriodStart     DateTime?
  currentPeriodEnd       DateTime?
  cancelAtPeriodEnd      Boolean            @default(false)
  canceledAt             DateTime?
  cancelReason           String?
  trialEnd               DateTime?
  discountCode           String?
  discountPercent        Int?
  metadata               Json?

  tenant   Tenant
  plan     Plan
  price    Price?
  invoices Invoice[]
}

enum SubscriptionStatus {
  ACTIVE      // Ativa e paga
  TRIALING    // Em período de trial
  PAST_DUE    // Pagamento atrasado
  CANCELED    // Cancelada
  EXPIRED     // Expirada
}
```

---

## 4. API Endpoints

### 4.1 Plans API

#### GET /api/plans

Lista todos os planos públicos.

**Query Parameters:**

```typescript
{
  tenantId?: string;  // Filtrar por tenant (admin only)
  isActive?: boolean; // Filtrar ativos/inativos
  type?: 'SUBSCRIPTION' | 'LIFETIME';
}
```

**Response:**

```typescript
{
  plans: [
    {
      id: 'uuid',
      code: 'pro',
      name: 'Plano Pro',
      description: 'Para equipes em crescimento',
      type: 'SUBSCRIPTION',
      trialDays: 14,
      badge: 'Popular',
      sortOrder: 2,
      prices: [
        {
          id: 'uuid',
          interval: 'MONTHLY',
          amount: 99.0,
          currency: 'BRL',
          originalAmount: 129.0,
        },
        {
          id: 'uuid',
          interval: 'YEARLY',
          amount: 990.0,
          currency: 'BRL',
          originalAmount: 1290.0,
        },
      ],
      features: [
        {
          code: 'USERS',
          name: 'Usuários',
          type: 'QUOTA',
          limitValue: 25,
          unit: 'users',
        },
        {
          code: 'DASHBOARD_ANALYTICS',
          name: 'Dashboard Analytics',
          type: 'BOOLEAN',
          enabled: true,
        },
      ],
    },
  ];
}
```

#### GET /api/plans/:id

Detalhes de um plano específico.

**Response:** Mesmo formato acima, mas objeto único.

#### POST /api/plans (Admin Only)

Criar novo plano.

**Request Body:**

```typescript
{
  code: "enterprise",
  name: "Plano Enterprise",
  description: "Para grandes empresas",
  type: "SUBSCRIPTION",
  trialDays: 30,
  isPublic: true,
  badge: "Best Value",
  sortOrder: 3,
  prices: [
    {
      interval: "MONTHLY",
      amount: 299.00,
      currency: "BRL"
    }
  ],
  features: [
    { featureCode: "USERS", limitValue: -1 },  // Unlimited
    { featureCode: "STORAGE_MB", limitValue: -1 },
    { featureCode: "DASHBOARD_ANALYTICS", enabled: true }
  ]
}
```

#### PUT /api/plans/:id (Admin Only)

Atualizar plano existente.

#### DELETE /api/plans/:id (Admin Only)

Desativar plano (soft delete via `isActive = false`).

---

### 4.2 Products API

#### GET /api/products

Lista produtos disponíveis.

**Query Parameters:**

```typescript
{
  tenantId?: string;
  isActive?: boolean;
  type?: 'ONE_TIME' | 'CONSUMABLE' | 'ADD_ON';
}
```

**Response:**

```typescript
{
  products: [
    {
      id: 'uuid',
      code: 'extra_storage_10gb',
      name: 'Armazenamento Extra (10GB)',
      description: 'Adicione 10GB ao seu plano',
      type: 'ONE_TIME',
      price: 19.0,
      currency: 'BRL',
      originalPrice: 29.0,
      imageUrl: 'https://...',
      stock: -1,
      maxPerTenant: 5,
      effects: [
        {
          featureCode: 'STORAGE_MB',
          effectType: 'ADD',
          value: 10000,
          durationDays: 365,
        },
      ],
    },
  ];
}
```

#### GET /api/products/:id

Detalhes de um produto.

#### POST /api/products (Admin Only)

Criar produto.

#### PUT /api/products/:id (Admin Only)

Atualizar produto.

#### DELETE /api/products/:id (Admin Only)

Desativar produto.

---

### 4.3 Subscriptions API

#### GET /api/subscriptions/current

Subscription atual do tenant autenticado.

**Response:**

```typescript
{
  subscription: {
    id: "uuid",
    status: "ACTIVE",
    plan: {
      code: "pro",
      name: "Plano Pro"
    },
    price: {
      interval: "MONTHLY",
      amount: 99.00,
      currency: "BRL"
    },
    currentPeriodStart: "2026-01-01T00:00:00Z",
    currentPeriodEnd: "2026-02-01T00:00:00Z",
    cancelAtPeriodEnd: false,
    features: {
      USERS: { type: "QUOTA", limit: 25, current: 12 },
      STORAGE_MB: { type: "QUOTA", limit: 10000, current: 3500 },
      DASHBOARD_ANALYTICS: { type: "BOOLEAN", enabled: true }
    }
  }
}
```

#### POST /api/subscriptions/upgrade

Fazer upgrade/downgrade de plano.

**Request Body:**

```typescript
{
  planId: "uuid",
  priceId: "uuid",  // Opcional: escolher intervalo específico
  prorated: true    // Calcular valor proporcional
}
```

#### POST /api/subscriptions/cancel

Cancelar subscription.

**Request Body:**

```typescript
{
  immediately: false,  // true = cancela agora, false = no fim do período
  reason: "Muito caro"
}
```

---

## 5. Fluxos de Negócio

### 5.1 Criação de Tenant com Plano Free

```
1. Tenant se registra
2. Sistema cria Subscription automática com Plan "free"
3. Features do plano free são aplicadas
4. Tenant pode usar sistema dentro dos limites
```

### 5.2 Upgrade de Plano

```
1. Tenant seleciona novo plano (ex: Pro)
2. Sistema calcula valor proporcional (se aplicável)
3. Cria pagamento (Stripe/PagueBit)
4. Após confirmação de pagamento:
   - Atualiza Subscription.planId
   - Atualiza features disponíveis
   - Registra em AuditLog
5. Tenant tem acesso imediato às novas features
```

### 5.3 Compra de Produto One-time

```
1. Tenant compra "Armazenamento Extra (10GB)"
2. Sistema cria Purchase record
3. Cria pagamento
4. Após confirmação:
   - Aplica ProductEffect (adiciona 10GB)
   - Atualiza UsageRecord
   - Tenant vê limite aumentado
```

---

## 6. Exemplos de Uso

### 6.1 Verificar se Tenant Tem Acesso a Feature

```typescript
// apps/api/src/modules/subscriptions/services/entitlement.service.ts

export class EntitlementService {
  async hasFeature(tenantId: string, featureCode: string): Promise<boolean> {
    const subscription = await prisma.subscription.findUnique({
      where: { tenantId },
      include: {
        plan: {
          include: {
            features: {
              where: { feature: { code: featureCode } },
              include: { feature: true },
            },
          },
        },
      },
    });

    if (!subscription) return false;

    const planFeature = subscription.plan.features.find(
      (f) => f.feature.code === featureCode,
    );

    if (!planFeature) return false;

    if (planFeature.feature.type === 'BOOLEAN') {
      return planFeature.enabled;
    }

    return true;
  }

  async getQuotaLimit(tenantId: string, featureCode: string): Promise<number> {
    const subscription = await prisma.subscription.findUnique({
      where: { tenantId },
      include: {
        plan: {
          include: {
            features: {
              where: { feature: { code: featureCode } },
              include: { feature: true },
            },
          },
        },
      },
    });

    const planFeature = subscription?.plan.features.find(
      (f) => f.feature.code === featureCode,
    );

    return planFeature?.limitValue ?? 0;
  }
}
```

### 6.2 Middleware de Verificação de Feature

```typescript
// apps/api/src/middleware/feature-guard.middleware.ts

export function requireFeature(featureCode: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const tenantId = request.user.tenantId;

    const hasAccess = await entitlementService.hasFeature(
      tenantId,
      featureCode,
    );

    if (!hasAccess) {
      return reply.status(403).send({
        error: 'Feature not available in your plan',
        featureCode,
        upgradeUrl: '/pricing',
      });
    }
  };
}

// Uso:
fastify.get(
  '/api/analytics',
  {
    preHandler: requireFeature('DASHBOARD_ANALYTICS'),
  },
  analyticsController.getAnalytics,
);
```

---

## 7. Guias de Implementação

### 7.1 Adicionar Nova Feature

1. **Criar feature no banco:**

```sql
INSERT INTO features (code, name, type, unit, category)
VALUES ('API_WEBHOOKS', 'Webhooks', 'BOOLEAN', null, 'Integrations');
```

2. **Adicionar aos planos:**

```sql
INSERT INTO plan_features (plan_id, feature_id, enabled)
SELECT p.id, f.id, true
FROM plans p, features f
WHERE p.code IN ('pro', 'enterprise')
  AND f.code = 'API_WEBHOOKS';
```

3. **Usar no código:**

```typescript
if (await entitlementService.hasFeature(tenantId, 'API_WEBHOOKS')) {
  // Permitir configuração de webhooks
}
```

### 7.2 Criar Novo Plano via API

```bash
curl -X POST http://localhost:3001/api/plans \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "startup",
    "name": "Plano Startup",
    "description": "Para startups em crescimento",
    "type": "SUBSCRIPTION",
    "trialDays": 14,
    "isPublic": true,
    "badge": "Recomendado",
    "sortOrder": 1,
    "prices": [
      {
        "interval": "MONTHLY",
        "amount": 49.00,
        "currency": "BRL"
      }
    ],
    "features": [
      { "featureCode": "USERS", "limitValue": 10 },
      { "featureCode": "STORAGE_MB", "limitValue": 5000 },
      { "featureCode": "DASHBOARD_ANALYTICS", "enabled": true }
    ]
  }'
```

---

## 📚 Referências

- [PLANS_PRODUCTS_SPECIFICATION.md](file:///home/bychrisr/projects/kaven-boilerplate/PLANS_PRODUCTS_SPECIFICATION.md) - Especificação completa
- [Prisma Schema](file:///home/bychrisr/projects/kaven-boilerplate/prisma/schema.prisma) - Modelos de dados
- [Phase 0 - Database Specification](file:///home/bychrisr/projects/kaven-boilerplate/Phase%200%20-%20FOUNDATION/9.%20DATABASE%20SPECIFICATION.md) - Documentação do banco

---

**Última Atualização:** 05/01/2026  
**Autor:** Kaven Development Team
