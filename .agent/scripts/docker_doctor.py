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
        "name": "Invalid Configuration",
        "patterns": [
            r"does not appear to be a valid email address",
            r"Configuration error",
            r"invalid value for"
        ],
        "diagnosis": "Configuração inválida de variáveis de ambiente (ex: email/formato inválido).",
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
