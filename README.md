# Kaven Boilerplate - Multi-tenant SaaS Platform

**Versão:** 2.0.0  
**Data:** Janeiro 2026  
**Status:** ✅ Produção Ready

---

## 🚀 Visão Geral

Kaven v2.0 é um boilerplate modular projetado para escala. Com uma CLI dedicada e arquitetura de banco de dados flexível, permite criar SaaS multi-tenant robustos com sistema de planos, produtos, pagamentos PIX e observabilidade integrada.

### Principais Funcionalidades (v2.0)

- ✅ **Kaven CLI** - Gestão total do projeto via linha de comando
- ✅ **Split-Schema** - Evolução segura do banco de dados (Prisma)
- ✅ **Sistema Modular** - Adicione ou remova funcionalidades sob demanda
- ✅ **Multi-tenancy** - Isolamento completo de dados por tenant
- ✅ **Plans & Products** - Gestão flexível de monetização
- ✅ **PIX Payments** - Integração nativa com PagueBit
- ✅ **Feature Validation** - Controle de acesso a recursos por plano
- ✅ **Observability** - Monitoramento completo com Prometheus/Grafana

---

## 📊 Stack Tecnológica

### Ferramentas v2.0

- **CLI:** TypeScript + Inquirer + Commander
- **Database Engine:** Prisma Split-Schema Manager
- **Module Engine:** Automatic Feature Injection

### Frontend

- **Framework:** Next.js 16 (App Router + Turbopack)
- **UI:** shadcn/ui + Tailwind CSS v4
- **Design System:** 62 componentes documentados (Nextra 4)
- **Estado:** TanStack Query + Zustand
- **i18n:** next-intl

### Backend

- **Framework:** Express.js / Fastify
- **ORM:** Prisma
- **Banco de Dados:** PostgreSQL
- **Integrações:** PagueBit (PIX), BullMQ (Filas), Redis (Cache)

---

## 🏗️ Arquitetura e Módulos

O Kaven v2.0 separa o que é **infraestrutura essencial** do que são **features de negócio**.

### 🏛️ Core Platform (Incluso por padrão)

- **Auth & Security:** JWT, RBAC, Anti-IDOR.
- **Multi-tenancy:** Isolamento completo de dados.
- **Design System:** 62 componentes UI base (não removível).
- **Billing Engine:** Lógica de planos e entitlements.

### 📦 Módulos Opcionais (Diferenciais)

- **Payments:** Gateway PagueBit/Stripe.
- **AI Assistant:** Integração com LLMs.
- **Analytics:** Tracking avançado de eventos.

---

## 🏗️ Estrutura de Pastas

```
kaven-boilerplate/
├── apps/
│   ├── admin/          # Admin Dashboard (Next.js)
│   ├── api/            # REST API (Backend)
│   └── docs/           # Documentação do Design System (Nextra 4)
├── kaven-cli/          # Coração da v2.0 (CLI)
├── packages/
│   └── database/       # Prisma Split-Schema & Data Layer
└── kaven.config.json   # Manifesto do projeto
```

---

## 🚀 Início Rápido

### Instalação

```bash
# Clone e entre no projeto
git clone https://github.com/your-org/kaven-boilerplate.git
cd kaven-boilerplate

# Instale as dependências
pnpm install

# Build da CLI (necessário na primeira execução)
cd kaven-cli && pnpm run build && cd ..

# Configure o projeto
node kaven-cli/bin/kaven.js init
```

### Comandos Essenciais

```bash
# Gerar schema do banco (Merge Base + Extended)
node kaven-cli/bin/kaven.js db generate

# Listar módulos disponíveis
node kaven-cli/bin/kaven.js module list

# Iniciar ambiente de desenvolvimento
pnpm dev
```

### Acessos Padrão

- **Admin Dashboard:** http://localhost:3000
- **Tenant App:** http://localhost:3001
- **API Server:** http://localhost:8000
- **Documentação Técnica:** http://localhost:3002
- **Grafana (Observability):** http://localhost:3004

---

## 📦 Módulos Principais

### 1. Plans & Products System

Sistema completo de monetização com planos e produtos.

- `Plan` - Planos de assinatura (FREE, PRO, ENTERPRISE)
- `PlanFeature` - Features incluídas no plano
- `Product` - Produtos avulsos (add-ons)

### 2. Payment System (PagueBit)

Integração completa com PagueBit para pagamentos PIX com QR Code dinâmico e webhooks automáticos.

### 3. Feature Validation

Middleware e serviços para validação de limites por plano em runtime.

---

## 🔐 Segurança

- JWT com refresh tokens
- RBAC (Role-Based Access Control)
- Isolamento de Tenant (Multi-tenancy)
- Validação HMAC v2 para Webhooks

---

## 🧪 Testes

```bash
pnpm test           # Testes unitários
pnpm test:e2e       # Testes E2E (Playwright)
```

---

## 📄 Licença

MIT License - veja [LICENSE](./LICENSE) para detalhes.

---

**Desenvolvido com ❤️ pela equipe Kaven**
