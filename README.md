# Kaven Boilerplate - Plataforma SaaS Multi-tenant Completa

**Versão:** 2.1.0 (CLI V2 + Security Core)
**Data:** Janeiro 2026
**Status:** ✅ Produção Ready

---

## 🚀 Visão Geral

**Kaven v2.0** é uma plataforma completa para construção de aplicações SaaS multi-tenant de nível empresarial. Mais do que um simples boilerplate, é um **ecossistema completo** com funcionalidades prontas para monetização, gerenciamento de usuários, observabilidade avançada e experiência de usuário premium.

### 🎯 O Que Você Pode Construir

Com o Kaven, você pode lançar rapidamente:

- **SaaS B2B** com múltiplos clientes isolados
- **Plataformas de Gestão** com controle granular de permissões
- **Aplicações Enterprise** com observabilidade completa
- **Marketplaces** com sistema de pagamentos integrado
- **Ferramentas Internas** com autenticação robusta

---

## ✨ Funcionalidades Principais

### 🏢 **Multi-tenancy Completo**

Sistema robusto de isolamento de dados por organização (tenant):

- **Friendly URLs**: Acesso via slugs legíveis (`/tenants/acme-corp`)
- **Smart Lookup**: API aceita UUID ou Slug transparentemente
- **Isolamento Total**: Dados segregados por `tenantId` em todas as camadas
- **Gestão de Membros**: Adicione/remova usuários em tenants específicos
- **Spaces**: Segmentação adicional dentro de cada tenant (Departamentos, Projetos)

**Casos de Uso**: Cada cliente tem sua própria área isolada, como Slack, Notion ou Asana.

---

### 💰 **Sistema de Monetização (Plans & Products)**

Monetize sua aplicação com sistema completo de planos e produtos:

#### Planos de Assinatura

- **Planos Flexíveis**: FREE, PRO, ENTERPRISE (totalmente configuráveis)
- **Features por Plano**: Controle granular de funcionalidades (USERS, STORAGE, API_CALLS)
- **Limites Configuráveis**: Quotas numéricas ou features boolean
- **Billing Intervals**: Mensal, Anual, Lifetime
- **Trial Periods**: Períodos de teste configuráveis
- **Badges**: "Popular", "Best Value" para destacar planos

#### Produtos Avulsos (Add-ons)

- **One-Time Purchases**: Compras únicas
- **Consumables**: Créditos, pacotes de uso
- **Add-ons Recorrentes**: Recursos extras mensais
- **Product Effects**: Adicione, multiplique ou habilite features

#### Validação em Runtime

- **Middleware Automático**: Valida limites antes de executar ações
- **Mensagens Contextuais**: Sugere upgrades quando limite atingido
- **Usage Tracking**: Rastreamento automático de uso com reset mensal
- **Upgrade Flow**: Fluxo completo de upgrade/downgrade com proration

**Exemplo Prático**:

```typescript
// Protege endpoint automaticamente
fastify.post('/api/users', {
  preHandler: [authMiddleware, requireFeature('USERS', 1)],
  handler: userController.create,
});

// Se limite atingido, retorna 403 com sugestão de upgrade
```

---

### 💳 **Pagamentos PIX (PagueBit)**

Integração nativa com gateway brasileiro:

- **QR Code Dinâmico**: Geração automática de QR Code para pagamento
- **Webhooks Automáticos**: Confirmação em tempo real via HMAC v2
- **Polling Frontend**: Detecção automática de pagamento aprovado
- **Expiração Configurável**: QR Codes com tempo de validade
- **Proration Automática**: Cálculo de valores proporcionais em upgrades
- **Status Tracking**: pending, approved, expired, failed, cancelled

**Fluxo Completo**:

1. Usuário seleciona plano PRO
2. Sistema gera QR Code PIX
3. Usuário paga via app bancário
4. Webhook confirma pagamento
5. Subscription é atualizada automaticamente
6. Features são ativadas instantaneamente

---

### 💱 **Sistema de Moedas & Câmbio**

Gerenciamento dinâmico de moedas fiduciárias e criptoativos:

- **SVG Nativo**: Suporte a ícones SVG vetoriais com redimensionamento automático
- **Real-time Conversion**: Cotações ao vivo via CoinGecko (cacheado)
- **Multi-currency**: Suporte a BRL, USD, EUR, BTC, SATS e mais
- **Admin Management**: Interface visual para adicionar/editar moedas

**Destaque**: O sistema lida automaticamente com a complexidade de Satoshis (sem decimais) vs Fiat (2 decimais).

