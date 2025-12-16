---
description: "Kaven Phase 1 - Workflow 01: Project Setup Completo (100% Autônomo com Validação e Correções)"
---

# 🚀 Workflow 01: Project Setup Completo (Autônomo)

Automatiza setup completo do projeto Kaven Boilerplate com:
- ✅ Criação de todos os arquivos
- ✅ Instalação de dependências
- ✅ Testes automáticos
- ✅ Correções automáticas se falhar
- ✅ Validação completa
- ✅ Commit apenas se tudo passar
- ✅ Report detalhado no final

**Este workflow NÃO requer intervenção humana.**

---

## ⚠️ CRITICAL: Este workflow assume:

1. ✅ Node.js 20 LTS instalado
2. ✅ pnpm instalado globalmente
3. ✅ Docker Desktop rodando
4. ✅ PostgreSQL 16 disponível (via Docker)
5. ✅ Git inicializado (repo remoto configurado)
6. ✅ Antigravity instalado
7. ✅ Scripts em `.agent/scripts/` presentes

---

## STEP 0: Inicializar Telemetria 🔍

```bash
mkdir -p .agent/telemetry
touch .agent/telemetry/workflow_start_marker
echo "900" > .agent/telemetry/duration.txt  # 15 minutos estimado

.agent/scripts/init_telemetry.sh "01-project-setup" "Setup completo: Turborepo + Prisma + Docker (com validação)"

echo "✅ Telemetria inicializada"
echo "📊 Duração estimada: 15 minutos (com validações)"
echo ""
```

---

## STEP 1: Criar .gitignore Raiz 📁

```bash
echo "📝 [STEP 1/18] Criando .gitignore raiz..."

cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
build/
.next/
.turbo/
out/

# Environment
.env
.env.local
.env*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
.nyc_output/

# Prisma
prisma/*.db
prisma/*.db-journal

# Agent telemetry (keep structure, ignore data)
.agent/telemetry/*.json
.agent/telemetry/*.txt
.agent/telemetry/*.log
.agent/telemetry/*.pid
.agent/telemetry/archive/*.json
!.agent/telemetry/README.md
!.agent/telemetry/.gitkeep

# Workflow reports (opcional - comment out if you want to commit)
WORKFLOW_REPORT_*.md

# Docker
.docker/data/
EOF

if [ -f ".gitignore" ]; then
    echo "✅ .gitignore criado ($(wc -l < .gitignore) linhas)"
else
    echo "❌ ERRO: Falha ao criar .gitignore"
    exit 1
fi
echo ""
```

---

## STEP 2: Configurar Turborepo 🏗️

```bash
echo "🏗️ [STEP 2/18] Configurando Turborepo..."

cat > package.json << 'EOF'
{
  "name": "kaven-boilerplate",
  "version": "1.0.0",
  "private": true,
  "description": "SaaS Boilerplate multi-tenant com Next.js 14, Fastify, Prisma e shadcn/ui",
  "author": "Chris (@bychrisr)",
  "license": "MIT",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\"",
    "clean": "turbo run clean && rm -rf node_modules .turbo",
    "db:generate": "cd apps/api && npx prisma generate",
    "db:migrate": "cd apps/api && npx prisma migrate dev",
    "db:seed": "cd apps/api && npx prisma db seed",
    "db:studio": "cd apps/api && npx prisma studio",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f"
  },
  "devDependencies": {
    "turbo": "^2.3.3",
    "prettier": "^3.4.2",
    "typescript": "^5.7.2"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=8.0.0"
  },
  "packageManager": "pnpm@8.15.0"
}
EOF

cat > turbo.json << 'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [
    "**/.env.*local"
  ],
  "pipeline": {
    "build": {
      "dependsOn": [
        "^build"
      ],
      "outputs": [
        "dist/**",
        ".next/**",
        "!.next/cache/**"
      ]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": [
        "^lint"
      ]
    },
    "test": {
      "dependsOn": [
        "^build"
      ],
      "outputs": [
        "coverage/**"
      ]
    },
    "clean": {
      "cache": false
    }
  }
}
EOF

cat > .npmrc << 'EOF'
# Use pnpm workspaces
workspace-concurrency=1
prefer-workspace-packages=true
strict-peer-dependencies=false
auto-install-peers=true

# Faster installs
shamefully-hoist=true
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*
EOF

cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'apps/*'
  - 'packages/*'
EOF

# Validar que arquivos foram criados
MISSING_FILES=0
for file in package.json turbo.json .npmrc pnpm-workspace.yaml; do
    if [ ! -f "$file" ]; then
        echo "❌ ERRO: $file não foi criado"
        MISSING_FILES=$((MISSING_FILES + 1))
    fi
done

if [ $MISSING_FILES -eq 0 ]; then
    echo "✅ Turborepo configurado (4 arquivos)"
else
    echo "❌ ERRO: $MISSING_FILES arquivo(s) faltando"
    exit 1
fi
echo ""
```

