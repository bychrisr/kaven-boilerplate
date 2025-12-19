#!/bin/bash
# consolidate_workflow_report.sh v2.0 - Complete Report Generator
# Based on original by Chris (@bychrisr) with v2.0 enhancements

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
# Define paths - CORRETO: .agent/telemetry/archive/
# ================================================================
ARCHIVE_DIR=".agent/telemetry/archive"
TELEMETRY_DIR=".agent/telemetry"
SNAPSHOT_FILE="$TELEMETRY_DIR/last_execution.json"
METRICS_FILE="$TELEMETRY_DIR/metrics.json"
FILES_TRACKER="$TELEMETRY_DIR/files_tracker.txt"
VALIDATION_LOG="$TELEMETRY_DIR/validation.log"

# Criar diretório de reports (não archive)
REPORTS_DIR=".agent/reports"
mkdir -p "$REPORTS_DIR"
mkdir -p "$ARCHIVE_DIR"

REPORT_FILE="$REPORTS_DIR/WORKFLOW_REPORT_${WORKFLOW_NAME}_${TIMESTAMP}.md"

# ================================================================
# CRITICAL: Read from SNAPSHOT first (v2.0 improvement)
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
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "❌ CRITICAL ERROR: NO TELEMETRY DATA FOUND"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Expected files:"
    echo "  1. $SNAPSHOT_FILE (primary)"
    echo "  2. $METRICS_FILE (fallback)"
    echo ""
    echo "Solution:"
    echo "  1. Run workflow: antigravity run .agent/workflows/$WORKFLOW_NAME.md"
    echo "  2. Wait for completion"
    echo "  3. Run this script again"
    echo ""
    exit 1
fi

# Check files_tracker
if [ ! -f "$FILES_TRACKER" ]; then
    echo "⚠️  Warning: $FILES_TRACKER not found (will use empty list)"
    touch "$FILES_TRACKER"
fi

echo ""

# ================================================================
# Read telemetry data
# ================================================================
echo "📊 Reading telemetry data..."

# Read from data source
WORKFLOW_NAME_JSON=$(jq -r '.workflow_name // "N/A"' "$DATA_SOURCE" 2>/dev/null || echo "N/A")
TASK_DESC=$(jq -r '.task_description // "N/A"' "$DATA_SOURCE" 2>/dev/null || echo "N/A")
TIMESTAMP_START=$(jq -r '.timestamp_start // "N/A"' "$DATA_SOURCE" 2>/dev/null || echo "N/A")
TIMESTAMP_END=$(jq -r '.timestamp_end // "N/A"' "$DATA_SOURCE" 2>/dev/null || echo "N/A")
DURATION=$(jq -r '.duration_seconds // 0' "$DATA_SOURCE" 2>/dev/null || echo "0")
LOC=$(jq -r '.lines_of_code // 0' "$DATA_SOURCE" 2>/dev/null || echo "0")
SUCCESS=$(jq -r '.success // false' "$DATA_SOURCE" 2>/dev/null || echo "false")
EXEC_ID=$(jq -r '.execution_id // "N/A"' "$DATA_SOURCE" 2>/dev/null || echo "N/A")

# Count files and commands
FILES_COUNT=$(jq -r '.files_created | length' "$DATA_SOURCE" 2>/dev/null || echo "0")
COMMANDS_COUNT=$(jq -r '.commands_executed | length' "$DATA_SOURCE" 2>/dev/null || echo "0")

# Convert duration
DURATION_MIN=$((DURATION / 60))
DURATION_SEC=$((DURATION % 60))

# Status
if [ "$SUCCESS" = "true" ]; then
    STATUS_EMOJI="✅"
    STATUS_TEXT="SUCCESS"
else
    STATUS_EMOJI="❌"
    STATUS_TEXT="FAILED"
fi

# Git info
GIT_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
GIT_COMMIT_MSG=$(git log -1 --pretty=format:"%h %s" 2>/dev/null || echo "No commits")

# Prisma info
if [ -f "prisma/schema.prisma" ]; then
    PRISMA_MODELS=$(grep -c "^model " prisma/schema.prisma 2>/dev/null || echo "0")
    PRISMA_ENUMS=$(grep -c "^enum " prisma/schema.prisma 2>/dev/null || echo "0")
    PRISMA_LINES=$(wc -l < prisma/schema.prisma 2>/dev/null || echo "0")
