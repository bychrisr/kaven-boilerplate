# 📝 ALTERAÇÕES NECESSÁRIAS NOS DOCUMENTOS DO PROJETO

> **Data:** 18 de Dezembro de 2025  
> **Contexto:** Sistema de Atualização e Módulos Extensíveis  
> **Status:** Pendente de Aplicação

---

## 📋 SUMÁRIO DE ALTERAÇÕES

Este documento lista todas as alterações necessárias nos documentos base do projeto Kaven Boilerplate para incorporar o **Sistema de Atualização e Módulos Extensíveis**.

---

## 1. ARCHITECTURE.md

### 1.1. Adicionar Novos ADRs

**Localização:** Após ADR-010 (JWT + Refresh Token)

**Conteúdo a adicionar:**

```markdown
---

### ADR-011: Instalação via CLI (não Git Clone)

**Status:** ✅ Accepted

**Context:**
Boilerplate needs to be installed without bringing Git history and remote from the boilerplate repository.

**Decision:**
Use CLI (`create-kaven-app`) that downloads via degit and initializes clean Git.

**Alternatives Considered:**
1. **Git clone + cleanup script**
   - ❌ Cons: Complex, error-prone, messy
2. **Zip download**
   - ❌ Cons: Not versioned, hard to update
3. **Degit + CLI** ← CHOSEN
   - ✅ Pros: Clean, simple, versionable

**Rationale:**
- ✅ No Git history pollution
- ✅ Dev starts with own repo
- ✅ Easy to version and distribute
- ✅ Great developer experience

**Implementation:**
```bash
npx create-kaven-app my-saas

# What it does:
# 1. Downloads code (no Git)
# 2. Interactive wizard
# 3. Initializes own Git
# 4. Installs dependencies
# 5. Ready to dev
```

**Consequences:**
- Requires NPM package (@kaven/cli)
- Requires CLI maintenance
- Better DX (developer experience)

---

### ADR-012: Optional Modules via Plugin System

**Status:** ✅ Accepted

**Context:**
Not every SaaS needs every module (e.g., Stripe vs Mercado Pago, Analytics vs No analytics).

**Decision:**
Fastify plugin system with dynamic registration based on `kaven.config.json`.

**Alternatives Considered:**
1. **Monolith** (everything always loaded)
   - ❌ Cons: Bloated, unused code shipped
2. **Microservices**
   - ❌ Cons: Too complex for boilerplate
3. **Plugin System** ← CHOSEN
   - ✅ Pros: Flexible, modular, clean

**Rationale:**
- ✅ Load only what you use
- ✅ Easy to add/remove features
- ✅ Clear separation of concerns
- ✅ Community can add modules

**Implementation:**
```typescript
// apps/api/src/index.ts
import { loadKavenModules } from './.kaven/loader';

const modules = await loadKavenModules('./kaven.config.json');