---

### 🔐 **Autenticação & Segurança Enterprise**

Sistema completo de autenticação e controle de acesso:

#### Autenticação

- **JWT com Refresh Tokens**: Tokens de curta duração + renovação automática
- **Password Recovery**: Fluxo completo de recuperação de senha
- **Email Verification**: Verificação de email com tokens temporários
- **Setup Wizard**: Assistente de configuração inicial em 4 etapas
- **Welcome Emails**: Templates HTML responsivos com gradientes

#### RBAC (Role-Based Access Control)

- **3 Níveis de Roles**: SUPER_ADMIN, TENANT_ADMIN, USER
- **Hierarquia de Permissões**: Cada role herda permissões inferiores
- **Resource Ownership**: Usuários só acessam seus próprios dados
- **Tenant Access Control**: Validação automática de acesso por tenant

#### Spaces & Permissions (Granular)

- **Spaces Configuráveis**: Departamentos, projetos ou áreas funcionais
- **Multi-Space Users**: Usuários podem pertencer a múltiplos spaces
- **Custom Permissions**: Permissões específicas por usuário/space
- **Permission Override**: Personalize permissões sem afetar o space original
- **Invite Spaces**: Defina acesso a spaces já no convite

**Exemplo de Spaces**: Finance, Marketing, DevOps, Support - cada um com suas próprias permissões.

#### 🛡️ **Segurança Avançada (Enterprise 2.0)**

Novas capacidades de segurança e compliance adicionadas na v2.1:

- **Data Masking Engine**: PII (Dados Pessoais) mascarados automaticamente na UI/API baseados em políticas.
  - _Exemplo_: `***-***-123-**` (CPF).
  - _Audit_: Solicitações de "Unmask" geram logs auditáveis.
- **Impersonation Auditada**: Admins acessam como usuários para suporte ("Log in as...").
  - _Contexto_: Banner visual persistente durante a sessão.
  - _Safety_: Logs imutáveis de cada ação realizada enquanto impersonado.
- **Security Requests**: Workflow de aprovação para ações sensíveis (Exportação de dados, Mudança de Role).

---

### 📊 **Observability Stack Enterprise-Grade**

Sistema completo de monitoramento e diagnóstico:

#### Backend (19 Endpoints)

- **9 Observability Endpoints**: Stats, Hardware, Infrastructure, External APIs, Alerts
- **10 Diagnostics Endpoints**: Health, Memory, Performance, Monitoring, Connectivity

#### Métricas Coletadas (36+)

- **Golden Signals**: Latency (p50/p95/p99), Traffic, Errors, Saturation
- **Hardware**: CPU, Memory, Disk, Network, Temperature, Swap
- **Node.js**: Event Loop Lag, Heap Memory, Active Handles/Requests
- **Infrastructure**: PostgreSQL, Redis (status, latency, connections)
- **External APIs**: Stripe, Google Maps, PagBit (success rate, circuit breaker)
- **Protection**: Cache hit/miss rate, Rate limit violations
- **Business**: Custom metrics específicas do negócio

#### Frontend (7 Tabs Interativas)

1. **Metrics**: Golden Signals + Node.js metrics
2. **Hardware**: CPU, Memory, Disk, Network em tempo real
3. **Infrastructure**: Status de Database e Cache
4. **External APIs**: Monitoramento de integrações
5. **Alerts**: Alertas ativos + Thresholds configuráveis
6. **Protection**: Cache e Rate Limit analytics
7. **Diagnostics**: Monitoring sessions + Connectivity tests

#### Integrações

- **Prometheus**: 36+ métricas exportadas
- **Grafana**: 4 dashboards pré-configurados
- **Sentry**: Error tracking e performance monitoring
- **Circuit Breaker**: Proteção contra falhas em cascata

**Benefício**: Visibilidade total da saúde da aplicação, detecção proativa de problemas.

---

### 📋 **Gerenciamento de Projetos & Tasks**

Sistema completo de gestão de trabalho:

#### Projects

- **CRUD Completo**: Criar, editar, listar, deletar projetos
- **Status Tracking**: ACTIVE, ARCHIVED, COMPLETED, ON_HOLD, IN_PROGRESS
- **Space Segmentation**: Projetos podem pertencer a Spaces
- **Color Coding**: Cores customizáveis para organização visual
- **Tenant Isolation**: Projetos isolados por tenant

#### Tasks

