# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-06

### ✨ Adicionado

#### Design System Documentation (62 componentes)

**Documentação completa do Design System** com qualidade Bootstrap-level usando Nextra 4.

**Foundation (5 páginas):**

- Colors - Sistema completo com oklch/hex + dark mode
- Typography - Hierarquia com DM Sans e Barlow
- Spacing - Sistema baseado em múltiplos de 4px
- Shadows - Níveis de elevação
- Borders - Border radius e estilos

**Components (57 componentes em 6 categorias):**

1. **Forms (18 componentes):**
   - Button, Icon Button, Button Group, Toggle Button
   - Input, TextField, Textarea
   - Select, Autocomplete
   - Checkbox, Radio, Switch
   - Date Picker, Time Picker
   - Slider, Rating
   - Label, Form

2. **Feedback (9 componentes):**
   - Alert, Alert Dialog
   - Dialog, Drawer
   - Snackbar, Skeleton, Progress
   - Tooltip, Popover

3. **Data Display (10 componentes):**
   - Stat Card, Data Table, Table
   - Card, Paper
   - Badge, Chip, Avatar
   - List, Divider

4. **Navigation (9 componentes):**
   - Navbar, App Bar
   - Breadcrumbs, Tabs, Pagination
   - Dropdown Menu, Mega Menu
   - Bottom Navigation, Link

5. **Interaction (2 componentes):**
   - Accordion, Stepper

6. **Specialized (8 componentes):**
   - Timeline, Tree View, Transfer List
   - FAB, Speed Dial
   - Image List, Masonry
   - Backdrop

**Cada componente inclui:**

- ✅ Exemplos de código funcionais
- ✅ Variações e casos de uso
- ✅ API completa com props
- ✅ Relacionamentos entre componentes
- ✅ Acessibilidade e melhores práticas

**Infraestrutura:**

- Nextra 4 com Tailwind CSS v4
- Sidebar organizado com categorias
- 129 páginas geradas
- Build otimizado para produção

### 🔧 Melhorado

- README.md atualizado com seção de Design System
- Arquitetura do projeto documentada
- Stack tecnológica atualizada (Tailwind CSS v4, Nextra 4)

### 📊 Estatísticas

- **62 componentes** documentados
- **129 páginas** geradas
- **57 arquivos .mdx** criados
- **3 \_meta.js** configurados
- **Build time:** ~4 minutos

### 🎯 Commits

1. Documentação completa de 26 componentes críticos
2. Documentação de 31 componentes médios/baixos
3. Correção de sidebar e estrutura Nextra
4. Atualização de README e CHANGELOG

---

## [0.6.0] - 2025-12-19

### ✨ Adicionado

#### Backend Completion (6 features principais)

**1. Middleware Camaleão (Tenant Detection)**

- Detecção automática de tenant via 3 métodos:
  - Header `X-Tenant-ID`
  - Subdomain (ex: `empresa.app.com`)
  - Path (ex: `/tenants/empresa/api/users`)
- Suporte a modo single-tenant e multi-tenant
- Middleware global aplicado a todas requests
- Documentação completa em `docs/TENANT_MIDDLEWARE.md`

**2. RBAC Middleware (Role-Based Access Control)**

- Hierarquia de roles: SUPER_ADMIN > TENANT_ADMIN > USER
- 6 middlewares de autorização:
  - `authMiddleware` - Verificação JWT
  - `requireRole()` - Requer roles específicas
  - `requireSuperAdmin` - Apenas super admin
  - `requireTenantAdmin` - Admin ou superior
  - `requireResourceOwnership()` - Verifica ownership
  - `requireTenantAccess` - Verifica acesso ao tenant
- 11 endpoints protegidos (6 users + 5 tenants)
- 4 helpers de verificação
- Documentação completa em `docs/RBAC_MIDDLEWARE.md`

**3. Email Service**

- Nodemailer com suporte a SMTP e SendGrid
- 4 templates HTML responsivos:
  - Welcome email (enviado no register)
  - Email verification
  - Password reset (enviado no forgot-password)
  - Invoice notification
- Modo desenvolvimento (sem SMTP configurado)
- Integração com auth endpoints
- Documentação completa em `docs/EMAIL_SERVICE.md`

**4. File Upload Service**

- Upload de arquivos com @fastify/multipart
- Validação de tipo (imagens, PDF, docs)
- Validação de tamanho (max 10MB)
- Storage local em `/uploads`
- Soft delete de arquivos
- 4 endpoints REST:
  - POST `/api/files/upload`
  - GET `/api/files` (paginado)
  - GET `/api/files/:id`
  - DELETE `/api/files/:id`
- Modelo File no Prisma com relações

**5. Rate Limiting**

- @fastify/rate-limit com Redis support
- Rate limiting global: 100 req/min
- Rate limiting específico por endpoint:
  - Login: 5 req/min
  - Register: 3 req/min
  - Forgot password: 3 req/min
- Key generator personalizado (user ID ou IP)
- Error builder em português
- Whitelist para localhost