for (const mod of modules) {
  await app.register(mod.plugin, mod.options);
}
```

**Module Structure:**
```
apps/api/src/modules/
├── payments-stripe/
│   ├── index.ts          (plugin export)
│   ├── routes.ts         (routes)
│   ├── services.ts       (business logic)
│   └── README.md         (docs)
├── payments-mercadopago/
├── analytics/
└── ai-assistant/
```

**Consequences:**
- Requires module loader
- Config in kaven.config.json
- Modules must follow contract

---

### ADR-013: Schema in 3 Layers (Base + Extended + Generated)

**Status:** ✅ Accepted

**Context:**
Single Prisma schema doesn't allow clean merge between Kaven updates and developer customizations.

**Decision:**
Split into `schema.base.prisma` (Kaven - read-only), `schema.extended.prisma` (Dev - editable), `schema.prisma` (generated - auto-merge).

**Alternatives Considered:**
1. **Single schema**
   - ❌ Cons: Merge conflicts on every update
2. **Separate databases**
   - ❌ Cons: Complex, expensive, hard to query
3. **3-layer schema** ← CHOSEN
   - ✅ Pros: Clean separation, auto-merge, no conflicts

**Rationale:**
- ✅ Kaven can update base schema
- ✅ Dev can extend without conflicts
- ✅ Automatic merge on generate
- ✅ Type-safe across all layers

**Implementation:**
```
prisma/
├── schema.base.prisma      ← Kaven (⚠️ don't edit)
├── schema.extended.prisma  ← Dev (✅ safe to edit)
└── schema.prisma           ← Generated (auto-merge)
```

**Merge Logic:**
```typescript
// .kaven/schema-merger.ts
export async function mergeSchemas() {
  const base = await readSchema('schema.base.prisma');
  const extended = await readSchema('schema.extended.prisma');
  
  // Merge models (extended fields added to base)
  const merged = mergeModels(base, extended);
  
  // Write final schema
  await writeSchema('schema.prisma', merged);
}
```

**Consequences:**
- Requires schema merger script
- Hook on prisma generate
- More complex development

---

### ADR-014: Additive Migrations Only

**Status:** ✅ Accepted

**Context:**
Destructive migrations break production SaaS built on top of Kaven.

**Decision:**
Strict policy: only `ALTER TABLE ADD`, never `DROP` or `RENAME`.

**Philosophy:**
> "Never remove, always add. Deprecate gracefully."

**Alternatives Considered:**
1. **Allow breaking changes**
   - ❌ Cons: Breaks prod, loses customer trust
2. **Breaking with migration guide**
   - ⚠️ Better, but still risky
3. **Additive only** ← CHOSEN
   - ✅ Safest approach

**Rationale:**
- ✅ Never breaks production
- ✅ Developers keep full control
- ✅ Migrations are predictable
- ✅ Rollback is simple

**Rules:**

**✅ ALLOWED:**
```sql
-- Add optional column
ALTER TABLE "User" ADD COLUMN "twoFactorSecret" TEXT;

-- Add column with default
ALTER TABLE "User" ADD COLUMN "emailVerified" BOOLEAN DEFAULT false;

-- Create new table
CREATE TABLE "TwoFactorBackupCode" (...);

-- Add index
CREATE INDEX "User_email_idx" ON "User"("email");
```

**❌ FORBIDDEN:**
```sql
-- Remove column
ALTER TABLE "User" DROP COLUMN "name";

-- Rename column
ALTER TABLE "User" RENAME COLUMN "name" TO "fullName";

-- Change type (can break)
ALTER TABLE "User" ALTER COLUMN "name" TYPE VARCHAR(50);

-- Drop table
DROP TABLE "OldTable";
```

**Deprecation Pattern:**
If you MUST change something:
```sql
-- Migration 1: Add new column
ALTER TABLE "User" ADD COLUMN "fullName" TEXT;
UPDATE "User" SET "fullName" = "name";

-- Mark old as deprecated (in schema)
-- @deprecated("Use fullName")
name String

-- Migration 2 (after 2-3 releases): Remove
-- ALTER TABLE "User" DROP COLUMN "name";
```

**Consequences:**
- Schemas grow over time (acceptable)
- Requires deprecation planning
- Much safer for users

---
```

### 1.2. Adicionar Seção: Module Architecture

**Localização:** Após seção "Monorepo Structure"

**Conteúdo a adicionar:**

```markdown
---

## 🧩 MODULE ARCHITECTURE

### Overview

Kaven uses a plugin-based architecture where features can be enabled/disabled via configuration.

### Module Types

```
┌─────────────────────────────────────────────────────────────┐
│                    MODULE LAYERS                             │
└─────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ CORE (Always Enabled)                                      │
├────────────────────────────────────────────────────────────┤
│ • auth        Authentication system                        │
│ • users       User management                              │
│ • tenants     Multi-tenancy system                         │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ OPTIONAL (Config-based)                                    │
├────────────────────────────────────────────────────────────┤
│ • payments-stripe      Stripe integration                  │
│ • payments-mercadopago Mercado Pago integration           │
│ • analytics            Analytics system                    │
│ • ai-assistant         AI-powered assistant                │
│ • notifications        Email/SMS/Push notifications        │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ CUSTOM (Developer-created)                                 │
├────────────────────────────────────────────────────────────┤
│ • your-custom-module   Your business logic                 │
└────────────────────────────────────────────────────────────┘
```

### Module Structure

Each module follows this structure:

```
apps/api/src/modules/payment-stripe/
├── index.ts              # Plugin export (entry point)
├── routes.ts             # API routes
├── services/             # Business logic
│   ├── checkout.ts
│   └── webhooks.ts
├── types.ts              # TypeScript types
├── migrations/           # Database migrations (if needed)
│   └── 001_stripe_tables.sql
├── tests/                # Unit tests
│   └── checkout.test.ts
└── README.md             # Documentation
```

### Module Registration

**Automatic Registration:**

```typescript
// apps/api/src/index.ts
import { Fastify } from 'fastify';
import { loadKavenModules } from './.kaven/loader';

const app = Fastify();

// Load enabled modules from config
const modules = await loadKavenModules('./kaven.config.json');

// Register each module
for (const module of modules) {
  await app.register(module.plugin, module.options);
}

app.listen({ port: 8000 });
```

**Configuration:**

```json
// kaven.config.json
{
  "kaven": {
    "modules": {
      "core": {
        "auth": true,
        "users": true,
        "tenants": true
      },
      "optional": {
        "payments-stripe": true,       // Enabled
        "payments-mercadopago": false,  // Disabled
        "analytics": true,
        "ai-assistant": false
      }
    }
  }
}
```

### Creating a Module

**Example: Payment Module**

```typescript
// apps/api/src/modules/payments-stripe/index.ts
import { FastifyPluginAsync } from 'fastify';
import Stripe from 'stripe';

export const stripePlugin: FastifyPluginAsync = async (app, opts) => {
  // Only register if enabled
  if (!opts.enabled) {
    app.log.info('Stripe module disabled');
    return;
  }

  // Initialize Stripe
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  // Decorate app with Stripe client
  app.decorate('stripe', stripe);

  // Register routes
  app.post('/payments/stripe/checkout', async (req, reply) => {
    const { amount, currency } = req.body;
    
    const session = await app.stripe.checkout.sessions.create({
      amount,
      currency,
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });
    
    return { sessionId: session.id };
  });

  app.post('/payments/stripe/webhook', async (req, reply) => {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    // Handle event
    switch (event.type) {
      case 'checkout.session.completed':
        // Handle successful payment
        break;
    }
    
    return { received: true };
  });

  app.log.info('Stripe module loaded');
};

export default stripePlugin;
```

### Module Lifecycle

1. **Installation:** `pnpm kaven module add payments-stripe`
2. **Configuration:** Edit `kaven.config.json`
3. **Development:** Use module in your code
4. **Update:** `pnpm kaven update` (updates module)
5. **Removal:** `pnpm kaven module remove payments-stripe`

---
```

---

## 2. TECH_STACK.md

### 2.1. Adicionar CLI Tool

**Localização:** Na seção de Development Tools

**Conteúdo a adicionar:**

```markdown
### Development & CLI Tools

| Tool | Version | Purpose | Why |
|------|---------|---------|-----|
| **@kaven/cli** | 2.0.0 | Installation & updates | Official Kaven CLI for project management |
| Turborepo | 2.3.x | Monorepo build system | Fast, cached builds |
| ...existing tools... |

#### @kaven/cli Features

**Installation:**
```bash
npx create-kaven-app my-saas
```

**Updates:**
```bash
pnpm kaven update
```

**Module Management:**
```bash
pnpm kaven module add analytics
pnpm kaven module remove ai-assistant
pnpm kaven module list
```

**Benefits:**
- ✅ Clean installation (no Git pollution)
- ✅ Non-destructive updates
- ✅ Automatic migration handling
- ✅ Interactive wizards
```

---

## 3. DATABASE_SPECIFICATION.md

### 3.1. Adicionar Seção: Schema Architecture

**Localização:** No início do documento, após introdução

**Conteúdo a adicionar:**

```markdown
---

## 📐 SCHEMA ARCHITECTURE (3-Layer System)

Kaven uses a 3-layer schema architecture that allows safe updates without breaking customizations.

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
│ • Controlled by you                                         │
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
// ⚠️ DO NOT EDIT

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  tenant   Tenant? @relation(fields: [tenantId], references: [id])
  tenantId String?
}
```

**Extended Schema (Developer):**
```prisma
// prisma/schema.extended.prisma
// ✅ Safe to edit

model User {
  // Base fields (don't redeclare)
  
  // Custom fields
  company     String?
  phone       String?
  avatar      String?
  preferences Json?
  
  // Custom relations
  orders       Order[]
  subscription Subscription?
}

model Order {
  id        String   @id @default(uuid())
  userId    String
  total     Decimal
  status    String
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id])
}
```

**Generated Schema (Final):**
```prisma
// prisma/schema.prisma
// ⚠️ AUTO-GENERATED - DO NOT EDIT

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Base relations
  tenant   Tenant? @relation(fields: [tenantId], references: [id])
  tenantId String?
  
  // Extended fields
  company     String?
  phone       String?
  avatar      String?
  preferences Json?
  
  // Extended relations
  orders       Order[]
  subscription Subscription?
}

model Order {
  id        String   @id @default(uuid())
  userId    String
  total     Decimal
  status    String
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id])
}
```

### Migration Strategy

**Kaven Migrations (Additive Only):**
```sql
-- migrations/001_kaven_init/migration.sql
CREATE TABLE "User" (...);

-- migrations/003_kaven_add_2fa/migration.sql
ALTER TABLE "User" ADD COLUMN "twoFactorSecret" TEXT;
ALTER TABLE "User" ADD COLUMN "emailVerified" BOOLEAN DEFAULT false;
```

**Developer Migrations:**
```sql
-- migrations/002_dev_add_company/migration.sql
ALTER TABLE "User" ADD COLUMN "company" TEXT;
ALTER TABLE "User" ADD COLUMN "phone" TEXT;

-- migrations/004_dev_add_orders/migration.sql
CREATE TABLE "Order" (...);
```

**Rules:**
- ✅ Kaven migrations: Only ADD (never DROP or RENAME)
- ✅ Dev migrations: Full freedom
- ✅ Kaven updates: Add new migrations, never modify existing
- ✅ Safe to run migrations multiple times (idempotent)

---
```

---

## 4. ROADMAP.md

### 4.1. Adicionar Phase: CLI & Module System

**Localização:** Após Phase 1 (MVP)

**Conteúdo a adicionar:**

```markdown
---

## Phase 1.5: CLI & Module System (Weeks 7-10)

> **Goal:** Make Kaven installable and updatable without Git cloning

**Priority:** 🔥 High  
**Status:** 🟡 Planned  
**Duration:** 4 weeks

### Deliverables

#### Week 7-8: CLI Development

**@kaven/cli Package:**
- [ ] Create NPM package structure
- [ ] `create-kaven-app` command (installation)
- [ ] Interactive wizard (database, modules, config)
- [ ] Degit integration (download without Git)
- [ ] Git initialization (clean repo)
- [ ] Config generation (kaven.config.json)

**Testing:**
- [ ] Test installation on macOS
- [ ] Test installation on Linux
- [ ] Test installation on Windows
- [ ] Verify Git is clean (no remote)

#### Week 9-10: Update System

**kaven update Command:**
- [ ] Version detection (GitHub API)
- [ ] Schema diff analyzer
- [ ] Intelligent file merger
- [ ] Migration detector
- [ ] Git branch creation
- [ ] Breaking change warnings

**Module Management:**
- [ ] `kaven module add <name>`
- [ ] `kaven module remove <name>`
- [ ] `kaven module list`
- [ ] Module registry (local)

**Testing:**
- [ ] Test update from v1.0 to v2.0
- [ ] Verify custom code preserved
- [ ] Test module add/remove
- [ ] Test schema merge

### Acceptance Criteria

#### Installation:
```bash
npx create-kaven-app my-saas
cd my-saas

# ✅ Git initialized (no Kaven remote)
git remote -v  # (empty)

# ✅ Config created
cat kaven.config.json  # Valid JSON

# ✅ Dependencies installed
pnpm dev  # Works
```

#### Update:
```bash
# Developer adds custom field
# Edit: prisma/schema.extended.prisma
# Add: company String?

# Kaven releases v2.0
pnpm kaven update

# ✅ Base schema updated
# ✅ Custom field preserved
# ✅ New migrations applied
# ✅ Git branch created
```

#### Modules:
```bash
# Add module
pnpm kaven module add analytics

# ✅ Module downloaded
# ✅ Config updated
# ✅ Dependencies installed
# ✅ Migrations applied

# Remove module
pnpm kaven module remove analytics

# ✅ Module removed
# ✅ Config updated
# ✅ Dependencies cleaned
```

---
```

---

## 5. NOVO DOCUMENTO: INSTALLATION_GUIDE.md

**Criar novo documento:**

```markdown
# 📦 INSTALLATION GUIDE - Kaven Boilerplate

> **Version:** 2.0.0  
> **Last Updated:** December 18, 2025

---

## 🚀 Quick Start

### Installation

```bash
# NPM
npx create-kaven-app my-saas

# PNPM (recommended)
pnpm create kaven-app my-saas

# Yarn
yarn create kaven-app my-saas
```

### Interactive Wizard

```
? Project name: my-saas
? Database: PostgreSQL
? Enable multi-tenancy? Yes
? Payment gateway: Stripe
? Enable analytics? Yes
? Enable AI assistant? No

📦 Downloading Kaven Boilerplate v2.0.0...
⚙️  Configuring project...
📦 Installing dependencies...
🔧 Initializing Git...

✅ Project created successfully!

Next steps:
  cd my-saas
  cp .env.example .env
  pnpm dev
```

---

## 📁 Project Structure

```
my-saas/
├── .kaven/                      # Kaven metadata
│   ├── version                  # Installed version
│   └── cli/                     # CLI scripts
├── apps/
│   ├── api/                     # Backend (Fastify)
│   │   └── src/
│   │       ├── core/            # Core modules (auth, users)
│   │       ├── modules/         # Optional modules
│   │       └── custom/          # Your code here
│   └── admin/                   # Frontend (Next.js)
├── packages/
│   └── shared/                  # Shared utilities
├── prisma/
│   ├── schema.base.prisma       # Kaven base (read-only)
│   ├── schema.extended.prisma   # Your extensions
│   └── schema.prisma            # Generated (auto-merge)
├── kaven.config.json            # Configuration
└── package.json
```

---

## ⚙️ Configuration

### kaven.config.json

```json
{
  "name": "my-saas",
  "version": "1.0.0",
  "kaven": {
    "version": "2.0.0",
    "features": {
      "multiTenant": true,
      "database": "postgresql",
      "payment": "stripe"
    },
    "modules": {
      "core": {
        "auth": true,
        "users": true,
        "tenants": true
      },
      "optional": {
        "payments-stripe": true,
        "analytics": true,
        "ai-assistant": false
      }
    }
  }
}
```

### Environment Variables

```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-here"
STRIPE_SECRET_KEY="sk_test_..."
```

---

## 🔄 Updates

### Check for Updates

```bash
pnpm kaven update --check

# Output:
# Current version: v2.0.0
# Latest version: v2.5.0
# Update available!
```

### Apply Update

```bash
pnpm kaven update

# Interactive prompts:
? Update from v2.0.0 to v2.5.0? Yes
? Apply migrations? Yes
? Create backup? Yes

# Process:
📊 Analyzing changes...
  ✅ User.twoFactorSecret (new field)
  ✅ TwoFactorBackupCode (new table)

🔄 Creating branch update/kaven-v2.5.0...
📝 Applying changes...
🗃️  Running migrations...

✅ Update complete!

Review: git diff main...update/kaven-v2.5.0
Apply:  git checkout main && git merge update/kaven-v2.5.0
```

---

## 🧩 Module Management

### Add Module

```bash
pnpm kaven module add analytics

# Output:
📦 Installing analytics module...
  ✅ Downloaded v1.0.0
  ✅ Installed dependencies
  ✅ Applied migrations
  ✅ Updated config

✅ Analytics module ready!
```

### Remove Module

```bash
pnpm kaven module remove analytics

# Output:
🗑️  Removing analytics module...
  ✅ Removed files
  ✅ Updated config
  ⚠️  Migrations preserved (data safety)

✅ Module removed!
```

### List Modules

```bash
pnpm kaven module list

# Output:
CORE (always enabled):
  ✅ auth
  ✅ users
  ✅ tenants

OPTIONAL:
  ✅ payments-stripe (v2.0.0)
  ❌ payments-mercadopago
  ✅ analytics (v1.0.0)
  ❌ ai-assistant

CUSTOM:
  📦 my-custom-module
```

---

## 🎨 Customization

### Extend User Model

**Edit:** `prisma/schema.extended.prisma`

```prisma
model User {
  // Base fields (don't redeclare)
  
  // Your custom fields
  company String?
  phone   String?
  avatar  String?
}
```

**Generate migration:**

```bash
pnpm prisma migrate dev --name add_custom_user_fields
```

### Add Custom Module

**Create:** `apps/api/src/custom/my-module/index.ts`

```typescript
import { FastifyPluginAsync } from 'fastify';

export const myModule: FastifyPluginAsync = async (app) => {
  app.get('/my-route', async () => {
    return { message: 'Hello from custom module!' };
  });
};

export default myModule;
```

**Register:**

```typescript
// apps/api/src/index.ts
await app.register(import('./custom/my-module'));
```

---

## 🐛 Troubleshooting

### CLI Not Found

```bash
# Clear npm cache
npm cache clean --force

# Reinstall
npm install -g create-kaven-app
```

### Update Fails

```bash
# Stash changes
git stash

# Retry update
pnpm kaven update

# Reapply changes
git stash pop
```

### Module Not Loading

**Check config:**
```json
{
  "modules": {
    "optional": {
      "my-module": true  // ← Make sure it's true
    }
  }
}
```

**Check logs:**
```bash
pnpm dev | grep "module"
```

---

## 📚 Next Steps

1. ✅ [Development Guide](./DEVELOPMENT.md)
2. ✅ [API Documentation](./API_SPECIFICATION.md)
3. ✅ [Deployment Guide](./DEPLOYMENT.md)

---

**Need help?** Open an issue on [GitHub](https://github.com/bychrisr/kaven-boilerplate/issues)
```

---

## 📊 RESUMO DAS ALTERAÇÕES

| Documento | Tipo de Alteração | Impacto |
|-----------|-------------------|---------|
| **ARCHITECTURE.md** | Adicionar 4 novos ADRs + Seção de Módulos | Alto |
| **TECH_STACK.md** | Adicionar @kaven/cli | Médio |
| **DATABASE_SPECIFICATION.md** | Adicionar Seção 3-Layer Schema | Alto |
| **ROADMAP.md** | Adicionar Phase 1.5 (CLI) | Médio |
| **INSTALLATION_GUIDE.md** | Criar novo documento | Alto |

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Documentação:
- [ ] Aplicar alterações no ARCHITECTURE.md
- [ ] Aplicar alterações no TECH_STACK.md
- [ ] Aplicar alterações no DATABASE_SPECIFICATION.md
- [ ] Aplicar alterações no ROADMAP.md
- [ ] Criar INSTALLATION_GUIDE.md

### Código:
- [ ] Criar estrutura .kaven/
- [ ] Criar @kaven/cli package
- [ ] Implementar schema.base.prisma
- [ ] Implementar schema.extended.prisma
- [ ] Implementar schema-merger.ts
- [ ] Criar estrutura de módulos
- [ ] Implementar module loader

### Testes:
- [ ] Testar instalação
- [ ] Testar atualização
- [ ] Testar adição de módulos
- [ ] Testar schema merge
- [ ] Testar migrations aditivas

---

**📅 Criado em:** 18 de Dezembro de 2025  
**✍️ Autor:** Chris (@bychrisr)  
**📧 Status:** Pendente de Revisão
