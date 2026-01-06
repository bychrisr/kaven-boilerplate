# Kaven Boilerplate - Multi-tenant SaaS Platform

**Versão:** 1.0.0  
**Data:** Janeiro 2026  
**Status:** ✅ Produção Ready

---

## 🚀 Visão Geral

Kaven é um boilerplate completo para aplicações SaaS multi-tenant com sistema robusto de planos, produtos, pagamentos PIX e validação de features por plano.

### Principais Funcionalidades

- ✅ **Multi-tenancy** - Isolamento completo de dados por tenant
- ✅ **Plans & Products** - Sistema flexível de planos e produtos
- ✅ **PIX Payments** - Integração PagueBit com QR Code dinâmico
- ✅ **Feature Validation** - Validação de limites em runtime
- ✅ **Usage Tracking** - Rastreamento de uso de features
- ✅ **Admin Panel** - CRUD completo de planos, produtos e features
- ✅ **Tenant Experience** - Pricing page, checkout e payment flow
- ✅ **Internationalization** - Suporte EN/PT-BR

---

## 📊 Stack Tecnológica

### Frontend

- **Framework:** Next.js 14 (App Router + Turbopack)
- **UI:** shadcn/ui + Tailwind CSS v4
- **Design System:** 62 componentes documentados (Nextra 4)
- **State:** TanStack Query + React Context
- **Forms:** React Hook Form + Zod
- **i18n:** next-intl

### Backend

- **Runtime:** Node.js 20+
- **Framework:** Fastify
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Cache:** Redis
- **Auth:** JWT

### Payments

- **Provider:** PagueBit (PIX)
- **Features:** QR Code dinâmico, Webhook v2, Expiração 10min

---

## 🏗️ Arquitetura

```
kaven-boilerplate/
├── apps/
│   ├── admin/          # Frontend (Next.js)
│   │   ├── app/        # Pages (App Router)
│   │   ├── components/ # UI Components
│   │   └── hooks/      # Custom Hooks
│   ├── api/            # Backend (Fastify)
│   │   ├── src/
│   │   │   ├── modules/      # Feature modules
│   │   │   ├── middleware/   # Middlewares
│   │   │   └── lib/          # Utilities
│   │   └── prisma/     # Database schema
│   └── docs/           # Design System Documentation (Nextra 4)
│       ├── content/    # 62 component docs
│       └── components/ # Demo components
├── packages/           # Shared packages
└── docs/              # Technical documentation
```

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 20+
- PostgreSQL 14+
- Redis 7+
- pnpm 8+

### Instalação

```bash
# Clone o repositório
git clone https://github.com/your-org/kaven-boilerplate.git
cd kaven-boilerplate

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Setup do banco de dados
pnpm db:migrate
pnpm db:seed

# Iniciar desenvolvimento
pnpm dev
```

### Acessos Padrão

- **Admin:** http://localhost:3000
- **API:** http://localhost:4000
- **Docs (Design System):** http://localhost:3002

**Credenciais de teste:**

- Email: `admin@kaven.dev`
- Senha: `admin123`

---

## 📦 Módulos Principais

### 1. Plans & Products System

Sistema completo de monetização com planos e produtos.

**Models:**

- `Plan` - Planos de assinatura (FREE, PRO, ENTERPRISE)
- `Price` - Preços por intervalo (mensal, anual, etc)
- `PlanFeature` - Features incluídas no plano
- `Product` - Produtos avulsos (add-ons, consumíveis)
- `ProductEffect` - Efeitos que produtos aplicam

**Endpoints:**

```
GET    /api/plans              # Listar planos públicos
GET    /api/plans/:id          # Detalhes do plano
POST   /api/plans              # Criar plano (admin)
PUT    /api/plans/:id          # Atualizar plano (admin)
DELETE /api/plans/:id          # Deletar plano (admin)

GET    /api/products           # Listar produtos
POST   /api/products           # Criar produto (admin)
PUT    /api/products/:id       # Atualizar produto (admin)
DELETE /api/products/:id       # Deletar produto (admin)
```

### 2. Payment System (PagueBit)

Integração completa com PagueBit para pagamentos PIX.

**Features:**

- QR Code dinâmico
- Webhook v2 com HMAC validation
- Expiração automática (10 minutos)
- Retry logic para rate limiting
- Idempotência de eventos

**Endpoints:**

```
POST   /api/purchases          # Criar purchase + QR Code
GET    /api/purchases/:id      # Consultar status
POST   /api/webhooks/paguebit  # Webhook (PagueBit)
```

**Fluxo:**

1. Cliente cria purchase
2. Sistema gera QR Code PIX
3. Cliente paga via PIX
4. PagueBit envia webhook
5. Sistema valida HMAC
6. Sistema atualiza subscription
7. Features são ativadas

### 3. Feature Validation & Usage Tracking

Sistema de validação de limites por plano em runtime.

**Components:**

- `EntitlementService` - Validação de features
- `UsageTrackingService` - Rastreamento de uso
- `requireFeature` middleware - Proteção de rotas

**Exemplo de Uso:**

```typescript
// Proteger endpoint
fastify.post('/api/users', {
  preHandler: [
    authMiddleware,
    requireFeature('USERS', 1) // Valida quota de USERS
  ],
  handler: userController.create
});

// Resposta quando limite atingido (403)
{
  "error": "Feature not available",
  "message": "Limite de 25 users atingido",
  "currentUsage": 25,
  "limit": 25,
  "currentPlan": "FREE",
  "availableUpgrades": [...]
}
```

### 4. Admin Panel

Interface completa para gerenciamento de planos, produtos e features.

**Páginas:**

