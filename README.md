# Kaven Boilerplate v2.0.0

> Enterprise-grade SaaS boilerplate with multi-tenancy, admin panel, and observability

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

## 🚀 Stack

**Backend:**
- Node.js 20 + Fastify 4
- Prisma 5 + PostgreSQL 16
- JWT + 2FA (TOTP)
- Redis 7 (cache + rate limiting)

**Frontend:**
- Next.js 14 (App Router)
- shadcn/ui + Tailwind CSS 4
- TanStack Query v5
- Zustand (state management)

**Observability:**
- Prometheus + Grafana
- Winston (structured logging)
- Health checks

**DevOps:**
- Docker Compose
- GitHub Actions CI/CD
- Multi-stage builds

## 📦 Features

- ✅ **Multi-tenancy** (shared database + RLS)
- ✅ **Admin panel** (users, tenants, audit logs, system config)
- ✅ **Authentication** (JWT + Refresh Token + 2FA TOTP)
- ✅ **RBAC** (Role-Based Access Control)
- ✅ **Audit logging** (immutable trail)
- ✅ **Observability** (Prometheus metrics + Grafana dashboards)
- ✅ **Rate limiting** (per user, per IP, per endpoint)
- ✅ **Security** (AES-256 encryption, CSRF protection, XSS prevention)
- ✅ **Telemetry** (automatic workflow metrics)

## 🏗️ Project Structure

```
kaven-boilerplate/
├── .agent/                  # Telemetry & Antigravity workflows
│   ├── workflows/          # Instrumented workflows
│   ├── telemetry/          # Metrics storage
│   └── scripts/            # Analysis scripts
├── pre-production/          # PDR, prompts, analysis
│   ├── prompts/
│   ├── pdr/
│   ├── analysis/
│   └── schema/
├── production/
│   ├── backend/            # Fastify + Prisma
│   │   ├── prisma/
│   │   ├── src/
│   │   └── tests/
│   ├── frontend/           # Next.js + shadcn/ui
│   │   ├── src/
│   │   └── public/
│   └── shared/             # Types & constants
├── infra/                  # Docker, Prometheus, Grafana
│   ├── docker/
│   ├── prometheus/
│   └── grafana/
├── docs/                   # Documentation
└── scripts/                # Utility scripts
```

## 🚀 Quick Start

### 1. Use This Template

Click **"Use this template"** button on GitHub to create a new repository.

### 2. Clone Your Repository

```bash
git clone git@github.com:YOUR_USERNAME/your-project-name.git
cd your-project-name
```

### 3. Setup Environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 4. Install Dependencies

```bash
# Install root dependencies
npm install

# Install workspace dependencies
cd production/backend && npm install
cd ../frontend && npm install
```

### 5. Start Infrastructure

```bash
cd infra/
docker compose up -d
```

Wait for PostgreSQL, Redis, Prometheus, and Grafana to be ready.

### 6. Run Migrations

```bash
cd production/backend
npx prisma migrate dev
npx prisma db seed
```

### 7. Start Development

```bash
# Terminal 1 (Backend)
cd production/backend
npm run dev

# Terminal 2 (Frontend)
cd production/frontend
npm run dev
```

Open:
- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:3000
- **Grafana:** http://localhost:3000 (admin/admin)
- **Prometheus:** http://localhost:9090

## 🔐 Default Credentials

```
Super Admin:
Email: admin@kaven.local
Password: Password123!

Tenant Admin (Acme Corp):
Email: admin@acme.com
Password: Password123!
```

**⚠️ CRITICAL: Change these in production!**

## 📚 Documentation

- [Architecture](docs/ARCHITECTURE.md) - System design & decisions
- [Development](docs/DEVELOPMENT.md) - Local setup & workflows
- [Deployment](docs/DEPLOYMENT.md) - Staging & production deploy
- [API Reference](docs/API.md) - API endpoints & contracts
- [Telemetry](docs/TELEMETRY.md) - Metrics & monitoring
- [Contributing](CONTRIBUTING.md) - How to contribute

## 📊 Observability

### Prometheus Metrics

- **Endpoint:** http://localhost:9090
- **Metrics exposed:** `/metrics`
- Custom metrics:
  - `http_request_duration_seconds` (histogram)
  - `http_requests_total` (counter)
  - `active_users_total` (gauge)
  - `database_query_duration_seconds` (histogram)

### Grafana Dashboards

- **URL:** http://localhost:3000
- **Credentials:** admin / admin
- Dashboards:
  - System Overview
  - Tenant Metrics (per tenant)
  - Performance Metrics

## 🧪 Testing

```bash
# Run all tests
npm test

# Backend tests only
cd production/backend
npm test
npm run test:coverage

# Frontend tests only
cd production/frontend
npm test
```

## 📦 Deployment

### Staging

```bash
# Build Docker images
docker compose -f infra/docker-compose.staging.yml build

# Deploy
docker compose -f infra/docker-compose.staging.yml up -d

# Run migrations
docker compose exec backend npx prisma migrate deploy
```

### Production

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed production deployment guide.

## 🔧 Development Workflows

### Telemetry System

This boilerplate includes automatic telemetry for all workflows:

```bash
# View metrics
cat .agent/telemetry/metrics.json | jq '.summary'

# Analyze metrics
python .agent/scripts/analyze_metrics.py

# View last execution
cat .agent/telemetry/metrics.json | jq '.executions[-1]'
```

### Antigravity Workflows

Located in `.agent/workflows/`:
- `backend.md` - Generate Prisma schema from PDR
- `contracts.md` - Generate tRPC contracts
- `tasks.md` - Generate implementation plan

All workflows are instrumented with automatic telemetry tracking.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Built with the **Kaven methodology** by [@bychrisr](https://github.com/bychrisr)
- Powered by [Fastify](https://fastify.dev), [Prisma](https://prisma.io), [Next.js](https://nextjs.org), and [shadcn/ui](https://ui.shadcn.com)
- Observability with [Prometheus](https://prometheus.io) & [Grafana](https://grafana.com)

## 🐛 Issues & Support

- **Issues:** [GitHub Issues](https://github.com/bychrisr/kaven-boilerplate/issues)
- **Discussions:** [GitHub Discussions](https://github.com/bychrisr/kaven-boilerplate/discussions)
- **Documentation:** [docs/](docs/)

## 📈 Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features and improvements.

---

**Made with ❤️ using Kaven v2.0.0**
