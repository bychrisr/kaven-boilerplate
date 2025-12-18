#!/bin/bash
# init_telemetry.sh v2.0 - Telemetry initialization with command tracker support

set -e

TELEMETRY_DIR=".agent/telemetry"
ARCHIVE_DIR="$TELEMETRY_DIR/archive"
CURRENT_FILE="$TELEMETRY_DIR/current_execution.json"

WORKFLOW_NAME="${1:-unnamed-workflow}"
TASK_DESCRIPTION="${2:-No description provided}"

echo "🔍 Initializing telemetry for: $WORKFLOW_NAME"

# Create directory structure
mkdir -p "$TELEMETRY_DIR" "$ARCHIVE_DIR"

# Create current execution file
TIMESTAMP_START=$(date -u +%Y-%m-%dT%H:%M:%SZ)

cat > "$CURRENT_FILE" << JSON
{
  "timestamp_start": "$TIMESTAMP_START",
  "workflow_name": "$WORKFLOW_NAME",
  "task_description": "$TASK_DESCRIPTION",
  "files_created": [],
  "files_modified": [],
  "commands_executed": [],
  "success": true,
  "agent_mode": "act"
}
JSON

# Create trackers
touch "$TELEMETRY_DIR/files_tracker.txt"
touch "$TELEMETRY_DIR/commands_tracker.txt"
echo "true" > "$TELEMETRY_DIR/success.txt"

echo "✅ Telemetry initialized"
echo "   Workflow: $WORKFLOW_NAME"
echo "   Started: $TIMESTAMP_START"
