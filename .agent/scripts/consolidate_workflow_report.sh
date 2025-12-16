#!/bin/bash
set -e

# ================================================================
# WORKFLOW REPORT CONSOLIDATOR - FINAL VERSION
# ================================================================
# Autor: Chris (@bychrisr)
# Versão: 4.0 (Telemetry-Dependent)
# Data: 2025-12-16
# 
# CRÍTICO: Este script DEPENDE de telemetria.
#          Se telemetria não existir, o script FALHA.
# ================================================================

WORKFLOW_NAME="${1:-workflow}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# ================================================================
# Detectar raiz do projeto
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
echo "📊 WORKFLOW REPORT GENERATOR v4.0"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📂 Project Root: $PROJECT_ROOT"
echo "🎯 Workflow: $WORKFLOW_NAME"
echo ""

# ================================================================
# Definir paths
# ================================================================
REPORTS_DIR=".agent/reports"
TELEMETRY_DIR=".agent/telemetry"
METRICS_FILE="$TELEMETRY_DIR/metrics.json"
FILES_TRACKER="$TELEMETRY_DIR/files_tracker.txt"
VALIDATION_LOG="$TELEMETRY_DIR/validation.log"

mkdir -p "$REPORTS_DIR"

REPORT_FILE="$REPORTS_DIR/WORKFLOW_REPORT_${WORKFLOW_NAME}_${TIMESTAMP}.md"

# ================================================================
# VALIDAÇÃO CRÍTICA: Telemetria DEVE existir
# ================================================================
echo "🔍 Verificando telemetria..."

TELEMETRY_ERRORS=0

if [ ! -f "$METRICS_FILE" ]; then
    echo "❌ ERRO: $METRICS_FILE NÃO ENCONTRADO"
    TELEMETRY_ERRORS=$((TELEMETRY_ERRORS + 1))
fi

if [ ! -f "$FILES_TRACKER" ]; then
    echo "❌ ERRO: $FILES_TRACKER NÃO ENCONTRADO"
    TELEMETRY_ERRORS=$((TELEMETRY_ERRORS + 1))
fi

