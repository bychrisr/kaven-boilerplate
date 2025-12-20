# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