**6. Swagger Documentation**

- OpenAPI 3.0 spec completa
- Swagger UI em `/docs`
- 30+ endpoints documentados
- 6 tags organizadas
- Bearer JWT authentication scheme
- UI interativa com try-it-out

### 📊 Estatísticas

- **11 arquivos criados** (1.800+ linhas)
- **10 arquivos modificados**
- **6 commits** incrementais
- **30+ endpoints** REST
- **4 documentações** completas
- **1 migração** Prisma (modelo File)

### 🔧 Dependências Adicionadas

- `nodemailer@7.0.11`
- `@types/nodemailer`
- `@fastify/rate-limit@10.3.0`
- `@fastify/multipart@9.3.0`
- `@fastify/swagger@9.6.1`
- `@fastify/swagger-ui@5.2.3`

### 🎯 Commits

1. `869ed36` - feat: implementa middleware Camaleão
2. `28ee927` - feat: implementa RBAC middleware
3. `f90b296` - feat: implementa email service
4. `684b54c` - feat: implementa rate limiting
5. `72e3d54` - feat: implementa file upload service
6. `5254e7f` - feat: adiciona documentação Swagger

---

## [0.5.0] - 2025-12-19

### ✨ Adicionado

#### Observability Stack Completo

- **Prometheus** (:9090) para coleta de métricas
  - Scrape interval: 10s
  - Retenção: 15 dias
  - Auto-discovery do backend via `host.docker.internal`
- **Grafana** (:3001) para visualização
  - Login: admin/admin
  - Dashboard Kaven API pré-configurado
  - Datasource Prometheus integrado
  - Auto-refresh a cada 5s

#### Métricas Implementadas (10+)

**HTTP Metrics:**

- `http_requests_total` - Total de requests (counter)
- `http_request_duration_seconds` - Duração de requests (histogram)
- `http_requests_active` - Requests ativos (gauge)
- `http_request_size_bytes` - Tamanho de requests (histogram)
- `http_response_size_bytes` - Tamanho de responses (histogram)

**Custom Metrics:**

- `auth_login_attempts_total` - Tentativas de login (counter)
- `database_query_duration_seconds` - Duração de queries (histogram)

**System Metrics (Node.js defaults):**

- `process_cpu_user_seconds_total` - CPU user
- `process_cpu_system_seconds_total` - CPU system
- `process_resident_memory_bytes` - Memória RSS
- `nodejs_heap_size_used_bytes` - Heap usado
- `nodejs_heap_size_total_bytes` - Heap total
- `process_open_fds` - File descriptors abertos

#### Health Checks Avançados (4 endpoints)

- `GET /health` - Basic health check (uptime)
- `GET /health/ready` - Readiness probe (verifica PostgreSQL)
- `GET /health/live` - Liveness probe (memory, PID, Node version)
- `GET /metrics` - Prometheus metrics endpoint

#### Dashboard Grafana (5 painéis)

1. **Request Rate** - req/s por método e rota
2. **Response Time** - p95 e p50 (percentis)
3. **Active Requests** - Requests sendo processados
4. **Memory Usage** - RSS e Heap usado
5. **Error Rate** - 4xx e 5xx por tempo

### 🔧 Infraestrutura

- Docker Compose: +Prometheus +Grafana
- Volumes persistentes para dados de métricas
- Network bridge automático entre containers

### 📊 Middleware

- Metrics middleware global (tracking automático de todas requests)
- Labels: method, route, status_code
- Histograms com buckets otimizados

### 📈 Documentação

- Guia de observability
- Screenshots Prometheus e Grafana
- Queries Prometheus exemplo
- Dashboard JSON versionado

### 🎯 Commits

1. `b24230f` - feat: implementa observability
2. `df89241` - feat: adiciona dashboard Grafana

---

## [0.4.0] - 2025-12-19

### ✨ Adicionado

#### Payment System (Stripe)

- **Stripe Service expandido** com 9 métodos:
  - `getOrCreateCustomer()` - Criar ou buscar customer
  - `createSubscription()` - Criar subscription com plano
  - `cancelSubscription()` - Cancelar subscription
  - `updatePaymentMethod()` - Atualizar método de pagamento
  - `listPaymentMethods()` - Listar métodos do customer
  - `handleWebhook()` - Processar webhooks do Stripe
  - 4 event handlers privados (invoice succeeded/failed, subscription updated/deleted)
- **Payment Controller** com 5 endpoints:
  - POST `/api/payments/subscription` - Criar subscription
  - DELETE `/api/payments/subscription/:id` - Cancelar
  - PUT `/api/payments/payment-method` - Atualizar método
  - GET `/api/payments/payment-methods/:id` - Listar métodos
  - POST `/api/webhooks/stripe` - Webhook handler
- **Integração automática** com Prisma:
  - Cria/atualiza subscriptions no banco
  - Cria invoices automaticamente quando pagamento sucede
  - Sincroniza status de subscriptions via webhooks
