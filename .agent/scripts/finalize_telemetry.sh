#!/bin/bash
# finalize_telemetry.sh v2.0 (Snapshot & Math Fix)
set -e

TELEMETRY_DIR=".agent/telemetry"
ARCHIVE_DIR="$TELEMETRY_DIR/archive"
CURRENT_FILE="$TELEMETRY_DIR/current_execution.json"
LAST_EXECUTION_FILE="$TELEMETRY_DIR/last_execution.json"
METRICS_FILE="$TELEMETRY_DIR/metrics.json"
FILES_TRACKER="$TELEMETRY_DIR/files_tracker.txt"
COMMANDS_TRACKER="$TELEMETRY_DIR/commands_tracker.txt"

mkdir -p "$ARCHIVE_DIR"

if [ ! -f "$CURRENT_FILE" ]; then echo "❌ No execution found"; exit 1; fi

# Ler Trackers
if [ -s "$FILES_TRACKER" ]; then
    FILES_CREATED=$(jq -R . "$FILES_TRACKER" | jq -s .)
else
    FILES_CREATED='[]'
fi

if [ -s "$COMMANDS_TRACKER" ]; then
    COMMANDS=$(jq -R . "$COMMANDS_TRACKER" | jq -s .)
else
    COMMANDS='[]'
fi

SUCCESS=$(cat "$TELEMETRY_DIR/success.txt" 2>/dev/null || echo "true")

# Calcular LOC (Lines of Code)
LOC=0
if [ -s "$FILES_TRACKER" ]; then
    while read -r file; do
        if [ -f "$file" ]; then
            L=$(wc -l < "$file" 2>/dev/null || echo 0)
            LOC=$((LOC + L))
        fi
    done < "$FILES_TRACKER"
fi

# Calcular Duração
TIMESTAMP_START=$(jq -r '.timestamp_start' "$CURRENT_FILE")
TIMESTAMP_END=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# Tenta Python para precisão, senão usa Bash
if command -v python3 &>/dev/null; then
    DURATION=$(python3 -c "from datetime import datetime; s=datetime.strptime('$TIMESTAMP_START', '%Y-%m-%dT%H:%M:%SZ'); e=datetime.strptime('$TIMESTAMP_END', '%Y-%m-%dT%H:%M:%SZ'); print(int((e-s).total_seconds()))" 2>/dev/null || echo 0)
else
    DURATION=0
fi

# Atualizar JSON
jq --argjson files "$FILES_CREATED" --argjson cmds "$COMMANDS" --arg success "$SUCCESS" --arg end "$TIMESTAMP_END" --argjson loc "$LOC" --argjson dur "$DURATION" \
   '.files_created = $files | .commands_executed = $cmds | .success = ($success == "true") | .timestamp_end = $end | .lines_of_code = $loc | .duration_seconds = $dur' \
   "$CURRENT_FILE" > "$CURRENT_FILE.tmp" && mv "$CURRENT_FILE.tmp" "$CURRENT_FILE"

# Criar ID e Snapshot
ID="exec-$(date +%s)"
jq --arg id "$ID" '. + {execution_id: $id}' "$CURRENT_FILE" > "$CURRENT_FILE.tmp" && mv "$CURRENT_FILE.tmp" "$CURRENT_FILE"

# *** O PULO DO GATO: SNAPSHOT ***
cp "$CURRENT_FILE" "$LAST_EXECUTION_FILE"
cp "$CURRENT_FILE" "$ARCHIVE_DIR/${ID}.json"

# Atualizar Histórico (Metrics)
if [ ! -f "$METRICS_FILE" ]; then echo '{"executions": [], "summary": {}}' > "$METRICS_FILE"; fi
jq -s '.[0].executions += [.[1]] | .[0]' "$METRICS_FILE" "$CURRENT_FILE" > "$METRICS_FILE.tmp" && mv "$METRICS_FILE.tmp" "$METRICS_FILE"

# Limpeza
rm -f "$FILES_TRACKER" "$COMMANDS_TRACKER" "$TELEMETRY_DIR/success.txt"
echo '{}' > "$CURRENT_FILE"

echo "✅ Telemetry finalized. Duration: ${DURATION}s"