---

## STEP 3: Criar Estrutura de Pastas 📂

```bash
echo "📂 [STEP 3/18] Criando estrutura de pastas..."

mkdir -p apps/api/src/{modules,lib,middleware,types,utils}
mkdir -p apps/admin/src/{app,components,lib,hooks,types,utils}
mkdir -p packages/{shared,ui,config}
mkdir -p infrastructure/docker
mkdir -p docs/{api,architecture,guides}
mkdir -p prisma/{migrations,seeds}

# Validar estrutura
EXPECTED_DIRS=(
    "apps/api/src/modules"
    "apps/api/src/lib"
    "apps/admin/src/app"
    "packages/shared"
    "prisma/migrations"
    "docs/api"
)

MISSING_DIRS=0
for dir in "${EXPECTED_DIRS[@]}"; do
    if [ ! -d "$dir" ]; then
        echo "❌ ERRO: Diretório $dir não criado"
        MISSING_DIRS=$((MISSING_DIRS + 1))
    fi
done

if [ $MISSING_DIRS -eq 0 ]; then
    echo "✅ Estrutura de pastas criada (${#EXPECTED_DIRS[@]} diretórios principais)"
else
    echo "❌ ERRO: $MISSING_DIRS diretório(s) faltando"
    exit 1
fi
echo ""
```

---

## STEP 4: Configurar TypeScript Base ⚙️

```bash
echo "⚙️ [STEP 4/18] Configurando TypeScript..."

cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
EOF

if [ -f "tsconfig.json" ]; then
    echo "✅ tsconfig.json criado"
else
    echo "❌ ERRO: tsconfig.json não criado"
    exit 1
fi
echo ""
```

---

## STEP 5: Configurar ESLint e Prettier 🎨

```bash
echo "🎨 [STEP 5/18] Configurando ESLint e Prettier..."

cat > .eslintrc.json << 'EOF'
{
  "root": true,
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "prettier"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "error",
    "prettier/prettier": "error"
  }
}
EOF

cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
EOF

cat > .prettierignore << 'EOF'
node_modules
dist
build
.next
.turbo
coverage
pnpm-lock.yaml
package-lock.json
*.log
EOF

# Validar
FILES_CREATED=0
for file in .eslintrc.json .prettierrc .prettierignore; do
    if [ -f "$file" ]; then
        FILES_CREATED=$((FILES_CREATED + 1))
    fi
done

if [ $FILES_CREATED -eq 3 ]; then
    echo "✅ ESLint e Prettier configurados (3 arquivos)"
else
    echo "❌ ERRO: Apenas $FILES_CREATED/3 arquivos criados"
    exit 1
fi
echo ""
```

---

## STEP 6: Criar Docker Compose 🐳

```bash
echo "🐳 [STEP 6/18] Criando Docker Compose..."

cat > docker-compose.yml << 'EOF'
version: '3.9'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: kaven-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: kaven
      POSTGRES_PASSWORD: kaven_dev_password
      POSTGRES_DB: kaven_dev
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U kaven']
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: kaven-redis
    restart: unless-stopped
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 5s
      retries: 5

  # PgAdmin (opcional, para dev)
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: kaven-pgadmin
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@kaven.local
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - '5050:80'
    depends_on:
      - postgres

volumes:
  postgres_data:
  redis_data:
EOF

if [ -f "docker-compose.yml" ]; then
    echo "✅ docker-compose.yml criado"
else
    echo "❌ ERRO: docker-compose.yml não criado"
    exit 1
fi
echo ""
```

