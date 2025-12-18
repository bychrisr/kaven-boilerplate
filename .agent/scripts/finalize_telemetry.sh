#!/bin/bash
# finalize_telemetry.sh v2.0 - Complete telemetry finalization with snapshot support

set -e

TELEMETRY_DIR=".agent/telemetry"
ARCHIVE_DIR="$TELEMETRY_DIR/archive"
CURRENT_FILE="$TELEMETRY_DIR/current_execution.json"
LAST_EXECUTION_FILE="$TELEMETRY_DIR/last_execution.json"
METRICS_FILE="$TELEMETRY_DIR/metrics.json"
FILES_TRACKER="$TELEMETRY_DIR/files_tracker.txt"
COMMANDS_TRACKER="$TELEMETRY_DIR/commands_tracker.txt"

echo "🏁 Finalizing telemetry..."

mkdir -p "$ARCHIVE_DIR"

if [ ! -f "$CURRENT_FILE" ]; then
    echo "❌ No current execution found at: $CURRENT_FILE"
    exit 1
fi

# ============================================================================
# READ FILES_TRACKER
# ============================================================================

if [ -f "$FILES_TRACKER" ] && [ -s "$FILES_TRACKER" ]; then
    FILES_CREATED=$(cat "$FILES_TRACKER" | grep -v '^[[:space:]]*$' | jq -R . | jq -s . 2>/dev/null || echo '[]')
    FILES_COUNT=$(grep -v '^[[:space:]]*$' "$FILES_TRACKER" 2>/dev/null | wc -l || echo "0")
else
    FILES_CREATED='[]'
    FILES_COUNT=0
fi

# ============================================================================
# READ COMMANDS_TRACKER (NEW: Automated command tracking)
# ============================================================================

if [ -f "$COMMANDS_TRACKER" ] && [ -s "$COMMANDS_TRACKER" ]; then
    COMMANDS=$(cat "$COMMANDS_TRACKER" | grep -v '^[[:space:]]*$' | jq -R . | jq -s . 2>/dev/null || echo '[]')
else
    COMMANDS='[]'
fi

# ============================================================================
# READ SUCCESS FLAG
# ============================================================================

if [ -f "$TELEMETRY_DIR/success.txt" ]; then
    SUCCESS=$(cat "$TELEMETRY_DIR/success.txt")
else
    SUCCESS="true"
fi

# ============================================================================
# COUNT LOC
# ============================================================================

LOC=0
if [ -f "$FILES_TRACKER" ] && [ -s "$FILES_TRACKER" ]; then
    echo "📊 Counting lines of code..."
    
    while IFS= read -r file; do
        # Skip empty lines
        if [ -z "$file" ]; then
            continue
        fi
        
        if [ -f "$file" ]; then
            # Count code files
            if [[ "$file" == *.ts ]] || \
               [[ "$file" == *.tsx ]] || \
               [[ "$file" == *.js ]] || \
               [[ "$file" == *.jsx ]] || \
               [[ "$file" == *.sql ]] || \
               [[ "$file" == *.prisma ]] || \
               [[ "$file" == *.yml ]] || \
               [[ "$file" == *.yaml ]] || \
               [[ "$file" == *.json ]] || \
               [[ "$file" == *Dockerfile* ]] || \
               [[ "$file" == *.md ]] || \
               [[ "$file" == *.sh ]]; then
                FILE_LOC=$(wc -l < "$file" 2>/dev/null || echo 0)
                LOC=$((LOC + FILE_LOC))
            fi
        fi
    done < <(grep -v '^[[:space:]]*$' "$FILES_TRACKER")
    
    echo "  Total: $LOC lines"
else
    echo "⚠️  No files tracked"
fi

# ============================================================================
# CALCULATE DURATION (Mathematical calculation - NEW)
# ============================================================================

TIMESTAMP_START=$(jq -r '.timestamp_start' "$CURRENT_FILE")
TIMESTAMP_END=$(date -u +%Y-%m-%dT%H:%M:%SZ)

echo ""
echo "⏱️  Calculating duration..."

