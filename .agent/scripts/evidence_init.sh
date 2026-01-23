#!/usr/bin/env bash
set -euo pipefail

WORKFLOW="${1:-unknown}"
NOTE="${2:-}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ART_DIR="$ROOT/artifacts"
mkdir -p "$ART_DIR" "$ROOT/reports"

TS=$(date +"%Y%m%d_%H%M%S")
RUN_DIR="$ART_DIR/${TS}__${WORKFLOW}"
mkdir -p "$RUN_DIR"

{
  echo "workflow=$WORKFLOW"
  echo "note=$NOTE"
  echo "started_at=$(date -Iseconds)"
  echo "cwd=$(pwd)"
  echo "git_branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)"
} > "$RUN_DIR/meta.env"

# Baseline snapshot
(git status --porcelain=v1 || true) > "$RUN_DIR/git_status_before.txt"
(git diff --stat || true) > "$RUN_DIR/git_diffstat_before.txt"

# Helpful: baseline line counts for common docs if they exist
for f in README.md docs/README.md; do
  if [[ -f "$f" ]]; then
    wc -l "$f" >> "$RUN_DIR/linecount_before.txt"
  fi
done

echo "$RUN_DIR" > "$ROOT/.last_artifact_dir"

echo "[evidence_init] $RUN_DIR"
