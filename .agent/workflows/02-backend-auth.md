---
description: 'Kaven Phase 1 - Workflow 02: Backend Authentication'
---

# 🔐 Workflow 02: Backend Authentication

---

## STEP 0: INICIALIZAR TELEMETRIA & WRAPPER

```bash
# Carregar utils e tracking
source .agent/scripts/utils.sh
.agent/scripts/init_telemetry.sh "02-backend-auth" "Sistema de autenticação: JWT + 2FA + Email"

# Verificar saúde da infraestrutura (Smart Doctor)
echo "🏥 Checking infrastructure..."
if [ -f .agent/scripts/docker_doctor.py ]; then
    python3 .agent/scripts/docker_doctor.py
fi
```

---

## STEP 1: Instalar Dependências

```bash
cd apps/api
execute "pnpm add fastify @fastify/cors @fastify/helmet bcryptjs jose winston zod"
execute "pnpm add -D @types/bcryptjs"
cd ../../
```

---

## STEP 2: Criar Estrutura

```bash
mkdir -p apps/api/src/modules/auth/{controllers,services}
mkdir -p apps/api/src/lib/{logger,crypto}
```

---

## STEP 3: Auth Service

```bash
cat > apps/api/src/modules/auth/services/auth.service.ts << 'EOF'
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export class AuthService {
  async register(email: string, password: string, name: string) {
    const hash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hash, name },
    });
    return { message: 'User registered successfully' };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    return { user: { id: user.id, email, name: user.name } };
  }
}
EOF

echo "apps/api/src/modules/auth/services/auth.service.ts" >> .agent/telemetry/files_tracker.txt
```

---

## STEP 4: Git Commit

```bash
execute "git add ."
execute "git commit -m 'feat: sistema de autenticação backend

Workflow: 02-backend-auth
'"
```

---

## STEP 5: FINALIZAR TELEMETRIA

```bash
.agent/scripts/finalize_telemetry.sh
bash .agent/scripts/consolidate_workflow_report.sh 02-backend-auth
```
