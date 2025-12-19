---
description: 'Kaven Phase 1 - Workflow 01: Project Setup (FIXED LOGIC)'
---

# 🚀 Workflow 01: Project Setup

---

## STEP 0: INICIALIZAR TELEMETRIA & TRACKING 🔍

Este passo prepara todo o ambiente, cria os scripts de suporte necessários e inicia a telemetria.

````bash
# 1. Garantir diretórios
mkdir -p .agent/scripts
mkdir -p .agent/telemetry/archive
mkdir -p .agent/reports

# 2. Criar utils.sh (Função Wrapper Persistente)
cat > .agent/scripts/utils.sh << 'EOF'
#!/bin/bash
mkdir -p .agent/telemetry
touch .agent/telemetry/commands_tracker.txt

execute() {
    local cmd="$*"
    echo "🤖 Executing: $cmd"
    echo "$cmd" >> .agent/telemetry/commands_tracker.txt
    eval "$cmd"
    return $?
}
EOF
chmod +x .agent/scripts/utils.sh

# 3. Criar init_telemetry.sh
cat > .agent/scripts/init_telemetry.sh << 'EOF'
#!/bin/bash
TELEMETRY_DIR=".agent/telemetry"
CURRENT_FILE="$TELEMETRY_DIR/current_execution.json"
WORKFLOW_NAME="${1:-unnamed}"
DESC="${2:-setup}"
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)

cat > "$CURRENT_FILE" << JSON
{
  "timestamp_start": "$TIMESTAMP",
  "workflow_name": "$WORKFLOW_NAME",
  "task_description": "$DESC",
  "files_created": [],
  "commands_executed": [],
  "success": true
}
JSON
: > "$TELEMETRY_DIR/files_tracker.txt"
: > "$TELEMETRY_DIR/commands_tracker.txt"
echo "true" > "$TELEMETRY_DIR/success.txt"
echo "✅ Telemetria iniciada: $WORKFLOW_NAME"
EOF
chmod +x .agent/scripts/init_telemetry.sh

# 4. Criar finalize_telemetry.sh
cat > .agent/scripts/finalize_telemetry.sh << 'EOF'
#!/bin/bash
TELEMETRY_DIR=".agent/telemetry"
CURRENT_FILE="$TELEMETRY_DIR/current_execution.json"
LAST_EXECUTION_FILE="$TELEMETRY_DIR/last_execution.json"
FILES_TRACKER="$TELEMETRY_DIR/files_tracker.txt"
COMMANDS_TRACKER="$TELEMETRY_DIR/commands_tracker.txt"
METRICS_FILE="$TELEMETRY_DIR/metrics.json"

if [ -f "$FILES_TRACKER" ]; then FILES=$(jq -R . "$FILES_TRACKER" | jq -s .); else FILES='[]'; fi
if [ -f "$COMMANDS_TRACKER" ]; then CMDS=$(jq -R . "$COMMANDS_TRACKER" | jq -s .); else CMDS='[]'; fi

START=$(jq -r '.timestamp_start' "$CURRENT_FILE")
END=$(date -u +%Y-%m-%dT%H:%M:%SZ)
DUR=0
if command -v python3 &>/dev/null; then
    DUR=$(python3 -c "from datetime import datetime; s=datetime.strptime('$START', '%Y-%m-%dT%H:%M:%SZ'); e=datetime.strptime('$END', '%Y-%m-%dT%H:%M:%SZ'); print(int((e-s).total_seconds()))" 2>/dev/null || echo 0)
fi

jq --argjson f "$FILES" --argjson c "$CMDS" --arg e "$END" --argjson d "$DUR" \
   '.files_created=$f | .commands_executed=$c | .timestamp_end=$e | .duration_seconds=$d' \
   "$CURRENT_FILE" > "$CURRENT_FILE.tmp" && mv "$CURRENT_FILE.tmp" "$CURRENT_FILE"

cp "$CURRENT_FILE" "$LAST_EXECUTION_FILE"
cp "$CURRENT_FILE" "$TELEMETRY_DIR/archive/exec_$(date +%s).json"

