#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$ROOT/config/quality.env"

log(){ printf "[ag] %s
" "$*"; }

run_cmd(){
  # Safe runner: no eval. To run pipelines, call: bash -lc "<cmd>"
  log "$*"
  "$@"
}

case "${1:-}" in
  lint)
    run_cmd bash -lc "$AG_LINT_CMD" |& tee -a "$ROOT/reports/last_lint.log";
    ;;
  typecheck)
    run_cmd bash -lc "$AG_TYPECHECK_CMD" |& tee -a "$ROOT/reports/last_typecheck.log";
    ;;
  test)
    run_cmd bash -lc "$AG_TEST_CMD" |& tee -a "$ROOT/reports/last_test.log";
    ;;
  build)
    run_cmd bash -lc "${AG_BUILD_CMD:-}" |& tee -a "$ROOT/reports/last_build.log";
    ;;
  *)
    cat <<'USAGE'
Usage:
  bash .agent/scripts/ag.sh lint
  bash .agent/scripts/ag.sh typecheck
  bash .agent/scripts/ag.sh test
  bash .agent/scripts/ag.sh build
USAGE
    exit 1
    ;;
esac
