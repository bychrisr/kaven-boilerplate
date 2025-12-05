#!/bin/bash

# docker-compose.yml
cat > infra/docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: kaven
      POSTGRES_PASSWORD: kaven123
      POSTGRES_DB: kaven_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U kaven"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - ./grafana/provisioning:/etc/grafana/provisioning
      - ./grafana/dashboards:/var/lib/grafana/dashboards
      - grafana_data:/var/lib/grafana

volumes:
  postgres_data:
  prometheus_data:
  grafana_data:
EOF

# prometheus.yml
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

# GitHub Actions - CI
cat > .github/workflows/ci.yml << 'EOF'
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install
        working-directory: production/backend
        run: npm ci
      - name: Lint
        working-directory: production/backend
        run: npm run lint
      - name: Test
        working-directory: production/backend
        run: npm test

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install
        working-directory: production/frontend
        run: npm ci
      - name: Lint
        working-directory: production/frontend
        run: npm run lint
      - name: Build
        working-directory: production/frontend
        run: npm run build
EOF

# Dockerfile.backend
cat > infra/docker/Dockerfile.backend << 'EOF'
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY production/backend/package*.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY production/backend ./
RUN npx prisma generate
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["node", "dist/server.js"]
EOF

# Dockerfile.frontend
cat > infra/docker/Dockerfile.frontend << 'EOF'
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY production/frontend/package*.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY production/frontend ./
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3001
CMD ["node", "server.js"]
EOF

echo "✅ Docker e CI criados!"
