#!/bin/bash
set -e

echo "📦 Criando arquivos de configuração..."

# .gitignore
cat > .gitignore << 'EOF'
node_modules/
.next/
dist/
build/
coverage/
.env
.env.local
production/backend/prisma/dev.db
production/backend/prisma/dev.db-journal
.agent/telemetry/current_execution.json
.DS_Store
*.log
*.swp
EOF

# LICENSE
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2025 Chris (@bychrisr)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

# package.json
cat > package.json << 'EOF'
{
  "name": "kaven-boilerplate",
  "version": "2.0.0",
  "description": "Enterprise-grade SaaS boilerplate",
  "private": true,
  "workspaces": [
    "production/backend",
    "production/frontend",
    "production/shared"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd production/backend && npm run dev",
    "dev:frontend": "cd production/frontend && npm run dev",
    "build": "npm run build:backend && npm run build:frontend",
    "test": "npm run test:backend && npm run test:frontend",
    "lint": "npm run lint:backend && npm run lint:frontend"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  },
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/bychrisr/kaven-boilerplate.git"
  },
  "keywords": ["saas", "boilerplate", "fastify", "nextjs", "prisma", "multi-tenancy"],
  "author": "Chris (@bychrisr)",
  "license": "MIT"
}
EOF

# .env.example
cat > .env.example << 'EOF'
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/kaven_db?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="change-this-to-a-secure-random-string"
JWT_REFRESH_SECRET="change-this-to-another-secure-random-string"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"

# Encryption
ENCRYPTION_KEY="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"

# Frontend
NEXT_PUBLIC_API_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
LOG_LEVEL="debug"
EOF

# CONTRIBUTING.md
cat > CONTRIBUTING.md << 'EOF'
# Contributing to Kaven Boilerplate

## Development Workflow

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes (follow code style)
4. Test: `npm test`
5. Commit: `git commit -m 'feat: add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open Pull Request

## Code Style

- ESLint + Prettier
- TypeScript strict mode
- Functional components (React)
- No `any` types

## Commit Messages

Follow Conventional Commits:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `chore:` maintenance
- `test:` tests

## Testing

```bash
npm test
npm run test:coverage
```

Coverage target: 70%+

## Questions?

Open an issue or discussion on GitHub.
EOF

# docs/ARCHITECTURE.md
cat > docs/ARCHITECTURE.md << 'EOF'
# Architecture

## Overview

Kaven Boilerplate follows modular monolith architecture.

## Components

- **Backend:** Fastify + Prisma
- **Frontend:** Next.js + shadcn/ui
- **Database:** PostgreSQL with multi-tenancy
- **Cache:** Redis
- **Observability:** Prometheus + Grafana

## Multi-Tenancy

Uses shared database with tenant context filtering (Prisma middleware).

## Authentication

JWT (access + refresh tokens) with optional 2FA (TOTP).

## To be expanded in Sprint 1-2
EOF

# docs/DEVELOPMENT.md
cat > docs/DEVELOPMENT.md << 'EOF'
# Development Guide

## Setup

See README.md for quick start.

## Project Structure

```
production/
├── backend/     # Fastify API
├── frontend/    # Next.js UI
└── shared/      # Common types
```

## Running Tests

```bash
npm test
```

## Adding Features

1. Update schema.prisma
2. Generate migration
3. Update tRPC contracts
4. Implement frontend

## To be expanded in Sprint 1-2
EOF

# docs/DEPLOYMENT.md
cat > docs/DEPLOYMENT.md << 'EOF'
# Deployment Guide

## Staging

```bash
docker compose -f infra/docker-compose.staging.yml up -d
```

## Production

1. Build images
2. Push to registry
3. Deploy with docker compose
4. Run migrations

## To be expanded in Sprint 1-2
EOF

# docs/TELEMETRY.md
cat > docs/TELEMETRY.md << 'EOF'
# Telemetry System

## Overview

Automatic workflow execution tracking.

## Metrics Collected

- Duration (seconds)
- Files created/modified
- Commands executed
- Lines of code
- Success/failure status

## Analysis

```bash
# Python
python .agent/scripts/analyze_metrics.py

# jq
cat .agent/telemetry/metrics.json | jq '.summary'
```

## Integration with brainOS

Future: Import metrics.json via API for dashboard visualization.

See `.agent/telemetry/README.md` for complete guide.
EOF

# .agent/telemetry/README.md
cat > .agent/telemetry/README.md << 'EOF'
# Telemetry System Quick Start

## View Metrics

```bash
# Summary
cat metrics.json | jq '.summary'

# Last execution
cat metrics.json | jq '.executions[-1]'

# Analysis
python ../scripts/analyze_metrics.py
```

## How It Works

1. Workflow starts → creates current_execution.json
2. Workflow tracks files/commands → updates current_execution.json
3. Workflow ends → finalize_telemetry.js consolidates metrics.json

## Files

- `metrics.json` - Main file (commit to git)
- `current_execution.json` - Temporary (ignored by git)
- `archive/` - Old metrics (optional)

See `/docs/TELEMETRY.md` for full documentation.
EOF

echo "✅ Todos os arquivos de configuração criados!"
