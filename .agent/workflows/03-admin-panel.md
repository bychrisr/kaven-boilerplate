---
description: "Kaven Phase 1 - Workflow 03: Admin Panel"
---

# 🎨 Workflow 03: Admin Panel

---

## STEP 0: INICIALIZAR TELEMETRIA & WRAPPER

```bash
.agent/scripts/init_telemetry.sh "03-admin-panel" "Admin panel com Next.js 14 e shadcn/ui"

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

## STEP 1: Criar Next.js App

```bash
cd apps/admin
execute "pnpm create next-app@latest . --typescript --tailwind --app"
cd ../../
```

---

## STEP 2: Instalar shadcn/ui

```bash
cd apps/admin
execute "pnpm dlx shadcn-ui@latest init -y"
execute "pnpm dlx shadcn-ui@latest add button input card"
cd ../../
```

---

## STEP 3: Git Commit

```bash
execute "git add ."
execute "git commit -m 'feat: admin panel com Next.js

Workflow: 03-admin-panel
'"
```

---

## STEP 4: FINALIZAR TELEMETRIA

```bash
.agent/scripts/finalize_telemetry.sh
bash .agent/scripts/consolidate_workflow_report.sh 03-admin-panel
```
