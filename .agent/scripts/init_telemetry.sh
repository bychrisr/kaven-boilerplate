#!/bin/bash
# init_telemetry.sh v2.0
set -e

TELEMETRY_DIR=".agent/telemetry"
CURRENT_FILE="$TELEMETRY_DIR/current_execution.json"
WORKFLOW_NAME="${1:-unnamed-workflow}"
TASK_DESCRIPTION="${2:-No description provided}"

mkdir -p "$TELEMETRY_DIR"

# Timestamp UTC
TIMESTAMP_START=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# Cria JSON inicial
cat > "$CURRENT_FILE" << JSON
{
  "timestamp_start": "$TIMESTAMP_START",
  "workflow_name": "$WORKFLOW_NAME",
  "task_description": "$TASK_DESCRIPTION",
  "files_created": [],
  "commands_executed": [],
  "success": true
}
JSON

# Limpa/Cria trackers
: > "$TELEMETRY_DIR/files_tracker.txt"
: > "$TELEMETRY_DIR/commands_tracker.txt"
echo "true" > "$TELEMETRY_DIR/success.txt"

echo "🔍 Telemetry initialized for: $WORKFLOW_NAME"
