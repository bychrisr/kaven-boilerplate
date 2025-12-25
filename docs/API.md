# Kaven Boilerplate - API Documentation

## 📋 Visão Geral

API REST completa para SaaS multi-tenant construída com:

- **Framework:** Fastify
- **Database:** PostgreSQL + Prisma ORM
- **Cache:** Redis
- **Auth:** JWT + 2FA (TOTP)
- **Payments:** Stripe + Pix
- **Observability:** Prometheus + Grafana

**Base URL:** `http://localhost:8000`

**Documentação Interativa:** `http://localhost:8000/docs` (Swagger UI)

---

## 🔐 Autenticação

Todos os endpoints protegidos requerem header:

```
Authorization: Bearer <access_token>
```

### Endpoints de Auth (12)

#### POST /api/auth/register

Registra novo usuário.

**Body:**

```json
{
  "email": "user@example.com",
  "password": "senha123",
  "name": "João Silva",
  "tenantSlug": "empresa1" // Opcional (multi-tenant)
}
```

**Response:** `201 Created`

```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "João Silva",
    "role": "USER"
  }
}
```

#### POST /api/auth/login

Realiza login e retorna tokens.

**Body:**

```json
{
  "email": "user@example.com",
  "password": "senha123",
  "twoFactorCode": "123456" // Opcional (se 2FA habilitado)
}
```

**Response:** `200 OK`

```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "uuid",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "João Silva",
    "role": "USER"
  }
}
```

#### POST /api/auth/refresh

Renova access token usando refresh token.

**Body:**

```json
{
  "refreshToken": "uuid"
}
```

#### POST /api/auth/logout

Invalida refresh token.

#### POST /api/auth/verify-email

Verifica email do usuário.

**Body:**

```json
{
  "token": "verification-token"
}
```

#### POST /api/auth/resend-verification

Reenvia email de verificação.

**Body:**

```json
{
  "email": "user@example.com"
}
```

#### POST /api/auth/forgot-password

Envia email de recuperação de senha.

**Body:**

```json
{
  "email": "user@example.com"
}
```

#### POST /api/auth/reset-password

Reseta senha usando token.

**Body:**

```json
{
  "token": "reset-token",
  "password": "novaSenha123"
}
```

#### POST /api/auth/2fa/setup

Configura 2FA (TOTP).

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCodeUrl": "data:image/png;base64,...",
  "backupCodes": ["12345678", "87654321", ...]
}
```

#### POST /api/auth/2fa/verify

Verifica código 2FA e habilita definitivamente.

**Body:**

```json
{
  "code": "123456"
}
```

#### POST /api/auth/2fa/disable

Desabilita 2FA.

**Body:**

```json
{
  "code": "123456"
}
```

---

## 👥 User Management (6 endpoints)

### GET /api/users

Lista usuários com paginação.

**Query Params:**

- `page` (default: 1) - Número da página
- `limit` (default: 10) - Itens por página
- `tenantId` (opcional) - Filtrar por tenant específico
- `search` (opcional) - Busca case-insensitive em **name** ou **email**
- `status` (opcional) - Filtrar por status: `ACTIVE`, `PENDING`, `BANNED`, `REJECTED`

**Auth:** TENANT_ADMIN ou SUPER_ADMIN

**Exemplos:**

```bash
# Listar todos os usuários
GET /api/users?page=1&limit=10

# Buscar por nome ou email
GET /api/users?search=joão

# Filtrar por status
GET /api/users?status=ACTIVE