- **Status Workflow**: TODO → IN_PROGRESS → IN_REVIEW → DONE
- **Prioridades**: LOW, MEDIUM, HIGH, URGENT
- **Assignees**: Atribuição de tasks a usuários específicos
- **Due Dates**: Prazos configuráveis
- **Inline Updates**: Atualização de status direto na tabela

#### Frontend Polido

- **Loading Skeletons**: Estados de carregamento elegantes
- **Error Boundaries**: Tratamento robusto de erros
- **Empty States**: Mensagens amigáveis quando não há dados
- **Real-time Updates**: React Query com invalidação automática

**Seed de Dados**: 5 projetos + 15 tasks de exemplo para demonstração.

---

### 📧 **Sistema de Email Transacional**

Envio automatizado de emails com templates premium:

#### Emails Implementados

- **Welcome Email**: Enviado após registro
- **Email Verification**: Link de verificação (expira em 24h)
- **Password Reset**: Link de recuperação (expira em 1h)
- **Invoice Notification**: Detalhes de faturas geradas

#### Templates

- **Design Responsivo**: Mobile-first com inline CSS
- **Gradientes Modernos**: Visual premium com cores vibrantes
- **CTAs Destacados**: Botões de ação com hover effects
- **Footer com Branding**: Identidade visual consistente

#### Configuração

- **SMTP Flexível**: Gmail, SendGrid ou qualquer provedor
- **Modo Desenvolvimento**: Logs no console sem envio real
- **Queue System**: BullMQ para envios assíncronos (planejado)

---

### 🛠️ **Kaven CLI V2.1 - Arquitetura IoC**

Nova geração da CLI construída com **InversifyJS** e arquitetura segura:

#### Arquitetura & Segurança

- **Hybrid Auth System**: OAuth2 Device Flow (Github-style) + License Keys Offline.
- **Passport Gating**: Validação local de direitos (`Allow = Authorized + Entitled`).
- **Secure Marketplace**: Instalação de módulos com verificação de assinatura **Ed25519** e Checksum SHA256.
- **Smart Caching**: Offloading inteligente de cache para otimização de disco.
- **License Keys**: Suporte a chaves de licença manuais (`--key`) para CI/CD ou installs offline.

#### Comandos Principais

- `kaven auth login`: Autenticação segura via navegador
- `kaven marketplace list`: Catálogo de módulos verificados
- `kaven marketplace install <slug>`: Instalação segura com validação
- `kaven marketplace install <slug> --key <KEY>`: Instalação com chave privada
- `kaven db generate`: Merge de schemas (Base + Extended)

#### Split-Schema Database

- **Schema Base**: Core do Kaven (não editável)
- **Schema Extended**: Suas customizações
- **Merge Automático**: CLI combina os dois sem conflitos
- **Evolução Segura**: Atualize o boilerplate sem perder suas alterações

**Benefício**: Atualize o Kaven sem quebrar suas customizações.

---

### 🎨 **Design System Completo**

62 componentes UI documentados e prontos para uso:

#### Componentes Base

- **Forms**: TextField, Select, Checkbox, Radio, Switch, DatePicker
- **Feedback**: Alert, Toast, Dialog, Drawer, Tooltip
- **Data Display**: Table, Card, Badge, Avatar, Chip
- **Navigation**: Menu, Tabs, Breadcrumb, Stepper
- **Layout**: Container, Grid, Stack, Divider

#### Recursos Avançados

- **Glassmorphism**: Efeitos de vidro fosco em dark mode
- **Live Preview**: Componentes interativos na documentação
- **Responsive**: Mobile-first design
- **Acessibilidade**: ARIA labels e keyboard navigation
- **Temas**: Light/Dark mode automático
- **CRUD Pattern**: Padrão unificado para páginas de edição com Tabs e Save Global

#### Documentação

- **Nextra 4**: Site de documentação com busca
- **Code Examples**: Exemplos de código copiáveis
- **Props Tables**: Documentação completa de props
- **Visual Examples**: Demonstrações interativas

---

### 🌍 **Sistema de Timezones Multi-idioma**

Gerenciamento inteligente de fusos horários:

- **Auto-detecção**: Detecta timezone do navegador automaticamente
- **Multi-idioma**: Labels em PT-BR e EN-US
- **22 Timezones**: Principais zonas IANA (America/Sao_Paulo, Europe/Paris, etc)
- **Horário de Verão**: Suporte automático via zonas IANA
- **Agrupamento Visual**: Timezones organizados por continente
- **Cache Inteligente**: React Query cacheia por idioma
- **Live Reload**: Atualização automática ao trocar idioma

