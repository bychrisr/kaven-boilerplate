#!/bin/bash
# Finalize Telemetry v5.0 - SIMPLE APPROACH THAT WORKS
set -e

TELEMETRY_DIR=".agent/telemetry"
ARCHIVE_DIR="$TELEMETRY_DIR/archive"
CURRENT_FILE="$TELEMETRY_DIR/current_execution.json"
METRICS_FILE="$TELEMETRY_DIR/metrics.json"
FILES_TRACKER="$TELEMETRY_DIR/files_tracker.txt"
COMMANDS_TRACKER="$TELEMETRY_DIR/commands_tracker.txt"
DURATION_FILE="$TELEMETRY_DIR/duration.txt"

echo "🏁 Finalizing telemetry..."
echo ""

mkdir -p "$ARCHIVE_DIR"

if [ ! -f "$CURRENT_FILE" ]; then
    echo "❌ No current execution found"
    exit 1
fi

# ============================================================================
# READ DATA
# ============================================================================

if [ -f "$FILES_TRACKER" ]; then
    FILES_CREATED=$(cat "$FILES_TRACKER" | jq -R . | jq -s .)
    FILES_COUNT=$(cat "$FILES_TRACKER" | wc -l)
else
    FILES_CREATED='[]'
    FILES_COUNT=0
fi

if [ -f "$COMMANDS_TRACKER" ]; then
    COMMANDS=$(cat "$COMMANDS_TRACKER" | jq -R . | jq -s .)
else
    COMMANDS='[]'
fi

if [ -f "$TELEMETRY_DIR/success.txt" ]; then
    SUCCESS=$(cat "$TELEMETRY_DIR/success.txt")
else
    SUCCESS="true"
fi

# ============================================================================
# COUNT LOC
# ============================================================================

LOC=0
if [ -f "$FILES_TRACKER" ]; then
    echo "📊 Counting lines of code..."
    while IFS= read -r file; do
        if [ -f "$file" ]; then
            # Count code files: TS, SQL, Prisma, YAML, Dockerfile, Markdown, Shell
            if [[ "$file" == *.ts ]] || \
               [[ "$file" == *.tsx ]] || \
               [[ "$file" == *.sql ]] || \
               [[ "$file" == *.prisma ]] || \
               [[ "$file" == *.yml ]] || \
               [[ "$file" == *.yaml ]] || \
               [[ "$file" == *Dockerfile* ]] || \
               [[ "$file" == *.md ]] || \
               [[ "$file" == *.sh ]]; then
                FILE_LOC=$(wc -l < "$file" 2>/dev/null || echo 0)
                LOC=$((LOC + FILE_LOC))
            fi
        fi
    done < "$FILES_TRACKER"
    echo "  Total: $LOC lines"
fi
echo ""

# ============================================================================
# READ DURATION (SIMPLE!)
# ============================================================================

# Duration is either provided in duration.txt OR we use 0
if [ -f "$DURATION_FILE" ]; then
    DURATION=$(cat "$DURATION_FILE" | tr -d '[:space:]')
else
    DURATION=0
fi

# ============================================================================
# UPDATE CURRENT EXECUTION
# ============================================================================

TIMESTAMP_END=$(date -u +%Y-%m-%dT%H:%M:%SZ)

jq --argjson files "$FILES_CREATED" \
   --argjson cmds "$COMMANDS" \
   --arg success "$SUCCESS" \
   --arg ts_end "$TIMESTAMP_END" \
   --argjson loc "$LOC" \
   --argjson dur "$DURATION" \
   '.files_created = $files | 
    .commands_executed = $cmds | 
    .success = ($success == "true") |
    .timestamp_end = $ts_end |
    .lines_of_code = $loc |
    .duration_seconds = $dur' \
   "$CURRENT_FILE" > "$CURRENT_FILE.tmp"

mv "$CURRENT_FILE.tmp" "$CURRENT_FILE"

# ============================================================================
# GENERATE EXECUTION ID
# ============================================================================