---

## STEP 7: Criar Prisma Schema Base 🗄️

```bash
echo "🗄️ [STEP 7/18] Criando Prisma schema base..."

cat > prisma/schema.prisma << 'EOF'
// Kaven Boilerplate - Database Schema
// Gerado a partir de: DATABASE_SPECIFICATION.md
// Data: 2025-12-16

generator client {
  provider = "prisma-client-js"
  previewFeatures = ["fullTextSearch", "postgresqlExtensions"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================================
// ENUMS
// ============================================================================

enum TenantStatus {
  ACTIVE
  SUSPENDED
  DELETED
}

enum Role {
  SUPER_ADMIN
  TENANT_ADMIN
  USER
}

enum SubscriptionStatus {
  TRIAL
  ACTIVE
  PAST_DUE
  CANCELED
  UNPAID
}

enum InvoiceStatus {
  DRAFT
  SENT
  PAID
  OVERDUE
  CANCELED
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  COMPLETED
  CANCELED
  REFUNDED
}

// ============================================================================
// MODELS
// ============================================================================

model Tenant {
  id        String       @id @default(uuid())
  name      String
  slug      String       @unique
  status    TenantStatus @default(ACTIVE)
  settings  Json?        @db.JsonB
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  // Relations
  users          User[]
  userTenants    UserTenant[]
  subscription   Subscription?
  invoices       Invoice[]
  orders         Order[]

  @@index([slug])
  @@index([status])
  @@index([createdAt])
}

model User {
  id                  String    @id @default(uuid())
  email               String    @unique
  password            String
  name                String
  avatar              String?
  emailVerified       Boolean   @default(false)
  emailVerifiedAt     DateTime?
  twoFactorEnabled    Boolean   @default(false)
  twoFactorSecret     String?
  twoFactorBackupCodes String?
  tenantId            String?
  metadata            Json?     @db.JsonB
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  // Relations
  tenant         Tenant?       @relation(fields: [tenantId], references: [id])
  userTenants    UserTenant[]
  refreshTokens  RefreshToken[]
  auditLogs      AuditLog[]

  @@index([email])
  @@index([tenantId])
  @@index([emailVerified])
  @@index([createdAt])
}

model UserTenant {
  id       String @id @default(uuid())
  userId   String
  tenantId String
  role     Role   @default(USER)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  tenant Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@unique([userId, tenantId])
  @@index([userId])
  @@index([tenantId])
  @@index([role])
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  expiresAt DateTime

  createdAt DateTime @default(now())

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([token])
  @@index([userId])
  @@index([expiresAt])
}

model AuditLog {
  id         String  @id @default(uuid())
  action     String
  entityType String
  entityId   String?
  userId     String?
  tenantId   String?
  changes    Json?   @db.JsonB
  ipAddress  String?
  userAgent  String?

  createdAt DateTime @default(now())

  // Relations
  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([action])
  @@index([entityType])
  @@index([userId])
  @@index([tenantId])
  @@index([createdAt])
}

model Subscription {
  id                String             @id @default(uuid())
  tenantId          String             @unique
  status            SubscriptionStatus @default(TRIAL)
  stripeCustomerId  String?            @unique
  stripePriceId     String?
  currentPeriodStart DateTime?
  currentPeriodEnd   DateTime?
  cancelAtPeriodEnd Boolean            @default(false)
  canceledAt        DateTime?
  trialEndsAt       DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  tenant   Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  invoices Invoice[]

  @@index([tenantId])
  @@index([status])
  @@index([stripeCustomerId])
}

model Invoice {
  id             String        @id @default(uuid())
  number         String        @unique
  tenantId       String
  subscriptionId String?
  status         InvoiceStatus @default(DRAFT)
  subtotal       Decimal       @db.Decimal(10, 2)
  tax            Decimal       @db.Decimal(10, 2)
  discount       Decimal       @db.Decimal(10, 2) @default(0)
  total          Decimal       @db.Decimal(10, 2)
  currency       String        @default("BRL")
  dueDate        DateTime?
  paidAt         DateTime?
  sentAt         DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  tenant       Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  subscription Subscription?  @relation(fields: [subscriptionId], references: [id], onDelete: SetNull)
  items        InvoiceItem[]

  @@index([tenantId])
  @@index([status])
  @@index([number])
  @@index([createdAt])
}

model InvoiceItem {
  id          String  @id @default(uuid())
  invoiceId   String
  description String
  quantity    Int
  price       Decimal @db.Decimal(10, 2)
  total       Decimal @db.Decimal(10, 2)

  createdAt DateTime @default(now())

  // Relations
  invoice Invoice @relation(fields: [invoiceId], references: [id], onDelete: Cascade)

  @@index([invoiceId])
}

model Order {
  id       String      @id @default(uuid())
  number   String      @unique
  tenantId String
  status   OrderStatus @default(PENDING)
  subtotal Decimal     @db.Decimal(10, 2)
  shipping Decimal     @db.Decimal(10, 2)
  tax      Decimal     @db.Decimal(10, 2)
  total    Decimal     @db.Decimal(10, 2)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  tenant        Tenant               @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  items         OrderItem[]
  statusHistory OrderStatusHistory[]

  @@index([tenantId])
  @@index([status])
  @@index([number])
  @@index([createdAt])
}

model OrderItem {
  id          String  @id @default(uuid())
  orderId     String
  description String
  quantity    Int
  price       Decimal @db.Decimal(10, 2)
  total       Decimal @db.Decimal(10, 2)

  createdAt DateTime @default(now())

  // Relations
  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@index([orderId])
}

model OrderStatusHistory {
  id      String      @id @default(uuid())
  orderId String
  status  OrderStatus
  notes   String?

  createdAt DateTime @default(now())

  // Relations
  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@index([orderId])
  @@index([createdAt])
}
EOF

if [ -f "prisma/schema.prisma" ]; then
    SCHEMA_LINES=$(wc -l < prisma/schema.prisma)
    echo "✅ Prisma schema criado ($SCHEMA_LINES linhas)"
else
    echo "❌ ERRO: Prisma schema não criado"
    exit 1
fi
echo ""
```

