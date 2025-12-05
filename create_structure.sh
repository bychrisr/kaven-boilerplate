#!/bin/bash
set -e

echo "🏗️  Criando estrutura completa do Kaven Boilerplate..."

# Agent & Telemetry
mkdir -p .agent/workflows
mkdir -p .agent/telemetry/archive
mkdir -p .agent/scripts

# Pre-production
mkdir -p pre-production/prompts
mkdir -p pre-production/pdr
mkdir -p pre-production/analysis
mkdir -p pre-production/schema

# Backend
mkdir -p production/backend/prisma/migrations
mkdir -p production/backend/src/modules/auth
mkdir -p production/backend/src/modules/tenant
mkdir -p production/backend/src/modules/admin
mkdir -p production/backend/src/observability/metrics
mkdir -p production/backend/src/observability/dashboards
mkdir -p production/backend/src/utils
mkdir -p production/backend/src/middleware
mkdir -p production/backend/tests/unit
mkdir -p production/backend/tests/integration

# Frontend
mkdir -p "production/frontend/src/app/(auth)"
mkdir -p "production/frontend/src/app/(dashboard)/admin/users"
mkdir -p "production/frontend/src/app/(dashboard)/admin/tenants"
mkdir -p "production/frontend/src/app/(dashboard)/admin/audit-logs"
mkdir -p "production/frontend/src/app/(dashboard)/admin/system"
mkdir -p production/frontend/src/components/ui
mkdir -p production/frontend/src/components/admin
mkdir -p production/frontend/src/components/layout
mkdir -p production/frontend/src/lib
mkdir -p production/frontend/src/stores
mkdir -p production/frontend/src/hooks
mkdir -p production/frontend/public

# Shared
mkdir -p production/shared/types
mkdir -p production/shared/constants

# Infrastructure
mkdir -p infra/docker
mkdir -p infra/prometheus
mkdir -p infra/grafana/dashboards
mkdir -p infra/grafana/provisioning

# GitHub Actions
mkdir -p .github/workflows

# Docs
mkdir -p docs

# Scripts
mkdir -p scripts

echo "✅ Estrutura criada!"
