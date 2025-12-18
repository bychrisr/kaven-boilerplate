#!/usr/bin/env python3
"""
Docker AI Doctor v2.0
Self-healing script for Docker containers with intelligent diagnostics
"""

import subprocess
import time
import sys
import re
from typing import List, Optional

# Configuration
MAX_RETRIES = 15
TIMEOUT = 5
CONTAINERS = ["kaven-postgres", "kaven-redis"]

class Colors:
    """ANSI color codes for terminal output"""
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def run(cmd: str) -> str:
    """Execute shell command and return output"""
    try:
        result = subprocess.check_output(
            cmd, 
            shell=True, 
            stderr=subprocess.STDOUT,
            universal_newlines=True
        )
        return result.strip()
    except subprocess.CalledProcessError as e:
        return e.output.strip() if e.output else str(e)

def get_container_status(name: str) -> str:
    """Get container status (running, restarting, exited, etc.)"""
    try:
        status = run(f"docker inspect --format='{{{{.State.Status}}}}' {name}")
        return status.replace("'", "")
    except:
        return "unknown"

def get_container_health(name: str) -> str:
    """Get container health status if healthcheck is configured"""
    try:
        health = run(f"docker inspect --format='{{{{.State.Health.Status}}}}' {name}")
        health = health.replace("'", "")
        return health if health != "<no value>" else "unknown"
    except:
        return "unknown"

def get_container_logs(name: str, lines: int = 50) -> str:
    """Get recent container logs"""
    return run(f"docker logs --tail {lines} {name}")

def diagnose_issue(logs: str) -> Optional[str]:
    """
    Analyze logs to identify known issues
    Returns: Issue type or None
    """
    patterns = {
        'permission': r'(Permission denied|EACCES|cannot access)',
        'connection': r'(Connection refused|could not connect|Connection reset)',
        'port': r'(Bind for .* failed|address already in use)',
        'disk': r'(No space left|Disk quota exceeded)',
        'memory': r'(Out of memory|Cannot allocate memory)',
        'timeout': r'(timeout|timed out)',
    }
    
    for issue_type, pattern in patterns.items():
        if re.search(pattern, logs, re.IGNORECASE):
            return issue_type
    
    return None

def heal_container(name: str, logs: str) -> bool:
    """
    Attempt to heal container based on diagnosed issue
    Returns: True if healing was attempted, False if issue is unfixable
    """
    issue = diagnose_issue(logs)
    
    if not issue:
        print(f"{Colors.WARNING}   → No known issue pattern detected{Colors.ENDC}")
        return False
    
    print(f"{Colors.OKCYAN}   → Diagnosed: {issue.upper()} issue{Colors.ENDC}")
    
    if issue == 'permission':
        print(f"{Colors.OKBLUE}   → Fixing permissions...{Colors.ENDC}")
        # Try common permission fixes
        run(f"docker exec -u 0 {name} chown -R postgres:postgres /var/lib/postgresql/data 2>/dev/null || true")
        run(f"docker exec -u 0 {name} chmod -R 700 /var/lib/postgresql/data 2>/dev/null || true")
        run(f"docker restart {name}")
        return True
    
    elif issue == 'connection':
        print(f"{Colors.OKBLUE}   → Restarting to resolve connection issue...{Colors.ENDC}")
        run(f"docker restart {name}")
        return True
    
    elif issue == 'timeout':
        print(f"{Colors.OKBLUE}   → Restarting to resolve timeout...{Colors.ENDC}")
        run(f"docker restart {name}")
        return True
    
    elif issue in ['port', 'disk', 'memory']:
        print(f"{Colors.FAIL}   → {issue.upper()} issue detected - manual intervention required{Colors.ENDC}")
        if issue == 'port':
            print(f"{Colors.WARNING}   → Check if port is already in use: docker ps{Colors.ENDC}")
        elif issue == 'disk':
            print(f"{Colors.WARNING}   → Check disk space: df -h{Colors.ENDC}")
        elif issue == 'memory':
            print(f"{Colors.WARNING}   → Check memory: docker stats{Colors.ENDC}")
        return False
    
    return False

def print_status(attempt: int, container: str, status: str, health: str):
    """Print formatted status line"""
    status_color = Colors.OKGREEN if status == "running" else Colors.FAIL
    health_color = Colors.OKGREEN if health == "healthy" else Colors.WARNING
    
    print(f"[{attempt}/{MAX_RETRIES}] {container}: "
          f"{status_color}status={status}{Colors.ENDC}, "
          f"{health_color}health={health}{Colors.ENDC}")

def main():
    """Main monitoring and healing loop"""
    print(f"{Colors.BOLD}{Colors.HEADER}🏥 Docker AI Doctor v2.0{Colors.ENDC}")
    print(f"{Colors.OKCYAN}Starting health monitoring for containers: {', '.join(CONTAINERS)}{Colors.ENDC}")
    print("")
    
    for attempt in range(1, MAX_RETRIES + 1):
        all_healthy = True
        
        for container in CONTAINERS:
            status = get_container_status(container)
            health = get_container_health(container)
            
            print_status(attempt, container, status, health)
            
            # Critical issue: container in restart loop
            if status == "restarting":
                print(f"{Colors.FAIL}🔧 {container} is in restart loop. Attempting to heal...{Colors.ENDC}")
                logs = get_container_logs(container)
                healed = heal_container(container, logs)
                
                if not healed:
                    print(f"{Colors.FAIL}❌ Unable to heal {container} automatically{Colors.ENDC}")
                    print(f"{Colors.WARNING}📋 Logs excerpt:{Colors.ENDC}")
                    print(logs[:500])  # Print first 500 chars of logs
                
                all_healthy = False
                time.sleep(TIMEOUT)
                break
            
            # Container not running
            if status != "running":
                print(f"{Colors.WARNING}⚠️  {container} is not running (status: {status}){Colors.ENDC}")
                all_healthy = False
                break
            
            # Container running but not healthy (if healthcheck exists)
            if health not in ["healthy", "unknown"]:
                print(f"{Colors.WARNING}⚠️  {container} is not healthy yet (health: {health}){Colors.ENDC}")
                all_healthy = False
        
        if all_healthy:
            print("")
            print(f"{Colors.BOLD}{Colors.OKGREEN}✅ All containers are healthy!{Colors.ENDC}")
            print(f"{Colors.OKCYAN}Docker infrastructure is ready.{Colors.ENDC}")
            sys.exit(0)
        
        print("")
        time.sleep(TIMEOUT)
    
    print("")
    print(f"{Colors.BOLD}{Colors.FAIL}❌ Timeout after {MAX_RETRIES} attempts{Colors.ENDC}")
    print(f"{Colors.WARNING}Some containers failed to reach healthy state.{Colors.ENDC}")
    print("")
    print(f"{Colors.OKCYAN}💡 Troubleshooting tips:{Colors.ENDC}")
    print("1. Check container logs: docker logs <container-name>")
    print("2. Check Docker status: docker ps -a")
    print("3. Restart Docker: docker-compose down && docker-compose up -d")
    print("4. Check system resources: docker stats")
    
    sys.exit(1)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n{Colors.WARNING}⚠️  Monitoring interrupted by user{Colors.ENDC}")
        sys.exit(130)
    except Exception as e:
        print(f"\n{Colors.FAIL}❌ Unexpected error: {e}{Colors.ENDC}")
        sys.exit(1)
