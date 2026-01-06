# ESPECIFICAÇÃO COMPLETA: Plans & Products

> **Versão:** 1.0.0  
> **Data:** 31 de dezembro de 2025  
> **Status:** NOVA ESPECIFICAÇÃO  
> **Prioridade:** MVP (Crítico para monetização)

---

## 📋 ÍNDICE

1. [Visão Geral](#1-visão-geral)
2. [Arquitetura Conceitual](#2-arquitetura-conceitual)
3. [Modelos de Dados (Prisma)](#3-modelos-de-dados-prisma)
4. [Feature Flags & Entitlements](#4-feature-flags--entitlements)
5. [Limites e Quotas](#5-limites-e-quotas)
6. [API Endpoints](#6-api-endpoints)
7. [Integração com Payments](#7-integração-com-payments)
8. [UI/Admin Panel](#8-uiadmin-panel)
9. [Fluxos de Negócio](#9-fluxos-de-negócio)
10. [Implementação](#10-implementação)
11. [Testes](#11-testes)

---

## 1. VISÃO GERAL

### 1.1 O Que Está Faltando no Projeto Atual

| Aspecto | Status Atual | Necessidade |
|---------|--------------|-------------|
| Plans (Subscription) | ❌ Hardcoded "Basic, Pro, Enterprise" | ✅ Entidade configurável |
| Products (One-time) | ❌ Não existe | ✅ Para vendas avulsas |
| Features | ❌ Não especificado | ✅ Feature flags por plano |
| Limits | ❌ Não especificado | ✅ Quotas por plano |
| Pricing | ❌ Apenas Stripe Price ID | ✅ Multi-provider, multi-currency |
| Admin CRUD | ❌ Não existe | ✅ Gerenciar planos pelo admin |

### 1.2 Objetivo

Criar um sistema completo de **Plans & Products** que seja:

- **Flexível**: Configurável via admin, não hardcoded
- **Multi-tenant**: Cada tenant pode ter seus próprios planos (B2B2C)
- **Multi-provider**: Funciona com Stripe, PagueBit, Mercado Pago, etc.
- **Feature-based**: Controla acesso por features, não por strings mágicas
- **Quota-based**: Limites configuráveis (usuários, storage, API calls, etc.)

### 1.3 Tipos de Monetização Suportados

```
┌─────────────────────────────────────────────────────────────────┐
│                    MODELOS DE MONETIZAÇÃO                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. SUBSCRIPTION (Recorrente)                                   │
│     └── Plans: Free, Basic, Pro, Enterprise                     │
│         └── Billing: Monthly, Yearly, Lifetime                  │
│                                                                 │
│  2. ONE-TIME (Compra única)                                     │
│     └── Products: Add-ons, Créditos, Licenças                   │
│                                                                 │
│  3. USAGE-BASED (Por uso) [POST-MVP]                            │
│     └── Metered: API calls, Storage, Emails enviados            │
│                                                                 │
│  4. HYBRID (Combinado)                                          │
│     └── Base subscription + Usage overage                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. ARQUITETURA CONCEITUAL

### 2.1 Entidades Principais

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│    Plan     │────<│   Price     │     │    Feature      │
│  (Template) │     │ (Variação)  │     │  (Capability)   │
└─────────────┘     └─────────────┘     └─────────────────┘
       │                                        │
       │            ┌─────────────┐             │
       └───────────>│ PlanFeature │<────────────┘
                    │   (N:N)     │
                    └─────────────┘
                           │
                           ▼
       ┌─────────────┐     │     ┌─────────────┐
       │   Quota     │<────┴────>│   Limit     │
       │ (Recurso)   │           │  (Valor)    │
       └─────────────┘           └─────────────┘

┌─────────────┐     ┌─────────────────┐     ┌─────────────┐
│   Tenant    │────>│  Subscription   │────>│    Plan     │
│             │     │                 │     │             │
└─────────────┘     └─────────────────┘     └─────────────┘
       │
       │            ┌─────────────────┐     ┌─────────────┐
       └───────────>│    Purchase     │────>│   Product   │
                    │  (One-time)     │     │             │
                    └─────────────────┘     └─────────────┘
```

### 2.2 Hierarquia de Planos

```yaml
# Exemplo de estrutura típica de SaaS

Plans:
  - name: Free
    type: SUBSCRIPTION
    prices:
      - interval: FOREVER
        amount: 0
    features:
      - feature: USERS
        limit: 1
      - feature: STORAGE_MB
        limit: 100
      - feature: API_CALLS_MONTH
        limit: 1000
      - feature: DASHBOARD_BASIC
        enabled: true
      - feature: DASHBOARD_ANALYTICS
        enabled: false

  - name: Basic
    type: SUBSCRIPTION
    prices:
      - interval: MONTHLY
        amount: 29.00
        currency: BRL
      - interval: YEARLY
        amount: 290.00  # 2 meses grátis
        currency: BRL
    features:
      - feature: USERS
        limit: 5
      - feature: STORAGE_MB
        limit: 1000
      - feature: API_CALLS_MONTH
        limit: 10000
      - feature: DASHBOARD_BASIC
        enabled: true
      - feature: DASHBOARD_ANALYTICS
        enabled: true
      - feature: EXPORT_CSV
        enabled: true

  - name: Pro
    type: SUBSCRIPTION
    trialDays: 14
    prices:
      - interval: MONTHLY
        amount: 99.00
      - interval: YEARLY
        amount: 990.00
    features:
      - feature: USERS
        limit: 25
      - feature: STORAGE_MB
        limit: 10000
      - feature: API_CALLS_MONTH
        limit: 100000
      - feature: DASHBOARD_BASIC
        enabled: true
      - feature: DASHBOARD_ANALYTICS
        enabled: true
      - feature: DASHBOARD_ADVANCED
        enabled: true
      - feature: EXPORT_CSV
        enabled: true
      - feature: EXPORT_PDF
        enabled: true
      - feature: API_ACCESS
        enabled: true
      - feature: CUSTOM_DOMAIN
        enabled: true

  - name: Enterprise
    type: SUBSCRIPTION
    prices:
      - interval: MONTHLY
        amount: 299.00
      - interval: YEARLY
        amount: 2990.00
    features:
      - feature: USERS
        limit: -1  # Unlimited
      - feature: STORAGE_MB
        limit: -1  # Unlimited
      - feature: API_CALLS_MONTH
        limit: -1  # Unlimited
      - feature: ALL_FEATURES
        enabled: true
      - feature: SSO
        enabled: true
      - feature: AUDIT_LOGS
        enabled: true
      - feature: PRIORITY_SUPPORT
        enabled: true
      - feature: SLA_99_9
        enabled: true

Products:
  - name: Extra Storage (10GB)
    type: ONE_TIME
    price: 19.00
    effect:
      - feature: STORAGE_MB
        add: 10000

  - name: API Credits Pack (100k)
    type: ONE_TIME
    price: 49.00
    effect:
      - feature: API_CREDITS
        add: 100000

  - name: White Label License
    type: ONE_TIME
    price: 499.00
    effect:
      - feature: WHITE_LABEL
        enabled: true
        permanent: true
```

---

## 3. MODELOS DE DADOS (PRISMA)

### 3.1 Schema Completo

```prisma
// ============================================
// PLANS & PRODUCTS
// ============================================

/// Feature definitions (catalog of all possible features)
model Feature {
  id          String   @id @default(uuid())
  
  /// Unique feature code (e.g., "USERS", "STORAGE_MB", "API_ACCESS")
  code        String   @unique
  
  /// Display name
  name        String
  
  /// Description for admin/docs
  description String?
  
  /// Feature type
  type        FeatureType @default(BOOLEAN)
  
  /// Default value for features not explicitly set
  defaultValue String?  @map("default_value")
  
  /// Unit for quota features (e.g., "users", "MB", "calls")
  unit        String?
  
  /// Category for grouping in UI
  category    String?
  
  /// Sort order in UI
  sortOrder   Int      @default(0) @map("sort_order")
  
  /// Whether feature is active
  isActive    Boolean  @default(true) @map("is_active")
  
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  // ============================================
  // RELATIONS
  // ============================================
  
  planFeatures  PlanFeature[]
  productEffects ProductEffect[]
  usageRecords  UsageRecord[]
  
  @@index([code])
  @@index([category])
  @@index([isActive])
  @@map("features")
}

/// Plan definitions (subscription tiers)
model Plan {
  id          String   @id @default(uuid())
  
  /// Tenant that owns this plan (null = global/platform plan)
  tenantId    String?  @map("tenant_id")
  
  /// Unique plan code (e.g., "free", "basic", "pro", "enterprise")
  code        String
  
  /// Display name
  name        String
  
  /// Description (supports markdown)
  description String?
  
  /// Plan type
  type        PlanType @default(SUBSCRIPTION)
  
  /// Trial period in days (0 = no trial)
  trialDays   Int      @default(0) @map("trial_days")
  
  /// Whether this is the default plan for new tenants
  isDefault   Boolean  @default(false) @map("is_default")
  
  /// Whether plan is visible in pricing page
  isPublic    Boolean  @default(true) @map("is_public")
  
  /// Whether plan is currently available for purchase
  isActive    Boolean  @default(true) @map("is_active")
  
  /// Sort order in pricing page
  sortOrder   Int      @default(0) @map("sort_order")
  
  /// Badge/label (e.g., "Popular", "Best Value")
  badge       String?
  
  /// Stripe Product ID (for Stripe sync)
  stripeProductId String? @unique @map("stripe_product_id")
  
  /// Additional metadata
  metadata    Json?
  
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  // ============================================
  // RELATIONS
  // ============================================
  
  tenant      Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  prices      Price[]
  features    PlanFeature[]
  subscriptions Subscription[]
  
  // ============================================
  // INDEXES & CONSTRAINTS
  // ============================================
  
  @@unique([tenantId, code]) // Unique code per tenant (or global)
  @@index([tenantId])
  @@index([isActive])
  @@index([isPublic])
  @@index([sortOrder])
  @@map("plans")
}

/// Price variations for plans (monthly, yearly, etc.)
model Price {
  id          String   @id @default(uuid())
  
  /// Associated plan
  planId      String   @map("plan_id")
  
  /// Price identifier/code
  code        String?
  
  /// Billing interval
  interval    BillingInterval @default(MONTHLY)
  
  /// Number of intervals (e.g., 3 for quarterly)
  intervalCount Int    @default(1) @map("interval_count")
  
  /// Price amount (in smallest unit, e.g., cents)
  amount      Decimal  @db.Decimal(10, 2)
  
  /// Currency code (ISO 4217)
  currency    String   @default("BRL")
  
  /// Original price (for showing discounts)
  originalAmount Decimal? @db.Decimal(10, 2) @map("original_amount")
  
  /// Whether price is currently active
  isActive    Boolean  @default(true) @map("is_active")
  
  /// Stripe Price ID
  stripePriceId String? @unique @map("stripe_price_id")
  
  /// PagueBit Price ID (for future use)
  pagueBitPriceId String? @map("paguebit_price_id")
  
  /// Additional metadata
  metadata    Json?
  
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  // ============================================
  // RELATIONS
  // ============================================
  
  plan        Plan     @relation(fields: [planId], references: [id], onDelete: Cascade)
  subscriptions Subscription[]
  
  // ============================================
  // INDEXES
  // ============================================
  
  @@unique([planId, interval, currency])
  @@index([planId])
  @@index([isActive])
  @@index([currency])
  @@map("prices")
}

/// Features assigned to plans with limits/values
model PlanFeature {
  id          String   @id @default(uuid())
  
  /// Associated plan
  planId      String   @map("plan_id")
  
  /// Associated feature
  featureId   String   @map("feature_id")
  
  /// Whether feature is enabled (for BOOLEAN features)
  enabled     Boolean  @default(true)
  
  /// Limit value (for QUOTA features, -1 = unlimited)
  limitValue  Int?     @map("limit_value")
  
  /// Custom value (for CUSTOM features)
  customValue String?  @map("custom_value")
  
  /// Override default in UI display
  displayOverride String? @map("display_override")
  
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  // ============================================
  // RELATIONS
  // ============================================
  
  plan        Plan     @relation(fields: [planId], references: [id], onDelete: Cascade)
  feature     Feature  @relation(fields: [featureId], references: [id], onDelete: Cascade)
  
  // ============================================
  // INDEXES
  // ============================================
  
  @@unique([planId, featureId])
  @@index([planId])
  @@index([featureId])
  @@map("plan_features")
}

/// Products for one-time purchases
model Product {
  id          String   @id @default(uuid())
  
  /// Tenant that owns this product (null = global/platform product)
  tenantId    String?  @map("tenant_id")
  
  /// Unique product code
  code        String
  
  /// Display name
  name        String
  
  /// Description (supports markdown)
  description String?
  
  /// Product type
  type        ProductType @default(ONE_TIME)
  
  /// Price amount
  price       Decimal  @db.Decimal(10, 2)
  
  /// Currency code
  currency    String   @default("BRL")
  
  /// Original price (for showing discounts)
  originalPrice Decimal? @db.Decimal(10, 2) @map("original_price")
  
  /// Whether product is currently available
  isActive    Boolean  @default(true) @map("is_active")
  
  /// Whether product is visible publicly
  isPublic    Boolean  @default(true) @map("is_public")
  
  /// Sort order
  sortOrder   Int      @default(0) @map("sort_order")
  
  /// Stock quantity (-1 = unlimited)
  stock       Int      @default(-1)
  
  /// Maximum purchases per tenant (-1 = unlimited)
  maxPerTenant Int     @default(-1) @map("max_per_tenant")
  
  /// Stripe Product ID
  stripeProductId String? @unique @map("stripe_product_id")
  
  /// Stripe Price ID
  stripePriceId String? @unique @map("stripe_price_id")
  
  /// Image URL
  imageUrl    String?  @map("image_url")
  
  /// Additional metadata
  metadata    Json?
  
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  // ============================================
  // RELATIONS
  // ============================================
  
  tenant      Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  effects     ProductEffect[]
  purchases   Purchase[]
  
  // ============================================
  // INDEXES
  // ============================================
  
  @@unique([tenantId, code])
  @@index([tenantId])
  @@index([isActive])
  @@index([type])
  @@map("products")
}

/// Effects that products have on features/quotas
model ProductEffect {
  id          String   @id @default(uuid())
  
  /// Associated product
  productId   String   @map("product_id")
  
  /// Associated feature
  featureId   String   @map("feature_id")
  
  /// Effect type
  effectType  EffectType @default(ADD) @map("effect_type")
  
  /// Value to add/set
  value       Int?
  
  /// Whether effect is permanent (survives subscription changes)
  isPermanent Boolean  @default(false) @map("is_permanent")
  
  /// Duration in days (null = permanent, 0 = until period end)
  durationDays Int?    @map("duration_days")
  
  createdAt   DateTime @default(now()) @map("created_at")
  
  // ============================================
  // RELATIONS
  // ============================================
  
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  feature     Feature  @relation(fields: [featureId], references: [id], onDelete: Cascade)
  
  // ============================================
  // INDEXES
  // ============================================
  
  @@unique([productId, featureId])
  @@index([productId])
  @@index([featureId])
  @@map("product_effects")
}

/// Purchase records for one-time products
model Purchase {
  id          String   @id @default(uuid())
  
  /// Associated tenant
  tenantId    String   @map("tenant_id")
  
  /// Associated product
  productId   String   @map("product_id")
  
  /// User who made the purchase
  userId      String?  @map("user_id")
  
  /// Purchase status
  status      PurchaseStatus @default(PENDING)
  
  /// Amount paid
  amount      Decimal  @db.Decimal(10, 2)
  
  /// Currency
  currency    String   @default("BRL")
  
  /// Payment method used
  paymentMethod PaymentMethod @default(PIX) @map("payment_method")
  
  /// External payment ID (Stripe, PagueBit, etc.)
  externalPaymentId String? @map("external_payment_id")
  
  /// When effects expire (null = never)
  expiresAt   DateTime? @map("expires_at")
  
  /// Additional metadata
  metadata    Json?
  
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  // ============================================
  // RELATIONS
  // ============================================
  
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  product     Product  @relation(fields: [productId], references: [id], onDelete: Restrict)
  user        User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  // ============================================
  // INDEXES
  // ============================================
  
  @@index([tenantId])
  @@index([productId])
  @@index([userId])
  @@index([status])
  @@index([createdAt])
  @@map("purchases")
}

/// Usage tracking for quota features
model UsageRecord {
  id          String   @id @default(uuid())
  
  /// Associated tenant
  tenantId    String   @map("tenant_id")
  
  /// Associated feature
  featureId   String   @map("feature_id")
  
  /// Current usage value
  currentUsage Int     @default(0) @map("current_usage")
  
  /// Period start
  periodStart DateTime @map("period_start")
  
  /// Period end
  periodEnd   DateTime @map("period_end")
  
  /// Last reset timestamp
  lastReset   DateTime @default(now()) @map("last_reset")
  
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  // ============================================
  // RELATIONS
  // ============================================
  
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  feature     Feature  @relation(fields: [featureId], references: [id], onDelete: Cascade)
  
  // ============================================
  // INDEXES
  // ============================================
  
  @@unique([tenantId, featureId, periodStart])
  @@index([tenantId])
  @@index([featureId])
  @@index([periodEnd])
  @@map("usage_records")
}

// ============================================
// UPDATED SUBSCRIPTION MODEL
// ============================================

/// Subscription (updated to reference Plan)
model Subscription {
  id              String   @id @default(uuid())
  
  /// Associated tenant
  tenantId        String   @unique @map("tenant_id")
  
  /// Associated plan
  planId          String   @map("plan_id")
  
  /// Associated price (specific billing interval)
  priceId         String?  @map("price_id")
  
  /// Stripe Customer ID
  stripeCustomerId String? @unique @map("stripe_customer_id")
  
  /// Stripe Subscription ID
  stripeSubscriptionId String? @unique @map("stripe_subscription_id")
  
  /// Subscription status
  status          SubscriptionStatus @default(TRIAL)
  
  /// Current billing period start
  currentPeriodStart DateTime? @map("current_period_start")
  
  /// Current billing period end
  currentPeriodEnd   DateTime? @map("current_period_end")
  
  /// Whether to cancel at period end
  cancelAtPeriodEnd  Boolean @default(false) @map("cancel_at_period_end")
  
  /// Cancellation timestamp
  canceledAt      DateTime? @map("canceled_at")
  
  /// Cancellation reason
  cancelReason    String?   @map("cancel_reason")
  
  /// Trial end timestamp
  trialEnd        DateTime? @map("trial_end")
  
  /// Discount/coupon code applied
  discountCode    String?   @map("discount_code")
  
  /// Discount percentage (0-100)
  discountPercent Int?      @map("discount_percent")
  
  /// Additional metadata
  metadata        Json?
  
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  
  // ============================================
  // RELATIONS
  // ============================================
  
  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  plan            Plan     @relation(fields: [planId], references: [id], onDelete: Restrict)
  price           Price?   @relation(fields: [priceId], references: [id], onDelete: SetNull)
  invoices        Invoice[]
  
  // ============================================
  // INDEXES
  // ============================================
  
  @@index([tenantId])
  @@index([planId])
  @@index([status])
  @@index([currentPeriodEnd])
  @@map("subscriptions")
}

// ============================================
// ENUMS
// ============================================

enum FeatureType {
  BOOLEAN   // Feature is on/off
  QUOTA     // Feature has a numeric limit
  CUSTOM    // Feature has a custom string value
}

enum PlanType {
  SUBSCRIPTION  // Recurring billing
  LIFETIME      // One-time payment, lifetime access
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

enum ProductType {
  ONE_TIME      // Single purchase
  CONSUMABLE    // Can be purchased multiple times
  ADD_ON        // Adds to subscription
}

enum EffectType {
  ADD           // Add value to current limit
  SET           // Set absolute value
  MULTIPLY      // Multiply current limit
  ENABLE        // Enable boolean feature
}

enum PurchaseStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
  EXPIRED
}

enum PaymentMethod {
  STRIPE
  PIX
  BOLETO
  CREDIT_CARD
  CRYPTO
}

enum SubscriptionStatus {
  TRIAL
  ACTIVE
  PAST_DUE
  CANCELED
  UNPAID
  PAUSED
}
```

### 3.2 Relacionamento com Tenant (Atualizado)

```prisma
// Adicionar ao modelo Tenant existente

model Tenant {
  // ... campos existentes ...
  
  // ============================================
  // NEW RELATIONS
  // ============================================
  
  /// Custom plans created by this tenant (B2B2C)
  plans       Plan[]
  
  /// Custom products created by this tenant
  products    Product[]
  
  /// Product purchases
  purchases   Purchase[]
  
  /// Usage records for quota tracking
  usageRecords UsageRecord[]
}

model User {
  // ... campos existentes ...
  
  /// Product purchases made by this user
  purchases   Purchase[]
}
```

---

## 4. FEATURE FLAGS & ENTITLEMENTS

### 4.1 Catálogo de Features Padrão

```typescript
// src/modules/billing/features/feature-catalog.ts

export const FEATURE_CATALOG = {
  // ============================================
  // QUOTA FEATURES (Numeric limits)
  // ============================================
  
  // Users & Team
  USERS: {
    code: 'USERS',
    name: 'Team Members',
    description: 'Maximum number of users in the tenant',
    type: 'QUOTA',
    unit: 'users',
    category: 'team',
    defaultValue: '1',
  },
  ROLES: {
    code: 'ROLES',
    name: 'Custom Roles',
    description: 'Maximum number of custom roles',
    type: 'QUOTA',
    unit: 'roles',
    category: 'team',
    defaultValue: '3',
  },
  
  // Storage
  STORAGE_MB: {
    code: 'STORAGE_MB',
    name: 'Storage',
    description: 'Storage space in megabytes',
    type: 'QUOTA',
    unit: 'MB',
    category: 'storage',
    defaultValue: '100',
  },
  FILE_SIZE_MB: {
    code: 'FILE_SIZE_MB',
    name: 'Max File Size',
    description: 'Maximum file size for uploads',
    type: 'QUOTA',
    unit: 'MB',
    category: 'storage',
    defaultValue: '10',
  },
  
  // API & Integration
  API_CALLS_MONTH: {
    code: 'API_CALLS_MONTH',
    name: 'API Calls',
    description: 'API calls per month',
    type: 'QUOTA',
    unit: 'calls/month',
    category: 'api',
    defaultValue: '1000',
  },
  WEBHOOKS: {
    code: 'WEBHOOKS',
    name: 'Webhook Endpoints',
    description: 'Maximum webhook endpoints',
    type: 'QUOTA',
    unit: 'endpoints',
    category: 'api',
    defaultValue: '1',
  },
  
  // Email
  EMAILS_MONTH: {
    code: 'EMAILS_MONTH',
    name: 'Emails',
    description: 'Transactional emails per month',
    type: 'QUOTA',
    unit: 'emails/month',
    category: 'email',
    defaultValue: '100',
  },
  
  // Projects/Workspaces
  PROJECTS: {
    code: 'PROJECTS',
    name: 'Projects',
    description: 'Maximum number of projects',
    type: 'QUOTA',
    unit: 'projects',
    category: 'workspace',
    defaultValue: '3',
  },
  
  // ============================================
  // BOOLEAN FEATURES (On/Off capabilities)
  // ============================================
  
  // Dashboard
  DASHBOARD_BASIC: {
    code: 'DASHBOARD_BASIC',
    name: 'Basic Dashboard',
    description: 'Access to basic dashboard',
    type: 'BOOLEAN',
    category: 'dashboard',
    defaultValue: 'true',
  },
  DASHBOARD_ANALYTICS: {
    code: 'DASHBOARD_ANALYTICS',
    name: 'Analytics Dashboard',
    description: 'Access to analytics dashboard',
    type: 'BOOLEAN',
    category: 'dashboard',
    defaultValue: 'false',
  },
  DASHBOARD_ADVANCED: {
    code: 'DASHBOARD_ADVANCED',
    name: 'Advanced Dashboard',
    description: 'Access to advanced dashboard with custom widgets',
    type: 'BOOLEAN',
    category: 'dashboard',
    defaultValue: 'false',
  },
  
  // Export
  EXPORT_CSV: {
    code: 'EXPORT_CSV',
    name: 'CSV Export',
    description: 'Export data to CSV',
    type: 'BOOLEAN',
    category: 'export',
    defaultValue: 'false',
  },
  EXPORT_PDF: {
    code: 'EXPORT_PDF',
    name: 'PDF Export',
    description: 'Export data to PDF',
    type: 'BOOLEAN',
    category: 'export',
    defaultValue: 'false',
  },
  EXPORT_EXCEL: {
    code: 'EXPORT_EXCEL',
    name: 'Excel Export',
    description: 'Export data to Excel',
    type: 'BOOLEAN',
    category: 'export',
    defaultValue: 'false',
  },
  
  // API Access
  API_ACCESS: {
    code: 'API_ACCESS',
    name: 'API Access',
    description: 'Access to REST API',
    type: 'BOOLEAN',
    category: 'api',
    defaultValue: 'false',
  },
  GRAPHQL_ACCESS: {
    code: 'GRAPHQL_ACCESS',
    name: 'GraphQL Access',
    description: 'Access to GraphQL API',
    type: 'BOOLEAN',
    category: 'api',
    defaultValue: 'false',
  },
  
  // Customization
  CUSTOM_DOMAIN: {
    code: 'CUSTOM_DOMAIN',
    name: 'Custom Domain',
    description: 'Use custom domain',
    type: 'BOOLEAN',
    category: 'customization',
    defaultValue: 'false',
  },
  WHITE_LABEL: {
    code: 'WHITE_LABEL',
    name: 'White Label',
    description: 'Remove branding',
    type: 'BOOLEAN',
    category: 'customization',
    defaultValue: 'false',
  },
  CUSTOM_THEME: {
    code: 'CUSTOM_THEME',
    name: 'Custom Theme',
    description: 'Customize colors and branding',
    type: 'BOOLEAN',
    category: 'customization',
    defaultValue: 'false',
  },
  
  // Security
  TWO_FACTOR_AUTH: {
    code: 'TWO_FACTOR_AUTH',
    name: '2FA',
    description: 'Two-factor authentication',
    type: 'BOOLEAN',
    category: 'security',
    defaultValue: 'true',
  },
  SSO: {
    code: 'SSO',
    name: 'SSO',
    description: 'Single Sign-On (SAML, OIDC)',
    type: 'BOOLEAN',
    category: 'security',
    defaultValue: 'false',
  },
  AUDIT_LOGS: {
    code: 'AUDIT_LOGS',
    name: 'Audit Logs',
    description: 'Access to audit logs',
    type: 'BOOLEAN',
    category: 'security',
    defaultValue: 'false',
  },
  IP_WHITELIST: {
    code: 'IP_WHITELIST',
    name: 'IP Whitelist',
    description: 'Restrict access by IP',
    type: 'BOOLEAN',
    category: 'security',
    defaultValue: 'false',
  },
  
  // Support
  SUPPORT_EMAIL: {
    code: 'SUPPORT_EMAIL',
    name: 'Email Support',
    description: 'Email support access',
    type: 'BOOLEAN',
    category: 'support',
    defaultValue: 'true',
  },
  SUPPORT_CHAT: {
    code: 'SUPPORT_CHAT',
    name: 'Chat Support',
    description: 'Live chat support',
    type: 'BOOLEAN',
    category: 'support',
    defaultValue: 'false',
  },
  SUPPORT_PHONE: {
    code: 'SUPPORT_PHONE',
    name: 'Phone Support',
    description: 'Phone support access',
    type: 'BOOLEAN',
    category: 'support',
    defaultValue: 'false',
  },
  PRIORITY_SUPPORT: {
    code: 'PRIORITY_SUPPORT',
    name: 'Priority Support',
    description: 'Priority support queue',
    type: 'BOOLEAN',
    category: 'support',
    defaultValue: 'false',
  },
  DEDICATED_MANAGER: {
    code: 'DEDICATED_MANAGER',
    name: 'Dedicated Account Manager',
    description: 'Personal account manager',
    type: 'BOOLEAN',
    category: 'support',
    defaultValue: 'false',
  },
  
  // SLA
  SLA_99: {
    code: 'SLA_99',
    name: '99% SLA',
    description: '99% uptime guarantee',
    type: 'BOOLEAN',
    category: 'sla',
    defaultValue: 'false',
  },
  SLA_99_9: {
    code: 'SLA_99_9',
    name: '99.9% SLA',
    description: '99.9% uptime guarantee',
    type: 'BOOLEAN',
    category: 'sla',
    defaultValue: 'false',
  },
  SLA_99_99: {
    code: 'SLA_99_99',
    name: '99.99% SLA',
    description: '99.99% uptime guarantee',
    type: 'BOOLEAN',
    category: 'sla',
    defaultValue: 'false',
  },
} as const;

export type FeatureCode = keyof typeof FEATURE_CATALOG;
```

### 4.2 Serviço de Entitlements

```typescript
// src/modules/billing/services/entitlement.service.ts

import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { CacheService } from '@/shared/cache/cache.service';

export interface Entitlement {
  featureCode: string;
  enabled: boolean;
  limit: number | null;  // null = no limit or N/A
  currentUsage: number;
  remaining: number | null;
}

export interface EntitlementCheck {
  allowed: boolean;
  reason?: string;
  limit?: number;
  currentUsage?: number;
  remaining?: number;
}

@Injectable()
export class EntitlementService {
  private readonly CACHE_TTL = 300; // 5 minutes
  
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  /**
   * Get all entitlements for a tenant
   */
  async getEntitlements(tenantId: string): Promise<Map<string, Entitlement>> {
    const cacheKey = `entitlements:${tenantId}`;
    
    // Check cache
    const cached = await this.cache.get<Map<string, Entitlement>>(cacheKey);
    if (cached) return cached;
    
    // Get subscription with plan and features
    const subscription = await this.prisma.subscription.findUnique({
      where: { tenantId },
      include: {
        plan: {
          include: {
            features: {
              include: {
                feature: true,
              },
            },
          },
        },
      },
    });

    if (!subscription) {
      throw new ForbiddenException('No active subscription');
    }

    // Get product effects (purchases)
    const activePurchases = await this.prisma.purchase.findMany({
      where: {
        tenantId,
        status: 'COMPLETED',
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      include: {
        product: {
          include: {
            effects: {
              include: {
                feature: true,
              },
            },
          },
        },
      },
    });

    // Get current usage
    const usageRecords = await this.prisma.usageRecord.findMany({
      where: {
        tenantId,
        periodEnd: { gt: new Date() },
      },
    });

    const usageMap = new Map(
      usageRecords.map(r => [r.featureId, r.currentUsage])
    );

    // Build entitlements map
    const entitlements = new Map<string, Entitlement>();

    // Apply plan features
    for (const pf of subscription.plan.features) {
      const usage = usageMap.get(pf.featureId) ?? 0;
      const limit = pf.feature.type === 'QUOTA' ? pf.limitValue : null;
      
      entitlements.set(pf.feature.code, {
        featureCode: pf.feature.code,
        enabled: pf.enabled,
        limit: limit === -1 ? null : limit, // -1 means unlimited
        currentUsage: usage,
        remaining: limit === null || limit === -1 ? null : Math.max(0, limit - usage),
      });
    }

    // Apply product effects (additive)
    for (const purchase of activePurchases) {
      for (const effect of purchase.product.effects) {
        const existing = entitlements.get(effect.feature.code);
        
        if (effect.effectType === 'ADD' && existing && existing.limit !== null) {
          existing.limit += effect.value ?? 0;
          existing.remaining = Math.max(0, existing.limit - existing.currentUsage);
        } else if (effect.effectType === 'ENABLE') {
          if (existing) {
            existing.enabled = true;
          } else {
            entitlements.set(effect.feature.code, {
              featureCode: effect.feature.code,
              enabled: true,
              limit: null,
              currentUsage: 0,
              remaining: null,
            });
          }
        }
      }
    }

    // Cache result
    await this.cache.set(cacheKey, entitlements, this.CACHE_TTL);

    return entitlements;
  }

  /**
   * Check if tenant can use a feature
   */
  async checkFeature(
    tenantId: string,
    featureCode: string,
  ): Promise<EntitlementCheck> {
    const entitlements = await this.getEntitlements(tenantId);
    const entitlement = entitlements.get(featureCode);

    if (!entitlement) {
      return {
        allowed: false,
        reason: `Feature ${featureCode} not available in your plan`,
      };
    }

    if (!entitlement.enabled) {
      return {
        allowed: false,
        reason: `Feature ${featureCode} is not enabled in your plan`,
      };
    }

    return {
      allowed: true,
      limit: entitlement.limit ?? undefined,
      currentUsage: entitlement.currentUsage,
      remaining: entitlement.remaining ?? undefined,
    };
  }

  /**
   * Check if tenant can consume quota
   */
  async checkQuota(
    tenantId: string,
    featureCode: string,
    amount: number = 1,
  ): Promise<EntitlementCheck> {
    const check = await this.checkFeature(tenantId, featureCode);

    if (!check.allowed) {
      return check;
    }

    // If no limit (unlimited), always allow
    if (check.limit === undefined) {
      return { allowed: true };
    }

    // Check if enough remaining
    const remaining = check.remaining ?? 0;
    if (remaining < amount) {
      return {
        allowed: false,
        reason: `Quota exceeded for ${featureCode}. Limit: ${check.limit}, Used: ${check.currentUsage}, Requested: ${amount}`,
        limit: check.limit,
        currentUsage: check.currentUsage,
        remaining,
      };
    }

    return {
      allowed: true,
      limit: check.limit,
      currentUsage: check.currentUsage,
      remaining,
    };
  }

  /**
   * Consume quota (after successful operation)
   */
  async consumeQuota(
    tenantId: string,
    featureCode: string,
    amount: number = 1,
  ): Promise<void> {
    // Get feature
    const feature = await this.prisma.feature.findUnique({
      where: { code: featureCode },
    });

    if (!feature || feature.type !== 'QUOTA') {
      return; // Not a quota feature, nothing to track
    }

    // Get or create usage record for current period
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    await this.prisma.usageRecord.upsert({
      where: {
        tenantId_featureId_periodStart: {
          tenantId,
          featureId: feature.id,
          periodStart,
        },
      },
      create: {
        tenantId,
        featureId: feature.id,
        currentUsage: amount,
        periodStart,
        periodEnd,
      },
      update: {
        currentUsage: { increment: amount },
      },
    });

    // Invalidate cache
    await this.cache.del(`entitlements:${tenantId}`);
  }

  /**
   * Invalidate cache for tenant
   */
  async invalidateCache(tenantId: string): Promise<void> {
    await this.cache.del(`entitlements:${tenantId}`);
  }
}
```

### 4.3 Guard de Feature

```typescript
// src/modules/billing/guards/feature.guard.ts

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EntitlementService } from '../services/entitlement.service';

export const FEATURE_KEY = 'required_feature';
export const RequireFeature = (featureCode: string) =>
  SetMetadata(FEATURE_KEY, featureCode);

export const QUOTA_KEY = 'required_quota';
export const RequireQuota = (featureCode: string, amount: number = 1) =>
  SetMetadata(QUOTA_KEY, { featureCode, amount });

@Injectable()
export class FeatureGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly entitlementService: EntitlementService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tenantId = request.user?.tenantId;

    if (!tenantId) {
      throw new ForbiddenException('Tenant not identified');
    }

    // Check feature requirement
    const requiredFeature = this.reflector.getAllAndOverride<string>(
      FEATURE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredFeature) {
      const check = await this.entitlementService.checkFeature(
        tenantId,
        requiredFeature,
      );
      
      if (!check.allowed) {
        throw new ForbiddenException(check.reason);
      }
    }

    // Check quota requirement
    const requiredQuota = this.reflector.getAllAndOverride<{
      featureCode: string;
      amount: number;
    }>(QUOTA_KEY, [context.getHandler(), context.getClass()]);

    if (requiredQuota) {
      const check = await this.entitlementService.checkQuota(
        tenantId,
        requiredQuota.featureCode,
        requiredQuota.amount,
      );

      if (!check.allowed) {
        throw new ForbiddenException(check.reason);
      }
    }

    return true;
  }
}
```

### 4.4 Uso nos Controllers

```typescript
// Exemplo de uso

@Controller('api/users')
@UseGuards(JwtAuthGuard, FeatureGuard)
export class UsersController {
  
  @Post()
  @RequireFeature('USERS')  // Verifica se feature está habilitada
  @RequireQuota('USERS', 1) // Verifica se tem quota disponível
  async createUser(@Body() dto: CreateUserDto) {
    // Criar usuário
    const user = await this.usersService.create(dto);
    
    // Consumir quota após sucesso
    await this.entitlementService.consumeQuota(dto.tenantId, 'USERS', 1);
    
    return user;
  }

  @Post('bulk')
  @RequireFeature('USERS')
  async createBulkUsers(
    @Body() dto: CreateBulkUsersDto,
    @Req() req: Request,
  ) {
    // Verificar quota para todos os usuários
    const check = await this.entitlementService.checkQuota(
      req.user.tenantId,
      'USERS',
      dto.users.length,
    );
    
    if (!check.allowed) {
      throw new ForbiddenException(check.reason);
    }
    
    // Criar usuários
    const users = await this.usersService.createBulk(dto);
    
    // Consumir quota
    await this.entitlementService.consumeQuota(
      req.user.tenantId,
      'USERS',
      users.length,
    );
    
    return users;
  }

  @Get('export/csv')
  @RequireFeature('EXPORT_CSV') // Verifica se pode exportar CSV
  async exportCsv() {
    // ...
  }

  @Get('export/pdf')
  @RequireFeature('EXPORT_PDF') // Verifica se pode exportar PDF
  async exportPdf() {
    // ...
  }
}
```

---

## 5. LIMITES E QUOTAS

### 5.1 Matriz de Features por Plano

```typescript
// src/modules/billing/config/default-plans.ts

export const DEFAULT_PLANS = [
  {
    code: 'free',
    name: 'Free',
    description: 'Para começar a explorar',
    type: 'SUBSCRIPTION',
    trialDays: 0,
    isDefault: true,
    isPublic: true,
    badge: null,
    prices: [
      { interval: 'FOREVER', amount: 0, currency: 'BRL' },
    ],
    features: [
      // Team
      { code: 'USERS', enabled: true, limit: 1 },
      { code: 'ROLES', enabled: true, limit: 2 },
      
      // Storage
      { code: 'STORAGE_MB', enabled: true, limit: 100 },
      { code: 'FILE_SIZE_MB', enabled: true, limit: 5 },
      
      // API
      { code: 'API_CALLS_MONTH', enabled: true, limit: 1000 },
      { code: 'WEBHOOKS', enabled: true, limit: 1 },
      { code: 'API_ACCESS', enabled: false },
      
      // Email
      { code: 'EMAILS_MONTH', enabled: true, limit: 100 },
      
      // Projects
      { code: 'PROJECTS', enabled: true, limit: 2 },
      
      // Dashboard
      { code: 'DASHBOARD_BASIC', enabled: true },
      { code: 'DASHBOARD_ANALYTICS', enabled: false },
      { code: 'DASHBOARD_ADVANCED', enabled: false },
      
      // Export
      { code: 'EXPORT_CSV', enabled: false },
      { code: 'EXPORT_PDF', enabled: false },
      { code: 'EXPORT_EXCEL', enabled: false },
      
      // Customization
      { code: 'CUSTOM_DOMAIN', enabled: false },
      { code: 'WHITE_LABEL', enabled: false },
      { code: 'CUSTOM_THEME', enabled: false },
      
      // Security
      { code: 'TWO_FACTOR_AUTH', enabled: true },
      { code: 'SSO', enabled: false },
      { code: 'AUDIT_LOGS', enabled: false },
      { code: 'IP_WHITELIST', enabled: false },
      
      // Support
      { code: 'SUPPORT_EMAIL', enabled: true },
      { code: 'SUPPORT_CHAT', enabled: false },
      { code: 'SUPPORT_PHONE', enabled: false },
      { code: 'PRIORITY_SUPPORT', enabled: false },
    ],
  },
  {
    code: 'basic',
    name: 'Basic',
    description: 'Para pequenas equipes',
    type: 'SUBSCRIPTION',
    trialDays: 7,
    isDefault: false,
    isPublic: true,
    badge: null,
    prices: [
      { interval: 'MONTHLY', amount: 49, currency: 'BRL' },
      { interval: 'YEARLY', amount: 490, currency: 'BRL', originalAmount: 588 },
    ],
    features: [
      // Team
      { code: 'USERS', enabled: true, limit: 5 },
      { code: 'ROLES', enabled: true, limit: 5 },
      
      // Storage
      { code: 'STORAGE_MB', enabled: true, limit: 1000 },
      { code: 'FILE_SIZE_MB', enabled: true, limit: 25 },
      
      // API
      { code: 'API_CALLS_MONTH', enabled: true, limit: 10000 },
      { code: 'WEBHOOKS', enabled: true, limit: 3 },
      { code: 'API_ACCESS', enabled: false },
      
      // Email
      { code: 'EMAILS_MONTH', enabled: true, limit: 1000 },
      
      // Projects
      { code: 'PROJECTS', enabled: true, limit: 10 },
      
      // Dashboard
      { code: 'DASHBOARD_BASIC', enabled: true },
      { code: 'DASHBOARD_ANALYTICS', enabled: true },
      { code: 'DASHBOARD_ADVANCED', enabled: false },
      
      // Export
      { code: 'EXPORT_CSV', enabled: true },
      { code: 'EXPORT_PDF', enabled: false },
      { code: 'EXPORT_EXCEL', enabled: false },
      
      // Customization
      { code: 'CUSTOM_DOMAIN', enabled: false },
      { code: 'WHITE_LABEL', enabled: false },
      { code: 'CUSTOM_THEME', enabled: true },
      
      // Security
      { code: 'TWO_FACTOR_AUTH', enabled: true },
      { code: 'SSO', enabled: false },
      { code: 'AUDIT_LOGS', enabled: false },
      { code: 'IP_WHITELIST', enabled: false },
      
      // Support
      { code: 'SUPPORT_EMAIL', enabled: true },
      { code: 'SUPPORT_CHAT', enabled: true },
      { code: 'SUPPORT_PHONE', enabled: false },
      { code: 'PRIORITY_SUPPORT', enabled: false },
    ],
  },
  {
    code: 'pro',
    name: 'Pro',
    description: 'Para equipes em crescimento',
    type: 'SUBSCRIPTION',
    trialDays: 14,
    isDefault: false,
    isPublic: true,
    badge: 'Popular',
    prices: [
      { interval: 'MONTHLY', amount: 149, currency: 'BRL' },
      { interval: 'YEARLY', amount: 1490, currency: 'BRL', originalAmount: 1788 },
    ],
    features: [
      // Team
      { code: 'USERS', enabled: true, limit: 25 },
      { code: 'ROLES', enabled: true, limit: 15 },
      
      // Storage
      { code: 'STORAGE_MB', enabled: true, limit: 10000 },
      { code: 'FILE_SIZE_MB', enabled: true, limit: 100 },
      
      // API
      { code: 'API_CALLS_MONTH', enabled: true, limit: 100000 },
      { code: 'WEBHOOKS', enabled: true, limit: 10 },
      { code: 'API_ACCESS', enabled: true },
      
      // Email
      { code: 'EMAILS_MONTH', enabled: true, limit: 10000 },
      
      // Projects
      { code: 'PROJECTS', enabled: true, limit: 50 },
      
      // Dashboard
      { code: 'DASHBOARD_BASIC', enabled: true },
      { code: 'DASHBOARD_ANALYTICS', enabled: true },
      { code: 'DASHBOARD_ADVANCED', enabled: true },
      
      // Export
      { code: 'EXPORT_CSV', enabled: true },
      { code: 'EXPORT_PDF', enabled: true },
      { code: 'EXPORT_EXCEL', enabled: true },
      
      // Customization
      { code: 'CUSTOM_DOMAIN', enabled: true },
      { code: 'WHITE_LABEL', enabled: false },
      { code: 'CUSTOM_THEME', enabled: true },
      
      // Security
      { code: 'TWO_FACTOR_AUTH', enabled: true },
      { code: 'SSO', enabled: false },
      { code: 'AUDIT_LOGS', enabled: true },
      { code: 'IP_WHITELIST', enabled: true },
      
      // Support
      { code: 'SUPPORT_EMAIL', enabled: true },
      { code: 'SUPPORT_CHAT', enabled: true },
      { code: 'SUPPORT_PHONE', enabled: false },
      { code: 'PRIORITY_SUPPORT', enabled: true },
      
      // SLA
      { code: 'SLA_99', enabled: true },
    ],
  },
  {
    code: 'enterprise',
    name: 'Enterprise',
    description: 'Para grandes organizações',
    type: 'SUBSCRIPTION',
    trialDays: 30,
    isDefault: false,
    isPublic: true,
    badge: 'Melhor Custo-Benefício',
    prices: [
      { interval: 'MONTHLY', amount: 499, currency: 'BRL' },
      { interval: 'YEARLY', amount: 4990, currency: 'BRL', originalAmount: 5988 },
    ],
    features: [
      // Team - UNLIMITED
      { code: 'USERS', enabled: true, limit: -1 },
      { code: 'ROLES', enabled: true, limit: -1 },
      
      // Storage - UNLIMITED
      { code: 'STORAGE_MB', enabled: true, limit: -1 },
      { code: 'FILE_SIZE_MB', enabled: true, limit: 500 },
      
      // API - UNLIMITED
      { code: 'API_CALLS_MONTH', enabled: true, limit: -1 },
      { code: 'WEBHOOKS', enabled: true, limit: -1 },
      { code: 'API_ACCESS', enabled: true },
      { code: 'GRAPHQL_ACCESS', enabled: true },
      
      // Email
      { code: 'EMAILS_MONTH', enabled: true, limit: -1 },
      
      // Projects
      { code: 'PROJECTS', enabled: true, limit: -1 },
      
      // Dashboard - ALL
      { code: 'DASHBOARD_BASIC', enabled: true },
      { code: 'DASHBOARD_ANALYTICS', enabled: true },
      { code: 'DASHBOARD_ADVANCED', enabled: true },
      
      // Export - ALL
      { code: 'EXPORT_CSV', enabled: true },
      { code: 'EXPORT_PDF', enabled: true },
      { code: 'EXPORT_EXCEL', enabled: true },
      
      // Customization - ALL
      { code: 'CUSTOM_DOMAIN', enabled: true },
      { code: 'WHITE_LABEL', enabled: true },
      { code: 'CUSTOM_THEME', enabled: true },
      
      // Security - ALL
      { code: 'TWO_FACTOR_AUTH', enabled: true },
      { code: 'SSO', enabled: true },
      { code: 'AUDIT_LOGS', enabled: true },
      { code: 'IP_WHITELIST', enabled: true },
      
      // Support - ALL
      { code: 'SUPPORT_EMAIL', enabled: true },
      { code: 'SUPPORT_CHAT', enabled: true },
      { code: 'SUPPORT_PHONE', enabled: true },
      { code: 'PRIORITY_SUPPORT', enabled: true },
      { code: 'DEDICATED_MANAGER', enabled: true },
      
      // SLA
      { code: 'SLA_99_9', enabled: true },
    ],
  },
];
```

### 5.2 Tabela Visual de Comparação

| Feature | Free | Basic | Pro | Enterprise |
|---------|------|-------|-----|------------|
| **Usuários** | 1 | 5 | 25 | ∞ |
| **Roles** | 2 | 5 | 15 | ∞ |
| **Storage** | 100 MB | 1 GB | 10 GB | ∞ |
| **API Calls/mês** | 1,000 | 10,000 | 100,000 | ∞ |
| **Webhooks** | 1 | 3 | 10 | ∞ |
| **Projetos** | 2 | 10 | 50 | ∞ |
| **Emails/mês** | 100 | 1,000 | 10,000 | ∞ |
| **Dashboard Básico** | ✅ | ✅ | ✅ | ✅ |
| **Analytics** | ❌ | ✅ | ✅ | ✅ |
| **Dashboard Avançado** | ❌ | ❌ | ✅ | ✅ |
| **Export CSV** | ❌ | ✅ | ✅ | ✅ |
| **Export PDF** | ❌ | ❌ | ✅ | ✅ |
| **Export Excel** | ❌ | ❌ | ✅ | ✅ |
| **Custom Domain** | ❌ | ❌ | ✅ | ✅ |
| **White Label** | ❌ | ❌ | ❌ | ✅ |
| **API Access** | ❌ | ❌ | ✅ | ✅ |
| **SSO** | ❌ | ❌ | ❌ | ✅ |
| **Audit Logs** | ❌ | ❌ | ✅ | ✅ |
| **IP Whitelist** | ❌ | ❌ | ✅ | ✅ |
| **2FA** | ✅ | ✅ | ✅ | ✅ |
| **Email Support** | ✅ | ✅ | ✅ | ✅ |
| **Chat Support** | ❌ | ✅ | ✅ | ✅ |
| **Phone Support** | ❌ | ❌ | ❌ | ✅ |
| **Priority Support** | ❌ | ❌ | ✅ | ✅ |
| **SLA** | - | - | 99% | 99.9% |
| **Preço Mensal** | R$ 0 | R$ 49 | R$ 149 | R$ 499 |
| **Preço Anual** | R$ 0 | R$ 490 | R$ 1.490 | R$ 4.990 |

---

## 6. API ENDPOINTS

### 6.1 Plans Endpoints

```typescript
// ============================================
// PUBLIC ENDPOINTS (Pricing Page)
// ============================================

/**
 * List public plans
 * GET /api/plans
 */
interface ListPlansResponse {
  data: {
    id: string;
    code: string;
    name: string;
    description: string;
    badge: string | null;
    trialDays: number;
    prices: {
      id: string;
      interval: BillingInterval;
      amount: number;
      currency: string;
      originalAmount: number | null;
    }[];
    features: {
      code: string;
      name: string;
      enabled: boolean;
      limit: number | null; // -1 = unlimited
      displayValue: string; // "5 users", "Unlimited", "✓"
    }[];
  }[];
}

/**
 * Get plan details
 * GET /api/plans/:code
 */

// ============================================
// ADMIN ENDPOINTS (SUPER_ADMIN)
// ============================================

/**
 * Create plan
 * POST /api/admin/plans
 */
interface CreatePlanRequest {
  code: string;
  name: string;
  description?: string;
  type: PlanType;
  trialDays?: number;
  isDefault?: boolean;
  isPublic?: boolean;
  badge?: string;
  prices: {
    interval: BillingInterval;
    amount: number;
    currency: string;
    originalAmount?: number;
  }[];
  features: {
    featureCode: string;
    enabled: boolean;
    limitValue?: number;
  }[];
}

/**
 * Update plan
 * PATCH /api/admin/plans/:id
 */

/**
 * Delete plan
 * DELETE /api/admin/plans/:id
 * Soft delete, only if no active subscriptions
 */

/**
 * Sync plan to Stripe
 * POST /api/admin/plans/:id/sync-stripe
 */

// ============================================
// TENANT ENDPOINTS
// ============================================

/**
 * Get current subscription
 * GET /api/billing/subscription
 */
interface GetSubscriptionResponse {
  data: {
    id: string;
    status: SubscriptionStatus;
    plan: {
      id: string;
      code: string;
      name: string;
    };
    price: {
      interval: BillingInterval;
      amount: number;
      currency: string;
    };
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    trialEnd: string | null;
  };
}

/**
 * Get current entitlements
 * GET /api/billing/entitlements
 */
interface GetEntitlementsResponse {
  data: {
    [featureCode: string]: {
      enabled: boolean;
      limit: number | null;
      currentUsage: number;
      remaining: number | null;
    };
  };
}

/**
 * Check specific feature
 * GET /api/billing/entitlements/:featureCode
 */

/**
 * Create subscription (checkout)
 * POST /api/billing/subscription
 */
interface CreateSubscriptionRequest {
  priceId: string;
  paymentMethod: 'stripe' | 'pix';
  paymentMethodId?: string; // For Stripe
}

/**
 * Update subscription (upgrade/downgrade)
 * PATCH /api/billing/subscription
 */
interface UpdateSubscriptionRequest {
  priceId: string;
}

/**
 * Cancel subscription
 * DELETE /api/billing/subscription
 */
interface CancelSubscriptionRequest {
  immediately: boolean;
  reason?: string;
}
```

### 6.2 Products Endpoints

```typescript
// ============================================
// PUBLIC ENDPOINTS
// ============================================

/**
 * List products
 * GET /api/products
 */
interface ListProductsResponse {
  data: {
    id: string;
    code: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    originalPrice: number | null;
    imageUrl: string | null;
    effects: {
      featureCode: string;
      effectType: EffectType;
      value: number | null;
    }[];
  }[];
}

// ============================================
// TENANT ENDPOINTS
// ============================================

/**
 * Purchase product
 * POST /api/billing/purchase
 */
interface PurchaseProductRequest {
  productId: string;
  paymentMethod: 'stripe' | 'pix';
  paymentMethodId?: string;
}

interface PurchaseProductResponse {
  data: {
    purchaseId: string;
    status: PurchaseStatus;
    // For Pix
    qrCode?: string;
    qrCodeText?: string;
    expiresAt?: string;
    // For Stripe
    clientSecret?: string;
  };
}

/**
 * List purchases
 * GET /api/billing/purchases
 */

/**
 * Get purchase details
 * GET /api/billing/purchases/:id
 */
```

### 6.3 Features Endpoints (Admin)

```typescript
/**
 * List features
 * GET /api/admin/features
 */

/**
 * Create feature
 * POST /api/admin/features
 */
interface CreateFeatureRequest {
  code: string;
  name: string;
  description?: string;
  type: FeatureType;
  unit?: string;
  category?: string;
  defaultValue?: string;
}

/**
 * Update feature
 * PATCH /api/admin/features/:id
 */

/**
 * Delete feature
 * DELETE /api/admin/features/:id
 * Only if not used in any plan
 */
```

---

## 7. INTEGRAÇÃO COM PAYMENTS

### 7.1 Arquitetura de Integração

```
┌─────────────────────────────────────────────────────────────────┐
│                     BILLING SERVICE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │   PlanService   │    │ ProductService  │                    │
│  └────────┬────────┘    └────────┬────────┘                    │
│           │                      │                              │
│           ▼                      ▼                              │
│  ┌─────────────────────────────────────────┐                   │
│  │         SubscriptionService             │                   │
│  │  (orquestra criação/atualização)        │                   │
│  └────────────────────┬────────────────────┘                   │
│                       │                                         │
│           ┌───────────┼───────────┐                            │
│           ▼           ▼           ▼                            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │StripeProvider│ │PagueBitProv. │ │MercadoPago P.│            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Fluxo de Checkout com Pix (PagueBit)

```typescript
// src/modules/billing/services/subscription.service.ts

@Injectable()
export class SubscriptionService {
  async createSubscription(
    tenantId: string,
    priceId: string,
    paymentMethod: 'stripe' | 'pix',
  ): Promise<CreateSubscriptionResult> {
    // 1. Buscar preço e plano
    const price = await this.prisma.price.findUnique({
      where: { id: priceId },
      include: { plan: true },
    });

    if (!price) {
      throw new NotFoundException('Price not found');
    }

    // 2. Verificar se já tem subscription ativa
    const existing = await this.prisma.subscription.findUnique({
      where: { tenantId },
    });

    if (existing && existing.status === 'ACTIVE') {
      throw new ConflictException('Tenant already has active subscription');
    }

    // 3. Criar ou atualizar subscription em PENDING
    const subscription = await this.prisma.subscription.upsert({
      where: { tenantId },
      create: {
        tenantId,
        planId: price.planId,
        priceId: price.id,
        status: 'TRIAL', // ou PENDING se não tiver trial
        trialEnd: price.plan.trialDays > 0
          ? new Date(Date.now() + price.plan.trialDays * 24 * 60 * 60 * 1000)
          : null,
      },
      update: {
        planId: price.planId,
        priceId: price.id,
        status: 'TRIAL',
      },
    });

    // 4. Se for gratuito, ativar imediatamente
    if (price.amount === 0) {
      await this.activateSubscription(subscription.id);
      return {
        subscriptionId: subscription.id,
        status: 'ACTIVE',
      };
    }

    // 5. Processar pagamento
    if (paymentMethod === 'pix') {
      return this.createPixCheckout(subscription, price);
    } else {
      return this.createStripeCheckout(subscription, price);
    }
  }

  private async createPixCheckout(
    subscription: Subscription,
    price: Price,
  ): Promise<CreateSubscriptionResult> {
    // Criar pagamento no PagueBit
    const payment = await this.pagueBitService.createPayment({
      amount: Number(price.amount),
      description: `Assinatura ${price.plan.name} - ${price.interval}`,
      customerEmail: subscription.tenant.email,
    });

    // Salvar referência do pagamento
    await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        metadata: {
          pendingPaymentId: payment.id,
          paymentProvider: 'paguebit',
        },
      },
    });

    return {
      subscriptionId: subscription.id,
      status: 'PENDING_PAYMENT',
      qrCode: payment.qrCode,
      qrCodeText: payment.qrCodeText,
      expiresAt: payment.expiresAt.toISOString(),
    };
  }

  async handlePagueBitWebhook(payload: WebhookResult): Promise<void> {
    if (payload.status !== 'PAID') return;

    // Buscar subscription pelo paymentId
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        metadata: {
          path: ['pendingPaymentId'],
          equals: payload.paymentId,
        },
      },
    });

    if (!subscription) {
      this.logger.warn(`No subscription found for payment ${payload.paymentId}`);
      return;
    }

    // Ativar subscription
    await this.activateSubscription(subscription.id);

    // Criar invoice
    await this.invoiceService.createFromSubscription(subscription.id, {
      paymentId: payload.paymentId,
      paymentProvider: 'paguebit',
    });
  }

  private async activateSubscription(subscriptionId: string): Promise<void> {
    const now = new Date();
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { price: true },
    });

    // Calcular período baseado no interval
    const periodEnd = this.calculatePeriodEnd(now, subscription.price.interval);

    await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        metadata: {
          ...subscription.metadata,
          activatedAt: now.toISOString(),
        },
      },
    });

    // Invalidar cache de entitlements
    await this.entitlementService.invalidateCache(subscription.tenantId);

    // Enviar email de confirmação
    await this.emailService.sendSubscriptionActivated(subscription.tenantId);
  }
}
```

### 7.3 Sincronização com Stripe

```typescript
// src/modules/billing/services/stripe-sync.service.ts

