# Kaven Boilerplate - Arquitetura

## 📐 Visão Geral

Sistema SaaS multi-tenant completo com arquitetura modular e escalável.

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Auth Pages  │  │  Dashboard   │  │  Admin Panel │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY (Fastify)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Middlewares: Auth, RBAC, Tenant, Metrics, RLS      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Auth Module │    │ User Module  │    │Tenant Module │
└──────────────┘    └──────────────┘    └──────────────┘
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│Payment Module│    │Invoice Module│    │ Order Module │
└──────────────┘    └──────────────┘    └──────────────┘
        │
        ▼
┌──────────────┐
│ Audit Module │
└──────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │PostgreSQL│  │  Redis   │  │Prometheus│  │ Grafana  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Estrutura de Diretórios

```
kaven-boilerplate/
├── apps/
│   ├── api/                    # Backend API (Fastify)
│   │   ├── src/
│   │   │   ├── lib/           # Bibliotecas compartilhadas
│   │   │   │   ├── prisma.ts  # Prisma client + RLS
│   │   │   │   ├── jwt.ts     # JWT utils
│   │   │   │   ├── bcrypt.ts  # Password hashing
│   │   │   │   ├── 2fa.ts     # TOTP 2FA
│   │   │   │   ├── metrics.ts # Prometheus metrics
│   │   │   │   └── email.service.ts
│   │   │   ├── middleware/    # Middlewares globais
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── tenant.middleware.ts (Camaleão)
│   │   │   │   ├── rbac.middleware.ts
│   │   │   │   └── metrics.middleware.ts
│   │   │   ├── modules/       # Módulos de negócio
│   │   │   │   ├── auth/
│   │   │   │   │   ├── controllers/
│   │   │   │   │   ├── services/
│   │   │   │   │   └── routes/
│   │   │   │   ├── users/
│   │   │   │   ├── tenants/
│   │   │   │   ├── payments/
│   │   │   │   ├── invoices/
│   │   │   │   └── orders/
│   │   │   ├── routes/
│   │   │   │   └── health.routes.ts
│   │   │   └── server.ts      # Entry point
│   │   └── prisma/
│   │       └── schema.prisma  # Database schema
│   │
│   └── admin/                 # Frontend Admin (Next.js)
│       ├── app/
│       │   ├── (auth)/       # Auth pages
│       │   │   ├── login/
│       │   │   ├── register/
│       │   │   ├── forgot-password/
│       │   │   ├── reset-password/
│       │   │   ├── verify-email/
│       │   │   └── 2fa-setup/
│       │   └── (dashboard)/  # Dashboard pages
│       │       ├── users/
│       │       ├── tenants/
│       │       ├── invoices/
│       │       └── orders/
│       └── components/       # Shared components
│
├── prisma/
│   └── schema.prisma         # Shared Prisma schema
│
├── docker/
│   ├── docker-compose.yml    # Dev environment
│   └── Dockerfile.api        # Production build
│
└── docs/
    ├── API.md               # API documentation
    └── ARCHITECTURE.md      # This file
```

---

## 🔐 Camadas de Segurança

### 1. Autenticação (JWT)

```typescript
// JWT Payload
{
  userId: string,
  email: string,
  role: Role,
  tenantId?: string,
  iat: number,
  exp: number
}
```

- **Access Token:** 15 minutos (curto)
- **Refresh Token:** 7 dias (longo)
- **Rotation:** Refresh token é rotacionado a cada uso

### 2. RBAC (Role-Based Access Control)

```typescript
enum Role {
  SUPER_ADMIN, // Acesso total (todos os tenants)
  TENANT_ADMIN, // Acesso total ao seu tenant
  USER, // Acesso limitado (apenas seus dados)
}
```

**Hierarquia:**

```
SUPER_ADMIN > TENANT_ADMIN > USER
```

### 3. Prisma RLS (Row-Level Security)

Middleware que auto-injeta `tenantId` em queries:

```typescript
// Query original
prisma.user.findMany();

// Query com RLS aplicado
prisma.user.findMany({
  where: { tenantId: currentTenantId },
});
```

**Modelos protegidos:**

- User
- Subscription
- Invoice
- Order
- AuditLog

### 4. Rate Limiting

- **Global:** 100 req/min por IP
- **Auth endpoints:** 3-5 req/min
- **Redis:** Distribuído em produção

---

## 🦎 Middleware Camaleão (Multi-Tenant)

Detecção automática de tenant em 3 níveis:

### 1. Header (Prioridade Alta)

```http
X-Tenant-ID: uuid-do-tenant
```