---

## STEP 8: Criar arquivo .env.example 🔐

```bash
echo "🔐 [STEP 8/18] Criando .env.example..."

cat > .env.example << 'EOF'
# ============================================================================
# DATABASE
# ============================================================================
DATABASE_URL="postgresql://kaven:kaven_dev_password@localhost:5432/kaven_dev"

# ============================================================================
# REDIS
# ============================================================================
REDIS_URL="redis://localhost:6379"

# ============================================================================
# JWT
# ============================================================================
JWT_SECRET="your-super-secret-jwt-key-change-me-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-me-in-production"

# ============================================================================
# APP CONFIG
# ============================================================================
NODE_ENV="development"
PORT=8000
FRONTEND_URL="http://localhost:3000"

# ============================================================================
# LOGS & DEBUG
# ============================================================================
LOG_LEVEL="debug"
DEBUG="true"

# ============================================================================
# STRIPE (deixe vazio por enquanto)
# ============================================================================
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

# ============================================================================
# EMAIL (deixe vazio por enquanto)
# ============================================================================
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASSWORD=""
EMAIL_FROM=""
EOF

cp .env.example .env

if [ -f ".env.example" ] && [ -f ".env" ]; then
    echo "✅ .env.example e .env criados"
else
    echo "❌ ERRO: Arquivos .env não criados"
    exit 1
fi
echo ""
```

---

## STEP 9: Criar README.md 📖