@Injectable()
export class StripeSyncService {
  /**
   * Sync plan to Stripe
   */
  async syncPlanToStripe(planId: string): Promise<void> {
    const plan = await this.prisma.plan.findUnique({
      where: { id: planId },
      include: { prices: true },
    });

    // Create or update Stripe Product
    let stripeProduct: Stripe.Product;
    
    if (plan.stripeProductId) {
      stripeProduct = await this.stripe.products.update(plan.stripeProductId, {
        name: plan.name,
        description: plan.description,
        active: plan.isActive,
      });
    } else {
      stripeProduct = await this.stripe.products.create({
        name: plan.name,
        description: plan.description,
        metadata: {
          planId: plan.id,
          planCode: plan.code,
        },
      });

      await this.prisma.plan.update({
        where: { id: planId },
        data: { stripeProductId: stripeProduct.id },
      });
    }

    // Sync prices
    for (const price of plan.prices) {
      await this.syncPriceToStripe(price, stripeProduct.id);
    }
  }

  private async syncPriceToStripe(
    price: Price,
    stripeProductId: string,
  ): Promise<void> {
    const recurring = this.mapIntervalToStripe(price.interval);

    if (price.stripePriceId) {
      // Stripe doesn't allow updating prices, so we archive and create new
      await this.stripe.prices.update(price.stripePriceId, {
        active: false,
      });
    }

    const stripePrice = await this.stripe.prices.create({
      product: stripeProductId,
      unit_amount: Math.round(Number(price.amount) * 100), // Convert to cents
      currency: price.currency.toLowerCase(),
      recurring: recurring ? { interval: recurring } : undefined,
      metadata: {
        priceId: price.id,
      },
    });

    await this.prisma.price.update({
      where: { id: price.id },
      data: { stripePriceId: stripePrice.id },
    });
  }