# Try Python first for accurate ISO8601 date parsing
if command -v python3 &> /dev/null; then
    DURATION=$(python3 -c "
from datetime import datetime
try:
    start = datetime.strptime('$TIMESTAMP_START', '%Y-%m-%dT%H:%M:%SZ')
    end = datetime.strptime('$TIMESTAMP_END', '%Y-%m-%dT%H:%M:%SZ')
    print(int((end - start).total_seconds()))
except:
    print(0)
" 2>/dev/null || echo "0")
else
    # Fallback to basic bash arithmetic (less accurate)
    DURATION=0
    echo "  ⚠️  Python not available, duration calculation limited"
fi

echo "  Duration: ${DURATION}s"

# ============================================================================
# UPDATE CURRENT EXECUTION JSON
# ============================================================================

echo ""
echo "📝 Updating execution data..."

# Validate JSON before using
if ! echo "$FILES_CREATED" | jq empty 2>/dev/null; then
    echo "⚠️  FILES_CREATED is not valid JSON, using empty array"
    FILES_CREATED='[]'
fi

if ! echo "$COMMANDS" | jq empty 2>/dev/null; then
    echo "⚠️  COMMANDS is not valid JSON, using empty array"
    COMMANDS='[]'
fi

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

if [ $? -eq 0 ]; then
    mv "$CURRENT_FILE.tmp" "$CURRENT_FILE"
    echo "✅ Execution data updated"
else
    echo "❌ Failed to update execution data"
    rm -f "$CURRENT_FILE.tmp"
    exit 1
fi

# ============================================================================
# GENERATE EXECUTION ID
# ============================================================================

if command -v python3 &> /dev/null; then
    EXEC_ID=$(python3 -c "import uuid; print(str(uuid.uuid4()))" 2>/dev/null || echo "exec-$(date +%s)-$$")
elif [ -f /proc/sys/kernel/random/uuid ]; then
    EXEC_ID=$(cat /proc/sys/kernel/random/uuid)
else
    EXEC_ID="exec-$(date +%s)-$$"
fi

jq --arg id "$EXEC_ID" \
   '. + {execution_id: $id}' \
   "$CURRENT_FILE" > "$CURRENT_FILE.tmp" && mv "$CURRENT_FILE.tmp" "$CURRENT_FILE"

# ============================================================================
# CREATE SNAPSHOT (CRITICAL FIX - NEW)
# ============================================================================

echo ""
echo "📸 Creating execution snapshot..."

cp "$CURRENT_FILE" "$LAST_EXECUTION_FILE"
echo "✅ Snapshot saved to: $LAST_EXECUTION_FILE"

# ============================================================================
# ARCHIVE EXECUTION
# ============================================================================

ARCHIVE_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ARCHIVE_FILE="$ARCHIVE_DIR/execution_${ARCHIVE_TIMESTAMP}.json"

cp "$CURRENT_FILE" "$ARCHIVE_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Archived: $ARCHIVE_FILE"
else
    echo "⚠️  Failed to archive (not critical)"
fi

# ============================================================================
# UPDATE METRICS.JSON (Historical accumulation)
# ============================================================================

echo ""
echo "💾 Updating historical metrics..."

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

# FIX: Use jq slurp to merge files instead of variables
jq -s '.[0].executions += [.[1]] | .[0]' \
   "$METRICS_FILE" "$CURRENT_FILE" > "$METRICS_FILE.tmp"

if [ $? -eq 0 ]; then
    mv "$METRICS_FILE.tmp" "$METRICS_FILE"
    echo "✅ Metrics updated"
else
    echo "❌ Failed to update metrics"
    rm -f "$METRICS_FILE.tmp"
    exit 1
fi

# ============================================================================
# UPDATE SUMMARY STATISTICS
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
      "total_executions": $total,
      "success_rate": $rate,
      "total_duration_seconds": $dur,
      "total_files_created": $files,
      "total_lines_of_code": $loc
   }' \
   "$METRICS_FILE" > "$METRICS_FILE.tmp" && mv "$METRICS_FILE.tmp" "$METRICS_FILE"

# ============================================================================
# CLEANUP
# ============================================================================

echo ""
echo "🧹 Cleaning up temporary files..."

rm -f "$FILES_TRACKER" "$COMMANDS_TRACKER" "$TELEMETRY_DIR/success.txt"

# Reset current_execution for next run
echo '{}' > "$CURRENT_FILE"

# ============================================================================
# SUMMARY
# ============================================================================

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 TELEMETRY FINALIZED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📁 Files created: $FILES_COUNT"
echo "📊 Lines of code: $LOC"
echo "⏱️  Duration: $DURATION seconds"
echo "✅ Success: $SUCCESS"
echo ""
echo "📄 Snapshot: $LAST_EXECUTION_FILE"
echo "📦 Archive: $ARCHIVE_FILE"
echo "📈 Metrics: $METRICS_FILE"
echo ""