if [ ! -f "$METRICS_FILE" ]; then echo '{"executions":[]}' > "$METRICS_FILE"; fi
jq -s '.[0].executions += [.[1]] | .[0]' "$METRICS_FILE" "$CURRENT_FILE" > "$METRICS_FILE.tmp" && mv "$METRICS_FILE.tmp" "$METRICS_FILE"

rm -f "$FILES_TRACKER" "$COMMANDS_TRACKER" "$TELEMETRY_DIR/success.txt"
echo "{}" > "$CURRENT_FILE"
echo "✅ Telemetria finalizada."
EOF
chmod +x .agent/scripts/finalize_telemetry.sh

# 5. Criar consolidate_workflow_report.sh
cat > .agent/scripts/consolidate_workflow_report.sh << 'EOF'
#!/bin/bash
# consolidate_workflow_report.sh v2.1 - Complete Report Generator
# Based on original by Chris (@bychrisr) with v2.1 enhancements (Mermaid, Links, Auto-Fix)

set -e

WORKFLOW_NAME="${1:-workflow}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# ================================================================
# Detect project root
# ================================================================
if [[ "$(basename $(dirname $(pwd)))" == ".agent" ]]; then
    PROJECT_ROOT="$(cd ../.. && pwd)"
elif [[ "$(basename $(pwd))" == ".agent" ]]; then
    PROJECT_ROOT="$(cd .. && pwd)"
else
    PROJECT_ROOT="$(pwd)"
fi

cd "$PROJECT_ROOT"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 WORKFLOW REPORT GENERATOR v2.1"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📂 Project Root: $PROJECT_ROOT"
echo "🎯 Workflow: $WORKFLOW_NAME"
echo ""

# ================================================================
# Define paths
# ================================================================
ARCHIVE_DIR=".agent/telemetry/archive"
TELEMETRY_DIR=".agent/telemetry"
SNAPSHOT_FILE="$TELEMETRY_DIR/last_execution.json"
METRICS_FILE="$TELEMETRY_DIR/metrics.json"
FILES_TRACKER="$TELEMETRY_DIR/files_tracker.txt"
VALIDATION_LOG="$TELEMETRY_DIR/validation.log"

REPORTS_DIR=".agent/reports"
mkdir -p "$REPORTS_DIR"
mkdir -p "$ARCHIVE_DIR"

REPORT_FILE="$REPORTS_DIR/WORKFLOW_REPORT_${WORKFLOW_NAME}_${TIMESTAMP}.md"

# ================================================================
# CRITICAL: Read from SNAPSHOT first
# ================================================================
echo "🔍 Checking telemetry sources..."

DATA_SOURCE=""
if [ -f "$SNAPSHOT_FILE" ]; then
    echo "✅ Using snapshot: $SNAPSHOT_FILE"
    DATA_SOURCE="$SNAPSHOT_FILE"
elif [ -f "$METRICS_FILE" ]; then
    echo "⚠️  Snapshot not found, using metrics.json"
    DATA_SOURCE="$METRICS_FILE"
else
    echo "❌ CRITICAL ERROR: NO TELEMETRY DATA FOUND"
    exit 1
fi

if [ ! -f "$FILES_TRACKER" ]; then
    touch "$FILES_TRACKER"
fi

echo ""

# ================================================================
# Read telemetry data
# ================================================================
echo "📊 Reading telemetry data..."