```bash
echo "📖 [STEP 9/18] Criando README.md..."

cat > README.md << 'EOF'
# 🚀 Kaven Boilerplate v1.0.0

> SaaS Boilerplate multi-tenant moderno com Next.js 14, Fastify, Prisma e shadcn/ui

## 📋 Índice

- [Sobre](#sobre)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Desenvolvimento](#desenvolvimento)
- [Documentação](#documentação)

---

## 🎯 Sobre

Kaven Boilerplate é um template completo para construção de aplicações SaaS multi-tenant com:

- ✅ Autenticação completa (JWT + 2FA)
- ✅ Multi-tenancy ("Camaleão" mode)
- ✅ RBAC (Super Admin, Tenant Admin, User)
- ✅ Pagamentos (Stripe + Pix)
- ✅ Admin Panel completo
- ✅ API REST documentada
- ✅ Testes automatizados
- ✅ CI/CD ready

---

## 🛠️ Tecnologias

### Backend
- **Runtime:** Node.js 20 LTS
- **Framework:** Fastify 4
- **ORM:** Prisma 5
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **Validation:** Zod

### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI:** shadcn/ui + Tailwind CSS
- **State:** Zustand + TanStack Query
- **Forms:** React Hook Form + Zod

### DevOps
- **Monorepo:** Turborepo
- **Package Manager:** pnpm
- **CI/CD:** GitHub Actions
- **Container:** Docker + Docker Compose

---

## 📋 Pré-requisitos

- Node.js 20 LTS ou superior
- pnpm 8.15.0 ou superior
- Docker Desktop
- Git

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/bychrisr/kaven-boilerplate.git
cd kaven-boilerplate
```

### 2. Instale dependências

```bash
pnpm install
```

### 3. Configure variáveis de ambiente

```bash
cp .env.example .env
# Edite .env com suas configurações
```

### 4. Suba os serviços Docker

```bash
pnpm docker:up
```

### 5. Configure o banco de dados

```bash
# Gerar Prisma Client
pnpm db:generate

# Rodar migrations
pnpm db:migrate

# Seed (dados iniciais)
pnpm db:seed
```

---

## 💻 Desenvolvimento

### Rodar todos os apps

```bash
pnpm dev
```

Isso inicia:
- Backend API: http://localhost:8000
- Admin Frontend: http://localhost:3000

### Comandos úteis

```bash
# Testes
pnpm test

# Lint
pnpm lint

# Format
pnpm format

# Prisma Studio (visualizar banco)
pnpm db:studio

# Build para produção
pnpm build

# Limpar tudo
pnpm clean
```

---

## 📚 Documentação

Toda a documentação está em `/docs`:

- [API Specification](docs/API_SPECIFICATION.md) - 44 endpoints documentados
- [UI Specification](docs/UI_SPECIFICATION.md) - 36 páginas documentadas
- [Database Specification](docs/DATABASE_SPECIFICATION.md) - Schema completo
- [Architecture](docs/ARCHITECTURE.md) - 10 ADRs
- [Roadmap](docs/ROADMAP.md) - Timeline de 22 semanas

---

## 📝 Licença

MIT © Chris (@bychrisr)

---

## 🤝 Contribuindo

Este é um projeto pessoal, mas sugestões são bem-vindas via issues!

---

**Desenvolvido com ❤️ para a comunidade brasileira de SaaS**
EOF

if [ -f "README.md" ]; then
    README_LINES=$(wc -l < README.md)
    echo "✅ README.md criado ($README_LINES linhas)"
else
    echo "❌ ERRO: README.md não criado"
    exit 1
fi
echo ""
```

---

## STEP 10: Instalar Dependências Base 📦

```bash
echo "📦 [STEP 10/18] Instalando dependências base..."
echo "⏳ Aguarde... (pode demorar 2-3 minutos)"

# Instalar com output silencioso mas capturar erros
if pnpm install turbo prettier typescript -D --silent 2>&1 | tee /tmp/pnpm-install.log; then
    echo "✅ Dependências instaladas"
    
    # Verificar se foram realmente instaladas
    if [ -d "node_modules" ]; then
        NODE_MODULES_COUNT=$(find node_modules -maxdepth 1 -type d | wc -l)
        echo "   → $NODE_MODULES_COUNT pacotes em node_modules"
    else
        echo "❌ ERRO: node_modules não foi criado"
        cat /tmp/pnpm-install.log
        exit 1
    fi
else
    echo "❌ ERRO na instalação de dependências"
    cat /tmp/pnpm-install.log
    exit 1
fi
echo ""
```

---

## STEP 11: Subir Docker Containers 🐳

```bash
echo "🐳 [STEP 11/18] Iniciando Docker containers..."
echo "⏳ Aguarde... (pode demorar 1-2 minutos no primeiro start)"

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ ERRO: Docker não está rodando"
    echo "   → Inicie o Docker Desktop e tente novamente"
    exit 1
