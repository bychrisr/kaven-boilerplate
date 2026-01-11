# DATABASE SPECIFICATION - Kaven Boilerplate

> **Version:** 2.0.0  
> **Date:** December 18, 2025  
> **Author:** Chris (@bychrisr)  
> **Type:** Complete Database Schema Specification  
> **Status:** Foundation Phase

---

## 📋 TABLE OF CONTENTS

1. [Database Overview](#database-overview)
2. [Complete Prisma Schema](#complete-prisma-schema)
3. [Entity Relationship Diagram](#entity-relationship-diagram)
4. [Table Specifications](#table-specifications)
5. [Index Strategy](#index-strategy)
6. [Migration Strategy](#migration-strategy)
7. [Seed Data](#seed-data)
8. [Backup Strategy](#backup-strategy)

---


## 📐 SCHEMA ARCHITECTURE (3-Layer System)

> **New in v2.0:** Kaven uses a 3-layer schema architecture for safe, conflict-free updates

### Layer Overview

```
┌─────────────────────────────────────────────────────────────┐
│ schema.base.prisma (Kaven - Read-only)                      │
├─────────────────────────────────────────────────────────────┤
│ • Controlled by Kaven                                       │
│ • ⚠️ DO NOT EDIT manually                                   │
│ • Updated via `kaven update`                                │
│ • Contains core models (User, Tenant, etc)                  │
└─────────────────────────────────────────────────────────────┘
                           +
┌─────────────────────────────────────────────────────────────┐
│ schema.extended.prisma (Developer - Editable)               │
├─────────────────────────────────────────────────────────────┤
│ • Controlled by you (the developer)                         │
│ • ✅ Safe to edit                                           │
│ • Add custom fields and tables                              │
│ • Never overwritten by updates                              │
└─────────────────────────────────────────────────────────────┘
                           =
┌─────────────────────────────────────────────────────────────┐
│ schema.prisma (Generated - Auto-merge)                      │
├─────────────────────────────────────────────────────────────┤
│ • Generated file                                            │
│ • ⚠️ DO NOT EDIT (will be regenerated)                      │
│ • Automatic merge of base + extended                        │
│ • Used by Prisma Client                                     │
└─────────────────────────────────────────────────────────────┘
```

### Example: Extending User Model

**Base Schema (Kaven):**
```prisma
// prisma/schema.base.prisma
// ⚠️ DO NOT EDIT - Managed by Kaven

/// @kaven v2.0.0
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Kaven v2.0 additions
  twoFactorSecret String?
  emailVerified   Boolean @default(false)
  
  tenant   Tenant? @relation(fields: [tenantId], references: [id])
  tenantId String?
  
  @@index([email])
}
```

**Extended Schema (Developer):**
```prisma
// prisma/schema.extended.prisma
// ✅ Safe to edit - Your customizations

model User {
  // Base fields (don't redeclare)
  // Kaven core fields inherited from schema.base.prisma
  
  // Custom fields
  company     String?
  phone       String?
  avatar      String?
  preferences Json?
  
  // Custom relations
  orders       Order[]
  subscription Subscription?
}

// Custom tables
model Order {
  id        String   @id @default(uuid())
  userId    String
  total     Decimal
  status    String
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id])
}

model Subscription {
  id        String   @id @default(uuid())
  userId    String   @unique
  plan      String
  status    String
  expiresAt DateTime
  
  user User @relation(fields: [userId], references: [id])
}
```

**Generated Schema (Final):**
```prisma
// prisma/schema.prisma
// ⚠️ AUTO-GENERATED - DO NOT EDIT
// This file is automatically generated by merging:
// - schema.base.prisma (Kaven core)
// - schema.extended.prisma (Your customizations)

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Kaven v2.0 fields
  twoFactorSecret String?
  emailVerified   Boolean @default(false)
  
  // Base relations
  tenant   Tenant? @relation(fields: [tenantId], references: [id])
  tenantId String?
  
  // Extended fields (from schema.extended.prisma)
  company     String?
  phone       String?
  avatar      String?
  preferences Json?
  
  // Extended relations (from schema.extended.prisma)
  orders       Order[]
  subscription Subscription?
  
  @@index([email])
}

// Extended tables (from schema.extended.prisma)
model Order {
  id        String   @id @default(uuid())
  userId    String
  total     Decimal
  status    String
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id])
}

model Subscription {
  id        String   @id @default(uuid())
  userId    String   @unique
  plan      String
  status    String
  expiresAt DateTime
  
  user User @relation(fields: [userId], references: [id])
}
```

### Migration Strategy

**Kaven Migrations (Additive Only):**
```sql
-- migrations/001_kaven_init/migration.sql
-- Initial Kaven schema
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  PRIMARY KEY ("id")
);

-- migrations/003_kaven_add_2fa/migration.sql
-- Kaven v2.0 update (ADDITIVE)
ALTER TABLE "User" ADD COLUMN "twoFactorSecret" TEXT;
ALTER TABLE "User" ADD COLUMN "emailVerified" BOOLEAN DEFAULT false;

CREATE TABLE "TwoFactorBackupCode" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "used" BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY ("id")
);
```

**Developer Migrations:**
```sql
-- migrations/002_dev_add_company/migration.sql
-- Developer custom fields
ALTER TABLE "User" ADD COLUMN "company" TEXT;
ALTER TABLE "User" ADD COLUMN "phone" TEXT;
ALTER TABLE "User" ADD COLUMN "avatar" TEXT;
ALTER TABLE "User" ADD COLUMN "preferences" JSONB;

-- migrations/004_dev_add_orders/migration.sql
-- Developer custom tables
CREATE TABLE "Order" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "total" DECIMAL(10,2) NOT NULL,
  "status" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);

ALTER TABLE "Order" 
  ADD CONSTRAINT "Order_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
```

### Rules

**✅ ALLOWED (Safe):**
- Add optional columns
- Add columns with defaults
- Create new tables
- Add indexes
- Add constraints

**❌ FORBIDDEN (Breaking):**
- Remove columns
- Rename columns
- Change column types (without migration path)
- Remove tables
- Change constraints (without data migration)

### Benefits

1. **No Conflicts:** Kaven updates never conflict with your customizations
2. **Type Safety:** Full TypeScript support across all layers
3. **Easy Updates:** `kaven update` merges schemas automatically
4. **Rollback Safe:** Can always regenerate from base + extended
5. **Clear Ownership:** Know exactly what's Kaven vs custom

---
## 🎯 DATABASE OVERVIEW

### Technology Stack

- **Database:** PostgreSQL 16
- **ORM:** Prisma 5
- **Migration Tool:** Prisma Migrate
- **Connection Pooling:** PgBouncer (production)
- **Backup:** pg_dump + AWS S3 (or similar)

---

### Design Principles

1. **Multi-Tenant Native**
   - Most tables have `tenantId` column
   - Row-Level Security via Prisma middleware
   - Tenant isolation enforced at multiple layers

2. **UUIDs Over Auto-Increment**
   - Better for distributed systems
   - No information leakage
   - Easier to merge databases

3. **Soft Deletes**
   - `deletedAt` column instead of hard DELETE
   - Allows data recovery
   - Maintains referential integrity

4. **Audit Trail**
   - `createdAt` and `updatedAt` on all tables
   - Separate `AuditLog` table for admin actions
   - Track who did what when

5. **JSON for Flexibility**
   - `metadata` field for custom data
   - `settings` for configuration
   - Allows schema extension without migrations

6. **Optimized Indexes**
   - All foreign keys indexed
   - Composite indexes for common queries
   - Unique constraints where needed

---

## 📄 COMPLETE PRISMA SCHEMA

**File:** `packages/@kaven/db/prisma/schema.prisma`

```prisma
// ============================================
// PRISMA CONFIGURATION
// ============================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// CORE MODELS (TENANT & USER)
// ============================================

/// Multi-tenant organization/workspace
/// Can be a company, team, or individual workspace
model Tenant {
  id        String   @id @default(uuid())
  
  /// Unique tenant name (e.g., "Acme Corp")
  name      String
  
  /// URL-safe slug for subdomain routing (e.g., "acme")
  /// Used in: acme.saas.com
  slug      String   @unique
  
  /// Tenant status: ACTIVE, SUSPENDED, or DELETED
  status    TenantStatus @default(ACTIVE)
  
  /// Flexible JSON field for tenant-specific settings
  /// Examples: branding, feature flags, limits
  settings  Json?
  
  /// Soft delete timestamp
  deletedAt DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // ============================================
  // RELATIONS
  // ============================================
  
  /// Users directly associated with this tenant
  users     User[]
  
  /// Many-to-many user-tenant relationships
  userTenants UserTenant[]
  
  /// Subscription for this tenant
  subscription Subscription?
  
  /// Invoices belonging to this tenant
  invoices  Invoice[]
  
  /// Orders belonging to this tenant
  orders    Order[]
  
  /// Audit logs for this tenant
  auditLogs AuditLog[]
  
  // ============================================
  // INDEXES
  // ============================================
  
  @@index([slug])
  @@index([status])
  @@index([createdAt])
  @@map("tenants")
}

/// User account (can belong to multiple tenants or none)
model User {
  id              String    @id @default(uuid())
  
  /// Unique email address (used for login)
  email           String    @unique
  
  /// Bcrypt hashed password (cost factor 12)
  passwordHash    String    @map("password_hash")
  
  /// User's display name
  name            String
  
  /// Optional avatar URL (S3, Cloudflare R2, etc)
  avatar          String?
  
  /// Email verification status
  emailVerified   Boolean   @default(false) @map("email_verified")
  
  /// Timestamp when email was verified
  emailVerifiedAt DateTime? @map("email_verified_at")
  
  /// 2FA TOTP enabled flag
  twoFactorEnabled Boolean  @default(false) @map("two_factor_enabled")
  
  /// Encrypted 2FA TOTP secret (AES-256-CBC)
  twoFactorSecret String?   @map("two_factor_secret")
  
  /// Encrypted backup codes for 2FA recovery
  /// Array of 10 one-time use codes
  backupCodes     Json?     @map("backup_codes")
  
  /// Optional tenant association
  /// NULL = tenant-less user (Super Admin, onboarding)
  tenantId        String?   @map("tenant_id")
  
  /// Flexible JSON field for custom user data
  /// Examples: preferences, profile fields, custom attributes
  metadata        Json?
  
  /// Soft delete timestamp
  deletedAt       DateTime? @map("deleted_at")
  
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  
  // ============================================
  // RELATIONS
  // ============================================
  
  /// Primary tenant (nullable for tenant-less users)
  tenant          Tenant?   @relation(fields: [tenantId], references: [id], onDelete: SetNull)
  
  /// Many-to-many tenant relationships
  userTenants     UserTenant[]
  
  /// Refresh tokens for this user
  refreshTokens   RefreshToken[]
  
  /// Audit logs created by this user
  auditLogs       AuditLog[]
  
  // ============================================
  // INDEXES
  // ============================================
  
  @@index([email])
  @@index([tenantId])
  @@index([emailVerified])
  @@index([createdAt])
  @@map("users")
}

/// Junction table for many-to-many User-Tenant relationship
/// Allows users to belong to multiple tenants with different roles
model UserTenant {
  id        String   @id @default(uuid())
  
  userId    String   @map("user_id")
  tenantId  String   @map("tenant_id")
  
  /// Role within this specific tenant
  role      Role     @default(USER)
  
  createdAt DateTime @default(now()) @map("created_at")
  
  // ============================================
  // RELATIONS
  // ============================================
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  // ============================================
  // CONSTRAINTS & INDEXES
  // ============================================
  
  /// One role per user per tenant
  @@unique([userId, tenantId])
  @@index([userId])
  @@index([tenantId])
  @@index([role])
  @@map("user_tenants")
}

// ============================================
// AUTHENTICATION MODELS
// ============================================

/// Refresh tokens for JWT authentication
/// Stored in database to allow revocation
model RefreshToken {
  id        String   @id @default(uuid())
  
  /// SHA-256 hashed token (never store plain text)
  token     String   @unique
  
  userId    String   @map("user_id")
  
  /// Token expiration timestamp (typically 7 days)
  expiresAt DateTime @map("expires_at")
  
  createdAt DateTime @default(now()) @map("created_at")
  
  // ============================================
  // RELATIONS
  // ============================================
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // ============================================
  // INDEXES
  // ============================================
  
  @@index([userId])
  @@index([expiresAt])
  @@index([token])
  @@map("refresh_tokens")
}

// ============================================
// AUDIT & LOGGING
// ============================================

/// Comprehensive audit log for all admin actions
/// Tracks who did what when for compliance and debugging
model AuditLog {
  id          String   @id @default(uuid())
  
  /// Tenant context (nullable for super admin actions)
  tenantId    String?  @map("tenant_id")
  
  /// User who performed the action
  userId      String?  @map("user_id")
  
  /// Action identifier (e.g., "user.created", "tenant.suspended")
  action      String
  
  /// Entity type affected (e.g., "User", "Tenant", "Invoice")
  entityType  String   @map("entity_type")
  
  /// ID of the affected entity
  entityId    String   @map("entity_id")
  
  /// Before/after snapshot for tracking changes
  /// Format: { before: {...}, after: {...} }
  changes     Json?
  
  /// IP address of the request
  ipAddress   String?  @map("ip_address")
  
  /// User agent string
  userAgent   String?  @map("user_agent")
  
  createdAt   DateTime @default(now()) @map("created_at")
  
  // ============================================
  // RELATIONS
  // ============================================
  
  user        User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  // ============================================
  // INDEXES
  // ============================================
  
  @@index([tenantId])
  @@index([userId])
  @@index([action])
  @@index([entityType])
  @@index([createdAt])
  @@map("audit_logs")
}

// ============================================
// PAYMENTS & SUBSCRIPTIONS
// ============================================

/// Subscription management for tenants
model Subscription {
  id              String   @id @default(uuid())
  
  /// Associated tenant
  tenantId        String   @unique @map("tenant_id")
  
  /// Stripe customer ID
  stripeCustomerId String? @unique @map("stripe_customer_id")
  
  /// Stripe price ID (plan)
  stripePriceId   String?  @map("stripe_price_id")
  
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
  
  /// Trial end timestamp
  trialEnd        DateTime? @map("trial_end")
  
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  
  // ============================================
  // RELATIONS
  // ============================================
  
  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  invoices        Invoice[]
  
  // ============================================
  // INDEXES
  // ============================================
  
  @@index([tenantId])
  @@index([status])
  @@index([stripeCustomerId])
  @@map("subscriptions")
}

/// Invoice management for billing
model Invoice {
  id          String   @id @default(uuid())
  
  /// Associated tenant
  tenantId    String   @map("tenant_id")
  
  /// Associated subscription (optional)
  subscriptionId String? @map("subscription_id")
  
  /// Sequential invoice number (e.g., "INV-2025-001")
  number      String   @unique
  
  /// Customer ID (optional, for external customers)
  customerId  String?  @map("customer_id")
  
  /// Invoice status
  status      InvoiceStatus @default(DRAFT)
  
  /// Subtotal before tax and discount
  subtotal    Decimal  @db.Decimal(10, 2)
  
  /// Tax amount
  tax         Decimal  @db.Decimal(10, 2) @default(0)
  
  /// Discount amount
  discount    Decimal  @db.Decimal(10, 2) @default(0)
  
  /// Total amount (subtotal + tax - discount)
  total       Decimal  @db.Decimal(10, 2)
  
  /// Currency code (ISO 4217)
  currency    String   @default("BRL")
  
  /// Due date for payment
  dueDate     DateTime? @map("due_date")
  
  /// Timestamp when invoice was paid
  paidAt      DateTime? @map("paid_at")
  
  /// Additional metadata (payment method, notes, etc)
  metadata    Json?
  
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  // ============================================
  // RELATIONS
  // ============================================
  
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  subscription Subscription? @relation(fields: [subscriptionId], references: [id], onDelete: SetNull)
  items       InvoiceItem[]
  
  // ============================================
  // INDEXES
  // ============================================
  
  @@index([tenantId])
  @@index([subscriptionId])
  @@index([status])
  @@index([dueDate])
  @@index([createdAt])
  @@map("invoices")
}

/// Line items for invoices
model InvoiceItem {
  id          String   @id @default(uuid())
  
  /// Associated invoice
  invoiceId   String   @map("invoice_id")
  
  /// Item description
  description String
  
  /// Quantity
  quantity    Int      @default(1)
  
  /// Unit price
  price       Decimal  @db.Decimal(10, 2)
  
  /// Total (quantity * price)
  total       Decimal  @db.Decimal(10, 2)
  
  // ============================================
  // RELATIONS
  // ============================================
  
  invoice     Invoice  @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  
  // ============================================
  // INDEXES
  // ============================================
  
  @@index([invoiceId])
  @@map("invoice_items")
}

// ============================================
// ORDER MANAGEMENT
// ============================================

/// Order management for products/services
model Order {
  id          String   @id @default(uuid())
  
  /// Associated tenant
  tenantId    String   @map("tenant_id")
  
  /// Customer ID (optional)
  customerId  String?  @map("customer_id")
  
  /// Sequential order number (e.g., "ORD-2025-001")
  number      String   @unique
  
  /// Order status
  status      OrderStatus @default(PENDING)
  
  /// Subtotal before shipping and tax
  subtotal    Decimal  @db.Decimal(10, 2)
  
  /// Shipping cost
  shipping    Decimal  @db.Decimal(10, 2) @default(0)
  
  /// Tax amount
  tax         Decimal  @db.Decimal(10, 2) @default(0)
  
  /// Total amount (subtotal + shipping + tax)
  total       Decimal  @db.Decimal(10, 2)
  
  /// Additional metadata (shipping address, notes, etc)
  metadata    Json?
  
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  // ============================================
  // RELATIONS
  // ============================================
  
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  items       OrderItem[]
  statusHistory OrderStatusHistory[]
  
  // ============================================
  // INDEXES
  // ============================================
  
  @@index([tenantId])
  @@index([status])
  @@index([createdAt])
  @@map("orders")
}

/// Line items for orders
model OrderItem {
  id          String   @id @default(uuid())
  
  /// Associated order
  orderId     String   @map("order_id")
  
  /// Product ID (optional, for inventory tracking)
  productId   String?  @map("product_id")
  
  /// Item description
  description String
  
  /// Quantity ordered
  quantity    Int
  
  /// Unit price
  price       Decimal  @db.Decimal(10, 2)
  
  /// Total (quantity * price)
  total       Decimal  @db.Decimal(10, 2)
  
  // ============================================
  // RELATIONS
  // ============================================
  
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  // ============================================
  // INDEXES
  // ============================================
  
  @@index([orderId])
  @@index([productId])
  @@map("order_items")
}

/// Order status history for tracking
model OrderStatusHistory {
  id        String   @id @default(uuid())
  
  /// Associated order
  orderId   String   @map("order_id")
  
  /// New status
  status    OrderStatus
  
  /// Optional notes about status change
  notes     String?
  
  createdAt DateTime @default(now()) @map("created_at")
  
  // ============================================
  // RELATIONS
  // ============================================
  
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  // ============================================
  // INDEXES
  // ============================================
  
  @@index([orderId])
  @@index([status])
  @@index([createdAt])
  @@map("order_status_history")
}

// ============================================
// ENUMS
// ============================================

/// Tenant status options
enum TenantStatus {
  /// Active and operational
  ACTIVE
  
  /// Temporarily suspended (payment failure, policy violation)
  SUSPENDED
  
  /// Soft deleted (can be recovered)
  DELETED
}

/// User roles within a tenant
enum Role {
  /// Super admin with global access (tenant-less)
  SUPER_ADMIN
  
  /// Tenant administrator with full tenant access
  TENANT_ADMIN
  
  /// Regular user with limited access
  USER
}

/// Subscription status options
enum SubscriptionStatus {
  /// Trial period (no payment required yet)
  TRIAL
  
  /// Active and paid
  ACTIVE
  
  /// Payment failed, grace period
  PAST_DUE
  
  /// Canceled by user
  CANCELED
  
  /// Payment permanently failed
  UNPAID
}

/// Invoice status options
enum InvoiceStatus {
  /// Created but not sent
  DRAFT
  
  /// Sent to customer
  SENT
  
  /// Payment received
  PAID
  
  /// Past due date
  OVERDUE
  
  /// Canceled/voided
  CANCELED
}

/// Order status options
enum OrderStatus {
  /// Order created, awaiting processing
  PENDING
  
  /// Order being processed
  PROCESSING
  
  /// Order shipped to customer
  SHIPPED
  
  /// Order delivered
  DELIVERED
  
  /// Order completed successfully
  COMPLETED
  
  /// Order canceled by user or admin
  CANCELED
  
  /// Order refunded
  REFUNDED
}
```

---

## 🗺️ ENTITY RELATIONSHIP DIAGRAM

### Textual Representation

```
┌─────────────────────────────────────────────────────────────────────┐
│                     KAVEN DATABASE SCHEMA                            │
└─────────────────────────────────────────────────────────────────────┘

CORE ENTITIES:
┌──────────┐       ┌──────────────┐       ┌──────┐
│  Tenant  │◄─────►│  UserTenant  │◄─────►│ User │
└──────────┘       └──────────────┘       └──────┘
     │                                        │
     │                                        │
     ├──────────┬─────────┬──────────────────┼────────────┐
     │          │         │                  │            │
     ▼          ▼         ▼                  ▼            ▼
┌────────┐ ┌────────┐ ┌────────┐    ┌──────────────┐ ┌─────────┐
│Subscr. │ │Invoice │ │ Order  │    │RefreshToken  │ │AuditLog │
└────────┘ └────────┘ └────────┘    └──────────────┘ └─────────┘
     │         │          │
     │         │          │
     ▼         ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐
│Invoice │ │Invoice │ │ Order  │
│        │ │  Item  │ │  Item  │
└────────┘ └────────┘ └────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │OrderStatus  │
                    │  History    │
                    └─────────────┘

RELATIONSHIPS:
• Tenant ←→ User (many-to-many via UserTenant)
• Tenant → Subscription (one-to-one)
• Tenant → Invoice (one-to-many)
• Tenant → Order (one-to-many)
• User → RefreshToken (one-to-many)
• User → AuditLog (one-to-many)
• Subscription → Invoice (one-to-many)
• Invoice → InvoiceItem (one-to-many)
• Order → OrderItem (one-to-many)
• Order → OrderStatusHistory (one-to-many)
```

---

## 📊 TABLE SPECIFICATIONS

### Tenants Table

**Purpose:** Store organization/workspace data

**Key Features:**
- Unique slug for subdomain routing
- Status tracking (ACTIVE, SUSPENDED, DELETED)
- Flexible settings via JSON

**Important Fields:**
- `slug`: URL-safe identifier (e.g., "acme" for acme.saas.com)
- `settings`: JSON field for tenant-specific config
- `deletedAt`: Soft delete support

**Sample Data:**
```sql
INSERT INTO tenants (id, name, slug, status, settings) VALUES
('123e4567-e89b-12d3-a456-426614174000', 'Acme Corp', 'acme', 'ACTIVE', '{"theme": "dark", "features": ["2fa", "api"]}');
```

---

### Users Table

**Purpose:** Store user accounts

**Key Features:**
- Can exist without tenant (Super Admin, onboarding)
- Email verification tracking
- 2FA TOTP support with backup codes
- Extensible via metadata JSON

**Important Fields:**
- `tenantId`: Nullable (allows tenant-less users)
- `passwordHash`: Bcrypt with cost factor 12
- `twoFactorSecret`: AES-256 encrypted
- `backupCodes`: Array of one-time codes (encrypted)
- `metadata`: JSON for custom user data

**Security Considerations:**
- Passwords NEVER stored in plain text
- 2FA secrets encrypted at rest
- Backup codes encrypted and validated once

**Sample Data:**
```sql
INSERT INTO users (id, email, password_hash, name, email_verified, tenant_id) VALUES
('223e4567-e89b-12d3-a456-426614174001', 'admin@acme.com', '$2b$12$...', 'Admin User', true, '123e4567-e89b-12d3-a456-426614174000');
```

---

### UserTenants Table

**Purpose:** Many-to-many relationship between users and tenants

**Key Features:**
- Allows users to belong to multiple tenants
- Different role per tenant
- Cascade delete on user or tenant deletion

**Important Fields:**
- `role`: Role within specific tenant (SUPER_ADMIN, TENANT_ADMIN, USER)

**Sample Data:**
```sql
INSERT INTO user_tenants (id, user_id, tenant_id, role) VALUES
('323e4567-e89b-12d3-a456-426614174002', '223e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', 'TENANT_ADMIN');
```

---

### RefreshTokens Table

**Purpose:** Store JWT refresh tokens for revocation

**Key Features:**
- Tokens hashed (SHA-256) before storage
- Expiration tracking
- Automatic cleanup of expired tokens (cron job)

**Important Fields:**
- `token`: SHA-256 hash (NEVER plain text)
- `expiresAt`: Typically 7 days from creation

**Security Considerations:**
- Tokens rotated on each use
- Old tokens deleted immediately
- Cleanup job runs daily to remove expired tokens

**Sample Data:**
```sql
INSERT INTO refresh_tokens (id, token, user_id, expires_at) VALUES
('423e4567-e89b-12d3-a456-426614174003', 'sha256_hash_here', '223e4567-e89b-12d3-a456-426614174001', NOW() + INTERVAL '7 days');
```

---

### AuditLogs Table

**Purpose:** Track all admin actions for compliance

**Key Features:**
- Tracks who, what, when, where
- Before/after snapshots via JSON
- IP and user agent tracking

**Important Fields:**
- `action`: Action identifier (e.g., "user.created")
- `entityType`: Affected entity (e.g., "User")
- `changes`: Before/after JSON snapshot

**Sample Data:**
```sql
INSERT INTO audit_logs (id, tenant_id, user_id, action, entity_type, entity_id, changes) VALUES
('523e4567-e89b-12d3-a456-426614174004', '123e4567-e89b-12d3-a456-426614174000', '223e4567-e89b-12d3-a456-426614174001', 'user.created', 'User', 'new-user-id', '{"before": null, "after": {"email": "new@example.com"}}');
```

---

### Subscriptions Table

**Purpose:** Manage tenant subscriptions

**Key Features:**
- One subscription per tenant
- Stripe integration (customer ID, price ID)
- Trial period support
- Cancellation tracking

**Important Fields:**
- `stripeCustomerId`: Links to Stripe customer
- `stripePriceId`: Links to Stripe price (plan)
- `status`: TRIAL, ACTIVE, PAST_DUE, CANCELED, UNPAID
- `cancelAtPeriodEnd`: Grace period for cancellations

**Sample Data:**
```sql
INSERT INTO subscriptions (id, tenant_id, stripe_customer_id, stripe_price_id, status, current_period_start, current_period_end) VALUES
('623e4567-e89b-12d3-a456-426614174005', '123e4567-e89b-12d3-a456-426614174000', 'cus_xxx', 'price_xxx', 'ACTIVE', '2025-01-01', '2025-02-01');
```

---

### Invoices Table

**Purpose:** Manage billing invoices

**Key Features:**
- Sequential numbering (INV-2025-001)
- Multiple statuses (DRAFT, SENT, PAID, OVERDUE, CANCELED)
- Multi-currency support
- Links to subscription (optional)

**Important Fields:**
- `number`: Unique sequential identifier
- `subtotal, tax, discount, total`: Financial breakdown
- `currency`: ISO 4217 code (BRL, USD, EUR, etc)
- `dueDate`: Payment deadline

**Sample Data:**
```sql
INSERT INTO invoices (id, tenant_id, subscription_id, number, status, subtotal, tax, discount, total, currency, due_date) VALUES
('723e4567-e89b-12d3-a456-426614174006', '123e4567-e89b-12d3-a456-426614174000', '623e4567-e89b-12d3-a456-426614174005', 'INV-2025-001', 'PAID', 100.00, 10.00, 0.00, 110.00, 'BRL', '2025-01-15');
```

---

### InvoiceItems Table

**Purpose:** Line items for invoices

**Key Features:**
- Multiple items per invoice
- Quantity and unit price tracking
- Automatic total calculation

**Sample Data:**
```sql
INSERT INTO invoice_items (id, invoice_id, description, quantity, price, total) VALUES
('823e4567-e89b-12d3-a456-426614174007', '723e4567-e89b-12d3-a456-426614174006', 'Pro Plan Subscription', 1, 100.00, 100.00);
```

---

### Orders Table

**Purpose:** Manage product/service orders

**Key Features:**
- Sequential numbering (ORD-2025-001)
- Status tracking with history
- Shipping and tax calculation

**Important Fields:**
- `status`: PENDING, PROCESSING, SHIPPED, DELIVERED, COMPLETED, CANCELED, REFUNDED
- `subtotal, shipping, tax, total`: Financial breakdown

**Sample Data:**
```sql
INSERT INTO orders (id, tenant_id, number, status, subtotal, shipping, tax, total) VALUES
('923e4567-e89b-12d3-a456-426614174008', '123e4567-e89b-12d3-a456-426614174000', 'ORD-2025-001', 'DELIVERED', 200.00, 15.00, 20.00, 235.00);
```

---

### OrderItems Table

**Purpose:** Line items for orders

**Key Features:**
- Multiple items per order
- Optional product ID for inventory
- Quantity and pricing

**Sample Data:**
```sql
INSERT INTO order_items (id, order_id, product_id, description, quantity, price, total) VALUES
('a23e4567-e89b-12d3-a456-426614174009', '923e4567-e89b-12d3-a456-426614174008', 'prod-123', 'Widget Pro', 2, 100.00, 200.00);
```

---

### OrderStatusHistory Table

**Purpose:** Track order status changes

**Key Features:**
- Immutable history log
- Optional notes per status change
- Chronological ordering

**Sample Data:**
```sql
INSERT INTO order_status_history (id, order_id, status, notes) VALUES
('b23e4567-e89b-12d3-a456-426614174010', '923e4567-e89b-12d3-a456-426614174008', 'SHIPPED', 'Shipped via FedEx, tracking: 1234567890');
```

---

## 🔍 INDEX STRATEGY

### Primary Indexes (UUID Primary Keys)

All tables use UUID primary keys with automatic B-tree indexes.

**Pros:**
- Better for distributed systems
- No information leakage
- Easier to merge databases

**Cons:**
- Slightly larger than integers (16 bytes vs 4 bytes)
- Random UUIDs = fragmentation (mitigated by sequential UUIDs in Postgres 13+)

---

### Foreign Key Indexes

**All foreign keys automatically indexed:**
```prisma
@@index([tenantId])
@@index([userId])
@@index([invoiceId])
@@index([orderId])
// ... etc
```

**Why:** Foreign key lookups are extremely common in joins.

---

### Composite Indexes

**Tenant-scoped queries:**
```prisma
// Users by tenant, ordered by creation
@@index([tenantId, createdAt])

// Users by tenant and email (login)
@@index([tenantId, email])

// Invoices by tenant and status
@@index([tenantId, status])
```

**Why:** Most queries filter by tenant first, then by other criteria.

---

### Unique Indexes

**Enforce uniqueness:**
```prisma
// Unique email across all users
@@unique([email])

// One role per user per tenant
@@unique([userId, tenantId])

// Unique tenant slug
@@unique([slug])
```

**Why:** Prevent duplicate data and enable fast existence checks.

---

### Partial Indexes (Future Optimization)

**Index only active records:**
```sql
-- Future: Create partial index for active tenants only
CREATE INDEX idx_tenants_active 
ON tenants (id) 
WHERE status = 'ACTIVE' AND deleted_at IS NULL;
```

**Why:** Smaller indexes = faster queries when filtering by status.

---

### Index Performance Guidelines

**DO Index:**
- ✅ All foreign keys
- ✅ Columns used in WHERE clauses
- ✅ Columns used in ORDER BY
- ✅ Columns used in JOIN conditions
- ✅ Unique constraints

**DON'T Index:**
- ❌ Low cardinality columns (e.g., boolean)
- ❌ Columns with high write frequency
- ❌ Very large text/json columns
- ❌ Columns rarely queried

**Monitoring:**
```sql
-- Check unused indexes (PostgreSQL)
SELECT 
  schemaname, 
  tablename, 
  indexname, 
  idx_scan 
FROM pg_stat_user_indexes 
WHERE idx_scan = 0 
AND indexrelname NOT LIKE '%_pkey';
```

---

## 🔄 MIGRATION STRATEGY

### Development Migrations

**Workflow:**
```bash
# 1. Modify schema.prisma
nano packages/@kaven/db/prisma/schema.prisma

# 2. Create migration
pnpm run db:migrate:dev --name add_user_avatar

# 3. Review generated SQL
cat packages/@kaven/db/prisma/migrations/*/migration.sql

# 4. Apply migration
pnpm run db:migrate:dev

# 5. Regenerate Prisma Client
# (automatic after migration)
```

**Generated Files:**
```
prisma/migrations/
├── 20250101000000_init/
│   └── migration.sql
├── 20250102000000_add_user_avatar/
│   └── migration.sql
└── migration_lock.toml
```

---

### Production Migrations

**Safe Migration Process:**

**1. Create Migration (Development):**
```bash
pnpm run db:migrate:dev --create-only --name add_user_avatar
```

**2. Review SQL:**
```sql
-- migration.sql
ALTER TABLE "users" ADD COLUMN "avatar" TEXT;
```

**3. Test on Staging:**
```bash
# Deploy to staging
DATABASE_URL=staging_url pnpm run db:migrate:deploy

# Run smoke tests
pnpm run test:smoke
```

**4. Deploy to Production:**
```bash
# During maintenance window (if needed)
DATABASE_URL=prod_url pnpm run db:migrate:deploy
```

**5. Monitor:**
```bash
# Check migration status
pnpm run db:migrate:status
```

---

### Zero-Downtime Migrations

**For breaking changes, use multi-step migrations:**

**Example: Rename column**

**Step 1: Add new column (SAFE)**
```sql
-- Migration: add_user_full_name
ALTER TABLE "users" ADD COLUMN "full_name" TEXT;
```

**Step 2: Backfill data (SAFE)**
```sql
-- Background job or migration script
UPDATE "users" SET "full_name" = "name" WHERE "full_name" IS NULL;
```

**Step 3: Update application (SAFE)**
```typescript
// Deploy code that writes to both columns
await prisma.user.update({
  data: {
    name: newName,        // Old column (deprecated)
    fullName: newName     // New column
  }
});
```

**Step 4: Make column required (SAFE)**
```sql
-- Migration: make_full_name_required
ALTER TABLE "users" ALTER COLUMN "full_name" SET NOT NULL;
```

**Step 5: Remove old column (SAFE)**
```sql
-- Migration: remove_user_name
ALTER TABLE "users" DROP COLUMN "name";
```

**Step 6: Update application (SAFE)**
```typescript
// Remove references to old column
await prisma.user.update({
  data: {
    fullName: newName  // Only new column
  }
});
```

---

### Migration Best Practices

**DO:**
- ✅ Test migrations on staging first
- ✅ Review generated SQL before applying
- ✅ Backup database before migrations
- ✅ Use multi-step for breaking changes
- ✅ Monitor during and after migration
- ✅ Have rollback plan ready

**DON'T:**
- ❌ Run migrations directly on production without testing
- ❌ Make breaking changes in single step
- ❌ Forget to backup before migration
- ❌ Deploy migrations during peak hours
- ❌ Ignore migration warnings

---

## 🌱 SEED DATA

### Development Seed

**File:** `packages/@kaven/db/prisma/seed.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create Demo Tenant
  const demoTenant = await prisma.tenant.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Demo Corporation',
      slug: 'demo',
      status: 'ACTIVE',
      settings: {
        theme: 'light',
        features: ['2fa', 'api', 'analytics']
      }
    }
  });
  
  console.log('✅ Created demo tenant:', demoTenant.slug);

  // 2. Create Super Admin (tenant-less)
  const superAdminPassword = await bcrypt.hash('SuperAdmin123!', 12);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@kaven.io' },
    update: {},
    create: {
      email: 'admin@kaven.io',
      passwordHash: superAdminPassword,
      name: 'Super Admin',
      emailVerified: true,
      tenantId: null  // Tenant-less
    }
  });
  
  console.log('✅ Created super admin:', superAdmin.email);

  // 3. Create Tenant Admin
  const tenantAdminPassword = await bcrypt.hash('TenantAdmin123!', 12);
  const tenantAdmin = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      passwordHash: tenantAdminPassword,
      name: 'Tenant Admin',
      emailVerified: true,
      tenantId: demoTenant.id
    }
  });
  
  console.log('✅ Created tenant admin:', tenantAdmin.email);

  // 4. Create UserTenant relationship
  await prisma.userTenant.upsert({
    where: {
      userId_tenantId: {
        userId: tenantAdmin.id,
        tenantId: demoTenant.id
      }
    },
    update: {},
    create: {
      userId: tenantAdmin.id,
      tenantId: demoTenant.id,
      role: 'TENANT_ADMIN'
    }
  });
  
  console.log('✅ Created user-tenant relationship');

  // 5. Create Regular User
  const userPassword = await bcrypt.hash('User123!', 12);
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@demo.com' },
    update: {},
    create: {
      email: 'user@demo.com',
      passwordHash: userPassword,
      name: 'Regular User',
      emailVerified: true,
      tenantId: demoTenant.id
    }
  });
  
  console.log('✅ Created regular user:', regularUser.email);

  // 6. Create UserTenant for regular user
  await prisma.userTenant.upsert({
    where: {
      userId_tenantId: {
        userId: regularUser.id,
        tenantId: demoTenant.id
      }
    },
    update: {},
    create: {
      userId: regularUser.id,
      tenantId: demoTenant.id,
      role: 'USER'
    }
  });

  // 7. Create Demo Subscription
  await prisma.subscription.upsert({
    where: { tenantId: demoTenant.id },
    update: {},
    create: {
      tenantId: demoTenant.id,
      status: 'TRIAL',
      trialEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    }
  });
  
  console.log('✅ Created demo subscription');

  // 8. Create Demo Invoice
  const invoice = await prisma.invoice.create({
    data: {
      tenantId: demoTenant.id,
      number: 'INV-2025-001',
      status: 'DRAFT',
      subtotal: 100,
      tax: 10,
      discount: 0,
      total: 110,
      currency: 'BRL',
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
      items: {
        create: [
          {
            description: 'Pro Plan - Monthly',
            quantity: 1,
            price: 100,
            total: 100
          }
        ]
      }
    }
  });
  
  console.log('✅ Created demo invoice:', invoice.number);

  // 9. Create Demo Order
  const order = await prisma.order.create({
    data: {
      tenantId: demoTenant.id,
      number: 'ORD-2025-001',
      status: 'PENDING',
      subtotal: 200,
      shipping: 15,
      tax: 20,
      total: 235,
      items: {
        create: [
          {
            description: 'Widget Pro',
            quantity: 2,
            price: 100,
            total: 200
          }
        ]
      }
    }
  });
  
  console.log('✅ Created demo order:', order.number);

  console.log('🎉 Database seeded successfully!');
  console.log('\n📋 Seed Data Summary:');
  console.log('   Super Admin: admin@kaven.io / SuperAdmin123!');
  console.log('   Tenant Admin: admin@demo.com / TenantAdmin123!');
  console.log('   Regular User: user@demo.com / User123!');
  console.log('   Demo Tenant: demo.saas.com');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Run Seed:**
```bash
pnpm run db:seed
```

---

## 💾 BACKUP STRATEGY

### Automated Daily Backups

**Using pg_dump + S3:**

```bash
#!/bin/bash
# backup.sh

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="kaven_backup_$TIMESTAMP.sql.gz"

# 1. Create backup
pg_dump $DATABASE_URL | gzip > $BACKUP_FILE

# 2. Upload to S3
aws s3 cp $BACKUP_FILE s3://kaven-backups/daily/

# 3. Delete local file
rm $BACKUP_FILE

# 4. Keep only last 30 days in S3
aws s3 ls s3://kaven-backups/daily/ | \
  awk '{print $4}' | \
  sort -r | \
  tail -n +31 | \
  xargs -I {} aws s3 rm s3://kaven-backups/daily/{}

echo "✅ Backup completed: $BACKUP_FILE"
```

**Cron Job:**
```cron
# Run daily at 2 AM
0 2 * * * /path/to/backup.sh
```

---

### Point-in-Time Recovery

**Enable WAL archiving (PostgreSQL):**

```sql
-- postgresql.conf
wal_level = replica
archive_mode = on
archive_command = 'cp %p /backup/wal_archive/%f'
```

**Restore to specific point:**
```bash
# Restore base backup
pg_restore -d kaven backup.dump

# Apply WAL files up to target time
recovery_target_time = '2025-01-15 14:30:00'
```

---

### Backup Testing

**Test restore monthly:**
```bash
#!/bin/bash
# test-restore.sh

# 1. Download latest backup
aws s3 cp s3://kaven-backups/daily/latest.sql.gz .

# 2. Create test database
createdb kaven_test

# 3. Restore
gunzip -c latest.sql.gz | psql kaven_test

# 4. Verify data
psql kaven_test -c "SELECT COUNT(*) FROM users;"

# 5. Cleanup
dropdb kaven_test
rm latest.sql.gz

echo "✅ Backup restore test completed"
```

---

## 📝 CHANGELOG

### v1.0.0 (December 16, 2025)
- Initial database schema specification
- Complete Prisma schema with comments
- Entity relationship diagram (textual)
- Table specifications with sample data
- Index strategy documented
- Migration strategy defined
- Seed data script created
- Backup strategy established

---

**Database specification complete! Ready for implementation in Phase 1.**
