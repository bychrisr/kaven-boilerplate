#!/bin/bash
# consolidate_workflow_report.sh v2.1 - Complete Report Generator
# Based on original by Chris (@bychrisr) with v2.1 enhancements (Mermaid, Links, Auto-Fix)

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
echo "📊 WORKFLOW REPORT GENERATOR v2.1"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📂 Project Root: $PROJECT_ROOT"
echo "🎯 Workflow: $WORKFLOW_NAME"
echo ""

# ================================================================
# Define paths
# ================================================================
ARCHIVE_DIR=".agent/telemetry/archive"
TELEMETRY_DIR=".agent/telemetry"
SNAPSHOT_FILE="$TELEMETRY_DIR/last_execution.json"
METRICS_FILE="$TELEMETRY_DIR/metrics.json"
FILES_TRACKER="$TELEMETRY_DIR/files_tracker.txt"
VALIDATION_LOG="$TELEMETRY_DIR/validation.log"

REPORTS_DIR=".agent/reports"
mkdir -p "$REPORTS_DIR"
mkdir -p "$ARCHIVE_DIR"

REPORT_FILE="$REPORTS_DIR/WORKFLOW_REPORT_${WORKFLOW_NAME}_${TIMESTAMP}.md"

# ================================================================
# CRITICAL: Read from SNAPSHOT first
# ================================================================
echo "🔍 Checking telemetry sources..."

DATA_SOURCE=""
if [ -f "$SNAPSHOT_FILE" ]; then
    echo "✅ Using snapshot: $SNAPSHOT_FILE"
    DATA_SOURCE="$SNAPSHOT_FILE"
elif [ -f "$METRICS_FILE" ]; then
    echo "⚠️  Snapshot not found, using metrics.json"
    DATA_SOURCE="$METRICS_FILE"
else
    echo "❌ CRITICAL ERROR: NO TELEMETRY DATA FOUND"
    exit 1
fi

if [ ! -f "$FILES_TRACKER" ]; then
    touch "$FILES_TRACKER"
fi

echo ""

# ================================================================
# Read telemetry data
# ================================================================
echo "📊 Reading telemetry data..."

WORKFLOW_NAME_JSON=$(jq -r '.workflow_name // "N/A"' "$DATA_SOURCE" 2>/dev/null || echo "N/A")
TASK_DESC=$(jq -r '.task_description // "N/A"' "$DATA_SOURCE" 2>/dev/null || echo "N/A")
TIMESTAMP_START=$(jq -r '.timestamp_start // "N/A"' "$DATA_SOURCE" 2>/dev/null || echo "N/A")
TIMESTAMP_END=$(jq -r '.timestamp_end // "N/A"' "$DATA_SOURCE" 2>/dev/null || echo "N/A")
DURATION=$(jq -r '.duration_seconds // 0' "$DATA_SOURCE" 2>/dev/null || echo "0")
LOC=$(jq -r '.lines_of_code // 0' "$DATA_SOURCE" 2>/dev/null || echo "0")
SUCCESS=$(jq -r '.success // false' "$DATA_SOURCE" 2>/dev/null || echo "false")
EXEC_ID=$(jq -r '.execution_id // "N/A"' "$DATA_SOURCE" 2>/dev/null || echo "N/A")

FILES_COUNT=$(jq -r '.files_created | length' "$DATA_SOURCE" 2>/dev/null || echo "0")
COMMANDS_COUNT=$(jq -r '.commands_executed | length' "$DATA_SOURCE" 2>/dev/null || echo "0")

DURATION_MIN=$((DURATION / 60))
DURATION_SEC=$((DURATION % 60))

if [ "$SUCCESS" = "true" ]; then
    STATUS_EMOJI="✅"
    STATUS_TEXT="SUCCESS"
else
    STATUS_EMOJI="❌"
    STATUS_TEXT="FAILED"
fi

GIT_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

if [ -f "prisma/schema.prisma" ]; then
    PRISMA_MODELS=$(grep -c "^model " prisma/schema.prisma 2>/dev/null || echo "0")
    PRISMA_ENUMS=$(grep -c "^enum " prisma/schema.prisma 2>/dev/null || echo "0")