### 2. Path (Prioridade Média)

```
/tenants/empresa-abc/api/users
         ^^^^^^^^^^^
         slug do tenant
```

### 3. Subdomain (Prioridade Baixa)

```
https://empresa-abc.app.com
        ^^^^^^^^^^^
        domain do tenant
```

**Fluxo:**

```typescript
Request → Camaleão Middleware → Detecta Tenant → Injeta tenantContext
                                                          ↓
                                                   Prisma RLS aplica filtro
```

---

## 💾 Database Schema

### Core Models

```prisma
model Tenant {
  id        String
  name      String
  slug      String @unique
  domain    String? @unique
  status    TenantStatus

  users         User[]
  subscriptions Subscription[]
  invoices      Invoice[]
  orders        Order[]
}

model User {
  id                String
  email             String @unique
  password          String
  name              String
  role              Role
  tenantId          String?
  twoFactorEnabled  Boolean
  twoFactorSecret   String?

  tenant        Tenant?
  refreshTokens RefreshToken[]
}
```

### Billing Models

```prisma
model Subscription {
  id                   String
  tenantId             String
  stripeCustomerId     String?
  stripeSubscriptionId String?
  status               SubscriptionStatus
  planName             String
  priceMonthly         Decimal

  tenant   Tenant
  invoices Invoice[]
}

model Invoice {
  id             String
  tenantId       String
  subscriptionId String?
  invoiceNumber  String @unique
  status         InvoiceStatus
  amountDue      Decimal
  amountPaid     Decimal
  dueDate        DateTime
  paidAt         DateTime?

  tenant       Tenant
  subscription Subscription?
  payments     Payment[]
}

model Order {
  id          String
  tenantId    String
  orderNumber String @unique
  status      OrderStatus
  totalAmount Decimal
  metadata    Json?

  tenant   Tenant
  payments Payment[]
}

model Payment {
  id            String
  invoiceId     String?
  orderId       String?
  amount        Decimal
  method        PaymentMethod
  status        PaymentStatus
  pixQrCode     String?
  pixQrCodeUrl  String?

  invoice Invoice?
  order   Order?
}
```

---

## 🔄 Fluxos Principais

### 1. Fluxo de Autenticação

```
┌──────┐                                    ┌──────┐
│Client│                                    │Server│
└──┬───┘                                    └──┬───┘
   │                                           │
   │  POST /api/auth/register                 │
   │─────────────────────────────────────────>│
   │                                           │
   │  201 Created + user data                 │
   │<─────────────────────────────────────────│
   │                                           │
   │  POST /api/auth/login                    │
   │─────────────────────────────────────────>│
   │                                           │
   │  200 OK + accessToken + refreshToken     │
   │<─────────────────────────────────────────│
   │                                           │
   │  GET /api/users/me                       │
   │  Header: Authorization: Bearer <token>   │
   │─────────────────────────────────────────>│
   │                                           │
   │  200 OK + user data                      │
   │<─────────────────────────────────────────│
```

### 2. Fluxo de Pagamento Pix

```
┌──────┐         ┌──────┐         ┌──────┐
│Client│         │Server│         │Gateway│
└──┬───┘         └──┬───┘         └──┬───┘
   │                │                │
   │ POST /pix/create                │
   │───────────────>│                │
   │                │                │
   │                │ Generate QR    │
   │                │───────────────>│
   │                │                │
   │                │ QR Code        │
   │                │<───────────────│
   │                │                │
   │ QR + pixCode   │                │
   │<───────────────│                │
   │                │                │
   │ [User pays]    │                │
   │                │                │
   │                │ Webhook        │
   │                │<───────────────│
   │                │                │
   │                │ Update Payment │
   │                │ Update Invoice │
   │                │                │
   │ GET /pix/:id/status             │
   │───────────────>│                │
   │                │                │
   │ status: COMPLETED               │
   │<───────────────│                │
```

### 3. Fluxo Multi-Tenant

```
Request: GET /api/users
Header: X-Tenant-ID: abc-123

         ↓
┌────────────────────┐
│ Tenant Middleware  │
│ (Camaleão)         │
└────────┬───────────┘
         │
         ├─> Detecta tenant via header
         │   tenantId = "abc-123"
         │
         ├─> Injeta em request.tenantContext
         │
         ↓
┌────────────────────┐
│ Auth Middleware    │
└────────┬───────────┘
         │
         ├─> Verifica JWT
         ├─> Extrai userId, role
         │
         ↓
┌────────────────────┐
│ RBAC Middleware    │
└────────┬───────────┘
         │
         ├─> Verifica permissões
         ├─> TENANT_ADMIN pode acessar
         │
         ↓
┌────────────────────┐
│ Controller         │
└────────┬───────────┘
         │
         ├─> userService.listUsers(tenantId)
         │
         ↓
┌────────────────────┐
│ Prisma RLS         │
└────────┬───────────┘
         │
         ├─> Auto-injeta WHERE tenantId = "abc-123"
         │
         ↓
┌────────────────────┐
│ Database           │
└────────────────────┘
```