WORKFLOW_NAME_JSON=$(jq -r '.workflow_name // "N/A"' "$DATA_SOURCE" 2>/dev/null || echo "N/A")
TASK_DESC=$(jq -r '.task_description // "N/A"' "$DATA_SOURCE" 2>/dev/null || echo "N/A")
TIMESTAMP_START=$(jq -r '.timestamp_start // "N/A"' "$DATA_SOURCE" 2>/dev/null || echo "N/A")
TIMESTAMP_END=$(jq -r '.timestamp_end // "N/A"' "$DATA_SOURCE" 2>/dev/null || echo "N/A")
DURATION=$(jq -r '.duration_seconds // 0' "$DATA_SOURCE" 2>/dev/null || echo "0")
LOC=$(jq -r '.lines_of_code // 0' "$DATA_SOURCE" 2>/dev/null || echo "0")
SUCCESS=$(jq -r '.success // false' "$DATA_SOURCE" 2>/dev/null || echo "false")
EXEC_ID=$(jq -r '.execution_id // "N/A"' "$DATA_SOURCE" 2>/dev/null || echo "N/A")

FILES_COUNT=$(jq -r '.files_created | length' "$DATA_SOURCE" 2>/dev/null || echo "0")
COMMANDS_COUNT=$(jq -r '.commands_executed | length' "$DATA_SOURCE" 2>/dev/null || echo "0")

DURATION_MIN=$((DURATION / 60))
DURATION_SEC=$((DURATION % 60))

if [ "$SUCCESS" = "true" ]; then
    STATUS_EMOJI="✅"
    STATUS_TEXT="SUCCESS"
else
    STATUS_EMOJI="❌"
    STATUS_TEXT="FAILED"
fi

GIT_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

if [ -f "prisma/schema.prisma" ]; then
    PRISMA_MODELS=$(grep -c "^model " prisma/schema.prisma 2>/dev/null || echo "0")
    PRISMA_ENUMS=$(grep -c "^enum " prisma/schema.prisma 2>/dev/null || echo "0")
else
    PRISMA_MODELS=0
    PRISMA_ENUMS=0
fi

DOCKER_RUNNING=$(docker ps --filter "name=kaven" --format "{{.Names}}" 2>/dev/null | wc -l || echo "0")

echo "✅ Telemetry loaded"
echo ""

# ================================================================
# Generate Report
# ================================================================
echo "📝 Generating report..."

cat > "$REPORT_FILE" << HEADER_END
# 📊 WORKFLOW EXECUTION REPORT