**Benefício**: Aplicação funciona corretamente em qualquer região do mundo.

---

### 🖼️ **Upload de Avatar com Otimização**

Sistema completo de upload de imagens de perfil:

#### Processamento Automático

- **Conversão WebP**: Reduz tamanho em 70-85%
- **Redimensionamento**: 400x400px automático
- **Crop Circular**: Interface de crop com zoom
- **Preview em Tempo Real**: Visualização antes de salvar

#### Features

- **Drag & Drop**: Upload por arrastar ou clicar
- **Validação**: Tipos permitidos (JPEG, PNG, GIF, WebP) e tamanho máximo (3MB)
- **Fallback Inteligente**: Iniciais do usuário quando sem avatar
- **Exibição Universal**: Avatar aparece em header, listas, perfis

**Tecnologias**: Sharp (processamento), React Easy Crop (interface)

---

### 🎨 **White-Label & Customização**

Sistema completo de branding para sua marca:

#### Configurações de Branding

- **Logo Customizável**: Upload de logo da empresa
- **Favicon Dinâmico**: Ícone personalizado no navegador
- **Cores Primárias**: Paleta de cores configurável
- **Nome da Empresa**: Branding em toda aplicação
- **SEO Customizado**: Meta tags e Open Graph configuráveis

#### Live Reload

- **Atualização Instantânea**: Mudanças aplicadas sem reload
- **React Query Polling**: Sincronização automática a cada 5s
- **Cache Invalidation**: Atualização imediata após salvar
- **Multi-usuário**: Todos os usuários veem mudanças em tempo real

**Casos de Uso**: White-label para revenda, branding corporativo.

---

### 🔔 **Sistema de Notificações**

Notificações em tempo real para usuários:

- **In-App Notifications**: Notificações dentro da aplicação
- **Email Notifications**: Envio automático de emails
- **Push Notifications**: Suporte a web push (planejado)
- **Notification Center**: Central de notificações com filtros
- **Read/Unread Tracking**: Controle de leitura
- **Priority Levels**: Notificações urgentes, normais, informativas

---

### 📈 **Audit Logs**

Rastreamento completo de ações no sistema:

- **Action Tracking**: Registro de todas as ações importantes
- **User Attribution**: Quem fez o quê e quando
- **IP Tracking**: Endereço IP de origem
- **Metadata**: Dados adicionais contextuais
- **Filtros Avançados**: Por usuário, ação, data, tenant
- **Exportação**: CSV/JSON para análise externa

**Casos de Uso**: Compliance, debugging, análise de comportamento.

---

### 🌐 **Internacionalização (i18n)**

Suporte completo a múltiplos idiomas:

- **next-intl**: Biblioteca robusta de i18n
- **170+ Traduções**: PT-BR e EN-US completos
- **Namespaces**: Organização por contexto
- **Pluralization**: Suporte a plurais
- **Date/Number Formatting**: Formatação por locale
- **Dynamic Loading**: Carregamento sob demanda

---

### 🔄 **User Invites**

Sistema de convites para novos usuários:

- **Email Invites**: Convites via email com token
- **Role Assignment**: Defina role no convite
- **Space Assignment**: Atribua spaces automaticamente
- **Expiration**: Tokens com validade configurável
- **Resend**: Reenvio de convites expirados
- **Acceptance Flow**: Fluxo completo de aceitação

---

### 🤝 **Community & Gamification (Dual Marketplace)**

Estratégia de engajamento e troca de valor (Novo na v2.1):

- **Marketplace de Código**: Módulos verificados para expandir a plataforma.
- **Marketplace de Reputação**: Sistema de XP e Badges integrado ao Discord.
  - **Rewards**: Descontos vitalícios para Top Contributors.
  - **Levels**: De Novice a Legend, desbloqueando acesso a betas e canais exclusivos.
  - **Integration**: Webhooks do Github conectam PRs a recompensas de XP.

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
- **i18n:** next-intl (PT-BR + EN-US)
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts

### Backend

- **Framework:** Fastify (alta performance)
- **ORM:** Prisma (type-safe)
- **Banco de Dados:** PostgreSQL 15+
- **Cache:** Redis
- **Queue:** BullMQ
- **Email:** Nodemailer
- **Monitoring:** Prometheus + Grafana
- **Error Tracking:** Sentry
- **Integrações:** PagueBit (PIX), Stripe (Cards)

---

## 🏗️ Arquitetura

