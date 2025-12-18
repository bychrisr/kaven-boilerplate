---
description: "Kaven Phase 1 - Workflow 01: Project Setup (Final)"
---

# 🚀 Workflow 01: Project Setup

---

## STEP 0: INICIALIZAR 🔍

```bash
# 1. Inicia telemetria
chmod +x .agent/scripts/*.sh
.agent/scripts/init_telemetry.sh "01-project-setup" "Setup Completo"

# 2. Carrega a função 'execute' (Crucial para persistência)
if [ ! -f .agent/scripts/utils.sh ]; then
    echo "❌ utils.sh not found! Run fix_structure.sh first."
    exit 1
fi
source .agent/scripts/utils.sh

echo "✅ Setup initialized"

```

---

## STEP 1 a 9: Configuração de Arquivos

_(Execute os blocos de criação de arquivo normalmente, usando `echo "file" >> .agent/telemetry/files_tracker.txt`)_

---

## STEP 10: Instalar Dependências 📦

```bash
# Recarrega utils para garantir que a função execute existe nesta sessão
source .agent/scripts/utils.sh

execute "pnpm install"

```

---

## STEP 11: Subir Docker com AI Doctor 🏥

Este script foi corrigido para escapar corretamente as chaves no Python (`{{{{`).

```bash
source .agent/scripts/utils.sh

echo "🐳 Starting Docker..."
execute "docker-compose up -d"

# Cria o script Python Doctor
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
    # Correção: Chaves quadruplas para f-string + docker format
    status = run(f"docker inspect --format='{{{{.State.Status}}}}' {name}")
    return status

def heal(name, logs):
    if "Permission denied" in logs:
        print(f"🔧 Fixing permissions for {name}...")
        run(f"docker exec -u 0 {name} chown -R 999:999 /var/lib/postgresql/data 2>/dev/null || true")
        run(f"docker restart {name}")
        return True
    if "Connection refused" in logs:
        print(f"🔧 Restarting {name} (Race Condition)...")
        run(f"docker restart {name}")
        return True
    return False

def main():
    print("🏥 Docker Doctor Running...")
    for i in range(MAX_RETRIES):
        healthy = True
        for c in CONTAINERS:
            status = check(c)
            print(f"   [{i+1}] {c}: {status}")

            if status == "restarting":
                heal(c, run(f"docker logs --tail 20 {c}"))
                healthy = False; break

            if status != "running":
                healthy = False

        if healthy:
            print("✅ All Systems Healthy")
            sys.exit(0)
        time.sleep(5)

    print("❌ Docker failed to stabilize")
    sys.exit(1)

if __name__ == "__main__": main()
PYTHON_DOC

execute "python3 .agent/scripts/docker_doctor.py"

```

---

## STEP 12: FINALIZAR E REPORTAR 📊

```bash
.agent/scripts/finalize_telemetry.sh
.agent/scripts/consolidate_workflow_report.sh "01-project-setup"

```
