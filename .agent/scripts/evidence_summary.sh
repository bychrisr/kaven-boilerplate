#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LAST_FILE="$ROOT/.last_artifact_dir"

if [[ ! -f "$LAST_FILE" ]]; then
  echo "No evidence bundle found. Run evidence_init first.";
  exit 1
fi

RUN_DIR="$(cat "$LAST_FILE")"

echo "# Evidence Bundle Summary"
echo
echo "- dir: $RUN_DIR"

if [[ -f "$RUN_DIR/meta.env" ]]; then
  echo "- meta:"; sed 's/^/  - /' "$RUN_DIR/meta.env"; echo
fi

for f in git_status_before.txt git_status_after.txt git_diffstat_before.txt git_diffstat_after.txt linecount_before.txt linecount_after.txt; do
  if [[ -f "$RUN_DIR/$f" ]]; then
    echo "## $f"; echo "```"; cat "$RUN_DIR/$f"; echo "```"; echo
  fi
done

echo "## last logs"
for f in "$ROOT/reports/last_lint.log" "$ROOT/reports/last_typecheck.log" "$ROOT/reports/last_test.log"; do
  if [[ -f "$f" ]]; then
    echo "### $(basename "$f")"; echo "```"; tail -n 120 "$f"; echo "```"; echo
  fi
done