### Estrutura de Pastas

```
kaven-boilerplate/
├── apps/
│   ├── admin/          # Admin Dashboard (Next.js)
│   │   ├── app/        # App Router (Next.js 16)
│   │   ├── components/ # Componentes React
│   │   ├── lib/        # Utilitários e services
│   │   └── messages/   # Traduções i18n
│   ├── tenant/         # Tenant App (Next.js)
│   │   └── app/        # Aplicação do tenant
│   ├── api/            # REST API (Fastify)
│   │   ├── src/
│   │   │   ├── modules/    # Módulos de negócio
│   │   │   ├── middleware/ # Auth, RBAC, Tenant
│   │   │   └── lib/        # Services compartilhados
│   └── docs/           # Documentação (Nextra 4)
│       └── content/    # Conteúdo MDX
├── kaven-cli/          # CLI (TypeScript)
│   ├── src/
│   │   ├── commands/   # Comandos da CLI
│   │   └── utils/      # Helpers
├── packages/
│   └── database/       # Prisma Split-Schema
│       ├── prisma/
│       │   ├── schema.base.prisma     # Core (não editar)
│       │   ├── schema.extended.prisma # Suas customizações
│       │   └── schema.prisma          # Gerado pela CLI
└── kaven.config.json   # Configuração do projeto
```

### Separação de Responsabilidades

- **Admin App**: Gerenciamento de tenants, usuários, planos, observability
- **Tenant App**: Aplicação do cliente final (projetos, tasks, etc)
- **API**: Backend unificado para ambos os apps
- **Docs**: Documentação técnica do Design System

---

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js**: v20 LTS ou superior
- **pnpm**: v9.15.4 ou superior
- **PostgreSQL**: 15+ (ou Docker)
- **Redis**: 7+ (opcional, para cache)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/your-org/kaven-boilerplate.git
cd kaven-boilerplate

# 2. Instale as dependências
pnpm install

# 3. Build da CLI (necessário na primeira execução)
cd kaven-cli && pnpm run build && cd ..

# 4. Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações

# 5. Inicie infraestrutura (Docker)
pnpm docker:up

# 6. Gere o schema do banco
node kaven-cli/bin/kaven.js db generate

# 7. Execute migrations
pnpm db:migrate

# 8. Seed de dados iniciais
pnpm db:seed

# 9. Inicie ambiente de desenvolvimento
pnpm dev
```

### Acessos Padrão

| Aplicação                   | URL                   | Credenciais Padrão         |
| :-------------------------- | :-------------------- | :------------------------- |
| **Admin Dashboard**         | http://localhost:3000 | admin@kaven.com / admin123 |
| **Tenant App**              | http://localhost:3001 | user@tenant.com / user123  |
| **API Server**              | http://localhost:8000 | -                          |
| **Documentação**            | http://localhost:3002 | -                          |
| **Grafana (Observability)** | http://localhost:3004 | admin / admin              |

---

## 🎯 Casos de Uso Reais

### 1. **SaaS de Gestão de Projetos**

- Multi-tenancy para múltiplos clientes
- Planos FREE, PRO, ENTERPRISE com limites de projetos/usuários
- Pagamentos PIX para mercado brasileiro
- Observability para monitorar performance

### 2. **Plataforma de E-learning**

- Tenants = Escolas/Instituições
- Spaces = Turmas/Departamentos
- Products = Cursos avulsos
- Feature Validation = Limite de alunos por plano

### 3. **Sistema de Help Desk**

- Multi-tenancy para empresas clientes
- RBAC para Support, Admin, User
- Audit Logs para compliance
- Email Service para notificações

### 4. **Marketplace B2B**

- Tenants = Fornecedores
- Products = Itens do catálogo
- Payment System = Comissões
- Observability = Monitoramento de vendas

---

## 📦 Comandos Úteis

### Desenvolvimento

```bash
pnpm dev              # Inicia todos os apps em modo dev
pnpm dev:admin        # Apenas Admin Dashboard
pnpm dev:tenant       # Apenas Tenant App
pnpm dev:api          # Apenas API Server
pnpm dev:docs         # Apenas Documentação
```

### Banco de Dados

```bash
node kaven-cli/bin/kaven.js db generate  # Gera schema final
pnpm db:migrate                          # Executa migrations
pnpm db:seed                             # Seed de dados
pnpm db:studio                           # Abre Prisma Studio
pnpm db:reset                            # Reset completo
```

### Build & Deploy

```bash
pnpm build            # Build de todos os apps
pnpm start            # Inicia em modo produção
pnpm test             # Testes unitários
pnpm test:e2e         # Testes E2E (Playwright)
```

### Kaven CLI

```bash
node kaven-cli/bin/kaven.js init           # Inicializa projeto
node kaven-cli/bin/kaven.js module list    # Lista módulos
node kaven-cli/bin/kaven.js module add payments  # Adiciona módulo
```

---

## 🔐 Segurança

### Implementações de Segurança

- ✅ **JWT com Refresh Tokens**: Tokens de curta duração
- ✅ **Password Hashing**: bcrypt com salt rounds
- ✅ **RBAC**: Controle de acesso baseado em roles
- ✅ **Tenant Isolation**: Dados segregados por tenant
- ✅ **HMAC Validation**: Webhooks com validação criptográfica
- ✅ **Rate Limiting**: Proteção contra DDoS
- ✅ **CORS**: Configuração adequada de origens
- ✅ **SQL Injection**: Proteção via Prisma ORM
- ✅ **XSS Protection**: Sanitização de inputs
- ✅ **CSRF Tokens**: Proteção contra CSRF

### Boas Práticas

- Variáveis sensíveis em `.env` (nunca commitadas)
- Secrets rotacionados regularmente
- Audit logs de ações críticas
- 2FA para Super Admins (planejado)

---

## 🧪 Testes

### Cobertura de Testes

- **Testes Unitários**: Services, utils, helpers
- **Testes de Integração**: APIs, controllers
- **Testes E2E**: Fluxos completos com Playwright

### Executar Testes

```bash
# Testes unitários
pnpm test

