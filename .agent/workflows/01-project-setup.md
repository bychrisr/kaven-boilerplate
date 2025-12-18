---
description: "Kaven Phase 1 - Workflow 01: Project Setup"
---

# 🚀 Workflow 01: Project Setup

---

## STEP 0: INICIALIZAR TELEMETRIA & WRAPPER

```bash
.agent/scripts/init_telemetry.sh "01-project-setup" "Setup completo: Turborepo + Prisma + Docker"

# Criar tracker de comandos
mkdir -p .agent/telemetry
touch .agent/telemetry/commands_tracker.txt

# Função Wrapper para Rastreabilidade Automática
execute() {
    local cmd="$*"
    echo "🤖 Executing: $cmd"
    echo "$cmd" >> .agent/telemetry/commands_tracker.txt
    eval "$cmd"
}
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
execute "pnpm install"
```

---

## STEP 10.5: Subir Docker com AI Doctor (Self-Healing) 🏥

```bash
echo "🐳 Iniciando Docker com AI Doctor..."
execute "docker-compose up -d"

# Criar Docker Doctor (Self-Healing Script)
cat > .agent/scripts/docker_doctor.py << 'PYTHON_DOC'
#!/usr/bin/env python3
import subprocess, time, sys, re

MAX_RETRIES = 15
TIMEOUT = 5
CONTAINERS = ["kaven-postgres", "kaven-redis"]

def run(cmd):
    """Executa comando shell e retorna output"""
    try:
        return subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT).decode().strip()
    except subprocess.CalledProcessError as e:
        return e.output.decode().strip() if e.output else str(e)

def get_container_status(name):
    """Retorna status do container"""
    return run(f"docker inspect --format='{{{{.State.Status}}}}' {name}")

def get_container_health(name):
    """Retorna health status do container"""
    health = run(f"docker inspect --format='{{{{.State.Health.Status}}}}' {name}")
    return health if health != "<no value>" else "unknown"

def heal_container(name, logs):
    """Tenta curar problemas conhecidos do container"""
    print(f"🔧 Attempting to heal {name}...")
    
    # Problema 1: Permission denied
    if "Permission denied" in logs or "EACCES" in logs:
        print(f"   → Detected permission issue. Fixing...")
        run(f"docker exec -u 0 {name} chown -R postgres:postgres /var/lib/postgresql/data 2>/dev/null || true")
        run(f"docker restart {name}")
        return True
    
    # Problema 2: Connection refused (race condition)
    if "Connection refused" in logs or "could not connect" in logs:
        print(f"   → Detected connection issue. Restarting...")
        run(f"docker restart {name}")
        return True
    
    # Problema 3: Port already in use
    if "Bind for" in logs and "failed" in logs:
        print(f"   → Port conflict detected")
        return False  # Não pode curar automaticamente
    
    return False

def main():
    print("🏥 Docker AI Doctor - Starting health monitoring...")
    
    for attempt in range(MAX_RETRIES):
        all_healthy = True
        
        for container in CONTAINERS:
            status = get_container_status(container)
            health = get_container_health(container)
            
            print(f"[{attempt+1}/{MAX_RETRIES}] {container}: status={status}, health={health}")
            
            # Container em loop de restart = problema crítico
            if status == "restarting":
                logs = run(f"docker logs --tail 50 {container}")
                healed = heal_container(container, logs)
                if not healed:
                    print(f"❌ Failed to heal {container}")
                all_healthy = False
                break
            
            # Container não está rodando
            if status != "running":
                all_healthy = False
                break
            
            # Container sem healthcheck ou ainda não healthy
            if health not in ["healthy", "unknown"]:
                all_healthy = False
        
        if all_healthy:
            print("✅ All containers are healthy!")
            sys.exit(0)
        
        time.sleep(TIMEOUT)
    
    print(f"❌ Timeout after {MAX_RETRIES} attempts")
    sys.exit(1)

if __name__ == "__main__":
    main()
PYTHON_DOC

chmod +x .agent/scripts/docker_doctor.py

# Executar o Doctor
execute "python3 .agent/scripts/docker_doctor.py"
```

---

## STEP 11: Git Commit

```bash
execute "git add ."
execute "git commit -m 'feat: setup inicial do projeto Kaven Boilerplate'"
```

---

## STEP 12: FINALIZAR TELEMETRIA

```bash
.agent/scripts/finalize_telemetry.sh
bash .agent/scripts/consolidate_workflow_report.sh 01-project-setup
```