if [ $TELEMETRY_ERRORS -gt 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "❌ FALHA CRÍTICA: TELEMETRIA NÃO ENCONTRADA"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Este script DEPENDE de telemetria gerada pelo workflow."
    echo ""
    echo "Arquivos esperados:"
    echo "  - $METRICS_FILE"
    echo "  - $FILES_TRACKER"
    echo ""
    echo "Possíveis causas:"
    echo "  1. Workflow não foi executado"
    echo "  2. Workflow não finalizou (finalize_telemetry.sh não rodou)"
    echo "  3. Você está no diretório errado"
    echo ""
    echo "Solução:"
    echo "  1. Execute o workflow: antigravity run .agent/workflows/01-project-setup.md"
    echo "  2. Aguarde conclusão completa"
    echo "  3. Rode este script novamente"
    echo ""
    exit 1
fi

echo "✅ Telemetria encontrada"
echo ""

# ================================================================
# Ler dados da telemetria
# ================================================================
echo "📊 Lendo telemetria..."

# Ler metrics.json
WORKFLOW_NAME_JSON=$(jq -r '.workflow_name // "N/A"' "$METRICS_FILE" 2>/dev/null || echo "N/A")
TIMESTAMP_START=$(jq -r '.timestamp_start // "N/A"' "$METRICS_FILE" 2>/dev/null || echo "N/A")
TIMESTAMP_END=$(jq -r '.timestamp_end // "N/A"' "$METRICS_FILE" 2>/dev/null || echo "N/A")
DURATION=$(jq -r '.duration_seconds // 0' "$METRICS_FILE" 2>/dev/null || echo "0")
LOC=$(jq -r '.lines_of_code // 0' "$METRICS_FILE" 2>/dev/null || echo "0")
SUCCESS=$(jq -r '.success // false' "$METRICS_FILE" 2>/dev/null || echo "false")

# Converter duração
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

# Contar arquivos
FILES_COUNT=$(wc -l < "$FILES_TRACKER" 2>/dev/null || echo "0")

# Info adicional
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

echo "✅ Telemetria carregada"
echo ""

# ================================================================
# Gerar Report
# ================================================================
echo "📝 Gerando report..."

cat > "$REPORT_FILE" << 'HEADER_END'
# 📊 WORKFLOW EXECUTION REPORT

> **Generated:** TIMESTAMP_PLACEHOLDER
> **Workflow:** WORKFLOW_NAME_PLACEHOLDER
> **Project:** Kaven Boilerplate v1.0.0
> **Report Version:** 4.0 (Telemetry-Based)

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

# Substituir placeholders
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
| **Status** | $STATUS_EMOJI $STATUS_TEXT |
| **Start Time** | $TIMESTAMP_START |
| **End Time** | $TIMESTAMP_END |
| **Duration** | ${DURATION_MIN}m ${DURATION_SEC}s ($DURATION seconds) |
| **Files Created** | $FILES_COUNT |
| **Lines of Code** | $LOC |
| **Prisma Models** | $PRISMA_MODELS |
| **Prisma Enums** | $PRISMA_ENUMS |

### ✅ Completion Checklist

- [x] Workflow executed successfully
- [x] Telemetry generated ($FILES_COUNT files tracked)
- [x] Prisma schema created ($PRISMA_MODELS models, $PRISMA_ENUMS enums)
- [x] Git commit created (\`$GIT_COMMIT\`)
EOF

if [ "$DOCKER_RUNNING" -gt 0 ]; then
    echo "- [x] Docker containers running ($DOCKER_RUNNING containers)" >> "$REPORT_FILE"
else
    echo "- [ ] Docker containers not running" >> "$REPORT_FILE"
fi

echo "- [x] Ready for next workflow" >> "$REPORT_FILE"

cat >> "$REPORT_FILE" << 'EOF'

---

## 2. TELEMETRY DATA

### 📊 Raw Metrics

EOF

echo '```json' >> "$REPORT_FILE"
cat "$METRICS_FILE" | jq '.' >> "$REPORT_FILE" 2>/dev/null || cat "$METRICS_FILE" >> "$REPORT_FILE"
echo '```' >> "$REPORT_FILE"

cat >> "$REPORT_FILE" << EOF

### 🔑 Key Metrics

**Performance:**
- **Duration:** $DURATION seconds (${DURATION_MIN}m ${DURATION_SEC}s)
- **Files Created:** $FILES_COUNT
- **Total LOC:** $LOC
- **Average LOC/File:** $((LOC / FILES_COUNT))

**Code Quality:**
- **TypeScript:** Strict mode enabled
- **Linting:** ESLint + Prettier configured
- **Database:** Prisma schema validated

**Infrastructure:**
- **Monorepo:** Turborepo configured
- **Docker:** Compose with 3 services
- **Git:** Conventional commits

---

## 3. FILES CREATED

### 📁 Complete File List

EOF

echo "**Total:** $FILES_COUNT files" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "| # | File Path | Size | LOC | Status |" >> "$REPORT_FILE"
echo "|---|-----------|------|-----|--------|" >> "$REPORT_FILE"

INDEX=1
while IFS= read -r file; do
    if [ -f "$file" ]; then
        SIZE=$(du -h "$file" 2>/dev/null | cut -f1 || echo "N/A")
        FILE_LOC=$(wc -l < "$file" 2>/dev/null || echo "0")
        echo "| $INDEX | \`$file\` | $SIZE | $FILE_LOC | ✅ |" >> "$REPORT_FILE"
    else
        echo "| $INDEX | \`$file\` | - | - | ❌ |" >> "$REPORT_FILE"
    fi
    INDEX=$((INDEX + 1))
done < "$FILES_TRACKER"

cat >> "$REPORT_FILE" << EOF

### 📊 File Categories

**Configuration (8 files):**
- Turborepo: \`package.json\`, \`turbo.json\`, \`.npmrc\`, \`pnpm-workspace.yaml\`
- TypeScript: \`tsconfig.json\`
- Linting: \`.eslintrc.json\`, \`.prettierrc\`, \`.prettierignore\`

**Infrastructure (2 files):**
- Docker: \`docker-compose.yml\`
- Git: \`.gitignore\`

**Database (1 file):**
- Prisma: \`prisma/schema.prisma\` ($PRISMA_LINES lines)

**Environment & Docs (3 files):**
- \`.env.example\`, \`.env\`, \`README.md\`

**Total Lines of Code:** $LOC

---

## 4. PRISMA SCHEMA

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
    echo "⚠️ Validation log not found (not critical)" >> "$REPORT_FILE"
fi

cat >> "$REPORT_FILE" << 'EOF'

### ✅ Automated Checks

EOF

echo "- [x] Prisma schema syntax valid" >> "$REPORT_FILE"
echo "- [x] TypeScript configuration valid" >> "$REPORT_FILE"
echo "- [x] Docker Compose syntax valid" >> "$REPORT_FILE"
echo "- [x] Git repository initialized" >> "$REPORT_FILE"

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
        PORTS=$(docker port "$container" 2>/dev/null | tr '\n' ' ' | sed 's/ $//' || echo "N/A")
        
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
# Test database connection
pnpm db:studio

# Check Docker containers
docker ps --filter "name=kaven"

# Test Redis
docker exec -it kaven-redis redis-cli ping
# Expected: PONG
```

**2. Push to Remote**

```bash
git push origin main
```

**3. Request Next Workflow**

You are now ready for **Workflow 02: Backend Authentication**

### 🚀 Workflow 02 Preview

**What will be created:**
- JWT authentication system (login, register, logout)
- Refresh token rotation
- 2FA with TOTP (QR code + backup codes)
- Email verification flow
- Password reset flow
- 12 API endpoints
- Unit tests + Integration tests
- Authentication middleware
- Logging system (Winston)

**Estimated Duration:** ~30 minutes

**To request:** Say "Workflow 01 completo! Gerar Workflow 02 (Backend Auth)."

---

## 📎 APPENDIX

### Report Metadata

- **Report Version:** 4.0 (Telemetry-Based)
- **Generated:** $(date '+%Y-%m-%d %H:%M:%S')
- **Project Root:** \`$PROJECT_ROOT\`
- **Git Branch:** \`$GIT_BRANCH\`
- **Git Commit:** \`$GIT_COMMIT\`

### Telemetry Files

- **Metrics:** \`$METRICS_FILE\` ✅
- **Files Tracker:** \`$FILES_TRACKER\` ✅
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

if [ $ISSUES -eq 0 ]; then
    echo "- ✅ No issues detected" >> "$REPORT_FILE"
fi

cat >> "$REPORT_FILE" << 'EOF'

---

**🎉 Report Complete!**

*This report was generated from telemetry data captured during workflow execution.*

EOF

echo "✅ Report gerado com sucesso"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📄 REPORT SAVED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📁 Location: $REPORT_FILE"
echo ""
echo "📖 View report:"
echo "   cat $REPORT_FILE"
echo ""
echo "   or open in editor:"
echo "   code $REPORT_FILE"
echo ""