  private mapIntervalToStripe(
    interval: BillingInterval,
  ): Stripe.Price.Recurring.Interval | null {
    const mapping: Record<BillingInterval, Stripe.Price.Recurring.Interval | null> = {
      DAILY: 'day',
      WEEKLY: 'week',
      MONTHLY: 'month',
      QUARTERLY: 'month', // 3 months
      YEARLY: 'year',
      LIFETIME: null,
      FOREVER: null,
    };
    return mapping[interval];
  }
}
```

---

## 8. UI/ADMIN PANEL

### 8.1 Páginas Necessárias

```typescript
// Estrutura de páginas no admin panel

const BILLING_PAGES = [
  // ============================================
  // PUBLIC (Pricing Page)
  // ============================================
  {
    path: '/pricing',
    component: 'PricingPage',
    description: 'Página pública de preços',
    features: [
      'Comparação de planos',
      'Toggle mensal/anual',
      'CTA para cada plano',
      'FAQ seção',
    ],
  },

  // ============================================
  // TENANT (Billing Settings)
  // ============================================
  {
    path: '/settings/billing',
    component: 'BillingOverview',
    description: 'Visão geral da assinatura',
    features: [
      'Plano atual',
      'Próxima cobrança',
      'Uso atual vs limites',
      'Histórico de faturas',
    ],
  },
  {
    path: '/settings/billing/upgrade',
    component: 'UpgradePlan',
    description: 'Upgrade/downgrade de plano',
    features: [
      'Comparação com plano atual',
      'Cálculo de proration',
      'Checkout integrado',
    ],
  },
  {
    path: '/settings/billing/invoices',
    component: 'InvoiceList',
    description: 'Lista de faturas',
    features: [
      'Tabela de faturas',
      'Download PDF',
      'Status de pagamento',
    ],
  },
  {
    path: '/settings/billing/payment-methods',
    component: 'PaymentMethods',
    description: 'Métodos de pagamento',
    features: [
      'Cartões salvos',
      'Adicionar/remover cartão',
      'Definir padrão',
    ],
  },

  // ============================================
  // ADMIN (Super Admin)
  // ============================================
  {
    path: '/admin/billing/plans',
    component: 'PlanManagement',
    description: 'Gerenciamento de planos',
    features: [
      'CRUD de planos',
      'Configuração de features',
      'Preços por intervalo',
      'Sync com Stripe',
    ],
  },
  {
    path: '/admin/billing/products',
    component: 'ProductManagement',
    description: 'Gerenciamento de produtos',
    features: [
      'CRUD de produtos',
      'Configuração de efeitos',
      'Imagens e descrições',
    ],
  },
  {
    path: '/admin/billing/features',
    component: 'FeatureManagement',
    description: 'Catálogo de features',
    features: [
      'CRUD de features',
      'Categorias',
      'Tipos (boolean, quota)',
    ],
  },
  {
    path: '/admin/billing/subscriptions',
    component: 'SubscriptionList',
    description: 'Lista de assinaturas',
    features: [
      'Todas as assinaturas',
      'Filtros por status/plano',
      'Ações (cancelar, reativar)',
      'Métricas (MRR, churn)',
    ],
  },
  {
    path: '/admin/billing/revenue',
    component: 'RevenueAnalytics',
    description: 'Analytics de receita',
    features: [
      'MRR, ARR',
      'Churn rate',
      'LTV',
      'Cohort analysis',
    ],
  },
];
```

### 8.2 Componentes de UI

```tsx
// components/billing/PricingCard.tsx