---

## 📊 Observability

### Prometheus Metrics

**Métricas coletadas:**

- `http_request_duration_seconds` - Duração de requests
- `http_requests_total` - Total de requests
- `http_requests_active` - Requests ativos
- `http_request_size_bytes` - Tamanho de requests
- `http_response_size_bytes` - Tamanho de responses
- `auth_login_attempts_total` - Tentativas de login
- `database_query_duration_seconds` - Duração de queries

### Health Checks

- `/health` - Basic health check
- `/health/ready` - Readiness probe (verifica DB)
- `/health/live` - Liveness probe (verifica app)

### Grafana Dashboards

- **API Performance:** Latência, throughput, error rate
- **Database:** Query performance, connections
- **Auth:** Login attempts, 2FA usage
- **Business:** Subscriptions, invoices, orders

---

## 🚀 Deployment

### Docker Compose (Development)

```yaml
services:
  api:
    build: ./apps/api
    ports: ['8000:8000']
    depends_on: [postgres, redis]

  postgres:
    image: postgres:16
    volumes: [postgres_data:/var/lib/postgresql/data]

  redis:
    image: redis:7-alpine

  prometheus:
    image: prom/prometheus
    volumes: [./prometheus.yml:/etc/prometheus/prometheus.yml]

  grafana:
    image: grafana/grafana
    ports: ['3001:3000']
```

### Production (Kubernetes)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kaven-api
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: api
          image: kaven-api:latest
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: kaven-secrets
                  key: database-url
```

---

## 🔧 Tecnologias

### Backend

- **Runtime:** Node.js 20+
- **Framework:** Fastify
- **ORM:** Prisma
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **Auth:** JWT (jose)
- **2FA:** TOTP (speakeasy)
- **Payments:** Stripe SDK
- **Validation:** Zod
- **Logging:** Winston
- **Metrics:** prom-client

### Frontend

- **Framework:** Next.js 14 (App Router)
- **Internationalization**: [i18n Implementation](architecture/INTERNATIONALIZATION.md) using `next-intl`.
- **Styling**: TailwindCSS with CSS Variables for dynamic theming./ui
- **State:** Zustand (planned)
- **API Client:** TanStack Query (planned)
- **Forms:** React Hook Form + Zod (planned)

### Infrastructure

- **Container:** Docker
- **Orchestration:** Docker Compose / Kubernetes
- **Monitoring:** Prometheus + Grafana
- **CI/CD:** GitHub Actions (planned)

---

## 📈 Escalabilidade

### Horizontal Scaling

- **API:** Stateless, pode escalar horizontalmente
- **Rate Limiting:** Redis distribuído
- **Sessions:** JWT stateless (sem sessões no servidor)

### Vertical Scaling

- **Database:** PostgreSQL com read replicas
- **Cache:** Redis Cluster
- **Files:** S3-compatible storage

### Performance

- **Connection Pooling:** Prisma connection pool
- **Query Optimization:** Indexes, selective fields
- **Caching:** Redis para rate limiting e sessions
- **CDN:** Static assets via CDN (planned)

---

## 🔒 Segurança

### OWASP Top 10 Mitigations

1. **Injection:** Prisma ORM (prepared statements)
2. **Broken Auth:** JWT + 2FA + refresh token rotation
3. **Sensitive Data:** bcrypt password hashing
4. **XML External Entities:** N/A (JSON API)
5. **Broken Access Control:** RBAC + RLS
6. **Security Misconfiguration:** Environment variables
7. **XSS:** Input validation (Zod)
8. **Insecure Deserialization:** JSON only
9. **Components with Known Vulnerabilities:** Dependabot
10. **Insufficient Logging:** Winston + Audit logs

### Headers de Segurança

```typescript
// TODO: Implementar
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security
- X-XSS-Protection
```

---

## 📝 Próximos Passos

- [ ] Implementar testes (unit + integration + E2E)
- [ ] Completar frontend dashboard
- [ ] Adicionar CI/CD pipeline
- [ ] Implementar file upload (S3)
- [ ] Adicionar email templates
- [ ] Configurar security headers
- [ ] Deploy em staging/production