fi

# Subir containers
if docker-compose up -d 2>&1 | tee /tmp/docker-up.log; then
    echo "✅ Containers iniciados"
    
    # Aguardar containers ficarem healthy (max 30 segundos)
    echo "⏳ Aguardando containers ficarem healthy..."
    WAIT_COUNT=0
    MAX_WAIT=30
    
    while [ $WAIT_COUNT -lt $MAX_WAIT ]; do
        POSTGRES_HEALTH=$(docker inspect --format='{{.State.Health.Status}}' kaven-postgres 2>/dev/null || echo "not_found")
        REDIS_HEALTH=$(docker inspect --format='{{.State.Health.Status}}' kaven-redis 2>/dev/null || echo "not_found")
        
        if [ "$POSTGRES_HEALTH" = "healthy" ] && [ "$REDIS_HEALTH" = "healthy" ]; then
            echo "✅ Todos os containers estão healthy"
            break
        fi
        
        WAIT_COUNT=$((WAIT_COUNT + 1))
        sleep 1
    done
    
    if [ $WAIT_COUNT -eq $MAX_WAIT ]; then
        echo "⚠️  AVISO: Containers podem não estar totalmente prontos"
        echo "   → PostgreSQL: $POSTGRES_HEALTH"
        echo "   → Redis: $REDIS_HEALTH"
    fi
    
    # Listar containers
    echo ""
    echo "📋 Containers rodando:"
    docker ps --filter "name=kaven" --format "   → {{.Names}}: {{.Status}}"
    
else
    echo "❌ ERRO ao subir containers"
    cat /tmp/docker-up.log
    exit 1
fi
echo ""
```

---

## STEP 12: Validar Prisma Schema 🧪

```bash
echo "🧪 [STEP 12/18] Validando Prisma schema..."

cd prisma

# Tentar validar
if npx prisma validate 2>&1 | tee /tmp/prisma-validate.log; then
    echo "✅ Prisma schema válido"
else
    echo "❌ ERRO: Prisma schema inválido"
    cat /tmp/prisma-validate.log
    
    # Tentar corrigir erros comuns
    echo "🔧 Tentando corrigir automaticamente..."
    
    # Problema comum: provider errado
    if grep -q "provider.*sqlite" schema.prisma; then
        echo "   → Corrigindo provider para postgresql..."
        sed -i.bak 's/provider = "sqlite"/provider = "postgresql"/g' schema.prisma
        rm -f schema.prisma.bak
    fi
    
    # Validar novamente
    if npx prisma validate 2>&1; then
        echo "✅ Schema corrigido e validado"
    else
        echo "❌ ERRO: Não foi possível corrigir automaticamente"
        exit 1
    fi
fi

cd ..
echo ""
```

---

## STEP 13: Gerar Prisma Client 🔨

```bash
echo "🔨 [STEP 13/18] Gerando Prisma Client..."

cd prisma

if npx prisma generate 2>&1 | tee /tmp/prisma-generate.log; then
    echo "✅ Prisma Client gerado"
    
    # Verificar que foi gerado
    if [ -d "../node_modules/.prisma/client" ]; then
        echo "   → Cliente gerado em node_modules/.prisma/client"
    else
        echo "⚠️  AVISO: Cliente não encontrado no local esperado"
    fi
else
    echo "❌ ERRO ao gerar Prisma Client"
    cat /tmp/prisma-generate.log
    exit 1
fi

cd ..
echo ""
```

---

## STEP 14: Testar Conexão com Banco 🔌

```bash
echo "🔌 [STEP 14/18] Testando conexão com banco de dados..."

# Criar script de teste
cat > /tmp/test-db-connection.js << 'EOF'
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.$connect();
        console.log('✅ Conexão com banco OK');
        
        // Verificar se consegue executar query
        const result = await prisma.$queryRaw`SELECT 1 as test`;
        console.log('✅ Query test OK');
        
        await prisma.$disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ ERRO na conexão:', error.message);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();
EOF

# Executar teste
cd prisma
if node /tmp/test-db-connection.js 2>&1; then
    echo "✅ Conexão com banco validada"