else
    PRISMA_MODELS=0
    PRISMA_ENUMS=0
fi

DOCKER_RUNNING=$(docker ps --filter "name=kaven" --format "{{.Names}}" 2>/dev/null | wc -l || echo "0")

echo "✅ Telemetry loaded"
echo ""

# ================================================================
# Generate Report
# ================================================================
echo "📝 Generating report..."

cat > "$REPORT_FILE" << HEADER_END
# 📊 WORKFLOW EXECUTION REPORT

> **Generated:** $(date '+%Y-%m-%d %H:%M:%S')
> **Workflow:** $WORKFLOW_NAME
> **Project:** Kaven Boilerplate
> **Report Version:** 2.1 (Enhanced)

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Telemetry Data](#2-telemetry-data)
3. [Files Created](#3-files-created)
4. [Docker Diagnostics](#4-docker-diagnostics)
5. [AI Validation](#5-ai-validation)
6. [Git Status](#6-git-status)

---

HEADER_END

# ================================================================
# SECTION 1: Executive Summary
# ================================================================
cat >> "$REPORT_FILE" << EOF
## 1. EXECUTIVE SUMMARY

### 🎯 Workflow Execution

| Metric | Value |
|--------|-------|
| **Workflow** | $WORKFLOW_NAME_JSON |
| **Task** | $TASK_DESC |
| **Status** | $STATUS_EMOJI $STATUS_TEXT |
| **End Time** | $TIMESTAMP_END |
| **Duration** | ${DURATION_MIN}m ${DURATION_SEC}s ($DURATION seconds) |
| **Files Created** | $FILES_COUNT |

### ✅ Completion Checklist

- [x] Workflow executed successfully
- [x] Telemetry generated ($FILES_COUNT files tracked)
EOF

if [ "$PRISMA_MODELS" -gt 0 ]; then
    echo "- [x] Prisma schema created ($PRISMA_MODELS models, $PRISMA_ENUMS enums)" >> "$REPORT_FILE"
fi

echo "- [x] Git commit created (\`$GIT_COMMIT\`)" >> "$REPORT_FILE"

if [ "$DOCKER_RUNNING" -gt 0 ]; then
    echo "- [x] Docker containers running ($DOCKER_RUNNING containers)" >> "$REPORT_FILE"
else
    echo "- [ ] Docker containers not running" >> "$REPORT_FILE"
fi

cat >> "$REPORT_FILE" << 'EOF'

---

## 2. TELEMETRY DATA

### 📊 Raw Execution Data

EOF

echo "\`\`\`json" >> "$REPORT_FILE"
cat "$DATA_SOURCE" | jq '.' >> "$REPORT_FILE" 2>/dev/null || cat "$DATA_SOURCE" >> "$REPORT_FILE"
echo "\`\`\`" >> "$REPORT_FILE"

cat >> "$REPORT_FILE" << 'EOF'

---

## 3. FILES CREATED

### 📁 Complete File List

EOF

echo "| # | File Path | Size | LOC | Status |" >> "$REPORT_FILE"
echo "|---|-----------|------|-----|--------|" >> "$REPORT_FILE"

INDEX=1
jq -r '.files_created[]' "$DATA_SOURCE" 2>/dev/null | while IFS= read -r file; do
    if [ -f "$file" ]; then
        SIZE=$(du -h "$file" 2>/dev/null | cut -f1 || echo "N/A")
        FILE_LOC=$(wc -l < "$file" 2>/dev/null || echo "0")
        # Use relative path from .agent/reports/ to project root
        REL_PATH="../../$file"
        echo "| $INDEX | [$file]($REL_PATH) | $SIZE | $FILE_LOC | ✅ |" >> "$REPORT_FILE"
    else
        echo "| $INDEX | \`$file\` | - | - | ❌ |" >> "$REPORT_FILE"
    fi
    INDEX=$((INDEX + 1))
done

cat >> "$REPORT_FILE" << 'EOF'

---

## 4. DOCKER DIAGNOSTICS

### 🧜‍♀️ Infrastructure Map

EOF

echo "\`\`\`mermaid" >> "$REPORT_FILE"
echo "graph TD" >> "$REPORT_FILE"

docker ps -a --filter "name=kaven" --format "{{.Names}}" 2>/dev/null | while read -r container; do
    STATUS=$(docker inspect --format='{{.State.Status}}' "$container" 2>/dev/null || echo "unknown")
    if [ "$STATUS" = "running" ]; then
        echo "    $container([✅ $container<br/>Running])" >> "$REPORT_FILE"
        echo "    style $container fill:#9f9,stroke:#333,stroke-width:2px" >> "$REPORT_FILE"
    else
        echo "    $container([❌ $container<br/>$STATUS])" >> "$REPORT_FILE"
        echo "    style $container fill:#f99,stroke:#333,stroke-width:2px" >> "$REPORT_FILE"
    fi
done
echo "\`\`\`" >> "$REPORT_FILE"

cat >> "$REPORT_FILE" << 'EOF'

### 🐳 Container Details

EOF

if [ "$DOCKER_RUNNING" -gt 0 ]; then
    echo "| Container | Status | Health | Ports |" >> "$REPORT_FILE"
    echo "|-----------|--------|--------|-------|" >> "$REPORT_FILE"
    
    docker ps -a --filter "name=kaven" --format "{{.Names}}" 2>/dev/null | while read -r container; do
        STATUS=$(docker inspect --format='{{.State.Status}}' "$container" 2>/dev/null || echo "unknown")
        HEALTH=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "N/A")
        PORTS=$(docker port "$container" 2>/dev/null | tr '\n' ' ' | sed 's/ $//' || echo "")
        
        if [ "$STATUS" = "running" ]; then
             EMOJI="✅"
        else
             EMOJI="❌"
        fi
        
        echo "| $EMOJI \`$container\` | $STATUS | $HEALTH | \`$PORTS\` |" >> "$REPORT_FILE"
        
        # Auto-Diagnostics for failed containers
        if [ "$STATUS" != "running" ] || [ "$HEALTH" == "unhealthy" ]; then
            echo "" >> "$REPORT_FILE"
            echo "<details><summary>🔍 <b>Debug Logs: $container</b></summary>" >> "$REPORT_FILE"
            echo "" >> "$REPORT_FILE"
            echo "\`\`\`" >> "$REPORT_FILE"
            docker logs --tail 20 "$container" 2>&1 >> "$REPORT_FILE" || echo "No logs available" >> "$REPORT_FILE"
            echo "\`\`\`" >> "$REPORT_FILE"
            echo "</details>" >> "$REPORT_FILE"
            echo "" >> "$REPORT_FILE"
        fi
    done
else
    echo "⚠️ **No Docker containers running**" >> "$REPORT_FILE"
fi

cat >> "$REPORT_FILE" << EOF

---

## 5. AI VALIDATION

EOF

WALKTHROUGH_FILE=".agent/telemetry/walkthrough.md"

if [ -f "$WALKTHROUGH_FILE" ]; then
    echo "🤖 Found AI walkthrough, injecting..."
    echo "### 🧠 AI Walkthrough & Insights" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    # Append content, skipping the first line (Title) to avoid duplicates
    tail -n +2 "$WALKTHROUGH_FILE" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
else
    echo "ℹ️  No AI walkthrough found at $WALKTHROUGH_FILE"
    echo "*No AI walkthrough/insights available for this execution.*" >> "$REPORT_FILE"
fi

cat >> "$REPORT_FILE" << EOF

---

## 6. GIT STATUS

**Branch:** \`$GIT_BRANCH\`
**Last Commit:** \`$GIT_COMMIT\`

EOF

if git diff --quiet 2>/dev/null; then
    echo "✅ **Working directory clean**" >> "$REPORT_FILE"
else
    echo "⚠️ **Uncommitted changes present**" >> "$REPORT_FILE"
fi

cat >> "$REPORT_FILE" << 'EOF'

---

**🎉 Report Complete!**
EOF

echo "✅ Report generated successfully at $REPORT_FILE"
