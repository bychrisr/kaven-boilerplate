# Kaven Boilerplate

> Base SaaS Multi-Tenant Enterprise-Grade

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Fastify](https://img.shields.io/badge/Fastify-4-green)](https://www.fastify.io/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)](https://www.prisma.io/)

---

## 🚀 Quick Start

```bash
# Instalar dependências
pnpm install

# Iniciar Docker (PostgreSQL + Redis)
docker-compose up -d

# Rodar migrações
npx prisma migrate dev

# Iniciar backend
cd apps/api && pnpm dev

# Iniciar frontend (em outro terminal)
cd apps/admin && pnpm dev
```

✅ **Backend:** http://localhost:8000  
✅ **Frontend:** http://localhost:3000

---

## 📋 Features Implementadas

### Backend (21 endpoints REST)

- ✅ **Autenticação completa:** Register, Login, 2FA TOTP, Password Reset
- ✅ **User Management:** CRUD com paginação
- ✅ **Tenant Management:** CRUD multi-tenant
- ✅ **Segurança:** JWT + Refresh Tokens, bcrypt, Zod validation

### Frontend

- ✅ **Login funcional** com integração API
- ✅ **Dashboard** com auth guard
- ✅ **UI responsiva** com Tailwind CSS

### Database

- ✅ **11 modelos Prisma:** Users, Tenants, Subscriptions, Invoices, Orders, etc.
- ✅ **6 enums** para status e roles
- ✅ **Migrações** aplicadas e versionadas

---

## 🏗️ Arquitetura

```
Turborepo Monorepo
├── Backend: Fastify 4 + TypeScript
├── Frontend: Next.js 14 (App Router)
├── Database: PostgreSQL 16 + Prisma 5
└── Cache: Redis 7
```

**Multi-Tenant "Camaleão":** Suporta single ou multi-tenant via configuração.

---

## 📚 Documentação

- [**Guia de Implementação**](docs/IMPLEMENTATION.md) - Arquitetura e detalhes técnicos
- [**Plano de Implementação**](https://github.com/.../implementation_plan.md) - Roadmap completo
- [**API Specification**](Phase%200%20-%20FOUNDATION/7.%20API%20SPECIFICATION.md) - Todos os endpoints
- [**Database Specification**](Phase%200%20-%20FOUNDATION/9.%20DATABASE%20SPECIFICATION.md) - Schema completo

---

## 🔐 Segurança

- **JWT** com access tokens (15min) + refresh tokens (7 dias) (Standard `sub` claim)
- **Password Hardening** com validação de força e hash seguro
- **2FA TOTP** com QR codes + backup codes
- **Zod** para validação de inputs e Environment Variables
- **Security Middlewares:** Rate Limiting (Redis), CSRF Protection, IDOR Prevention
- **Secure Logger** com redação de dados sensíveis
- **Input Sanitization** contra XSS e Injection
- **CORS** e **Helmet** configurados
- **Soft deletes** para auditoria

---

## 🧪 Testes

```bash
# Unit tests (TODO)
pnpm test

# E2E tests (TODO)
pnpm test:e2e

# Coverage (TODO)
pnpm test:coverage
```

**Target:** 80%+ coverage

---

## 📊 Stack Tecnológica

### Backend

- Node.js 20 LTS
- Fastify 4
- Prisma 5
- TypeScript 5.3
- jose (JWT)
- bcrypt
- speakeasy (2FA)
- Zod

### Frontend

- Next.js 14
- React 18
- TypeScript 5.3
- Tailwind CSS
- (TODO: shadcn/ui, TanStack Query, Zustand)

### DevOps

- Docker + Docker Compose
- Turborepo
- (TODO: GitHub Actions CI/CD)

---

## 🗂️ Estrutura do Projeto

```
kaven-boilerplate/
├── apps/
│   ├── api/          # Backend Fastify
│   └── admin/        # Frontend Next.js
├── packages/         # Código compartilhado
├── prisma/           # Database schema
├── docs/             # Documentação
├── .agent/           # Scripts de automação
└── docker-compose.yml
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'feat: adiciona nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Abra um Pull Request

**Convenção de Commits:** [Conventional Commits](https://www.conventionalcommits.org/)

---

## 📈 Roadmap

- [x] Setup inicial + Database
- [x] Autenticação completa + 2FA
- [x] User/Tenant Management
- [x] Frontend básico
- [ ] Payment System (Stripe + Pix)
- [ ] Observability (Prometheus + Grafana)
- [ ] Frontend completo (36 páginas)
- [ ] Testes (unit + integration + E2E)
- [ ] CI/CD pipeline
- [ ] Módulos Post-MVP (CRM, Files, Chat, etc.)

---

## 📝 Licença

MIT © 2025

---

## 🔗 Links Úteis

- [Documentação Phase 0](Phase%200%20-%20FOUNDATION/)
- [Telemetria e Relatórios](.agent/reports/)
- [Workflows](.agent/workflows/)

---

**Status:** 🟡 MVP Parcial (30% completo)  
**Versão:** 0.3.0  
**Última atualização:** 2025-12-19
