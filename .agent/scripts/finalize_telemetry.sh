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
ARCHIVE_TIMESTAMP=$(date +%s)
cp "$CURRENT_FILE" "$TELEMETRY_DIR/archive/exec_${ARCHIVE_TIMESTAMP}.json"

# ================================================================
# Handle Walkthrough Artifact (Consume, Archive, Stage)
# ================================================================
WORKFLOW_NAME=$(jq -r '.workflow_name // "unknown"' "$CURRENT_FILE")
STAGING_FILE="$TELEMETRY_DIR/staging_walkthrough.md"
ARCHIVE_W_DIR="$TELEMETRY_DIR/archive/walkthroughs"
mkdir -p "$ARCHIVE_W_DIR"

if [ -f "walkthrough.md" ]; then
    echo "🧠 Found 'walkthrough.md' in root. Processing..."
    
    # 1. Archive (History)
    cp "walkthrough.md" "$ARCHIVE_W_DIR/${ARCHIVE_TIMESTAMP}_${WORKFLOW_NAME}_walkthrough.md"
    echo "✅ Archived to $ARCHIVE_W_DIR/"
    
    # 2. Stage (For Report) - OVERWRITE any existing staging
    mv "walkthrough.md" "$STAGING_FILE"
    echo "✅ Moved to staging ($STAGING_FILE) for report generation."
    
elif [ -f "$STAGING_FILE" ]; then
    # If no new walkthrough, KEEP existing staging for the report to pick up?
    # User requirement: "walkthrough é para ser temporário, depois que gera o report... apaga"
    # So if we are finalizing a NEW execution and there is NO new walkthrough, 
    # we should probably NOT clear staging yet, because finalize runs BEFORE report.
    # Actually, finalize marks the end of execution. If there is no walkthrough for THIS execution, 
    # maybe we should clear staging to prevent old walkthroughs attaching to new reports?
    # Decision: Safety first. If no new walkthrough provided for this execution, assume none exists.
    # BUT, if the user forgot to create it, they might want to add it later.
    # Better approach: The REPORT script deletes it. Finalize just adds if present.
    echo "ℹ️  No new 'walkthrough.md' found. Keeping existing staging if any."
fi

if [ ! -f "$METRICS_FILE" ]; then echo '{"executions":[]}' > "$METRICS_FILE"; fi
jq -s '.[0].executions += [.[1]] | .[0]' "$METRICS_FILE" "$CURRENT_FILE" > "$METRICS_FILE.tmp" && mv "$METRICS_FILE.tmp" "$METRICS_FILE"

rm -f "$FILES_TRACKER" "$COMMANDS_TRACKER" "$TELEMETRY_DIR/success.txt"
echo "{}" > "$CURRENT_FILE"
echo "✅ Telemetria finalizada."