# Combinar filtros
GET /api/users?search=silva&status=PENDING&page=1
```

**Response:**

```json
{
  "users": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### GET /api/users/me

Retorna usuário autenticado.

### GET /api/users/:id

Busca usuário por ID.

**Auth:** Owner ou TENANT_ADMIN

### POST /api/users

Cria novo usuário.

**Auth:** TENANT_ADMIN

**Body:**

```json
{
  "email": "user@example.com",
  "password": "senha123",
  "name": "João Silva",
  "role": "USER",
  "tenantId": "uuid" // Opcional
}
```

### PUT /api/users/:id

Atualiza usuário.

**Auth:** Owner ou TENANT_ADMIN

### DELETE /api/users/:id

Deleta usuário (soft delete).

**Auth:** TENANT_ADMIN

---

## 🏢 Tenant Management (5 endpoints)

### GET /api/tenants

Lista tenants.

**Auth:** SUPER_ADMIN

### GET /api/tenants/:id

Busca tenant por ID.

### POST /api/tenants

Cria novo tenant.

**Auth:** SUPER_ADMIN

**Body:**

```json
{
  "name": "Empresa ABC",
  "slug": "empresa-abc",
  "domain": "empresa-abc.app.com" // Opcional
}
```

### PUT /api/tenants/:id

Atualiza tenant.

**Auth:** SUPER_ADMIN

### DELETE /api/tenants/:id

Deleta tenant (soft delete).

**Auth:** SUPER_ADMIN

---

## 💳 Payments (7 endpoints)

### Stripe

#### POST /api/payments/subscription

Cria subscription no Stripe.

**Body:**

```json
{
  "tenantId": "uuid",
  "email": "user@example.com",
  "name": "João Silva",
  "priceId": "price_1234" // Stripe Price ID
}
```

#### DELETE /api/payments/subscription/:id

Cancela subscription.

#### PUT /api/payments/payment-method

Atualiza método de pagamento.

**Body:**

```json
{
  "subscriptionId": "uuid",
  "paymentMethodId": "pm_1234" // Stripe Payment Method ID
}
```

#### GET /api/payments/payment-methods/:subscriptionId

Lista métodos de pagamento.

### Pix

#### POST /api/payments/pix/create

Cria pagamento Pix.

**Body:**

```json
{
  "tenantId": "uuid",
  "amount": 100.0,
  "description": "Pagamento de assinatura",
  "invoiceId": "uuid", // Opcional
  "orderId": "uuid" // Opcional
}
```

**Response:**

```json
{
  "id": "uuid",
  "pixCode": "00020126580014br.gov.bcb.pix...",
  "qrCodeUrl": "data:image/png;base64,...",
  "amount": 100.0,
  "expiresAt": "2025-12-21T14:00:00Z",
  "status": "PENDING"
}
```

#### GET /api/payments/pix/:id/status

Verifica status do pagamento Pix.

### Webhooks

#### POST /api/webhooks/stripe

Webhook do Stripe (eventos de pagamento).

**Headers:** `stripe-signature`

#### POST /api/webhooks/pix

Webhook de notificações Pix.

**Body:**

```json
{
  "paymentId": "uuid",
  "status": "COMPLETED",
  "transactionId": "txn_123"
}
```

---

## 📄 Invoices (5 endpoints)

### GET /api/invoices

Lista invoices.

**Query Params:** `page`, `limit`, `tenantId`

**Auth:** TENANT_ADMIN

### GET /api/invoices/:id

Busca invoice por ID.

### POST /api/invoices

Cria nova invoice.

**Body:**

```json
{
  "tenantId": "uuid",
  "subscriptionId": "uuid", // Opcional
  "amountDue": 100.0,
  "currency": "BRL",
  "dueDate": "2025-12-31T23:59:59Z",
  "metadata": {} // Opcional
}
```

### PUT /api/invoices/:id

Atualiza invoice.

**Body:**

```json
{
  "status": "PAID",
  "amountPaid": 100.0,
  "paidAt": "2025-12-21T12:00:00Z"
}
```

**Status válidos:** `DRAFT`, `PENDING`, `PAID`, `OVERDUE`, `CANCELED`

### POST /api/invoices/:id/send

Envia invoice por email.

---

## 📦 Orders (3 endpoints)

### GET /api/orders

Lista orders.

**Query Params:** `page`, `limit`, `tenantId`

### GET /api/orders/:id

Busca order por ID.

### PUT /api/orders/:id/status

Atualiza status da order.

**Body:**

```json
{
  "status": "COMPLETED"
}
```

**Status válidos:** `PENDING`, `PROCESSING`, `COMPLETED`, `CANCELED`, `REFUNDED`

---

---

## 👁️ Observability & Audit (2 endpoints)

### GET /api/observability/stats

Retorna métricas de sistema em tempo real (CPU, Memória, Requests).

**Auth:** SUPER_ADMIN

**Response:**

```json
{
  "uptime": 3600,
  "system": {
    "memory": {
      "rss": 12345678,
      "heapTotal": 23456789,
      "heapUsed": 12345678
    },
    "cpu": {
      "user": 12345,
      "system": 6789
    }
  },
  "http": {
    "totalRequests": 1500,
    "requestsPerSecond": 25.5,
    "errorRequests": 5,
    "errorRate": 0.003
  }
}
```

### GET /api/audit-logs

Lista logs de auditoria do sistema.

**Query Params:**

- `page` (default: 1)
- `limit` (default: 10)
- `tenantId` (opcional, para SUPER_ADMIN filtrar)
- `entityType` (opcional: 'User', 'Auth', 'Invoice', etc.)
- `action` (opcional: 'create', 'update', 'delete', 'login')
- `startDate` / `endDate` (ISO 8601)

**Auth:** SUPER_ADMIN ou TENANT_ADMIN (vê apenas do próprio tenant)

**Response:**

```json
{
  "logs": [
    {
      "id": "uuid",
      "createdAt": "2025-12-21T10:00:00Z",
      "actor": {
        "id": "uuid",
        "email": "admin@kaven.com",
        "name": "Admin User"
      },
      "action": "user.create",
      "entity": "User",
      "entityId": "uuid-criado",
      "metadata": {
        "role": "USER",
        "email": "newuser@example.com"
      },
      "ipAddress": "127.0.0.1",
      "userAgent": "Mozilla/5.0..."
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

## 🏥 Health & Metrics (4 endpoints)

### GET /health

Health check básico.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-12-21T12:00:00Z",
  "uptime": 3600
}
```

### GET /health/ready

Readiness probe (verifica dependências).

**Response:**

```json
{
  "status": "ready",
  "checks": {
    "database": true
  }
}
```

### GET /health/live

Liveness probe (verifica se app está vivo).

### GET /metrics

Métricas Prometheus.

**Response:** Formato Prometheus

---

## 🔒 RBAC (Role-Based Access Control)

### Roles

- **SUPER_ADMIN:** Acesso total (todos os tenants)
- **TENANT_ADMIN:** Acesso total ao seu tenant
- **USER:** Acesso limitado (apenas seus dados)

### Middlewares

- `authMiddleware`: Verifica JWT
- `requireSuperAdmin`: Requer SUPER_ADMIN
- `requireTenantAdmin`: Requer TENANT_ADMIN ou superior
- `requireResourceOwnership`: Verifica ownership do recurso

---

## 🦎 Middleware Camaleão (Multi-Tenant)

Detecção automática de tenant via:

1. **Header:** `X-Tenant-ID: uuid`
2. **Path:** `/tenants/:slug/...`
3. **Subdomain:** `empresa1.app.com`

### Prisma RLS (Row-Level Security)

Auto-injeta `tenantId` em queries para modelos:

- User
- Subscription
- Invoice
- Order
- AuditLog

---

## 📊 Rate Limiting

**Global:** 100 requests/min por IP

**Endpoints específicos:**

- `/api/auth/register`: 3 req/min
- `/api/auth/login`: 5 req/min
- `/api/auth/forgot-password`: 3 req/min
- `/api/auth/resend-verification`: 3 req/min

**Redis:** Rate limiting distribuído em produção

---

## 🔧 Configuração

### Variáveis de Ambiente

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/kaven

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Multi-Tenant
MULTI_TENANT_MODE=true
DEFAULT_TENANT_ID=uuid

# Frontend
FRONTEND_URL=http://localhost:3000
```

---

## 📝 Exemplos de Uso

### Fluxo Completo de Autenticação

```bash
# 1. Registrar
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"senha123","name":"João"}'

# 2. Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"senha123"}'

# 3. Usar access token
curl http://localhost:8000/api/users/me \
  -H "Authorization: Bearer eyJhbGc..."
```

### Criar Pagamento Pix

```bash
curl -X POST http://localhost:8000/api/payments/pix/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "tenantId":"uuid",
    "amount":100.00,
    "description":"Pagamento teste"
  }'
```

---

## 🚀 Total de Endpoints

- **Auth:** 12 endpoints
- **Users:** 6 endpoints
- **Tenants:** 5 endpoints
- **Payments:** 7 endpoints (Stripe + Pix + Webhooks)
- **Invoices:** 5 endpoints
- **Orders:** 3 endpoints
- **Observability:** 2 endpoints
- **Health:** 4 endpoints

**Total:** 44 endpoints REST + Swagger docs