- `/plans` - CRUD de planos
- `/products` - CRUD de produtos
- `/features` - CRUD de features
- `/subscriptions` - Visualização de assinaturas

**Features:**

- Formulários com validação Zod
- TanStack Query para cache
- Feedback visual (toasts)
- Internacionalização

### 5. Tenant Experience

Experiência completa de compra para o tenant.

**Páginas:**

- `/pricing` - Visualização de planos
- `/checkout` - Checkout com proration
- Payment Modal - QR Code PIX com timer

**Features:**

- Toggle mensal/anual
- Cálculo automático de proration
- Timer de expiração (10 min)
- Polling de status (5s)
- Estados: pending, approved, expired, failed

---

## 🔐 Segurança

### Autenticação

- JWT com refresh tokens
- HttpOnly cookies
- CSRF protection

### Autorização

- RBAC (Role-Based Access Control)
- Tenant isolation
- Resource ownership validation

### Payments

- HMAC v2 validation (webhooks)
- Idempotência de eventos
- Retry logic com backoff

### API

- Rate limiting (300 req/min)
- CORS configurado
- Input validation (Zod)
- SQL injection protection (Prisma)

---

## 📈 Performance

### Otimizações

- TanStack Query cache (5 min)
- Redis cache para sessions
- Database indexes otimizados
- Next.js Image optimization

### Métricas Alvo

- API Response: < 200ms (p95)
- Page Load: < 2s
- Database Queries: < 100ms
- Uptime: > 99.9%

---

## 🧪 Testes

### Estrutura

```
tests/
├── e2e/              # Testes E2E (Playwright)
├── integration/      # Testes de integração
└── unit/             # Testes unitários (Jest)
```

### Comandos

```bash
pnpm test           # Testes unitários
pnpm test:e2e       # Testes E2E
pnpm test:coverage  # Cobertura
```

### Cobertura Alvo

- Unit: > 70%
- Integration: > 50%
- E2E: Fluxos críticos 100%

---

## 🚀 Deploy

### Staging

```bash
# Build
pnpm build

# Migrations
pnpm db:migrate:deploy

# Start
pnpm start
```

### Produção

**Variáveis de Ambiente Obrigatórias:**

```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
PAGUEBIT_API_TOKEN=...
PAGUEBIT_WEBHOOK_SECRET=...
```

**Checklist:**

- [ ] HTTPS configurado
- [ ] Environment variables em vault
- [ ] Migrations aplicadas
- [ ] Seeds executados (opcional)
- [ ] Monitoring configurado
- [ ] Logs centralizados
- [ ] Backups automáticos

---

## 📚 Documentação

### Documentação Técnica

- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Testing Guide](./docs/TESTING.md)
- [Contributing](./CONTRIBUTING.md)

### Design System Documentation

**🎨 Documentação Completa do Design System** - 62 componentes documentados com qualidade Bootstrap-level!

Acesse a documentação interativa em: **http://localhost:3002** (modo dev)

**Conteúdo:**

- **🎨 Foundation (5 páginas)**
  - Colors - Sistema completo de cores com oklch/hex + dark mode
  - Typography - Hierarquia tipográfica com DM Sans e Barlow
  - Spacing - Sistema de espaçamento baseado em múltiplos de 4px
  - Shadows - Níveis de elevação e sombras
  - Borders - Border radius e estilos

- **🧩 Components (57 componentes em 6 categorias)**
  - 📝 **Forms (18):** Button, Input, TextField, Textarea, Select, Autocomplete, Checkbox, Radio, Switch, Date Picker, Time Picker, Slider, Rating, Label, Form, Icon Button, Button Group, Toggle Button
  - 💬 **Feedback (9):** Alert, Alert Dialog, Dialog, Drawer, Snackbar, Skeleton, Progress, Tooltip, Popover
  - 📊 **Data Display (10):** Stat Card, Data Table, Table, Card, Paper, Badge, Chip, Avatar, List, Divider
  - 🧭 **Navigation (9):** Navbar, App Bar, Breadcrumbs, Tabs, Pagination, Dropdown Menu, Mega Menu, Bottom Navigation, Link
  - 🔄 **Interaction (2):** Accordion, Stepper
  - ⚡ **Specialized (8):** Timeline, Tree View, Transfer List, FAB, Speed Dial, Image List, Masonry, Backdrop

**Cada componente inclui:**

- ✅ Exemplos de código funcionais
- ✅ Variações e casos de uso
- ✅ API completa com props
- ✅ Relacionamentos entre componentes
- ✅ Acessibilidade e melhores práticas

**Comandos:**

```bash
# Iniciar documentação em modo dev
pnpm --filter docs dev

# Build da documentação
pnpm --filter docs build

# Preview do build
pnpm --filter docs start
```

---

## 🗺️ Roadmap

### Próximas Features

- [ ] Plan Gate component (bloqueio visual)
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Invoice generation
- [ ] Refund flow
- [ ] Subscription pause/resume
- [ ] Proration customizável
- [ ] Multi-currency support

### Integrações Futuras

- [ ] Stripe (cartão de crédito)
- [ ] Mercado Pago
- [ ] Email providers (SendGrid, Resend)
- [ ] SMS notifications (Twilio)

---

## 📄 Licença

MIT License - veja [LICENSE](./LICENSE) para detalhes.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja [CONTRIBUTING.md](./CONTRIBUTING.md) para guidelines.

---

## 📞 Suporte

- **Email:** support@kaven.dev
- **Docs:** https://docs.kaven.dev
- **Issues:** https://github.com/your-org/kaven-boilerplate/issues

---

**Desenvolvido com ❤️ pela equipe Kaven**
