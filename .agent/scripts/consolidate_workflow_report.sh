#!/bin/bash
# consolidate_workflow_report.sh v2.0 - Report generator reading from snapshot

set -e

WORKFLOW_NAME="${1:-workflow}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# ================================================================
# Detect project root
# ================================================================
if [[ "$(basename $(dirname $(pwd)))" == ".agent" ]]; then
    PROJECT_ROOT="$(cd ../.. && pwd)"
elif [[ "$(basename $(pwd))" == ".agent" ]]; then
    PROJECT_ROOT="$(cd .. && pwd)"
else
    PROJECT_ROOT="$(pwd)"
fi

cd "$PROJECT_ROOT"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 WORKFLOW REPORT GENERATOR v2.0"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📂 Project Root: $PROJECT_ROOT"
echo "🎯 Workflow: $WORKFLOW_NAME"
echo ""

# ================================================================
# Define paths - CRITICAL: Read from snapshot first!
# ================================================================
REPORTS_DIR=".agent/reports"
TELEMETRY_DIR=".agent/telemetry"
SNAPSHOT_FILE="$TELEMETRY_DIR/last_execution.json"
METRICS_FILE="$TELEMETRY_DIR/metrics.json"
FILES_TRACKER="$TELEMETRY_DIR/files_tracker.txt"
VALIDATION_LOG="$TELEMETRY_DIR/validation.log"

mkdir -p "$REPORTS_DIR"

REPORT_FILE="$REPORTS_DIR/WORKFLOW_REPORT_${WORKFLOW_NAME}_${TIMESTAMP}.md"

# ================================================================
# CRITICAL FIX: Use snapshot as primary data source
# ================================================================

if [ -f "$SNAPSHOT_FILE" ]; then
    echo "✅ Reading from snapshot: $SNAPSHOT_FILE"
    DATA_SOURCE="$SNAPSHOT_FILE"
    SOURCE_CMD="cat"
elif [ -f "$METRICS_FILE" ]; then
    echo "⚠️  Snapshot not found, falling back to metrics.json"
    DATA_SOURCE="$METRICS_FILE"
    SOURCE_CMD="jq -r '.executions[-1]'"
else
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "❌ CRITICAL ERROR: NO TELEMETRY DATA FOUND"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Expected files:"
    echo "  1. $SNAPSHOT_FILE (primary)"
    echo "  2. $METRICS_FILE (fallback)"
    echo ""
    echo "Please run the workflow first before generating report."
    exit 1
fi

# ================================================================
# Extract data from source
# ================================================================

echo "📊 Extracting execution data..."

WORKFLOW_DATA=$($SOURCE_CMD "$DATA_SOURCE")

# Extract fields with fallbacks
WORKFLOW_NAME_DATA=$(echo "$WORKFLOW_DATA" | jq -r '.workflow_name // "Unknown"')
TASK_DESC=$(echo "$WORKFLOW_DATA" | jq -r '.task_description // "No description"')
TIMESTAMP_START=$(echo "$WORKFLOW_DATA" | jq -r '.timestamp_start // "N/A"')
TIMESTAMP_END=$(echo "$WORKFLOW_DATA" | jq -r '.timestamp_end // "N/A"')
DURATION=$(echo "$WORKFLOW_DATA" | jq -r '.duration_seconds // 0')
LOC=$(echo "$WORKFLOW_DATA" | jq -r '.lines_of_code // 0')
FILES_COUNT=$(echo "$WORKFLOW_DATA" | jq -r '.files_created | length')
COMMANDS_COUNT=$(echo "$WORKFLOW_DATA" | jq -r '.commands_executed | length')
SUCCESS=$(echo "$WORKFLOW_DATA" | jq -r '.success // false')
EXEC_ID=$(echo "$WORKFLOW_DATA" | jq -r '.execution_id // "N/A"')

# Format duration
DURATION_MIN=$((DURATION / 60))
DURATION_SEC=$((DURATION % 60))

# Status emoji
if [ "$SUCCESS" = "true" ]; then
    STATUS_EMOJI="✅"
    STATUS_TEXT="SUCCESS"
else
    STATUS_EMOJI="❌"
    STATUS_TEXT="FAILED"
fi

# ================================================================
# Generate Markdown Report
# ================================================================

echo "📝 Generating report..."

cat > "$REPORT_FILE" << HEADER
# 📊 WORKFLOW EXECUTION REPORT

> **Generated:** $(date '+%Y-%m-%d %H:%M:%S')
> **Workflow:** $WORKFLOW_NAME_DATA
> **Project:** Kaven Boilerplate
> **Report Version:** 2.0 (Snapshot-Based)

---

## 📋 EXECUTIVE SUMMARY

### 🎯 Workflow Execution

