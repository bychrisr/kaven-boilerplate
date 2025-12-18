---
description: "Kaven Phase 1 - Workflow 01: Project Setup (Final Version)"
---

# 🚀 Workflow 01: Project Setup

---

## STEP 0: INICIALIZAR 🔍

Carrega ferramentas e inicia telemetria.

```bash
# 1. Carregar utilitários (Obrigatório ter rodado setup_agent.sh antes)
if [ -f .agent/scripts/utils.sh ]; then
    source .agent/scripts/utils.sh
else
    echo "❌ ERRO CRÍTICO: .agent/scripts/utils.sh não encontrado."
    echo "⚠️  Por favor, rode ./setup_agent.sh na raiz antes de iniciar."
    exit 1
fi

# 2. Iniciar telemetria
.agent/scripts/init_telemetry.sh "01-project-setup" "Setup Completo: Turborepo + Prisma + Docker"

```

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
.env
.env*.local
*.log
coverage/
prisma/*.db
.agent/telemetry/*.json
.agent/telemetry/*.txt
!.agent/telemetry/archive/
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
  "$schema": "https://turbo.build/schema.json",
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

## STEP 3: Criar Estrutura de Pastas

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

## STEP 8: Env Files

```bash
cat > .env.example << 'EOF'
DATABASE_URL="postgresql://kaven:kaven_dev_password@localhost:5432/kaven_dev"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="dev-secret"
NODE_ENV="development"
EOF

cp .env.example .env
echo ".env" >> .agent/telemetry/files_tracker.txt

```

---

## STEP 9: README

```bash
cat > README.md << 'EOF'
# Kaven Boilerplate
EOF
echo "README.md" >> .agent/telemetry/files_tracker.txt

```

---

## STEP 10: Instalar Dependências 📦

```bash
# Recarrega utils por segurança
source .agent/scripts/utils.sh

execute "pnpm install"

```

---

## STEP 11: Subir Docker com AI Doctor 🏥

```bash
source .agent/scripts/utils.sh

echo "🐳 Subindo Docker..."
execute "docker-compose up -d"

# Cria script Python de cura
cat > .agent/scripts/docker_doctor.py << 'PYTHON_EOF'
#!/usr/bin/env python3
import subprocess, time, sys

def run(cmd):
    try: return subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT).decode()
    except Exception as e: return str(e.output) if hasattr(e, 'output') else str(e)

def main():
    print("🏥 Doctor check...")
    for i in range(15):
        pg = run("docker inspect --format='{{.State.Status}}' kaven-postgres").strip()
        rd = run("docker inspect --format='{{.State.Status}}' kaven-redis").strip()

        print(f"   Try {i+1}: PG={pg}, RD={rd}")

        if pg == "restarting":
            run("docker restart kaven-postgres")

        if pg == "running" and rd == "running":
            print("✅ All running")
            sys.exit(0)
        time.sleep(5)
    sys.exit(1)

if __name__ == "__main__": main()
PYTHON_EOF

execute "python3 .agent/scripts/docker_doctor.py"

```

---

## STEP 12: Git Commit

```bash
source .agent/scripts/utils.sh

if [ ! -d .git ]; then git init; fi
execute "git add ."
execute "git commit -m 'feat: setup inicial'"

```

---

## STEP 13: FINALIZAR TELEMETRIA 📊

```bash
.agent/scripts/finalize_telemetry.sh
.agent/scripts/consolidate_workflow_report.sh "01-project-setup"

```
