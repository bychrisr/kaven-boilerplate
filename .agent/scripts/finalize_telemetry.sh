#!/bin/bash
TELEMETRY_DIR=".agent/telemetry"
CURRENT_FILE="$TELEMETRY_DIR/current_execution.json"
LAST_EXECUTION_FILE="$TELEMETRY_DIR/last_execution.json"
FILES_TRACKER="$TELEMETRY_DIR/files_tracker.txt"
COMMANDS_TRACKER="$TELEMETRY_DIR/commands_tracker.txt"
METRICS_FILE="$TELEMETRY_DIR/metrics.json"

if [ -f "$FILES_TRACKER" ]; then FILES=$(jq -R . "$FILES_TRACKER" | jq -s .); else FILES='[]'; fi
if [ -f "$COMMANDS_TRACKER" ]; then CMDS=$(jq -R . "$COMMANDS_TRACKER" | jq -s .); else CMDS='[]'; fi

START=$(jq -r '.timestamp_start' "$CURRENT_FILE")
END=$(date -u +%Y-%m-%dT%H:%M:%SZ)
DUR=0
if command -v python3 &>/dev/null; then
    DUR=$(python3 -c "from datetime import datetime; s=datetime.strptime('$START', '%Y-%m-%dT%H:%M:%SZ'); e=datetime.strptime('$END', '%Y-%m-%dT%H:%M:%SZ'); print(int((e-s).total_seconds()))" 2>/dev/null || echo 0)
fi

jq --argjson f "$FILES" --argjson c "$CMDS" --arg e "$END" --argjson d "$DUR" \
   '.files_created=$f | .commands_executed=$c | .timestamp_end=$e | .duration_seconds=$d' \
   "$CURRENT_FILE" > "$CURRENT_FILE.tmp" && mv "$CURRENT_FILE.tmp" "$CURRENT_FILE"

cp "$CURRENT_FILE" "$LAST_EXECUTION_FILE"
cp "$CURRENT_FILE" "$TELEMETRY_DIR/archive/exec_$(date +%s).json"

if [ ! -f "$METRICS_FILE" ]; then echo '{"executions":[]}' > "$METRICS_FILE"; fi
jq -s '.[0].executions += [.[1]] | .[0]' "$METRICS_FILE" "$CURRENT_FILE" > "$METRICS_FILE.tmp" && mv "$METRICS_FILE.tmp" "$METRICS_FILE"

rm -f "$FILES_TRACKER" "$COMMANDS_TRACKER" "$TELEMETRY_DIR/success.txt"
echo "{}" > "$CURRENT_FILE"
echo "✅ Telemetria finalizada."
