#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

req=(
  "$ROOT/config/quality.env"
  "$ROOT/rules/00-truth-protocol.md"
  "$ROOT/workflows/preflight.md"
  "$ROOT/workflows/ci-verify.md"
  "$ROOT/scripts/ag.sh"
)

ok=1
for f in "${req[@]}"; do
  if [[ ! -f "$f" ]]; then
    echo "Missing: $f"
    ok=0
  fi
done

if [[ "$ok" -eq 1 ]]; then
  echo "[validate_agent] OK"
else
  echo "[validate_agent] FAIL"
  exit 1
fi