- **Raw body support** para verificação de signature do Stripe

### 🔧 Melhorado

- Server Fastify agora registra rotas de `/api/payments` e `/api/webhooks`
- Validação Zod em todos os endpoints de pagamento

### 📊 Estatísticas

- **Total de endpoints:** 26 (21 anteriores + 5 payments)
- **Services:** 5 módulos (auth, users, tenants, payments, subscriptions)
- **Webhooks:** 1 endpoint, 4 event types tratados

### 🎯 Commits

1. `6788488` - feat: sistema completo de pagamentos Stripe

---

## [0.3.0] - 2025-12-19

### ✨ Adicionado

#### Backend

- Sistema completo de autenticação com 10 endpoints REST
  - Register, Login com JWT + Refresh Tokens
  - 2FA TOTP com QR codes e backup codes
  - Forgot/Reset password
  - Email verification
- User Management com 6 endpoints CRUD (paginação incluída)
- Tenant Management com 5 endpoints CRUD (paginação incluída)
- Bibliotecas compartilhadas:
  - Cliente Prisma singleton
  - Utilitários JWT (jose)
  - Hash bcrypt (cost 12)
  - Validação Zod para todos inputs
  - Sistema 2FA (speakeasy + qrcode)
- Servidor Fastify configurado com CORS

#### Frontend

- Página de login funcional integrada com API
- Dashboard com proteção de rota e info do usuário
- UI responsiva com Tailwind CSS

#### Database

- Schema Prisma completo com 11 modelos:
  - Tenant, User, RefreshToken, AuditLog
  - Subscription, Invoice, Order, Payment
- 6 enums para status e roles
- Migração `20251220002433_mvp_complete_schema` aplicada
- Suporte a soft deletes
- Indexes para performance

#### Infraestrutura

- Docker Compose com PostgreSQL 16, Redis 7 e pgAdmin
- Monorepo Turborepo configurado
- Sistema de telemetria automatizado (3 workflows)
- Scripts de automação em `.agent/scripts/`

#### Documentação

- `docs/IMPLEMENTATION.md` com arquitetura completa
- README.md atualizado com quick start
- 3 relatórios de telemetria gerados
- Documentação inline em todos os services

### 🔧 Corrigido

- Erros TypeScript no dashboard (tipo `any` removido)
- Warning de cascading renders no useEffect
- Lint errors relacionados a setState

### 🔐 Segurança

- JWT com tokens de curta duração (15min access, 7d refresh)
- bcrypt para hash de senhas (cost factor 12)
- 2FA TOTP implementado corretamente
- Validação Zod em todos os endpoints
- CORS configurado adequadamente
- Refresh tokens revogáveis armazenados no banco

### 📊 Estatísticas

- **21 endpoints REST** funcionais
- **11 modelos** Prisma
- **2 páginas** frontend
- **21+ arquivos** criados
- **~2.000 linhas** de código TypeScript backend
- **~300 linhas** de código TypeScript frontend

### 🎯 Commits

1. `d7e0b56` - feat: módulo completo de autenticação com 10 endpoints + 2FA
2. `99bd269` - feat: módulos users e tenants management
3. `521c8a8` - feat: frontend funcional com login e dashboard
4. `d2c5db4` - fix: corrige erros TypeScript no dashboard
5. `ed41f1c` - docs: adiciona documentação consolidada completa
6. `[atual]` - fix: refatora dashboard para evitar setState em useEffect

---

## [0.2.0] - 2025-12-19

### ✨ Adicionado

- Estrutura básica do monorepo
- Configuração Turborepo
- Docker Compose inicial
- Prisma schema básico (Tenant, User)
- Workflows 01-05 documentados

---

## [0.1.0] - 2025-12-19

### ✨ Adicionado

- Documentação Phase 0 - FOUNDATION completa
- Plano de implementação de 8 fases
- Especificações de API, UI e Database
- Roadmap completo do projeto

---

## Próximas Versões Planejadas

### [0.4.0] - Payment System

- Integração Stripe completa
- Integração Pix (Brasil)
- Webhooks de pagamento
- Gerenciamento de subscriptions

### [0.5.0] - Observability

- Prometheus + Grafana
- Structured logging (Winston)
- Health checks avançados
- Dashboards de métricas

### [0.6.0] - Frontend Completo

- 34 páginas restantes
- Componentes shadcn/ui
- TanStack Query
- Zustand state management

### [1.0.0] - MVP Completo

- Todos os 44 endpoints implementados
- Todas as 36 páginas frontend
- Testes completos (unit + integration + E2E)
- CI/CD pipeline
- Documentação API (Swagger)
- Deployment em produção

---

**Legenda:**

- ✨ **Adicionado** para novas funcionalidades
- 🔧 **Corrigido** para correções de bugs
- 🔐 **Segurança** para vulnerabilidades corrigidas
- 📝 **Documentação** para mudanças na documentação
- 🗑️ **Removido** para funcionalidades removidas
- ⚡ **Performance** para melhorias de performance
