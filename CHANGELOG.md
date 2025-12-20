# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