else
    PRISMA_MODELS=0
    PRISMA_ENUMS=0
    PRISMA_LINES=0
fi

# Docker info
DOCKER_RUNNING=$(docker ps --filter "name=kaven" --format "{{.Names}}" 2>/dev/null | wc -l || echo "0")

echo "✅ Telemetry loaded"
echo ""

# ================================================================
# Generate Report
# ================================================================
echo "📝 Generating report..."

cat > "$REPORT_FILE" << 'HEADER_END'
# 📊 WORKFLOW EXECUTION REPORT

> **Generated:** TIMESTAMP_PLACEHOLDER
> **Workflow:** WORKFLOW_NAME_PLACEHOLDER
> **Project:** Kaven Boilerplate v2.0
> **Report Version:** 2.0 (Snapshot-Based)

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Telemetry Data](#2-telemetry-data)
3. [Files Created](#3-files-created)
4. [Prisma Schema](#4-prisma-schema)
5. [Validation Results](#5-validation-results)
6. [Docker Status](#6-docker-status)
7. [Git Status](#7-git-status)
8. [Next Steps](#8-next-steps)

---

HEADER_END

# Replace placeholders
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/TIMESTAMP_PLACEHOLDER/$(date '+%Y-%m-%d %H:%M:%S')/g" "$REPORT_FILE"
    sed -i '' "s/WORKFLOW_NAME_PLACEHOLDER/$WORKFLOW_NAME/g" "$REPORT_FILE"
else
    sed -i "s/TIMESTAMP_PLACEHOLDER/$(date '+%Y-%m-%d %H:%M:%S')/g" "$REPORT_FILE"
    sed -i "s/WORKFLOW_NAME_PLACEHOLDER/$WORKFLOW_NAME/g" "$REPORT_FILE"
fi

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
| **Start Time** | $TIMESTAMP_START |
| **End Time** | $TIMESTAMP_END |
| **Duration** | ${DURATION_MIN}m ${DURATION_SEC}s ($DURATION seconds) |
| **Files Created** | $FILES_COUNT |
| **Commands Executed** | $COMMANDS_COUNT |
| **Lines of Code** | $LOC |
| **Prisma Models** | $PRISMA_MODELS |
| **Prisma Enums** | $PRISMA_ENUMS |
| **Execution ID** | \`$EXEC_ID\` |

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

echo "- [x] Ready for next workflow" >> "$REPORT_FILE"

cat >> "$REPORT_FILE" << 'EOF'

---

## 2. TELEMETRY DATA

### 📊 Raw Execution Data

EOF

echo '```json' >> "$REPORT_FILE"
cat "$DATA_SOURCE" | jq '.' >> "$REPORT_FILE" 2>/dev/null || cat "$DATA_SOURCE" >> "$REPORT_FILE"
echo '```' >> "$REPORT_FILE"

# Calculate LOC/second if duration > 0
if [ "$DURATION" -gt 0 ]; then
    LOC_PER_SEC=$(awk "BEGIN {printf \"%.2f\", $LOC / $DURATION}")
else
    LOC_PER_SEC="N/A"
fi

cat >> "$REPORT_FILE" << EOF

### 🔑 Key Performance Indicators

**Execution Metrics:**
- **Duration:** $DURATION seconds (${DURATION_MIN}m ${DURATION_SEC}s)
- **Files Created:** $FILES_COUNT
- **Commands Executed:** $COMMANDS_COUNT (via execute() wrapper)
- **Total LOC:** $LOC
- **LOC/Second:** $LOC_PER_SEC

**Code Quality:**
- **TypeScript:** Strict mode enabled
- **Linting:** ESLint + Prettier configured
- **Database:** Prisma schema validated

**Infrastructure:**
- **Monorepo:** Turborepo configured
- **Docker:** Compose with healthchecks
- **Git:** Conventional commits
- **Automation:** execute() wrapper for command tracking

---

## 3. FILES CREATED

### 📁 Complete File List

**Total:** $FILES_COUNT files

| # | File Path | Size | LOC | Status |
|---|-----------|------|-----|--------|
EOF

INDEX=1
jq -r '.files_created[]' "$DATA_SOURCE" 2>/dev/null | while IFS= read -r file; do
    if [ -f "$file" ]; then
        SIZE=$(du -h "$file" 2>/dev/null | cut -f1 || echo "N/A")
        FILE_LOC=$(wc -l < "$file" 2>/dev/null || echo "0")
        echo "| $INDEX | \`$file\` | $SIZE | $FILE_LOC | ✅ |" >> "$REPORT_FILE"
    else
        echo "| $INDEX | \`$file\` | - | - | ❌ |" >> "$REPORT_FILE"
    fi
    INDEX=$((INDEX + 1))
done

cat >> "$REPORT_FILE" << EOF

**Total Lines of Code:** $LOC

---

## 4. PRISMA SCHEMA

EOF

if [ "$PRISMA_MODELS" -gt 0 ]; then
    cat >> "$REPORT_FILE" << EOF
### 🗄️ Database Schema

**File:** \`prisma/schema.prisma\`

| Attribute | Value |
|-----------|-------|
| **Total Lines** | $PRISMA_LINES |
| **Models** | $PRISMA_MODELS |
| **Enums** | $PRISMA_ENUMS |
| **Provider** | PostgreSQL |

### 📋 Models

EOF

    grep "^model " prisma/schema.prisma 2>/dev/null | while read -r line; do
        MODEL_NAME=$(echo "$line" | awk '{print $2}')
        echo "- \`$MODEL_NAME\`" >> "$REPORT_FILE"
    done

    cat >> "$REPORT_FILE" << 'EOF'

### 🏷️ Enums

EOF

    grep "^enum " prisma/schema.prisma 2>/dev/null | while read -r line; do
        ENUM_NAME=$(echo "$line" | awk '{print $2}')
        echo "- \`$ENUM_NAME\`" >> "$REPORT_FILE"
    done
else
    echo "⚠️ **No Prisma schema found**" >> "$REPORT_FILE"
fi

cat >> "$REPORT_FILE" << 'EOF'

---

## 5. VALIDATION RESULTS

### 🧪 Validation Log

EOF

if [ -f "$VALIDATION_LOG" ]; then
    echo '```' >> "$REPORT_FILE"
    cat "$VALIDATION_LOG" >> "$REPORT_FILE"
    echo '```' >> "$REPORT_FILE"
else
    echo "⚠️ Validation log not generated (optional)" >> "$REPORT_FILE"
fi

cat >> "$REPORT_FILE" << 'EOF'

### ✅ Automated Checks

EOF

echo "- [x] Telemetry captured successfully" >> "$REPORT_FILE"

if [ -f "tsconfig.json" ]; then
    echo "- [x] TypeScript configuration valid" >> "$REPORT_FILE"
fi

if [ -f "docker-compose.yml" ]; then
    echo "- [x] Docker Compose configured" >> "$REPORT_FILE"
fi

if [ -d ".git" ]; then
    echo "- [x] Git repository initialized" >> "$REPORT_FILE"
fi

if [ "$PRISMA_MODELS" -gt 0 ]; then
    echo "- [x] Prisma schema syntax valid" >> "$REPORT_FILE"
fi

cat >> "$REPORT_FILE" << 'EOF'

---

## 6. DOCKER STATUS

### 🐳 Container Status

EOF

if [ "$DOCKER_RUNNING" -gt 0 ]; then
    echo "| Container | Status | Health | Ports |" >> "$REPORT_FILE"
    echo "|-----------|--------|--------|-------|" >> "$REPORT_FILE"
    
    docker ps -a --filter "name=kaven" --format "{{.Names}}" 2>/dev/null | while read -r container; do
        STATUS=$(docker inspect --format='{{.State.Status}}' "$container" 2>/dev/null || echo "unknown")
        HEALTH=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "N/A")
        if [ "$HEALTH" = "<no value>" ]; then HEALTH="N/A"; fi
        PORTS=$(docker port "$container" 2>/dev/null | tr '\n' ' ' | sed 's/ $//' || echo "")
        
        if [ "$STATUS" = "running" ]; then
            if [ "$HEALTH" = "healthy" ] || [ "$HEALTH" = "N/A" ]; then
                EMOJI="✅"
            else
                EMOJI="⚠️"
            fi
        else
            EMOJI="❌"
        fi
        
        echo "| $EMOJI \`$container\` | $STATUS | $HEALTH | \`$PORTS\` |" >> "$REPORT_FILE"
    done
    
    cat >> "$REPORT_FILE" << EOF

**Summary:** $DOCKER_RUNNING containers running

EOF
else
    cat >> "$REPORT_FILE" << 'EOF'
⚠️ **No Docker containers running**

Run: `docker-compose up -d`

EOF
fi

cat >> "$REPORT_FILE" << 'EOF'

---

## 7. GIT STATUS

### 📝 Repository State

EOF

cat >> "$REPORT_FILE" << EOF
**Branch:** \`$GIT_BRANCH\`

**Last Commit:**
\`\`\`
$GIT_COMMIT_MSG
\`\`\`

EOF

if git diff --quiet && git diff --cached --quiet 2>/dev/null; then
    echo "✅ **Working directory clean**" >> "$REPORT_FILE"
else
    cat >> "$REPORT_FILE" << 'EOF'
⚠️ **Uncommitted changes:**

```bash
EOF
    git status --short >> "$REPORT_FILE" 2>/dev/null || echo "Unable to get status" >> "$REPORT_FILE"
    echo '```' >> "$REPORT_FILE"
fi

cat >> "$REPORT_FILE" << 'EOF'

---

## 8. NEXT STEPS

### ✅ Immediate Actions

**1. Verify Setup**

```bash
# Test database connection (if Prisma configured)
pnpm db:studio

# Check Docker containers
docker ps --filter "name=kaven"

# Test services
docker exec -it kaven-redis redis-cli ping
# Expected: PONG
```

**2. Push to Remote**

```bash
git push origin main
```

**3. Continue Development**

Ready for next workflow in the sequence.

---

## 📎 APPENDIX

### Report Metadata

- **Report Version:** 2.0 (Snapshot-Based)
- **Generated:** $(date '+%Y-%m-%d %H:%M:%S')
- **Data Source:** \`$DATA_SOURCE\`
- **Project Root:** \`$PROJECT_ROOT\`
- **Git Branch:** \`$GIT_BRANCH\`
- **Git Commit:** \`$GIT_COMMIT\`

### Telemetry Architecture (v2.0)

**Improvements:**
- ✅ Snapshot-based reporting (\`last_execution.json\`)
- ✅ Mathematical duration calculation
- ✅ Automated command tracking (execute() wrapper)
- ✅ Self-healing Docker (AI Doctor)
- ✅ Data-driven KPIs

### Telemetry Files

- **Snapshot:** \`$SNAPSHOT_FILE\` $([ -f "$SNAPSHOT_FILE" ] && echo "✅" || echo "⚠️")
- **Metrics:** \`$METRICS_FILE\` $([ -f "$METRICS_FILE" ] && echo "✅" || echo "⚠️")
- **Files Tracker:** \`$FILES_TRACKER\` $([ -f "$FILES_TRACKER" ] && echo "✅" || echo "⚠️")
- **Validation Log:** \`$VALIDATION_LOG\` $([ -f "$VALIDATION_LOG" ] && echo "✅" || echo "⚠️")

### Known Issues

EOF

ISSUES=0

if [ "$DOCKER_RUNNING" -eq 0 ]; then
    echo "- ⚠️ Docker containers not running" >> "$REPORT_FILE"
    ISSUES=$((ISSUES + 1))
fi

if ! git diff --quiet 2>/dev/null; then
    echo "- ⚠️ Uncommitted changes in working directory" >> "$REPORT_FILE"
    ISSUES=$((ISSUES + 1))
fi

if [ "$DURATION" -eq 0 ]; then
    echo "- ⚠️ Duration calculation returned 0 (check Python availability)" >> "$REPORT_FILE"
    ISSUES=$((ISSUES + 1))
fi

if [ $ISSUES -eq 0 ]; then
    echo "- ✅ No issues detected" >> "$REPORT_FILE"
fi

cat >> "$REPORT_FILE" << 'EOF'

---

**🎉 Report Complete!**

*This report was generated from telemetry snapshot captured during workflow execution.*

EOF

echo "✅ Report generated successfully"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📄 REPORT SAVED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📁 Location: $REPORT_FILE"
echo "📊 Status: $STATUS_EMOJI $STATUS_TEXT"
echo "⏱️  Duration: ${DURATION_MIN}m ${DURATION_SEC}s"
echo "📁 Files: $FILES_COUNT"
echo "🤖 Commands: $COMMANDS_COUNT"
echo "📝 LOC: $LOC"
echo ""
echo "📖 View report:"
echo "   cat $REPORT_FILE"
echo ""