| Metric | Value |
|--------|-------|
| **Workflow** | $WORKFLOW_NAME_DATA |
| **Status** | $STATUS_EMOJI $STATUS_TEXT |
| **Start Time** | $TIMESTAMP_START |
| **End Time** | $TIMESTAMP_END |
| **Duration** | ${DURATION_MIN}m ${DURATION_SEC}s ($DURATION seconds) |
| **Files Created** | $FILES_COUNT |
| **Commands Executed** | $COMMANDS_COUNT |
| **Lines of Code** | $LOC |
| **Execution ID** | \`$EXEC_ID\` |

### 📝 Task Description

$TASK_DESC

---

## 📊 TELEMETRY DATA

### Raw Execution JSON

\`\`\`json
HEADER

echo "$WORKFLOW_DATA" | jq '.' >> "$REPORT_FILE"

cat >> "$REPORT_FILE" << 'FOOTER'
```

### 🔑 Key Performance Indicators

**Efficiency Metrics:**
- **Execution Speed:** DURATION seconds
- **Code Generation Rate:** LOC_PER_SECOND LOC/second
- **Automation Level:** COMMANDS_COUNT commands executed automatically

**Quality Metrics:**
- **Success Status:** STATUS
- **Files Tracked:** FILES_COUNT
- **Command Tracking:** ✅ Active (via execute() wrapper)
- **LOC Counting:** ✅ Automated

---

## 📁 FILES CREATED

**Total:** FILES_COUNT files

<details>
<summary>Click to expand file list</summary>

```json
FILES_LIST
```

</details>

---

## 🤖 COMMANDS EXECUTED

**Total:** COMMANDS_COUNT commands

<details>
<summary>Click to expand command list</summary>

```json
COMMANDS_LIST
```

</details>

**📝 Note:** Commands are automatically tracked via the `execute()` wrapper function.

---

## 🎯 NEXT STEPS

### ✅ Immediate Actions

1. **Verify Build:**
   ```bash
   pnpm build
   pnpm test
   ```

2. **Check Quality:**
   ```bash
   pnpm lint
   ```

3. **Review Generated Files:**
   - Total files: FILES_COUNT
   - Total LOC: LOC

### 🚀 Continue Development

Ready for next workflow in the sequence.

---

## 📎 APPENDIX

### Report Metadata

- **Report Version:** 2.0 (Snapshot-Based)
- **Data Source:** DATA_SOURCE_PATH
- **Generated:** $(date '+%Y-%m-%d %H:%M:%S')
- **Project Root:** `$PROJECT_ROOT`

### Telemetry Architecture

**V2.0 Improvements:**
- ✅ Snapshot-based reporting (`last_execution.json`)
- ✅ Mathematical duration calculation (Python-based)
- ✅ Automated command tracking (`execute()` wrapper)
- ✅ Self-healing Docker (AI Doctor)

---

**🎉 Report Complete!**

*This report was generated from telemetry snapshot captured during workflow execution.*
FOOTER

# ================================================================
# Replace placeholders with actual values
# ================================================================

sed -i "s/DURATION/$DURATION/g" "$REPORT_FILE"
sed -i "s/STATUS/$STATUS_TEXT/g" "$REPORT_FILE"
sed -i "s/FILES_COUNT/$FILES_COUNT/g" "$REPORT_FILE"
sed -i "s/COMMANDS_COUNT/$COMMANDS_COUNT/g" "$REPORT_FILE"
sed -i "s|DATA_SOURCE_PATH|$DATA_SOURCE|g" "$REPORT_FILE"

# Calculate LOC/second
if [ "$DURATION" -gt 0 ]; then
    LOC_PER_SEC=$(awk "BEGIN {printf \"%.2f\", $LOC / $DURATION}")
else
    LOC_PER_SEC="N/A"
fi
sed -i "s/LOC_PER_SECOND/$LOC_PER_SEC/g" "$REPORT_FILE"

# Insert files list
FILES_LIST=$(echo "$WORKFLOW_DATA" | jq '.files_created')
sed -i "/FILES_LIST/r /dev/stdin" "$REPORT_FILE" <<< "$FILES_LIST"
sed -i '/FILES_LIST/d' "$REPORT_FILE"

# Insert commands list
COMMANDS_LIST=$(echo "$WORKFLOW_DATA" | jq '.commands_executed')
sed -i "/COMMANDS_LIST/r /dev/stdin" "$REPORT_FILE" <<< "$COMMANDS_LIST"
sed -i '/COMMANDS_LIST/d' "$REPORT_FILE"

sed -i "s/LOC/$LOC/g" "$REPORT_FILE"

# ================================================================
# Summary
# ================================================================

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ REPORT GENERATED SUCCESSFULLY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📄 Report: $REPORT_FILE"
echo "📊 Status: $STATUS_EMOJI $STATUS_TEXT"
echo "⏱️  Duration: ${DURATION_MIN}m ${DURATION_SEC}s"
echo "📁 Files: $FILES_COUNT"
echo "🤖 Commands: $COMMANDS_COUNT"
echo "📝 LOC: $LOC"
echo ""
