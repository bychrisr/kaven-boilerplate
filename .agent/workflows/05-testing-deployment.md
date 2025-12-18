---
description: "Kaven Phase 1 - Workflow 05: Testing & Deployment"
---

# 🧪 Workflow 05: Testing & Deployment

---

## STEP 0: INICIALIZAR TELEMETRIA & WRAPPER

```bash
.agent/scripts/init_telemetry.sh "05-testing-deployment" "Testes e deploy"

# Criar tracker de comandos
mkdir -p .agent/telemetry
touch .agent/telemetry/commands_tracker.txt

# Função Wrapper
execute() {
    local cmd="$*"
    echo "🤖 Executing: $cmd"
    echo "$cmd" >> .agent/telemetry/commands_tracker.txt
    eval "$cmd"
}
```

---

## STEP 1: Instalar Vitest

```bash
cd apps/api
execute "pnpm add -D vitest"
cd ../../
```

---

## STEP 2: Test Config

```bash
cat > apps/api/vitest.config.ts << 'EOF'
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
EOF

echo "apps/api/vitest.config.ts" >> .agent/telemetry/files_tracker.txt
```

---

## STEP 3: Git Commit

```bash
execute "git add ."
execute "git commit -m 'feat: testes e configuração de deploy

Workflow: 05-testing-deployment
'"
```

---

## STEP 4: FINALIZAR TELEMETRIA

```bash
.agent/scripts/finalize_telemetry.sh
bash .agent/scripts/consolidate_workflow_report.sh 05-testing-deployment
```
