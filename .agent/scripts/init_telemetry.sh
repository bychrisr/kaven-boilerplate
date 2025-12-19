#!/bin/bash
TELEMETRY_DIR=".agent/telemetry"
CURRENT_FILE="$TELEMETRY_DIR/current_execution.json"
WORKFLOW_NAME="${1:-unnamed}"
DESC="${2:-setup}"
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)

mkdir -p "$TELEMETRY_DIR"
cat > "$CURRENT_FILE" << JSON
{
  "timestamp_start": "$TIMESTAMP",
  "workflow_name": "$WORKFLOW_NAME",
  "task_description": "$DESC",
  "files_created": [],
  "commands_executed": [],
  "success": true
}
JSON
: > "$TELEMETRY_DIR/files_tracker.txt"
: > "$TELEMETRY_DIR/commands_tracker.txt"
echo "true" > "$TELEMETRY_DIR/success.txt"
echo "✅ Telemetria iniciada: $WORKFLOW_NAME"
