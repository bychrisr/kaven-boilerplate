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
    print(f"�� Healing {name}...")
    if "Permission denied" in logs:
        # Tenta corrigir permissões - requer sudo ou docker rootless config, mas aqui tentamos via container se possivel ou falhamos gracefully
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
