# Kaven Boilerplate

> **Status**: 🚧 Em Desenvolvimento  
> **Versão**: 1.0.0  
> **Última Atualização**: 2025-01-09  
> **Responsável**: Equipe Kaven  

## 🎯 Visão Geral

O **Kaven Boilerplate** é um painel administrativo multi-tenant plug-and-play, seguro, observável e pronto para novos SaaS. Baseado em Node.js + Fastify + TypeScript (backend) e React + Material-UI + Vite (frontend), com PostgreSQL + Prisma para persistência e observabilidade completa.

## 🛠️ Stack Tecnológica

### Backend
- **Node.js 20+** com **Fastify 4.x**
- **TypeScript** para tipagem estática
- **Prisma ORM** com **PostgreSQL 15+**
- **JWT** para autenticação com refresh tokens
- **Redis** para cache e rate limiting
- **BullMQ** para workers assíncronos
- **Prometheus** + **Grafana** para observabilidade

### Frontend
- **React 18** + **Vite 5.x**
- **Material-UI** (MUI) para componentes
- **TanStack Query** para gerenciamento de estado assíncrono
- **Zustand** para estado global
- **TypeScript** para tipagem

### Infraestrutura
- **Docker** + **Docker Compose** para desenvolvimento
- **PostgreSQL** com Row-Level Security (RLS)
- **Redis** para cache e filas
- **Prometheus** para métricas
- **Grafana** para dashboards

## 🚀 Quick Start

### Pré-requisitos
- Node.js 20+
- Docker e Docker Compose
- Git

### Setup Local

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd kaven-boilerplate
   ```

2. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Edite .env com suas configurações
   ```

3. **Inicie os serviços de infraestrutura**
   ```bash
   docker-compose up -d postgres redis
   ```

4. **Configure o banco de dados**
   ```bash
   cd prisma
   npx prisma db push
   npx prisma db seed
   ```

5. **Inicie o backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

6. **Inicie o frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

7. **Acesse a aplicação**
   - Frontend: http://localhost:3039
   - Backend API: http://localhost:3010
   - Grafana: http://localhost:3000
   - Prometheus: http://localhost:9090

## 📁 Estrutura do Projeto

```
kaven-boilerplate/
├── backend/                    # Backend Node.js + Fastify + TypeScript
│   ├── src/
│   │   ├── controllers/        # Controllers da API
│   │   ├── routes/            # Definição de rotas
│   │   ├── middleware/        # Middleware (auth, rate limit, etc)
│   │   ├── services/          # Lógica de negócio
│   │   ├── workers/           # Workers assíncronos (BullMQ)
│   │   ├── utils/             # Utilitários
│   │   ├── types/             # Tipos TypeScript
│   │   ├── app.ts             # Configuração Fastify
│   │   └── server.ts          # Inicialização do servidor
│   └── tests/                 # Testes unitários e integração
├── frontend/                   # Frontend React + Material-UI
│   └── src/
│       ├── components/        # Componentes reutilizáveis
│       ├── pages/             # Páginas da aplicação
│       ├── layouts/           # Layouts comuns
│       ├── hooks/             # Hooks customizados
│       ├── services/          # Chamadas à API
│       ├── types/             # Tipos TypeScript
│       └── utils/             # Utilitários
├── prisma/                     # Schema e migrations do banco
│   ├── schema.prisma          # Schema do banco de dados
│   ├── migrations/            # Migrations do Prisma
│   └── seed.ts                # Dados iniciais
├── config/                     # Configurações de infraestrutura
│   ├── docker/                # Docker Compose files
│   ├── prometheus/            # Configuração Prometheus
│   └── grafana/               # Dashboards Grafana
├── scripts/                    # Scripts de automação
├── .system/                    # Documentação técnica
│   ├── docs/                  # Documentação seguindo padrões
│   └── scripts/               # Scripts de documentação
└── docker-compose.yml          # Orquestração principal
```

## 🔐 Funcionalidades

### ✅ Implementadas
- [x] Estrutura base do projeto
- [x] Configuração Git com proteção de pastas ocultas

### 🚧 Em Desenvolvimento
- [ ] Backend com autenticação JWT
- [ ] Frontend integrado com API
- [ ] Sistema multi-tenant com RLS
- [ ] Observabilidade com Prometheus + Grafana

### 📋 Roadmap
- [ ] Gestão de usuários e tenants
- [ ] Métricas por tenant
- [ ] Workers assíncronos
- [ ] Testes automatizados
- [ ] Documentação completa

## 🏗️ Arquitetura

### Multi-Tenant
- Isolamento de dados por tenant usando Row-Level Security (RLS)
- Autenticação JWT com informações de tenant
- Rate limiting por tenant

### Observabilidade
- Métricas por tenant: tempo de resposta, erros, uso de CPU
- Dashboards Grafana para monitoramento
- Logs estruturados com Pino

### Segurança
- Senhas hasheadas com bcrypt
- Rate limiting multi-camada
- Headers de segurança (Helmet)
- Proteção contra XSS, SQL injection, CSRF

## 📚 Documentação

Documentação técnica completa disponível em `.system/docs/`:

- [Authentication](.system/docs/authentication/) - Sistema de autenticação
- [Multi-Tenant](.system/docs/multi-tenant/) - Arquitetura multi-tenant
- [Observability](.system/docs/observability/) - Sistema de observabilidade
- [Planning](.system/docs/planning/) - Documentos de planejamento (PDR)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Convenções de Commit
Seguimos [Conventional Commits](https://www.conventionalcommits.org/):
- `feat(scope): descrição` - Nova funcionalidade
- `fix(scope): descrição` - Correção de bug
- `docs(scope): descrição` - Documentação
- `chore(scope): descrição` - Tarefas de manutenção

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE.md](LICENSE.md) para detalhes.

## 📞 Suporte

Para dúvidas ou suporte:
- Abra uma [Issue](https://github.com/your-org/kaven-boilerplate/issues)
- Consulte a documentação em `.system/docs/`

---

**Kaven Boilerplate** - Multi-tenant admin panel boilerplate 🚀