if command -v python3 &> /dev/null; then
    EXEC_ID=$(python3 -c "import uuid; print(str(uuid.uuid4()))" 2>/dev/null || echo "exec-$(date +%s)-$$")
elif command -v python &> /dev/null; then
    EXEC_ID=$(python -c "import uuid; print str(uuid.uuid4())" 2>/dev/null || echo "exec-$(date +%s)-$$")
elif [ -f /proc/sys/kernel/random/uuid ]; then
    EXEC_ID=$(cat /proc/sys/kernel/random/uuid)
else
    EXEC_ID="exec-$(date +%s)-$$"
fi

jq --arg id "$EXEC_ID" \
   '. + {execution_id: $id}' \
   "$CURRENT_FILE" > "$CURRENT_FILE.tmp"

mv "$CURRENT_FILE.tmp" "$CURRENT_FILE"

# ============================================================================
# ARCHIVE
# ============================================================================

ARCHIVE_FILE="$ARCHIVE_DIR/execution_$(date +%Y%m%d_%H%M%S).json"
cp "$CURRENT_FILE" "$ARCHIVE_FILE"

echo "✅ Archived: $ARCHIVE_FILE"
echo ""

# ============================================================================
# UPDATE METRICS
# ============================================================================

if [ ! -f "$METRICS_FILE" ]; then
    echo '{
  "project": "kaven-boilerplate",
  "version": "2.0.0",
  "executions": [],
  "summary": {
    "total_executions": 0,
    "success_rate": 100,
    "total_duration_seconds": 0,
    "total_files_created": 0,
    "total_lines_of_code": 0
  }
}' > "$METRICS_FILE"
fi

EXEC_ENTRY=$(cat "$CURRENT_FILE")
jq --argjson exec "$EXEC_ENTRY" \
   '.executions += [$exec]' \
   "$METRICS_FILE" > "$METRICS_FILE.tmp"

mv "$METRICS_FILE.tmp" "$METRICS_FILE"

# ============================================================================
# UPDATE SUMMARY
# ============================================================================

TOTAL=$(jq '.executions | length' "$METRICS_FILE")
SUCCESS_COUNT=$(jq '[.executions[] | select(.success == true)] | length' "$METRICS_FILE")
SUCCESS_RATE=$(awk "BEGIN {if ($TOTAL > 0) printf \"%.2f\", ($SUCCESS_COUNT * 100 / $TOTAL); else print 100}")
TOTAL_DURATION=$(jq '[.executions[].duration_seconds] | add // 0' "$METRICS_FILE")
TOTAL_FILES=$(jq '[.executions[].files_created | length] | add // 0' "$METRICS_FILE")
TOTAL_LOC=$(jq '[.executions[].lines_of_code] | add // 0' "$METRICS_FILE")

jq --argjson total "$TOTAL" \
   --argjson rate "$SUCCESS_RATE" \
   --argjson dur "$TOTAL_DURATION" \
   --argjson files "$TOTAL_FILES" \
   --argjson loc "$TOTAL_LOC" \
   '.summary = {
     total_executions: $total,
     success_rate: $rate,
     total_duration_seconds: $dur,
     total_files_created: $files,
     total_lines_of_code: $loc
   }' \
   "$METRICS_FILE" > "$METRICS_FILE.tmp"

mv "$METRICS_FILE.tmp" "$METRICS_FILE"

# ============================================================================
# CLEANUP
# ============================================================================

rm -f "$FILES_TRACKER" "$COMMANDS_TRACKER" "$TELEMETRY_DIR/success.txt" "$DURATION_FILE"
echo '{}' > "$CURRENT_FILE"

# ============================================================================
# SUMMARY
# ============================================================================

echo "✅ Telemetry finalized!"
echo "📊 Execution ID: $EXEC_ID"
echo "⏱  Duration: ${DURATION}s"
echo "📁 Files: $FILES_COUNT"
echo "📝 LOC: $LOC"
echo "📈 Success rate: ${SUCCESS_RATE}%"
echo ""