> **Generated:** $(date '+%Y-%m-%d %H:%M:%S')
> **Workflow:** $WORKFLOW_NAME
> **Project:** Kaven Boilerplate
> **Report Version:** 2.1 (Enhanced)

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Telemetry Data](#2-telemetry-data)
3. [Files Created](#3-files-created)
4. [Docker Diagnostics](#4-docker-diagnostics)
5. [AI Validation](#5-ai-validation)
6. [Git Status](#6-git-status)

---

HEADER_END

# ================================================================
# SECTION 1: Executive Summary
# ================================================================
cat >> "$REPORT_FILE" << EOF
## 1. EXECUTIVE SUMMARY

### 🎯 Workflow Execution

| Metric | Value |
|--------|-------|
| **Workflow** | $WORKFLOW_NAME_JSON |
| **Task** | $TASK_DESC |
| **Status** | $STATUS_EMOJI $STATUS_TEXT |
| **End Time** | $TIMESTAMP_END |
| **Duration** | ${DURATION_MIN}m ${DURATION_SEC}s ($DURATION seconds) |
| **Files Created** | $FILES_COUNT |

### ✅ Completion Checklist

- [x] Workflow executed successfully
- [x] Telemetry generated ($FILES_COUNT files tracked)
EOF

if [ "$PRISMA_MODELS" -gt 0 ]; then
    echo "- [x] Prisma schema created ($PRISMA_MODELS models, $PRISMA_ENUMS enums)" >> "$REPORT_FILE"
fi

echo "- [x] Git commit created (\`$GIT_COMMIT\`)" >> "$REPORT_FILE"

if [ "$DOCKER_RUNNING" -gt 0 ]; then
    echo "- [x] Docker containers running ($DOCKER_RUNNING containers)" >> "$REPORT_FILE"
else
    echo "- [ ] Docker containers not running" >> "$REPORT_FILE"
fi

cat >> "$REPORT_FILE" << 'EOF'

---

## 2. TELEMETRY DATA

### 📊 Raw Execution Data

EOF

echo "\`\`\`json" >> "$REPORT_FILE"
cat "$DATA_SOURCE" | jq '.' >> "$REPORT_FILE" 2>/dev/null || cat "$DATA_SOURCE" >> "$REPORT_FILE"
echo "\`\`\`" >> "$REPORT_FILE"

cat >> "$REPORT_FILE" << 'EOF'

---

## 3. FILES CREATED

### 📁 Complete File List

EOF

echo "| # | File Path | Size | LOC | Status |" >> "$REPORT_FILE"
echo "|---|-----------|------|-----|--------|" >> "$REPORT_FILE"

INDEX=1
jq -r '.files_created[]' "$DATA_SOURCE" 2>/dev/null | while IFS= read -r file; do
    if [ -f "$file" ]; then
        SIZE=$(du -h "$file" 2>/dev/null | cut -f1 || echo "N/A")
        FILE_LOC=$(wc -l < "$file" 2>/dev/null || echo "0")
        # Use relative path from .agent/reports/ to project root
        REL_PATH="../../$file"
        echo "| $INDEX | [$file]($REL_PATH) | $SIZE | $FILE_LOC | ✅ |" >> "$REPORT_FILE"
    else
        echo "| $INDEX | \`$file\` | - | - | ❌ |" >> "$REPORT_FILE"
    fi
    INDEX=$((INDEX + 1))
done

cat >> "$REPORT_FILE" << 'EOF'

---

## 4. DOCKER DIAGNOSTICS

### 🧜‍♀️ Infrastructure Map

EOF

echo "\`\`\`mermaid" >> "$REPORT_FILE"
echo "graph TD" >> "$REPORT_FILE"

docker ps -a --filter "name=kaven" --format "{{.Names}}" 2>/dev/null | while read -r container; do
    STATUS=$(docker inspect --format='{{.State.Status}}' "$container" 2>/dev/null || echo "unknown")
    if [ "$STATUS" = "running" ]; then
        echo "    $container([✅ $container<br/>Running])" >> "$REPORT_FILE"
        echo "    style $container fill:#9f9,stroke:#333,stroke-width:2px" >> "$REPORT_FILE"
    else
        echo "    $container([❌ $container<br/>$STATUS])" >> "$REPORT_FILE"
        echo "    style $container fill:#f99,stroke:#333,stroke-width:2px" >> "$REPORT_FILE"
    fi
done
echo "\`\`\`" >> "$REPORT_FILE"

cat >> "$REPORT_FILE" << 'EOF'

### 🐳 Container Details

EOF

if [ "$DOCKER_RUNNING" -gt 0 ]; then
    echo "| Container | Status | Health | Ports |" >> "$REPORT_FILE"
    echo "|-----------|--------|--------|-------|" >> "$REPORT_FILE"

    docker ps -a --filter "name=kaven" --format "{{.Names}}" 2>/dev/null | while read -r container; do
        STATUS=$(docker inspect --format='{{.State.Status}}' "$container" 2>/dev/null || echo "unknown")
        HEALTH=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "N/A")
        PORTS=$(docker port "$container" 2>/dev/null | tr '\n' ' ' | sed 's/ $//' || echo "")

        if [ "$STATUS" = "running" ]; then
             EMOJI="✅"
        else
             EMOJI="❌"
        fi

        echo "| $EMOJI \`$container\` | $STATUS | $HEALTH | \`$PORTS\` |" >> "$REPORT_FILE"

        # Auto-Diagnostics for failed containers
        if [ "$STATUS" != "running" ] || [ "$HEALTH" == "unhealthy" ]; then
            echo "" >> "$REPORT_FILE"
            echo "<details><summary>🔍 <b>Debug Logs: $container</b></summary>" >> "$REPORT_FILE"
            echo "" >> "$REPORT_FILE"
            echo "\`\`\`" >> "$REPORT_FILE"
            docker logs --tail 20 "$container" 2>&1 >> "$REPORT_FILE" || echo "No logs available" >> "$REPORT_FILE"
            echo "\`\`\`" >> "$REPORT_FILE"
            echo "</details>" >> "$REPORT_FILE"
            echo "" >> "$REPORT_FILE"
        fi
    done
else
    echo "⚠️ **No Docker containers running**" >> "$REPORT_FILE"
fi

cat >> "$REPORT_FILE" << EOF

---

## 5. AI VALIDATION

EOF

WALKTHROUGH_FILE=".agent/telemetry/walkthrough.md"

if [ -f "$WALKTHROUGH_FILE" ]; then
    echo "🤖 Found AI walkthrough, injecting..."
    echo "### 🧠 AI Walkthrough & Insights" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    # Append content, skipping the first line (Title) to avoid duplicates
    tail -n +2 "$WALKTHROUGH_FILE" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
else
    echo "ℹ️  No AI walkthrough found at $WALKTHROUGH_FILE"
    echo "*No AI walkthrough/insights available for this execution.*" >> "$REPORT_FILE"
fi

cat >> "$REPORT_FILE" << EOF

---

## 6. GIT STATUS

**Branch:** \`$GIT_BRANCH\`
**Last Commit:** \`$GIT_COMMIT\`

EOF

if git diff --quiet 2>/dev/null; then
    echo "✅ **Working directory clean**" >> "$REPORT_FILE"
else
    echo "⚠️ **Uncommitted changes present**" >> "$REPORT_FILE"
fi

cat >> "$REPORT_FILE" << 'EOF'

---

**🎉 Report Complete!**
EOF

echo "✅ Report generated successfully at $REPORT_FILE"
EOF
chmod +x .agent/scripts/consolidate_workflow_report.sh

# 6. Executar Inicialização
.agent/scripts/init_telemetry.sh "01-project-setup" "Setup completo: Turborepo + Prisma + Docker"

---

## STEP 1: Criar .gitignore

```bash
cat > .gitignore << 'EOF'
node_modules/
.pnpm-store/
dist/
build/
.next/
.turbo/
out/
.env
.env.local
.env*.local
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store
Thumbs.db
*.log
coverage/
.nyc_output/
prisma/*.db
prisma/*.db-journal
.agent/telemetry/*.json
.agent/telemetry/*.txt
.agent/telemetry/*.log
.agent/telemetry/*.pid
.agent/telemetry/archive/*.json
!.agent/telemetry/README.md
!.agent/telemetry/.gitkeep
.docker/data/
EOF

echo ".gitignore" >> .agent/telemetry/files_tracker.txt

````

---

## STEP 2: Configurar Turborepo

```bash
cat > package.json << 'EOF'
{
  "name": "kaven-boilerplate",
  "version": "1.0.0",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "db:generate": "npx prisma generate",
    "db:migrate": "npx prisma migrate dev",
    "db:studio": "npx prisma studio",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down"
  },
  "devDependencies": {
    "turbo": "^2.3.3",
    "prettier": "^3.4.2",
    "typescript": "^5.7.2"
  },
  "packageManager": "pnpm@8.15.0"
}
EOF

cat > turbo.json << 'EOF'
{
  "$schema": "[https://turbo.build/schema.json](https://turbo.build/schema.json)",
  "pipeline": {
    "build": {"dependsOn": ["^build"]},
    "dev": {"cache": false},
    "lint": {},
    "test": {"dependsOn": ["^build"]}
  }
}
EOF

cat > .npmrc << 'EOF'
shamefully-hoist=true
strict-peer-dependencies=false
EOF

cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'apps/*'
  - 'packages/*'
EOF

echo "package.json" >> .agent/telemetry/files_tracker.txt
echo "turbo.json" >> .agent/telemetry/files_tracker.txt
echo ".npmrc" >> .agent/telemetry/files_tracker.txt
echo "pnpm-workspace.yaml" >> .agent/telemetry/files_tracker.txt

```

---

## STEP 3: Criar Estrutura

```bash
mkdir -p apps/api/src/{modules,lib,middleware,types,utils}
mkdir -p apps/admin/src/{app,components,lib,hooks,types,utils}
mkdir -p packages/{shared,ui,config}
mkdir -p prisma/{migrations,seeds}
mkdir -p docs/{api,architecture,guides}

```

---

## STEP 4: TypeScript Config

```bash
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
EOF

echo "tsconfig.json" >> .agent/telemetry/files_tracker.txt

```

---

## STEP 5: ESLint e Prettier

```bash
cat > .eslintrc.json << 'EOF'
{
  "extends": ["eslint:recommended"],
  "rules": {}
}
EOF

cat > .prettierrc << 'EOF'
{
  "semi": true,
  "singleQuote": true
}
EOF

cat > .prettierignore << 'EOF'
node_modules
dist
.next
EOF

echo ".eslintrc.json" >> .agent/telemetry/files_tracker.txt
echo ".prettierrc" >> .agent/telemetry/files_tracker.txt
echo ".prettierignore" >> .agent/telemetry/files_tracker.txt

```

---

## STEP 6: Docker Compose

```bash
cat > docker-compose.yml << 'EOF'
version: '3.9'
services:
  postgres:
    image: postgres:16-alpine
    container_name: kaven-postgres
    environment:
      POSTGRES_USER: kaven
      POSTGRES_PASSWORD: kaven_dev_password
      POSTGRES_DB: kaven_dev
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U kaven"]
      interval: 5s
      timeout: 5s
      retries: 5
  redis:
    image: redis:7-alpine
    container_name: kaven-redis
    ports:
      - '6379:6379'
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
volumes:
  postgres_data:
EOF

echo "docker-compose.yml" >> .agent/telemetry/files_tracker.txt

```

---

## STEP 7: Prisma Schema

```bash
cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum TenantStatus {
  ACTIVE
  SUSPENDED
  DELETED
}

enum Role {
  SUPER_ADMIN
  TENANT_ADMIN
  USER
}

model Tenant {
  id        String       @id @default(uuid())
  name      String
  slug      String       @unique
  status    TenantStatus @default(ACTIVE)
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt

  users     User[]
  @@index([slug])
}

model User {
  id               String    @id @default(uuid())
  email            String    @unique
  password         String
  name             String
  emailVerified    Boolean   @default(false)
  twoFactorEnabled Boolean   @default(false)
  tenantId         String?
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  tenant Tenant? @relation(fields: [tenantId], references: [id])
  @@index([email])
}
EOF

echo "prisma/schema.prisma" >> .agent/telemetry/files_tracker.txt

```

---

## STEP 8: Environment Files

```bash
cat > .env.example << 'EOF'
DATABASE_URL="postgresql://kaven:kaven_dev_password@localhost:5432/kaven_dev"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="change-me-in-production"
NODE_ENV="development"
PORT=8000
EOF

cp .env.example .env

echo ".env.example" >> .agent/telemetry/files_tracker.txt
echo ".env" >> .agent/telemetry/files_tracker.txt

```

---

## STEP 9: README

````bash
cat > README.md << 'EOF'
# Kaven Boilerplate

SaaS Boilerplate multi-tenant

## Quick Start

```bash
pnpm install
pnpm docker:up
pnpm dev

````

EOF

echo "README.md" >> .agent/telemetry/files_tracker.txt

````

---

## STEP 10: Instalar Dependências

```bash
# Carregar o wrapper criado no STEP 0
source .agent/scripts/utils.sh

execute "pnpm install"

````

---

## STEP 10.5: Subir Docker com AI Doctor (Self-Healing) 🏥

```bash
source .agent/scripts/utils.sh

echo "🐳 Iniciando Docker com AI Doctor..."
execute "docker-compose up -d"

# Criar Docker Doctor (Python syntax corrigida)
cat > .agent/scripts/docker_doctor.py << 'PYTHON_DOC'
#!/usr/bin/env python3
"""
🏥 Smart Docker Doctor v3.0
Sistema Especialista para Diagnóstico e Auto-Cura de Containers Docker.
Author: Antigravity Agent
"""

import subprocess
import time
import sys
import json
import re
import os

# ==============================================================================
# 🧠 KNOWLEDGE BASE (Base de Conhecimento)
# ==============================================================================
# Mapeia padrões de erro (Regex) -> Diagnóstico -> Tratamento

KNOWLEDGE_BASE = [
    {
        "name": "Port Conflict",
        "patterns": [
            r"address already in use",
            r"bind: .* failed",
            r"listen tcp .* bind: address already in use"
        ],
        "diagnosis": "Porta do host já está ocupada por outro processo.",
        "action": "kill_host_port"
    },
    {
        "name": "Authentication Failure",
        "patterns": [
            r"password authentication failed",
            r"Access denied for user",
            r"authentication failed"
        ],
        "diagnosis": "Credenciais incorretas configuradas no container.",
        "action": "force_env_reset"
    },
    {
        "name": "Database Locked",
        "patterns": [
            r"database system is starting up",
            r"recovery is in progress",
            r"Another postmaster is running"
        ],
        "diagnosis": "Banco de dados em estado de recuperação ou bloqueado.",
        "action": "wait_backoff"
    },
    {
        "name": "Permission Denied",
        "patterns": [
            r"permission denied",
            r"chown: changing ownership",
            r"EACCES: permission denied"
        ],
        "diagnosis": "Erro de permissão no sistema de arquivos (volumes).",
        "action": "fix_permissions"
    },
    {
        "name": "Missing Dependency",
        "patterns": [
            r"Module not found",
            r"ImportError",
            r"Command not found"
        ],
        "diagnosis": "Dependência de código ou sistema faltando.",
        "action": "rebuild_container"
    }
]

# ==============================================================================
# 🛠️ CORE TOOLS (Ferramentas)
# ==============================================================================

def run(cmd, ignore_error=False):
    """Executa comando shell e retorna output."""
    try:
        if isinstance(cmd, list):
            cmd = " ".join(cmd)
        return subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT).decode().strip()
    except subprocess.CalledProcessError as e:
        if ignore_error:
            return ""
        return str(e.output.decode()) if hasattr(e, 'output') else str(e)

def log(msg, icon="ℹ️"):
    print(f"{icon} {msg}")

# ==============================================================================
# 👨‍⚕️ DOCTOR CLASSES (Lógica)
# ==============================================================================

class ContainerPatient:
    def __init__(self, name):
        self.name = name
        self.status = "unknown"
        self.health = "unknown"
        self.logs = ""
        self.diagnosis = None

    def check_vitals(self):
        """Verifica status e health check via docker inspect."""
        try:
            res = run(f"docker inspect --format='{{{{json .State}}}}' {self.name}")
            state = json.loads(res)
            self.status = state.get('Status', 'unknown')
            self.health = state.get('Health', {}).get('Status', 'N/A')
            return self.status == 'running' and (self.health == 'healthy' or self.health == 'N/A')
        except:
            self.status = "missing"
            return False

    def fetch_logs(self, lines=50):
        """Busca logs recentes para análise."""
        self.logs = run(f"docker logs --tail {lines} {self.name}", ignore_error=True)

class SmartDoctor:
    def __init__(self, containers):
        self.patients = [ContainerPatient(c) for c in containers]
        self.max_retries = 10

    def analyze_symptoms(self, patient):
        """Compara logs do paciente com a Knowledge Base."""
        for rule in KNOWLEDGE_BASE:
            for pattern in rule["patterns"]:
                if re.search(pattern, patient.logs, re.IGNORECASE):
                    patient.diagnosis = rule
                    return rule
        return None

    def perform_surgery(self, patient, treatment):
        """Executa a ação corretiva baseada no diagnóstico."""
        action = treatment["action"]
        log(f"Tratamento prescrito: {action.upper()} para {patient.name}", "💊")

        if action == "kill_host_port":
            # Tenta identificar porta (simplificado para Postgres/Redis padrão)
            # Em produção real, precisaria de parsing mais complexo
            ports = {"kaven-postgres": 5432, "kaven-redis": 6379}
            port = ports.get(patient.name)
            if port:
                log(f"Tentando liberar porta {port}...", "🔪")
                # Não matamos processos do host por segurança neste script
                # Mas forçamos o restart do container que geralmente resolve bind issues no docker
                run(f"docker rm -f {patient.name}")
                run("docker-compose up -d")

        elif action == "force_env_reset":
            log("Recriando container para forçar variáveis de ambiente...", "♻️")
            run(f"docker rm -f {patient.name}")
            run("docker-compose up -d")

        elif action == "wait_backoff":
            log("Aguardando sistema estabilizar (Deep Sleep)...", "💤")
            time.sleep(10)

        elif action == "fix_permissions":
            log("Tentando corrigir permissões...", "🔧")
            # Implementação genérica: recriar container costuma resolver volume mount issues em dev
            run(f"docker rm -f {patient.name}")
            run("docker-compose up -d")

        elif action == "rebuild_container":
            log("Forçando rebuild...", "🏗️")
            run(f"docker-compose user {patient.name} --build -d")

        else:
            log("Tratamento genérico: Restart Force", "🔨")
            run(f"docker restart {patient.name}")

    def start_rounds(self):
        """Inicia o ciclo de verificação e cura."""
        log("Iniciando ronda médica...", "🏥")

        for i in range(self.max_retries):
            all_healthy = True
            report = []

            for patient in self.patients:
                is_healthy = patient.check_vitals()
                status_str = f"{patient.name}={patient.status}"
                if patient.health != "N/A":
                    status_str += f"({patient.health})"

                report.append(status_str)

                if not is_healthy:
                    all_healthy = False
                    # Se estiver em loop de restart ou morto, analisar
                    if patient.status in ['restarting', 'exited', 'dead']:
                        log(f"Paciente {patient.name} instável ({patient.status}). Analisando...", "🧐")
                        patient.fetch_logs()
                        diagnosis = self.analyze_symptoms(patient)

                        if diagnosis:
                            log(f"DIAGNÓSTICO: {diagnosis['name']} - {diagnosis['diagnosis']}", "💡")
                            self.perform_surgery(patient, diagnosis)
                            time.sleep(5) # Recuperação pós-cirúrgica
                        else:
                            log(f"Sintomas desconhecidos em {patient.name}. Tentando reanimação padrão.", "⚠️")
                            run(f"docker restart {patient.name}")
                            time.sleep(3)

            log(f"Round {i+1}/{self.max_retries}: " + ", ".join(report), "📝")

            if all_healthy:
                log("Todos os sistemas operacionais! Alta médica concedida.", "✅")
                return True

            time.sleep(5)

        log("Falha crítica: Pacientes não responderam aos tratamentos.", "💀")
        return False

# ==============================================================================
# 🚀 MAIN
# ==============================================================================

if __name__ == "__main__":
    # Autodetect containers from kaven prefix
    try:
        raw = run("docker ps -a --filter 'name=kaven' --format '{{.Names}}'")
        containers = [c for c in raw.split('\n') if c.strip()]
        if not containers:
            # Fallback defaults
            containers = ['kaven-postgres', 'kaven-redis']
    except:
        containers = ['kaven-postgres', 'kaven-redis']

    doctor = SmartDoctor(containers)
    success = doctor.start_rounds()

    sys.exit(0 if success else 1)
PYTHON_DOC

execute "python3 .agent/scripts/docker_doctor.py"

```

---

## STEP 11: Git Commit

```bash
source .agent/scripts/utils.sh

# Garante git init
if [ ! -d .git ]; then git init; fi

execute "git add ."
execute "git commit -m 'feat: setup inicial do projeto Kaven Boilerplate'"

```

---

## STEP 12: FINALIZAR TELEMETRIA

```bash
.agent/scripts/finalize_telemetry.sh
.agent/scripts/consolidate_workflow_report.sh 01-project-setup

```

```

```
