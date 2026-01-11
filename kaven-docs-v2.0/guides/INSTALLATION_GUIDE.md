# 📦 INSTALLATION GUIDE - Kaven Boilerplate

> **Version:** 2.0.0  
> **Last Updated:** December 18, 2025  
> **Author:** Chris (@bychrisr)

---

## 📋 TABLE OF CONTENTS

1. [Quick Start](#-quick-start)
2. [Project Structure](#-project-structure)
3. [Configuration](#%EF%B8%8F-configuration)
4. [Updates](#-updates)
5. [Module Management](#-module-management)
6. [Customization](#-customization)
7. [Troubleshooting](#-troubleshooting)
8. [Next Steps](#-next-steps)

---

## 🚀 QUICK START

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

### First Run

```bash
cd my-saas

# Configure environment
cp .env.example .env
nano .env  # Edit database URL, etc

# Start development
pnpm dev

# Output:
# 🚀 API running on http://localhost:8000
# 🎨 Admin running on http://localhost:3000
```

---

## 📁 PROJECT STRUCTURE

```
my-saas/
├── .kaven/                      # Kaven metadata
│   ├── version                  # Installed version (2.0.0)
│   ├── modules/                 # Available modules
│   └── cli/                     # CLI scripts
│
├── apps/
│   ├── api/                     # Backend (Fastify)
│   │   └── src/
│   │       ├── core/            # Core modules (DO NOT EDIT)
│   │       │   ├── auth/        # Authentication
│   │       │   ├── users/       # User management
│   │       │   └── tenants/     # Multi-tenancy
│   │       │
│   │       ├── modules/         # Optional modules
│   │       │   ├── payments-stripe/
│   │       │   └── analytics/
│   │       │
│   │       └── custom/          # ✅ YOUR CODE HERE
│   │           └── .gitkeep
│   │
│   └── admin/                   # Frontend (Next.js 14)
│       ├── app/                 # App Router
│       └── components/
│           ├── ui/              # shadcn/ui (DO NOT EDIT)
│           └── custom/          # ✅ YOUR COMPONENTS
│
├── packages/
│   └── shared/                  # Shared utilities (DO NOT EDIT)
│       ├── types/
│       └── utils/
│
├── prisma/
│   ├── schema.base.prisma       # ⚠️ Kaven base (READ-ONLY)
│   ├── schema.extended.prisma   # ✅ Your extensions
│   ├── schema.prisma            # 🤖 Generated (auto-merge)
│   └── migrations/
│       ├── 001_kaven_init/      # Kaven migrations
│       └── 002_dev_*/           # Your migrations
│
├── .env                         # Environment variables
├── .env.example                 # Template
├── docker-compose.yml           # PostgreSQL + Redis
├── kaven.config.json            # ✅ Configuration
├── package.json
├── turbo.json                   # Monorepo config
└── README.md
```

### File Ownership

| Path | Owner | Editable? | Updated By |
|------|-------|-----------|------------|
| `apps/api/src/core/` | Kaven | ❌ No | `kaven update` |
| `apps/api/src/modules/` | Kaven | ⚠️ Not recommended | `kaven update` |
| `apps/api/src/custom/` | You | ✅ Yes | You |
| `packages/shared/` | Kaven | ❌ No | `kaven update` |
| `prisma/schema.base.prisma` | Kaven | ❌ No | `kaven update` |
| `prisma/schema.extended.prisma` | You | ✅ Yes | You |
| `kaven.config.json` | Both | ✅ Yes | Both |
| `.env` | You | ✅ Yes | You |

---

## ⚙️ CONFIGURATION

### kaven.config.json

```json
{
  "name": "my-saas",
  "version": "1.0.0",
  "kaven": {
    "version": "2.0.0",
    "installedAt": "2025-12-18T00:00:00Z",
    "repository": "https://github.com/bychrisr/kaven-boilerplate",
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
        "payments-mercadopago": false,
        "analytics": true,
        "ai-assistant": false,
        "notifications": false
      }
    },
    "customizations": {
      "removedModules": [],
      "addedModules": ["my-custom-module"]
    }
  }
}
```

### Environment Variables

```bash
# .env

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/kaven"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-key-change-in-production"
JWT_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"

# Multi-tenancy
APP_MODE="MULTI"                    # or "SINGLE"
TENANT_DETECTION="subdomain"        # or "header", "path"
DEFAULT_TENANT_ID="1"               # Used in SINGLE mode

# Stripe (if enabled)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Frontend
NEXT_PUBLIC_API_URL="http://localhost:8000"
```

---

## 🔄 UPDATES

### Check for Updates

```bash
pnpm kaven update --check

# Output:
# 📊 Current version: v2.0.0
# 🚀 Latest version: v2.5.0
# 📦 Update available!
# 
# Changes:
#   ✅ User.twoFactorSecret (new field)
#   ✅ TwoFactorBackupCode (new table)
#   ⚠️  payments-stripe: v1.0 → v2.0
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
  ✅ User.emailVerified (new field)
  ✅ TwoFactorBackupCode (new table)
  ❌ No breaking changes detected

🔄 Creating branch update/kaven-v2.5.0...
📦 Downloading Kaven v2.5.0...
📝 Applying changes...
  ✅ Updated core modules
  ✅ Updated base schema
  ✅ Updated payments-stripe
  ⏭️  Preserved custom code
🗃️  Running migrations...
  ✅ 010_kaven_2fa_system.sql applied
📝 Committing changes...

✅ Update complete!

Review: git diff main...update/kaven-v2.5.0
Apply:  git checkout main && git merge update/kaven-v2.5.0
```

### What Gets Updated?

**✅ UPDATED (Kaven-controlled):**
```bash
.kaven/                    # Metadata
apps/api/src/core/         # Core modules
packages/shared/           # Shared utilities
prisma/schema.base.prisma  # Base schema
.github/workflows/         # CI/CD
```

**⏭️ PRESERVED (Your code):**
```bash
apps/api/src/custom/                # Your modules
prisma/schema.extended.prisma       # Your schema extensions
.env                                # Your config
kaven.config.json (customizations)  # Your settings
```

**🔀 MERGED:**
```bash
package.json          # Dependencies merged
prisma/migrations/    # New migrations added
```

### Review Changes

```bash
# See what changed
git diff main...update/kaven-v2.5.0

# See files changed
git diff --name-only main...update/kaven-v2.5.0

# Review specific file
git diff main...update/kaven-v2.5.0 -- prisma/schema.base.prisma
```

### Apply Update

```bash
# If you're happy with changes
git checkout main
git merge update/kaven-v2.5.0

# Success!
✅ Merged update/kaven-v2.5.0 into main
```

### Rollback (if needed)

```bash
# Cancel update
git checkout main
git branch -D update/kaven-v2.5.0

# Or revert if already merged
git revert HEAD
```

---

## 🧩 MODULE MANAGEMENT

### Add Module

```bash
pnpm kaven module add ai-assistant

# Output:
📦 Installing ai-assistant module...
  ✅ Downloaded ai-assistant v1.0.0
  ✅ Installed to apps/api/src/modules/ai-assistant/
  ✅ Updated kaven.config.json
  ✅ Installed dependencies:
     - openai@4.0.0
  ✅ Applied migrations:
     - 005_ai_conversation_tables.sql

✅ ai-assistant module installed!

Configuration:
  Set OPENAI_API_KEY in .env

Usage:
  import { aiAssistant } from '@/modules/ai-assistant';
```

**What happens:**
1. Module downloaded from Kaven registry
2. Installed in `apps/api/src/modules/ai-assistant/`
3. `kaven.config.json` updated (module enabled)
4. Dependencies installed
5. Migrations applied (if any)

### Remove Module

```bash
pnpm kaven module remove ai-assistant

# Output:
🗑️  Removing ai-assistant module...
  ✅ Removed apps/api/src/modules/ai-assistant/
  ✅ Updated kaven.config.json
  ✅ Removed dependencies (if unused):
     - openai@4.0.0
  ⚠️  Migrations preserved (data safety)

✅ ai-assistant module removed!

Note: Database tables preserved. To drop:
  pnpm prisma migrate reset
```

**Data Safety:**
- Module files removed
- Config updated
- Dependencies cleaned
- **Migrations NOT removed** (data safety)
- Tables remain in database

### List Modules

```bash
pnpm kaven module list

# Output:
CORE MODULES (always enabled):
  ✅ auth            v2.0.0  Authentication system
  ✅ users           v2.0.0  User management
  ✅ tenants         v2.0.0  Multi-tenancy

OPTIONAL MODULES:
  ✅ payments-stripe v2.0.0  Stripe payments
  ❌ payments-mercadopago    Mercado Pago (not installed)
  ✅ analytics       v1.0.0  Analytics & tracking
  ❌ ai-assistant            AI assistant (not installed)
  ❌ notifications           Email/SMS/Push (not installed)

CUSTOM MODULES:
  📦 my-custom-module        Your custom code
```

### Available Modules

| Module | Description | Dependencies |
|--------|-------------|--------------|
| **payments-stripe** | Stripe integration | stripe@14.x |
| **payments-mercadopago** | Mercado Pago integration | mercadopago@2.x |
| **analytics** | Analytics & tracking | @vercel/analytics |
| **ai-assistant** | AI-powered chat | openai@4.x |
| **notifications** | Email/SMS/Push | nodemailer, twilio |

---

## 🎨 CUSTOMIZATION

### Extend User Model

**Edit:** `prisma/schema.extended.prisma`

```prisma
// prisma/schema.extended.prisma

model User {
  // Base fields from schema.base.prisma
  // (no need to redeclare)
  
  // Your custom fields
  company     String?
  phone       String?
  avatar      String?
  preferences Json?
  
  // Your custom relations
  orders       Order[]
  subscription Subscription?
}

// Your custom tables
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

**Generate Migration:**

```bash
pnpm prisma migrate dev --name add_custom_user_fields

# Output:
🔄 Generating migration...
  ✅ Migration created: 002_dev_add_custom_user_fields/

📝 Migration SQL:
  ALTER TABLE "User" ADD COLUMN "company" TEXT;
  ALTER TABLE "User" ADD COLUMN "phone" TEXT;
  CREATE TABLE "Order" (...);
  CREATE TABLE "Subscription" (...);

✅ Migration applied!
```

### Add Custom Module

**Create:** `apps/api/src/custom/my-module/index.ts`

```typescript
import { FastifyPluginAsync } from 'fastify';

export const myModule: FastifyPluginAsync = async (app) => {
  // Add routes
  app.get('/my-feature', async (req, reply) => {
    return { message: 'Hello from custom module!' };
  });

  app.post('/my-feature', async (req, reply) => {
    const { data } = req.body;
    // Your business logic
    return { success: true };
  });

  app.log.info('Custom module loaded');
};

export default myModule;
```

**Register:**

```typescript
// apps/api/src/index.ts
import { Fastify } from 'fastify';

const app = Fastify();

// ... Kaven modules load automatically ...

// Register your custom module
await app.register(import('./custom/my-module'));

app.listen({ port: 8000 });
```

### Custom Frontend Component

**Create:** `apps/admin/components/custom/MyComponent.tsx`

```typescript
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function MyComponent() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold">My Custom Feature</h2>
      <Button onClick={() => alert('Hello!')}>
        Click Me
      </Button>
    </Card>
  );
}
```

**Use:**

```typescript
// apps/admin/app/dashboard/page.tsx
import { MyComponent } from '@/components/custom/MyComponent';

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <MyComponent />
    </div>
  );
}
```

---

## 🐛 TROUBLESHOOTING

### CLI Not Found

**Problem:**
```bash
npx create-kaven-app my-saas
# Command not found
```

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try again
npx create-kaven-app@latest my-saas

# Or install globally
npm install -g create-kaven-app
create-kaven-app my-saas
```

### Update Fails

**Problem:**
```bash
pnpm kaven update
# ❌ Error: Uncommitted changes
```

**Solution:**
```bash
# Stash your changes
git stash

# Retry update
pnpm kaven update

# Reapply your changes
git stash pop
```

### Module Not Loading

**Problem:**
```bash
pnpm dev
# Module 'analytics' not found
```

**Solution 1: Check config**
```json
// kaven.config.json
{
  "modules": {
    "optional": {
      "analytics": true  // ← Make sure it's true
    }
  }
}
```

**Solution 2: Reinstall module**
```bash
pnpm kaven module remove analytics
pnpm kaven module add analytics
```

**Solution 3: Check logs**
```bash
pnpm dev | grep "module"
# Look for "analytics module loaded" or error messages
```

### Database Connection Error

**Problem:**
```bash
pnpm dev
# ❌ Error: Can't reach database
```

**Solution:**
```bash
# Check Docker containers
docker ps

# If not running:
docker-compose up -d

# Wait for healthy status
docker ps --filter "name=kaven"

# Test connection
docker exec -it kaven-postgres psql -U postgres -c "SELECT 1"
```

### Schema Merge Issues

**Problem:**
```bash
pnpm prisma generate
# ❌ Error: Conflicting fields
```

**Solution:**
```bash
# Regenerate schema
pnpm kaven schema:merge

# Or manually:
node .kaven/cli/schema-merger.js

# Then generate
pnpm prisma generate
```

---

## 📚 NEXT STEPS

### 1. Development

- ✅ [Development Guide](./DEVELOPMENT.md) - Development workflow
- ✅ [API Documentation](./API_SPECIFICATION.md) - API reference
- ✅ [Database Guide](./DATABASE_SPECIFICATION.md) - Schema details

### 2. Deployment

- ✅ [Deployment Guide](./DEPLOYMENT.md) - Deploy to production
- ✅ [CI/CD Setup](./CICD.md) - Automated deployments

### 3. Advanced

- ✅ [Module Development](./MODULE_DEVELOPMENT.md) - Create your own modules
- ✅ [Architecture](./ARCHITECTURE.md) - System architecture
- ✅ [Contributing](./CONTRIBUTING.md) - Contribute to Kaven

---

## 🆘 SUPPORT

### Documentation

- 📚 [Full Documentation](https://docs.kaven.dev)
- 🎥 [Video Tutorials](https://youtube.com/kaven)
- 💬 [Discord Community](https://discord.gg/kaven)

### Issues & Questions

- 🐛 [Report Bug](https://github.com/bychrisr/kaven-boilerplate/issues/new?template=bug_report.md)
- 💡 [Feature Request](https://github.com/bychrisr/kaven-boilerplate/issues/new?template=feature_request.md)
- ❓ [Ask Question](https://github.com/bychrisr/kaven-boilerplate/discussions)

### Updates

- 📰 [Changelog](./CHANGELOG.md)
- 🗺️ [Roadmap](./ROADMAP.md)
- 🎉 [Releases](https://github.com/bychrisr/kaven-boilerplate/releases)

---

**Made with ❤️ by Chris (@bychrisr)**  
**Version:** 2.0.0  
**Last Updated:** December 18, 2025
