#!/usr/bin/env bash
set -euo pipefail

WORKFLOW="${1:-unknown}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LAST_FILE="$ROOT/.last_artifact_dir"

if [[ ! -f "$LAST_FILE" ]]; then
  echo "[evidence_finalize] No .last_artifact_dir found. Run evidence_init first."
  exit 1
fi

RUN_DIR="$(cat "$LAST_FILE")"

(git status --porcelain=v1 || true) > "$RUN_DIR/git_status_after.txt"
(git diff --stat || true) > "$RUN_DIR/git_diffstat_after.txt"
(git diff || true) > "$RUN_DIR/git_diff.patch"

# Line counts after
for f in README.md docs/README.md; do
  if [[ -f "$f" ]]; then
    wc -l "$f" >> "$RUN_DIR/linecount_after.txt"
  fi
done

{
  echo "workflow=$WORKFLOW"
  echo "finished_at=$(date -Iseconds)"
} >> "$RUN_DIR/meta.env"

echo "[evidence_finalize] $RUN_DIR"