interface PricingCardProps {
  plan: Plan;
  currentPlanId?: string;
  billingInterval: 'monthly' | 'yearly';
  onSelect: (priceId: string) => void;
}

export function PricingCard({
  plan,
  currentPlanId,
  billingInterval,
  onSelect,
}: PricingCardProps) {
  const price = plan.prices.find(
    p => p.interval === (billingInterval === 'monthly' ? 'MONTHLY' : 'YEARLY')
  );
  
  const isCurrentPlan = plan.id === currentPlanId;
  const isFree = price?.amount === 0;

  return (
    <Card className={cn(
      'relative',
      plan.badge === 'Popular' && 'border-primary shadow-lg',
    )}>
      {plan.badge && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
          {plan.badge}
        </Badge>
      )}
      
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6">
          <span className="text-4xl font-bold">
            {isFree ? 'Grátis' : `R$ ${price?.amount}`}
          </span>
          {!isFree && (
            <span className="text-muted-foreground">
              /{billingInterval === 'monthly' ? 'mês' : 'ano'}
            </span>
          )}
          {price?.originalAmount && (
            <span className="ml-2 text-sm line-through text-muted-foreground">
              R$ {price.originalAmount}
            </span>
          )}
        </div>

        <ul className="space-y-3">
          {plan.features.map((feature) => (
            <li key={feature.code} className="flex items-center gap-2">
              {feature.enabled ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={cn(
                !feature.enabled && 'text-muted-foreground'
              )}>
                {feature.displayValue}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant={isCurrentPlan ? 'outline' : 'default'}
          disabled={isCurrentPlan}
          onClick={() => price && onSelect(price.id)}
        >
          {isCurrentPlan ? 'Plano Atual' : isFree ? 'Começar Grátis' : 'Assinar'}
        </Button>
      </CardFooter>
    </Card>
  );
}
```

```tsx
// components/billing/UsageCard.tsx

interface UsageCardProps {
  featureCode: string;
  name: string;
  limit: number | null;
  currentUsage: number;
  unit: string;
}

export function UsageCard({
  featureCode,
  name,
  limit,
  currentUsage,
  unit,
}: UsageCardProps) {
  const isUnlimited = limit === null || limit === -1;
  const percentage = isUnlimited ? 0 : (currentUsage / limit) * 100;
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold">{currentUsage}</span>
          <span className="text-muted-foreground">
            {isUnlimited ? '/ ∞' : `/ ${limit}`} {unit}
          </span>
        </div>
        
        {!isUnlimited && (
          <Progress
            value={Math.min(percentage, 100)}
            className={cn(
              'mt-2',
              isAtLimit && 'bg-destructive/20',
              isNearLimit && !isAtLimit && 'bg-warning/20',
            )}
          />
        )}

        {isAtLimit && (
          <p className="mt-2 text-xs text-destructive">
            Limite atingido. Faça upgrade para continuar.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## 9. FLUXOS DE NEGÓCIO

### 9.1 Diagrama de Estados da Subscription

```
                                    ┌─────────────────┐
                                    │                 │
                  ┌────────────────>│     TRIAL       │
                  │                 │                 │
                  │                 └────────┬────────┘
                  │                          │
          Novo tenant                   Trial end
          (com trial)                   + pagamento
                  │                          │
                  │                          ▼
┌─────────────────┴──┐              ┌─────────────────┐
│                    │   Pagamento  │                 │
│  PENDING_PAYMENT   │─────OK──────>│     ACTIVE      │<──────┐
│                    │              │                 │       │
└─────────────────┬──┘              └────────┬────────┘       │
                  │                          │                │
             Expirou/                   Pagamento         Reativação
              Falhou                     falhou              │
                  │                          │                │
                  ▼                          ▼                │
         ┌─────────────────┐        ┌─────────────────┐      │
         │                 │        │                 │      │
         │    CANCELED     │<───────│    PAST_DUE     │──────┘
         │                 │        │                 │
         └────────┬────────┘        └─────────────────┘
                  │                          │
                  │                     Grace period
                  │                       expirou
                  │                          │
                  │                          ▼
                  │                 ┌─────────────────┐
                  │                 │                 │
                  └────────────────>│     UNPAID      │
                                    │                 │
                                    └─────────────────┘
```

### 9.2 Fluxo de Upgrade/Downgrade

```
┌─────────────────────────────────────────────────────────────────┐
│                        UPGRADE FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Tenant seleciona novo plano                                 │
│                                                                 │
│  2. Sistema calcula proration:                                  │
│     - Dias restantes no período atual                           │
│     - Crédito do plano atual                                    │
│     - Débito do novo plano                                      │
│     - Valor final = Débito - Crédito                            │
│                                                                 │
│  3. Se valor > 0: Cobrar imediatamente                          │
│     Se valor < 0: Crédito para próxima fatura                   │
│                                                                 │
│  4. Atualizar subscription para novo plano                      │
│                                                                 │
│  5. Invalidar cache de entitlements                             │
│                                                                 │
│  6. Features do novo plano ativas IMEDIATAMENTE                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       DOWNGRADE FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Tenant seleciona plano inferior                             │
│                                                                 │
│  2. Sistema verifica se uso atual excede limites do novo plano: │
│     - Ex: Tem 10 usuários, novo plano permite 5                 │
│     - Se excede: Mostrar aviso, exigir redução                  │
│                                                                 │
│  3. Agendar downgrade para FIM do período atual                 │
│     (cancelAtPeriodEnd = true, scheduledPlanId = novo plano)    │
│                                                                 │
│  4. Tenant mantém features atuais até fim do período            │
│                                                                 │
│  5. No fim do período: Aplicar novo plano                       │
│     - Atualizar subscription                                    │
│     - Invalidar cache                                           │
│     - Notificar tenant                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 9.3 Fluxo de Compra de Produto (Add-on)

```
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│  Tenant  │      │  Backend │      │ PagueBit │      │ Database │
└────┬─────┘      └────┬─────┘      └────┬─────┘      └────┬─────┘
     │                 │                 │                 │
     │ POST /purchase  │                 │                 │
     │ {productId,pix} │                 │                 │
     │────────────────>│                 │                 │
     │                 │                 │                 │
     │                 │ Validate product│                 │
     │                 │────────────────────────────────-->│
     │                 │<──────────────────────────────────│
     │                 │                 │                 │
     │                 │ Create payment  │                 │
     │                 │────────────────>│                 │
     │                 │                 │                 │
     │                 │  QR Code        │                 │
     │                 │<────────────────│                 │
     │                 │                 │                 │
     │                 │ Save purchase   │                 │
     │                 │ (PENDING)       │                 │
     │                 │────────────────────────────────-->│
     │                 │                 │                 │
     │  QR Code +      │                 │                 │
     │  expiresAt      │                 │                 │
     │<────────────────│                 │                 │
     │                 │                 │                 │
     │  [Cliente paga] │                 │                 │
     │                 │                 │                 │
     │                 │  Webhook        │                 │
     │                 │  (approved)     │                 │
     │                 │<────────────────│                 │
     │                 │                 │                 │
     │                 │ Update purchase │                 │
     │                 │ (COMPLETED)     │                 │
     │                 │────────────────────────────────-->│
     │                 │                 │                 │
     │                 │ Apply effects   │                 │
     │                 │ (add quota)     │                 │
     │                 │────────────────────────────────-->│
     │                 │                 │                 │
     │                 │ Invalidate      │                 │
     │                 │ entitlement     │                 │
     │                 │ cache           │                 │
     │                 │─────┐           │                 │
     │                 │     │           │                 │
     │                 │<────┘           │                 │
     │                 │                 │                 │
     │  Email:         │                 │                 │
     │  Purchase OK    │                 │                 │
     │<────────────────│                 │                 │
     ▼                 ▼                 ▼                 ▼
```

---

## 10. IMPLEMENTAÇÃO

### 10.1 Checklist de Desenvolvimento

```markdown
## Fase 1: Foundation (2 dias)

### Database
- [ ] Criar migration para novos modelos
- [ ] Seed com features padrão
- [ ] Seed com planos padrão

### Types
- [ ] Criar DTOs
- [ ] Criar interfaces
- [ ] Criar enums

## Fase 2: Core Services (3 dias)

### Feature Service
- [ ] CRUD de features
- [ ] Feature catalog

### Plan Service
- [ ] CRUD de planos
- [ ] Preços por intervalo
- [ ] Features por plano

### Entitlement Service
- [ ] Get entitlements
- [ ] Check feature
- [ ] Check quota
- [ ] Consume quota
- [ ] Cache layer

## Fase 3: Billing Services (3 dias)

### Subscription Service
- [ ] Create subscription
- [ ] Update subscription (upgrade/downgrade)
- [ ] Cancel subscription
- [ ] Proration calculation

### Product Service
- [ ] CRUD de produtos
- [ ] Purchase flow
- [ ] Apply effects

### Integration
- [ ] Stripe sync
- [ ] PagueBit integration
- [ ] Webhook handlers

## Fase 4: API Layer (2 dias)

### Controllers
- [ ] Plans controller
- [ ] Products controller
- [ ] Billing controller
- [ ] Admin controllers

### Guards
- [ ] Feature guard
- [ ] Quota guard

### Middleware
- [ ] Usage tracking middleware

## Fase 5: Frontend (3 dias)

### Pages
- [ ] Pricing page
- [ ] Billing settings
- [ ] Plan upgrade page
- [ ] Invoice list
- [ ] Admin: Plan management
- [ ] Admin: Product management

### Components
- [ ] PricingCard
- [ ] UsageCard
- [ ] SubscriptionStatus
- [ ] FeatureComparison

## Fase 6: Tests (2 dias)

- [ ] Unit tests: Services
- [ ] Unit tests: Guards
- [ ] Integration tests: API
- [ ] E2E tests: Checkout flow
```

### 10.2 Arquivos a Criar

```
src/
├── modules/
│   └── billing/
│       ├── billing.module.ts
│       ├── controllers/
│       │   ├── plans.controller.ts
│       │   ├── products.controller.ts
│       │   ├── billing.controller.ts
│       │   └── admin/
│       │       ├── admin-plans.controller.ts
│       │       ├── admin-products.controller.ts
│       │       └── admin-features.controller.ts
│       ├── services/
│       │   ├── plan.service.ts
│       │   ├── product.service.ts
│       │   ├── subscription.service.ts
│       │   ├── entitlement.service.ts
│       │   ├── usage.service.ts
│       │   ├── proration.service.ts
│       │   └── stripe-sync.service.ts
│       ├── guards/
│       │   └── feature.guard.ts
│       ├── decorators/
│       │   ├── require-feature.decorator.ts
│       │   └── require-quota.decorator.ts
│       ├── dto/
│       │   ├── create-plan.dto.ts
│       │   ├── create-product.dto.ts
│       │   ├── create-subscription.dto.ts
│       │   └── ...
│       ├── interfaces/
│       │   ├── entitlement.interface.ts
│       │   └── ...
│       ├── config/
│       │   ├── feature-catalog.ts
│       │   └── default-plans.ts
│       └── __tests__/
│           ├── plan.service.spec.ts
│           ├── entitlement.service.spec.ts
│           └── ...
│
├── prisma/
│   ├── migrations/
│   │   └── YYYYMMDD_add_plans_products/
│   └── seed/
│       ├── features.seed.ts
│       └── plans.seed.ts
│
└── apps/
    └── web/
        └── app/
            ├── (public)/
            │   └── pricing/
            │       └── page.tsx
            └── (dashboard)/
                └── settings/
                    └── billing/
                        ├── page.tsx
                        ├── upgrade/
                        │   └── page.tsx
                        └── invoices/
                            └── page.tsx
```

---

## 11. TESTES

### 11.1 Testes de Entitlement

```typescript
// src/modules/billing/__tests__/entitlement.service.spec.ts

describe('EntitlementService', () => {
  describe('checkFeature', () => {
    it('should allow access to enabled boolean feature', async () => {
      // Setup: Plan Pro com EXPORT_CSV enabled
      const result = await service.checkFeature(tenantId, 'EXPORT_CSV');
      
      expect(result.allowed).toBe(true);
    });

    it('should deny access to disabled feature', async () => {
      // Setup: Plan Free com EXPORT_CSV disabled
      const result = await service.checkFeature(tenantId, 'EXPORT_CSV');
      
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('not enabled');
    });
  });

  describe('checkQuota', () => {
    it('should allow when quota available', async () => {
      // Setup: Plan Basic com USERS limit 5, usage atual 3
      const result = await service.checkQuota(tenantId, 'USERS', 1);
      
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(2);
    });

    it('should deny when quota exceeded', async () => {
      // Setup: Plan Basic com USERS limit 5, usage atual 5
      const result = await service.checkQuota(tenantId, 'USERS', 1);
      
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('Quota exceeded');
    });

    it('should always allow unlimited features', async () => {
      // Setup: Plan Enterprise com USERS limit -1 (unlimited)
      const result = await service.checkQuota(tenantId, 'USERS', 1000);
      
      expect(result.allowed).toBe(true);
    });
  });

  describe('consumeQuota', () => {
    it('should increment usage counter', async () => {
      await service.consumeQuota(tenantId, 'API_CALLS_MONTH', 100);
      
      const entitlements = await service.getEntitlements(tenantId);
      expect(entitlements.get('API_CALLS_MONTH')?.currentUsage).toBe(100);
    });

    it('should invalidate cache after consume', async () => {
      await service.consumeQuota(tenantId, 'API_CALLS_MONTH', 1);
      
      // Verify cache was invalidated
      expect(cache.del).toHaveBeenCalledWith(`entitlements:${tenantId}`);
    });
  });

  describe('product effects', () => {
    it('should add quota from purchased product', async () => {
      // Setup: Tenant comprou "Extra Storage 10GB"
      // Plan Basic tem 1GB, produto adiciona 10GB
      
      const entitlements = await service.getEntitlements(tenantId);
      const storage = entitlements.get('STORAGE_MB');
      
      expect(storage?.limit).toBe(11000); // 1000 + 10000
    });

    it('should enable feature from purchased product', async () => {
      // Setup: Tenant comprou "White Label License"
      // Plan Pro não tem WHITE_LABEL
      
      const entitlements = await service.getEntitlements(tenantId);
      const whiteLabel = entitlements.get('WHITE_LABEL');
      
      expect(whiteLabel?.enabled).toBe(true);
    });
  });
});
```

### 11.2 Testes de Subscription Flow

```typescript
// src/modules/billing/__tests__/subscription.service.spec.ts

describe('SubscriptionService', () => {
  describe('createSubscription', () => {
    it('should create subscription with trial', async () => {
      const result = await service.createSubscription(
        tenantId,
        priceId,
        'stripe',
      );

      expect(result.status).toBe('TRIAL');
      
      const sub = await prisma.subscription.findUnique({
        where: { tenantId },
      });
      expect(sub?.trialEnd).toBeDefined();
    });

    it('should create pix checkout for paid plan', async () => {
      const result = await service.createSubscription(
        tenantId,
        paidPriceId,
        'pix',
      );

      expect(result.status).toBe('PENDING_PAYMENT');
      expect(result.qrCode).toBeDefined();
      expect(result.expiresAt).toBeDefined();
    });

    it('should activate immediately for free plan', async () => {
      const result = await service.createSubscription(
        tenantId,
        freePriceId,
        'pix',
      );

      expect(result.status).toBe('ACTIVE');
    });
  });

  describe('upgrade', () => {
    it('should calculate proration correctly', async () => {
      // Setup: Tenant no plano Basic (R$49/mês), 15 dias restantes
      // Upgrade para Pro (R$149/mês)
      
      const proration = await service.calculateProration(
        subscriptionId,
        newPriceId,
      );

      // Crédito: 49 * (15/30) = 24.50
      // Débito: 149 * (15/30) = 74.50
      // Total: 74.50 - 24.50 = 50.00
      expect(proration.amount).toBe(50);
    });

    it('should apply new features immediately on upgrade', async () => {
      await service.updateSubscription(subscriptionId, proPriceId);

      const entitlements = await entitlementService.getEntitlements(tenantId);
      expect(entitlements.get('API_ACCESS')?.enabled).toBe(true);
    });
  });

  describe('downgrade', () => {
    it('should schedule downgrade for period end', async () => {
      await service.updateSubscription(subscriptionId, basicPriceId);

      const sub = await prisma.subscription.findUnique({
        where: { id: subscriptionId },
      });

      // Plano atual mantido
      expect(sub?.planId).toBe(proPlanId);
      // Mas scheduled para mudar
      expect(sub?.metadata.scheduledPlanId).toBe(basicPlanId);
    });

    it('should block downgrade if usage exceeds new limits', async () => {
      // Setup: Tenant tem 20 usuários, Basic permite 5
      
      await expect(
        service.updateSubscription(subscriptionId, basicPriceId),
      ).rejects.toThrow('Current usage exceeds new plan limits');
    });
  });
});
```

---

## CONCLUSÃO

Este documento fornece uma especificação completa para o sistema de **Plans & Products** do Kaven Boilerplate, incluindo:

✅ **Modelos de dados** completos (Prisma schema)  
✅ **Feature flags** com catálogo extensível  
✅ **Sistema de quotas** com tracking de uso  
✅ **Entitlements** com cache e guards  
✅ **Integração** com Stripe e PagueBit  
✅ **API endpoints** completos  
✅ **Fluxos de negócio** detalhados  
✅ **UI/Admin** páginas necessárias  
✅ **Testes** abrangentes  

A implementação segue os padrões existentes do projeto e se integra perfeitamente com a arquitetura multi-tenant "Camaleão".

---

**Próximos Passos:**

1. Revisar e ajustar feature catalog para seu caso de uso
2. Definir preços reais dos planos
3. Confirmar gaps do PagueBit com o time de dev
4. Iniciar implementação pela Fase 1 (Foundation)