# Testes E2E
pnpm test:e2e

# Testes com coverage
pnpm test:coverage

# Testes em modo watch
pnpm test:watch
```

---

## 📚 Documentação

### Documentação Disponível

- **[Design System](http://localhost:3002/design-system)**: 62 componentes UI
- **[Platform Docs](http://localhost:3002/platform)**: Arquitetura e guias
- **[API Reference](http://localhost:8000/api/docs)**: Swagger/OpenAPI
- **[Changelog](./CHANGELOG.md)**: Histórico de versões

### Guias Principais

- [Kaven CLI](/apps/docs/content/platform/cli.mdx)
- [Split-Schema Database](/apps/docs/content/platform/database.mdx)
- [Plans & Products](/apps/docs/content/platform/plans-and-products.mdx)
- [Observability Stack](/apps/docs/content/platform/observability.mdx)
- [RBAC Middleware](/apps/docs/content/platform/features/RBAC_MIDDLEWARE.mdx)
- [Spaces & Permissions](/apps/docs/content/platform/features/spaces-and-permissions.mdx)

---

## 🚢 Deploy em Produção

### Checklist de Deploy

1. ✅ Configurar variáveis de ambiente de produção
2. ✅ Configurar banco de dados PostgreSQL
3. ✅ Configurar Redis (cache)
4. ✅ Configurar SMTP (emails)
5. ✅ Configurar Sentry (error tracking)
6. ✅ Configurar domínio e SSL
7. ✅ Executar migrations
8. ✅ Build de produção
9. ✅ Configurar monitoramento (Grafana)
10. ✅ Configurar backups automáticos

### Plataformas Recomendadas

- **Vercel**: Frontend (Admin + Tenant)
- **Railway/Render**: Backend API
- **Supabase/Neon**: PostgreSQL gerenciado
- **Upstash**: Redis gerenciado
- **Cloudflare**: CDN e proteção DDoS

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja [CONTRIBUTING.md](./CONTRIBUTING.md) para detalhes.

### Como Contribuir

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'feat: add amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

---

## 📄 Licença

MIT License - veja [LICENSE](./LICENSE) para detalhes.

---

## 🙏 Agradecimentos

- **shadcn/ui**: Design System base
- **Prisma**: ORM type-safe
- **Next.js**: Framework React
- **Fastify**: Framework backend
- **Comunidade Open Source**: Por todas as bibliotecas incríveis

---

## 📞 Suporte

- **Documentação**: [http://localhost:3002](http://localhost:3002)
- **Issues**: [GitHub Issues](https://github.com/your-org/kaven-boilerplate/issues)
- **Discord**: [Comunidade Kaven](https://discord.gg/kaven)
- **Email**: support@kaven.com

---

**Desenvolvido com ❤️ pela equipe Kaven**

> **Kaven v2.0** - Transformando ideias em SaaS de nível empresarial desde 2026.