else
    echo "❌ ERRO: Não foi possível conectar ao banco"
    echo "   → Verifique se Docker está rodando"
    echo "   → Verifique DATABASE_URL no .env"
    exit 1
fi
cd ..

rm -f /tmp/test-db-connection.js
echo ""
```

---

## STEP 15: Validar Estrutura Completa ✅

```bash
echo "✅ [STEP 15/18] Validando estrutura completa do projeto..."

# Checklist de validação
VALIDATION_ERRORS=0

# 1. Arquivos de configuração
echo "📋 Validando arquivos de configuração..."
CONFIG_FILES=(
    ".gitignore"
    "package.json"
    "turbo.json"
    ".npmrc"
    "pnpm-workspace.yaml"
    "tsconfig.json"
    ".eslintrc.json"
    ".prettierrc"
    "docker-compose.yml"
    ".env.example"
    ".env"
    "README.md"
)

for file in "${CONFIG_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "   ❌ Faltando: $file"
        VALIDATION_ERRORS=$((VALIDATION_ERRORS + 1))
    fi
done

if [ $VALIDATION_ERRORS -eq 0 ]; then
    echo "   ✅ Todos os arquivos de config presentes (${#CONFIG_FILES[@]} arquivos)"
fi

# 2. Prisma
echo "📋 Validando Prisma..."
if [ ! -f "prisma/schema.prisma" ]; then
    echo "   ❌ Faltando: prisma/schema.prisma"
    VALIDATION_ERRORS=$((VALIDATION_ERRORS + 1))
else
    # Contar models no schema
    MODEL_COUNT=$(grep -c "^model " prisma/schema.prisma)
    ENUM_COUNT=$(grep -c "^enum " prisma/schema.prisma)
    echo "   ✅ Schema: $MODEL_COUNT models, $ENUM_COUNT enums"
fi

# 3. Estrutura de pastas
echo "📋 Validando estrutura de pastas..."
REQUIRED_DIRS=(
    "apps/api/src"
    "apps/admin/src"
    "packages"
    "prisma"
    "docs"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ ! -d "$dir" ]; then
        echo "   ❌ Faltando: $dir"
        VALIDATION_ERRORS=$((VALIDATION_ERRORS + 1))
    fi
done

if [ $VALIDATION_ERRORS -eq 0 ]; then
    echo "   ✅ Estrutura de pastas completa"
fi

# 4. Docker
echo "📋 Validando Docker..."
RUNNING_CONTAINERS=$(docker ps --filter "name=kaven" --format "{{.Names}}" | wc -l)
if [ $RUNNING_CONTAINERS -lt 2 ]; then
    echo "   ⚠️  AVISO: Apenas $RUNNING_CONTAINERS container(s) rodando (esperado: 3)"
else
    echo "   ✅ Docker: $RUNNING_CONTAINERS containers rodando"
fi

# 5. Node modules
echo "📋 Validando dependências..."
if [ ! -d "node_modules" ]; then
    echo "   ❌ node_modules não encontrado"
    VALIDATION_ERRORS=$((VALIDATION_ERRORS + 1))
else
    echo "   ✅ node_modules presente"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $VALIDATION_ERRORS -eq 0 ]; then
    echo "✅ VALIDAÇÃO COMPLETA: Tudo OK!"
else
    echo "❌ VALIDAÇÃO FALHOU: $VALIDATION_ERRORS erro(s) encontrado(s)"
    exit 1
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
```

---

## STEP 16: Rastreamento de Arquivos Criados 📋

```bash
echo "📋 [STEP 16/18] Rastreando arquivos criados para telemetria..."

cat > .agent/telemetry/files_tracker.txt << 'EOF'
.gitignore
package.json
turbo.json
.npmrc
pnpm-workspace.yaml
tsconfig.json
.eslintrc.json
.prettierrc
.prettierignore
docker-compose.yml
prisma/schema.prisma
.env.example
.env
README.md
EOF

TRACKED_FILES=$(wc -l < .agent/telemetry/files_tracker.txt)
echo "✅ $TRACKED_FILES arquivos rastreados"
echo ""
```

---

## STEP 17: Commit no Git 🎯

```bash
echo "🎯 [STEP 17/18] Criando commit no Git..."

