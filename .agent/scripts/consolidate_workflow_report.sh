#!/bin/bash
# consolidate_workflow_report.sh v2.0
set -e

WORKFLOW_NAME="${1:-workflow}"
PROJECT_ROOT=$(pwd) # Assume rodando da raiz
TELEMETRY_DIR=".agent/telemetry"
SNAPSHOT="$TELEMETRY_DIR/last_execution.json"
REPORT_DIR=".agent/reports"
mkdir -p "$REPORT_DIR"
REPORT_FILE="$REPORT_DIR/REPORT_${WORKFLOW_NAME}_$(date +%Y%m%d_%H%M%S).md"

# Lê do Snapshot
if [ ! -f "$SNAPSHOT" ]; then echo "❌ No snapshot found"; exit 1; fi

DURATION=$(jq -r '.duration_seconds // 0' "$SNAPSHOT")
LOC=$(jq -r '.lines_of_code // 0' "$SNAPSHOT")
SUCCESS=$(jq -r '.success' "$SNAPSHOT")
[ "$SUCCESS" = "true" ] && EMOJI="✅" || EMOJI="❌"

echo "# 📊 Workflow Report: $WORKFLOW_NAME" > "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "| Metric | Value |" >> "$REPORT_FILE"
echo "|---|---|" >> "$REPORT_FILE"
echo "| Status | $EMOJI $SUCCESS |" >> "$REPORT_FILE"
echo "| Duration | ${DURATION}s |" >> "$REPORT_FILE"
echo "| Lines of Code | $LOC |" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "## Executed Commands" >> "$REPORT_FILE"
echo "\`\`\`json" >> "$REPORT_FILE"
jq '.commands_executed' "$SNAPSHOT" >> "$REPORT_FILE"
echo "\`\`\`" >> "$REPORT_FILE"

echo "✅ Report generated at: $REPORT_FILE"
