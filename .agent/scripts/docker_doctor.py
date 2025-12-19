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
