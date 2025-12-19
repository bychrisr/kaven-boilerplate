---
description: "Kaven Phase 1 - Workflow 01: Project Setup (FIXED LOGIC)"
---

# 🚀 Workflow 01: Project Setup

---

## STEP 0: INICIALIZAR TELEMETRIA & TRACKING 🔍

Este passo prepara todo o ambiente, cria os scripts de suporte necessários e inicia a telemetria.

```bash
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
  "timestamp_start": "$TIMESTAMP_START",
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
SNAPSHOT=".agent/telemetry/last_execution.json"
NAME="${1:-workflow}"
REPORT=".agent/reports/REPORT_${NAME}_$(date +%Y%m%d_%H%M%S).md"

if [ ! -f "$SNAPSHOT" ]; then echo "❌ Sem dados"; exit 1; fi

DUR=$(jq -r '.duration_seconds' "$SNAPSHOT")
FILES=$(jq -r '.files_created | length' "$SNAPSHOT")
STATUS=$(jq -r '.success' "$SNAPSHOT")

echo "# 📊 Report: $NAME" > "$REPORT"
echo "- Status: $STATUS" >> "$REPORT"
echo "- Duração: ${DUR}s" >> "$REPORT"
echo "- Arquivos Criados: $FILES" >> "$REPORT"
echo "" >> "$REPORT"
echo "## Comandos" >> "$REPORT"
echo "\`\`\`" >> "$REPORT"
jq -r '.commands_executed[]' "$SNAPSHOT" >> "$REPORT"
echo "\`\`\`" >> "$REPORT"
echo "✅ Report: $REPORT"
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

```

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

```bash
cat > README.md << 'EOF'
# Kaven Boilerplate

SaaS Boilerplate multi-tenant

## Quick Start

```bash
pnpm install
pnpm docker:up
pnpm dev

```

EOF

echo "README.md" >> .agent/telemetry/files_tracker.txt

```

---

## STEP 10: Instalar Dependências

```bash
# Carregar o wrapper criado no STEP 0
source .agent/scripts/utils.sh

execute "pnpm install"

```

---

## STEP 10.5: Subir Docker com AI Doctor (Self-Healing) 🏥

```bash
source .agent/scripts/utils.sh

echo "🐳 Iniciando Docker com AI Doctor..."
execute "docker-compose up -d"

# Criar Docker Doctor (Python syntax corrigida)
cat > .agent/scripts/docker_doctor.py << 'PYTHON_DOC'
#!/usr/bin/env python3
import subprocess, time, sys

MAX_RETRIES = 15
CONTAINERS = ["kaven-postgres", "kaven-redis"]

def run(cmd):
    try:
        return subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT).decode().strip()
    except subprocess.CalledProcessError as e:
        return e.output.decode().strip() if e.output else str(e)

def check(name):
    # Escape das chaves para o Python nao confundir com variáveis
    status = run(f"docker inspect --format='{{{{.State.Status}}}}' {name}")
    return status

def heal(name, logs):
    print(f"🔧 Healing {name}...")
    if "Permission denied" in logs:
        run(f"docker exec -u 0 {name} chown -R 999:999 /var/lib/postgresql/data 2>/dev/null || true")
        run(f"docker restart {name}")
        return True
    if "Connection refused" in logs:
        run(f"docker restart {name}")
        return True
    return False

def main():
    print("🏥 AI Doctor Monitoring...")
    for i in range(MAX_RETRIES):
        all_ok = True
        for c in CONTAINERS:
            status = check(c)
            print(f"   [{i+1}] {c}: {status}")
            if status == "restarting":
                heal(c, run(f"docker logs --tail 20 {c}"))
                all_ok = False; break
            if status != "running":
                all_ok = False
        
        if all_ok:
            print("✅ Healthy")
            sys.exit(0)
        time.sleep(5)
    print("❌ Failed")
    sys.exit(1)

if __name__ == "__main__": main()
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
