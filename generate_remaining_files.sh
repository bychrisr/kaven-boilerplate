#!/bin/bash
set -e

echo "📝 Gerando arquivos restantes..."

# ==============================================
# DEVELOPMENT.md
# ==============================================
cat > docs/DEVELOPMENT.md << 'EOF'
# Development Guide

> **Version:** 2.0.0  
> **Last Updated:** 2025-12-05

## Prerequisites

- Node.js 20+
- npm 10+
- Docker & Docker Compose
- Git

## Setup

### 1. Clone Repository

```bash
git clone git@github.com:YOUR_USERNAME/your-project.git
cd your-project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 4. Start Infrastructure

```bash
npm run docker:up
```

### 5. Run Migrations

```bash
npm run prisma:migrate
npm run prisma:seed
```

### 6. Start Development

```bash
npm run dev
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start backend + frontend |
| `npm run build` | Build all workspaces |
| `npm test` | Run all tests |
| `npm run lint` | Lint all workspaces |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run docker:up` | Start Docker services |
| `npm run docker:down` | Stop Docker services |
| `npm run telemetry:analyze` | Analyze workflow metrics |

## Project Structure

See [README.md](../README.md#-project-structure)

## Testing

### Backend

```bash
cd production/backend
npm test
npm run test:coverage
```

### Frontend

```bash
cd production/frontend
npm test
```

## Debugging

### VS Code

See `.vscode/launch.json` for debug configurations.

### Chrome DevTools

Backend runs on port 3000 with Node.js inspector.

---

**Next Steps:** Complete implementation guide in Sprint 1-2
EOF

# ==============================================
# DEPLOYMENT.md
# ==============================================
cat > docs/DEPLOYMENT.md << 'EOF'
# Deployment Guide

> **Version:** 2.0.0  
> **Status:** Draft - To be completed in Sprint 1-2 (Task B7)

## Environments

1. **Development** - Local Docker Compose
2. **Staging** - VPS with Docker Compose
3. **Production** - VPS or Cloud (Railway/Render)

## Staging Deployment

**To be documented in Sprint 1-2 (Task B7)**

## Production Deployment

**To be documented in Sprint 1-2 (Task B7)**

## Environment Variables

See [.env.example](../.env.example) for all required variables.

## Database Migrations

```bash
# Production migrations
npx prisma migrate deploy
```

## Monitoring

- Grafana: http://your-domain:3000
- Prometheus: http://your-domain:9090

---

**Status:** To be completed in Sprint 1-2
EOF

# ==============================================
# API.md
# ==============================================
cat > docs/API.md << 'EOF'
# API Reference

> **Version:** 2.0.0  
> **Status:** Draft - To be completed in Sprint 1-2

## Base URL

```
Development: http://localhost:3000
Production: https://api.your-domain.com
```

## Authentication

All endpoints (except public auth endpoints) require JWT token:

```http
Authorization: Bearer <access_token>
```

## Endpoints

### Auth

**To be documented in Sprint 1-2 (Task B4)**

### Users

**To be documented in Sprint 1-2 (Task B4)**

### Tenants

**To be documented in Sprint 1-2 (Task B4)**

### Admin

**To be documented in Sprint 1-2 (Task B4)**

---

**Status:** To be completed in Sprint 1-2
EOF

# ==============================================
# TELEMETRY.md
# ==============================================
cp /mnt/user-data/outputs/TELEMETRY_SYSTEM_GUIDE.md docs/TELEMETRY.md

# ==============================================
# CONTRIBUTING.md
# ==============================================
cat > CONTRIBUTING.md << 'EOF'
# Contributing to Kaven Boilerplate

Thank you for your interest in contributing!

## Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Code Style

- TypeScript strict mode
- ESLint + Prettier
- Functional components (React)
- No `any` types

## Commit Convention

Use conventional commits:

```
feat: add new feature
fix: fix bug
docs: update documentation
chore: update dependencies
test: add tests
```

## Testing

All PRs must include tests.

## License

By contributing, you agree that your contributions will be licensed under MIT License.
EOF

# ==============================================
# ROADMAP.md
# ==============================================
cat > ROADMAP.md << 'EOF'
# Roadmap

## v2.0.0 (Current)

### Sprint 1-2: Core Infrastructure (Weeks 1-2)
- [ ] Task B1: Create repository ✅
- [ ] Task B2: Folder structure
- [ ] Task B3: PostgreSQL + Prisma multi-tenant (8h)
- [ ] Task B4: Backend Auth + Admin (24h)
- [ ] Task B5: Frontend Admin UI (12h)
- [ ] Task B6: Observability (6h)
- [ ] Task B7: Docker + CI (6h)

### Sprint 3-4: Workflows v2.0.0 (Weeks 3-4)
- [ ] Refactor workflows for boilerplate
- [ ] Validation project

### Sprint 5-6: Documentation & Release (Weeks 5-6)
- [ ] Complete documentation
- [ ] Release v2.0.0

## v2.1.0 (Future)

- [ ] Stripe integration
- [ ] Email templates
- [ ] Notification system
- [ ] Advanced RBAC

## v3.0.0 (Future)

- [ ] Microservices architecture option
- [ ] Kubernetes deployment
- [ ] Advanced analytics
EOF

# ==============================================
# Docker Compose Development
# ==============================================
cat > infra/docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: kaven-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: kaven_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: kaven-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  prometheus:
    image: prom/prometheus:latest
    container_name: kaven-prometheus
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'

  grafana:
    image: grafana/grafana:latest
    container_name: kaven-grafana
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning
      - ./grafana/dashboards:/var/lib/grafana/dashboards

volumes:
  postgres_data:
  redis_data:
  prometheus_data:
  grafana_data:
EOF

# ==============================================
# Prometheus Config
# ==============================================
mkdir -p infra/prometheus
cat > infra/prometheus/prometheus.yml << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'kaven-backend'
    static_configs:
      - targets: ['host.docker.internal:3000']
    metrics_path: '/metrics'
EOF

# ==============================================
# .gitkeep files
# ==============================================
find . -type d -empty -exec touch {}/.gitkeep \;

echo "✅ Todos os arquivos criados!"
