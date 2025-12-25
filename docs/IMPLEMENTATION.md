# Kaven Boilerplate - Documentação de Implementação

> **Data:** 2025-12-24
> **Status:** MVP Implementado + Axisor Security Hardening
> **Tempo:** ~14 horas

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Backend API](#backend-api)
4. [Frontend](#frontend)
5. [Database](#database)
6. [Segurança & Hardening](SECURITY_ARCHITECTURE.md)
7. [UI Design](UI_DESIGN.md)
8. [Como Executar](#como-executar)
9. [Estrutura de Arquivos](#estrutura-de-arquivos)
10. [Próximos Passos](#próximos-passos)

---

## 🎯 Visão Geral

O **Kaven Boilerplate** é uma base sólida para aplicações SaaS multi-tenant, construída com as melhores práticas de desenvolvimento moderno.

### Stack Tecnológica

**Backend:**

- **Autenticação Avançada**: JWT, Refresh Tokens, 2FA, e RBAC.
- **Multi-tenancy Nativo**: Isolamento lógico de dados por tenant via middleware "Camaleão".
- **Observabilidade**: [Dashboard nativo](OBSERVABILITY.md) com métricas em tempo real e logs de auditoria.
- Node.js 20 LTS + TypeScript 5.3
- Fastify 4 (API REST)
- Prisma 5 (ORM)
- PostgreSQL 16
- Redis 7

**Frontend:**

- **Frontend Moderno**: Next.js 14 (App Router) com Shadcn UI.
- React 18
- TypeScript 5.3
- Tailwind CSS

**Segurança:**

- JWT (jose library)
- bcrypt (cost factor 12)
- 2FA TOTP (speakeasy)
- Validação Zod

---

## 🏗️ Arquitetura

### Multi-Tenant "Camaleão"

O sistema foi projetado para suportar:

- **Modo SINGLE:** Um único tenant (mais simples)
- **Modo MULTI:** Múltiplos tenants com isolamento completo

Detecção de tenant via:

- Subdomain (`empresa1.app.com`)
- Header (`X-Tenant-ID`)
- Path (`/tenants/:slug`)

### Estrutura Monorepo (Turborepo)

```
kaven-boilerplate/
├── apps/
│   ├── api/          # Backend Fastify
│   └── admin/        # Frontend Next.js
├── packages/
│   ├── shared/       # Código compartilhado
│   └── ui/           # Componentes UI
└── prisma/           # Schema e migrações
```

---

## 🔌 Backend API

### Endpoints Implementados (21 total)

#### 🔐 Autenticação (`/api/auth`) - 10 endpoints

| Método | Rota               | Descrição                  |
| ------ | ------------------ | -------------------------- |
| POST   | `/register`        | Registra novo usuário      |
| POST   | `/verify-email`    | Verifica email             |
| POST   | `/login`           | Login com JWT              |
| POST   | `/refresh`         | Renova access token        |
| POST   | `/logout`          | Invalida refresh token     |
| POST   | `/forgot-password` | Envia email de recuperação |
| POST   | `/reset-password`  | Reseta senha               |
| POST   | `/2fa/setup`       | Configura 2FA + QR code    |
| POST   | `/2fa/verify`      | Verifica código TOTP       |
| POST   | `/2fa/disable`     | Desabilita 2FA             |

#### 👥 Users (`/api/users`) - 6 endpoints

| Método | Rota   | Descrição                 |
| ------ | ------ | ------------------------- |
| GET    | `/`    | Lista usuários (paginado) |
| GET    | `/me`  | Usuário atual             |
| GET    | `/:id` | Busca por ID              |
| POST   | `/`    | Cria usuário              |
| PUT    | `/:id` | Atualiza usuário          |
| DELETE | `/:id` | Deleta (soft delete)      |

#### 🏢 Tenants (`/api/tenants`) - 5 endpoints

| Método | Rota   | Descrição                |
| ------ | ------ | ------------------------ |
| GET    | `/`    | Lista tenants (paginado) |
| GET    | `/:id` | Busca por ID             |
| POST   | `/`    | Cria tenant              |
| PUT    | `/:id` | Atualiza tenant          |
| DELETE | `/:id` | Deleta (soft delete)     |

### Estrutura de Services

Cada módulo segue a arquitetura em camadas:

```
modules/auth/
├── services/
│   └── auth.service.ts      # Lógica de negócio
├── controllers/
│   └── auth.controller.ts   # Handlers HTTP
└── routes/
    └── auth.routes.ts       # Definição de rotas
```

**Exemplo de uso:**

```typescript
// Service (lógica)
export class AuthService {
  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    // ... validações
    const accessToken = await generateAccessToken({ userId: user.id, ... });
    return { accessToken, user };
  }
}

// Controller (HTTP)
export class AuthController {
  async login(request, reply) {
    const data = loginSchema.parse(request.body);
    const result = await authService.login(data);
    reply.send(result);
  }
}
```

---

## 🎨 Frontend

### Páginas Implementadas (3)

#### `/setup` - Setup Wizard

- Assistente de configuração inicial em 4 etapas
- Step 1: Branding & Global Settings (nome, email, senha, idioma, moeda, cor)
- Step 2: Architecture Selection (Single vs Multi-tenant)
- Step 3: Administrative Team (seleção de personas)
- Step 4: Finalization (resumo e instalação)
- Validação visual de senha em tempo real
- Design dark glassmorphism consistente
- Documentação completa em [SETUP_WIZARD.md](SETUP_WIZARD.md)

#### `/login` - Página de Login

- Formulário com email/senha
- Integração com API `/api/auth/login`
- Tratamento de erros
- Loading states
- Redirecionamento pós-login

#### `/dashboard` - Dashboard

- Proteção de rota (verifica token)
- Exibição de dados do usuário
- Estatísticas básicas
- Logout funcional

### Exemplo de Integração com API

```typescript
// Login
const response = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});

const data = await response.json();

// Salvar tokens
localStorage.setItem('accessToken', data.accessToken);
localStorage.setItem('refreshToken', data.refreshToken);
```

---

## 🗄️ Database

### Schema Prisma (11 modelos)

```prisma
model Tenant {
  id        String   @id @default(uuid())
  name      String
  slug      String   @unique
  domain    String?  @unique
  status    TenantStatus @default(ACTIVE)
  users     User[]
  // ... mais campos
}

model User {
  id               String   @id @default(uuid())
  email            String   @unique
  password         String
  name             String
  role             Role     @default(USER)
  twoFactorEnabled Boolean  @default(false)
  twoFactorSecret  String?
  tenantId         String?
  tenant           Tenant?  @relation(...)
  // ... mais campos
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  revokedAt DateTime?
  user      User     @relation(...)
}

// + AuditLog, Subscription, Invoice, Order, Payment
```

### Enums

- `TenantStatus`: ACTIVE, SUSPENDED, DELETED
- `Role`: SUPER_ADMIN, TENANT_ADMIN, USER
- `SubscriptionStatus`: ACTIVE, CANCELED, PAST_DUE, TRIALING, EXPIRED
- `InvoiceStatus`: DRAFT, PENDING, PAID, OVERDUE, CANCELED
- `OrderStatus`: PENDING, PROCESSING, COMPLETED, CANCELED, REFUNDED
- `PaymentMethod`: STRIPE, PIX, CREDIT_CARD, BOLETO
- `PaymentStatus`: PENDING, COMPLETED, FAILED, REFUNDED

---

## 🔐 Segurança

### Autenticação JWT

```typescript
// Access Token (curta duração: 15min)
const accessToken = await generateAccessToken({
  userId: user.id,
  email: user.email,
  role: user.role,
  tenantId: user.tenantId,
});

// Refresh Token (longa duração: 7 dias)
const refreshToken = generateRefreshToken(); // UUID-like
await prisma.refreshToken.create({
  data: { token: refreshToken, userId: user.id, expiresAt: ... }
});
```

### Hash de Senhas (bcrypt)

```typescript
// Registro
const hashedPassword = await hashPassword(plainPassword); // cost: 12

// Login
const isValid = await comparePassword(plainPassword, hashedPassword);
```

### 2FA TOTP

```typescript
// Setup
const { secret, qrCodeUrl } = await generate2FASecret(email);
const backupCodes = generateBackupCodes(); // 10 códigos

// Verificação
const isValid = verify2FACode(secret, userInputCode);
```

### Validação (Zod)

```typescript
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
  twoFactorCode: z.string().length(6).optional(),
});

const data = loginSchema.parse(request.body); // Throws se inválido
```

---

## 🚀 Como Executar

### Pré-requisitos

```bash
# Versões necessárias
node --version  # v20+
pnpm --version  # v8+
docker --version
```

### 1. Instalar Dependências

```bash
pnpm install
```

### 2. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Editar `.env`:

```env
DATABASE_URL="postgresql://kaven:kaven_dev_password@localhost:5432/kaven_dev"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="seu-secret-super-seguro-aqui"
NODE_ENV="development"
PORT=8000
```

### 3. Iniciar Docker

```bash
docker-compose up -d
```

Verifica containers:

```bash
docker ps
# Deve mostrar: kaven-postgres, kaven-redis, kaven-pgadmin
```

### 4. Rodar Migrações

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Iniciar Backend

```bash
cd apps/api
pnpm dev
```

Backend rodará em: **http://localhost:8000**

### 6. Iniciar Frontend

```bash
cd apps/admin
pnpm dev
```

Frontend rodará em: **http://localhost:3000**

### 7. Acessar a Aplicação

1. Acesse: http://localhost:3000/login
2. Registre um usuário via API ou use credentials de seed

---

## 📁 Estrutura de Arquivos

```
kaven-boilerplate/
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── lib/                    # Bibliotecas compartilhadas
│   │   │   │   ├── prisma.ts          # Cliente Prisma
│   │   │   │   ├── jwt.ts             # Utilitários JWT
│   │   │   │   ├── bcrypt.ts          # Hash de senhas
│   │   │   │   ├── 2fa.ts             # TOTP + QR codes
│   │   │   │   └── validation.ts      # Schemas Zod
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── services/auth.service.ts
│   │   │   │   │   ├── controllers/auth.controller.ts
│   │   │   │   │   └── routes/auth.routes.ts
│   │   │   │   ├── users/
│   │   │   │   │   ├── services/user.service.ts
│   │   │   │   │   ├── controllers/user.controller.ts
│   │   │   │   │   └── routes/user.routes.ts
│   │   │   │   └── tenants/
│   │   │   │       ├── services/tenant.service.ts
│   │   │   │       ├── controllers/tenant.controller.ts
│   │   │   │       └── routes/tenant.routes.ts
│   │   │   └── server.ts              # Servidor Fastify
│   │   └── package.json
│   └── admin/
│       ├── app/
│       │   ├── login/
│       │   │   └── page.tsx           # Página de login
│       │   ├── dashboard/
│       │   │   └── page.tsx           # Dashboard
│       │   ├── layout.tsx
│       │   └── page.tsx
│       └── package.json
├── prisma/
│   ├── schema.prisma                  # Schema completo
│   └── migrations/
│       └── 20251220002433_mvp_complete_schema/
├── .agent/
│   ├── reports/                       # Relatórios de telemetria
│   ├── scripts/                       # Scripts de automação
│   └── workflows/                     # Workflows documentados
├── docker-compose.yml                 # PostgreSQL + Redis
├── package.json                       # Raiz do monorepo
├── turbo.json                         # Configuração Turborepo
└── pnpm-workspace.yaml               # Workspaces
```

---

## 📊 Próximos Passos

### Curto Prazo (1-2 semanas)

- [ ] **Middleware Camaleão:** Detecção automática de tenant
- [ ] **RBAC Middleware:** Controle de permissões
- [ ] **Payment System:** Integração Stripe + Pix
- [ ] **Frontend Auth Completo:** 9 páginas de autenticação
- [ ] **Testes Unitários:** 80%+ coverage

### Médio Prazo (3-4 semanas)

- [ ] **Frontend Dashboard Completo:** 27 páginas
- [ ] **Observability:** Prometheus + Grafana dashboards
- [ ] **CI/CD:** GitHub Actions pipeline
- [ ] **Testes E2E:** Playwright
- [ ] **Documentação API:** Swagger/OpenAPI

### Longo Prazo (Post-MVP)

- [ ] **CRM Module:** Leads, Deals, Contacts
- [ ] **Advanced Invoicing:** Templates, Recurring, Multi-currency
- [ ] **File Manager:** S3 integration
- [ ] **Real-time Chat:** WebSocket
- [ ] **Email System:** Internal mail
- [ ] **Referral Program:** Tracking, Rewards

---

## 📈 Estatísticas

### Código Implementado

- **Backend:** ~2.000 linhas TypeScript
- **Frontend:** ~300 linhas TypeScript/TSX
- **Database:** 11 modelos Prisma
- **Total:** 21+ arquivos criados

### Commits Realizados

1. `d7e0b56` - feat: módulo completo de autenticação
2. `99bd269` - feat: módulos users e tenants management
3. `521c8a8` - feat: frontend funcional
4. `[próximo]` - fix: corrige TypeScript errors

### Telemetria

- 3 workflows executados
- 3 relatórios gerados
- ~2 horas de desenvolvimento

---

## 🤝 Contribuindo

Para contribuir com o projeto:

1. Siga os [Conventional Commits](https://www.conventionalcommits.org/)
2. Mantenha coverage de testes acima de 80%
3. Execute linting: `pnpm lint`
4. Teste localmente antes de commitar

---

## 📝 Licença

MIT

---

**Última atualização:** 2025-12-19  
**Versão:** 0.3.0 (MVP Parcial)