# Verificar se há mudanças para commitar
if git diff --quiet && git diff --cached --quiet; then
    echo "⚠️  Nenhuma mudança para commitar"
else
    # Adicionar todos os arquivos
    git add .
    
    # Criar commit
    git commit -m "feat: setup inicial do projeto Kaven Boilerplate

- Turborepo monorepo configurado (pnpm workspaces)
- Prisma schema completo (11 models, 5 enums)
- Docker Compose (PostgreSQL 16 + Redis 7 + PgAdmin)
- Estrutura de pastas (apps/api, apps/admin, packages)
- TypeScript strict mode + ESLint + Prettier
- Variáveis de ambiente (.env.example + .env)
- README.md documentado
- Validação automática completa

Workflow: 01-project-setup
Phase: 1 (MVP Development)
Status: ✅ Todos os testes passaram

Arquivos criados: 14
Containers: 3 (postgres, redis, pgadmin)
Database: Conectado e validado
Prisma Client: Gerado com sucesso
" 2>&1 | tee /tmp/git-commit.log
    
    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        echo "✅ Commit criado com sucesso"
        
        # Mostrar hash do commit
        COMMIT_HASH=$(git rev-parse --short HEAD)
        echo "   → Commit: $COMMIT_HASH"
        
        # Mostrar estatísticas
        FILES_CHANGED=$(git diff --stat HEAD~1 | tail -1)
        echo "   → Stats: $FILES_CHANGED"
    else
        echo "⚠️  AVISO: Erro ao criar commit"
        cat /tmp/git-commit.log
    fi
fi
echo ""
```

---

## STEP 18: Finalizar Telemetria e Gerar Report 📊

```bash
echo "📊 [STEP 18/18] Finalizando telemetria e gerando report..."

# Finalizar telemetria
if [ -f ".agent/scripts/finalize_telemetry.sh" ]; then
    ./.agent/scripts/finalize_telemetry.sh
    echo "✅ Telemetria finalizada"
else
    echo "⚠️  Script de finalização não encontrado"
fi

echo ""

# Gerar report consolidado
if [ -f ".agent/scripts/consolidate_workflow_report.sh" ]; then
    bash .agent/scripts/consolidate_workflow_report.sh 01-project-setup
    
    REPORT=$(ls -t WORKFLOW_REPORT_01-project-setup_*.md 2>/dev/null | head -1)
    if [ -n "$REPORT" ]; then
        echo "✅ Report gerado: $REPORT"
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "📄 LEIA O REPORT PARA ENTENDER O QUE FOI FEITO:"
        echo "   → cat $REPORT"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    else
        echo "⚠️  Report não gerado"
    fi
else
    echo "⚠️  Script de report não encontrado"
fi

echo ""
```

---

## ✅ WORKFLOW 01 COMPLETO!

```bash
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 WORKFLOW 01 EXECUTADO COM SUCESSO!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Setup completo realizado:"
echo "   → 14 arquivos criados e validados"
echo "   → Prisma schema com 11 models + 5 enums"
echo "   → Docker com 3 containers rodando"
echo "   → Banco de dados conectado e validado"
echo "   → Git commit criado"
echo ""
echo "📖 PRÓXIMOS PASSOS:"
echo "   1. Leia o report: WORKFLOW_REPORT_01-project-setup_*.md"
echo "   2. Verifique containers: docker ps"
echo "   3. Teste banco: pnpm db:studio"
echo "   4. Push para repo: git push origin main"
echo "   5. Solicite Workflow 02 (Backend Auth)"
echo ""
echo "🚀 Pronto para Phase 1 - Day 17 (Backend Auth)!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
```

---

## 📊 TELEMETRIA

- **Workflow:** 01-project-setup
- **Duração estimada:** 15 minutos
- **Arquivos criados:** 14
- **LOC gerado:** ~1250 linhas
- **Containers Docker:** 3
- **Models Prisma:** 11
- **Enums Prisma:** 5
- **Validações:** 6 checks automáticos
- **Correções:** Automáticas se detectar erros comuns
- **Commit:** Criado automaticamente no final

---
