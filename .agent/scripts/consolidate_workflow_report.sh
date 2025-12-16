#!/bin/bash
set -e

# ================================================================
# WORKFLOW REPORT CONSOLIDATOR
# ================================================================
# Purpose: Generate single comprehensive report after Antigravity
#          workflow execution
# Usage: ./consolidate_workflow_report.sh [workflow_name]
# Example: ./consolidate_workflow_report.sh backend
# ================================================================

WORKFLOW_NAME="${1:-backend}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT_FILE="WORKFLOW_REPORT_${WORKFLOW_NAME}_${TIMESTAMP}.md"

echo "📊 Consolidating workflow report for: $WORKFLOW_NAME"
echo "📁 Output: $REPORT_FILE"
echo ""

# ================================================================
# HEADER
# ================================================================
cat > "$REPORT_FILE" << 'EOF'
# 📊 WORKFLOW EXECUTION REPORT

> **Generated:** TIMESTAMP_PLACEHOLDER
> **Workflow:** WORKFLOW_NAME_PLACEHOLDER
> **Project:** Kaven Boilerplate v2.0.0

---

## 📋 TABLE OF CONTENTS

1. [Execution Summary](#execution-summary)
2. [Telemetry Data](#telemetry-data)
3. [Implementation Plan](#implementation-plan)
4. [Walkthrough/Analysis](#walkthroughanalysis)
5. [Generated Files](#generated-files)
6. [Validation Results](#validation-results)
7. [Issues & Observations](#issues--observations)
8. [Next Steps](#next-steps)

---

EOF

# Replace placeholders
sed -i.bak "s/TIMESTAMP_PLACEHOLDER/$(date '+%Y-%m-%d %H:%M:%S')/g" "$REPORT_FILE"
sed -i.bak "s/WORKFLOW_NAME_PLACEHOLDER/$WORKFLOW_NAME/g" "$REPORT_FILE"
rm -f "${REPORT_FILE}.bak"

# ================================================================
# SECTION 1: EXECUTION SUMMARY
# ================================================================
cat >> "$REPORT_FILE" << 'EOF'
## 1. EXECUTION SUMMARY

### Workflow Details

| Attribute | Value |
|-----------|-------|
EOF

echo "| **Workflow Name** | $WORKFLOW_NAME |" >> "$REPORT_FILE"
echo "| **Execution Date** | $(date '+%Y-%m-%d') |" >> "$REPORT_FILE"
echo "| **Start Time** | [FILL: HH:MM] |" >> "$REPORT_FILE"
echo "| **End Time** | [FILL: HH:MM] |" >> "$REPORT_FILE"
echo "| **Duration** | [FILL: XX minutes] |" >> "$REPORT_FILE"
echo "| **Status** | [FILL: ✅ Success / ⚠️ Partial / ❌ Failed] |" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

cat >> "$REPORT_FILE" << 'EOF'

### Quick Status

- [ ] Workflow completed without errors
- [ ] All expected files generated
- [ ] Validation passed
- [ ] Telemetry recorded
- [ ] Ready for next phase

---

EOF

# ================================================================
# SECTION 2: TELEMETRY DATA
# ================================================================
cat >> "$REPORT_FILE" << 'EOF'
## 2. TELEMETRY DATA

### Raw Telemetry (Last Execution)

EOF

# Check if telemetry file exists
if [ -f ".agent/telemetry/metrics.json" ]; then
    echo '```json' >> "$REPORT_FILE"
    
    # Try to extract last execution with jq (if available)
    if command -v jq &> /dev/null; then
        jq '.executions[-1]' .agent/telemetry/metrics.json >> "$REPORT_FILE" 2>/dev/null || \
        echo "[ERROR: Could not parse telemetry JSON]" >> "$REPORT_FILE"
    else
        echo "[jq not installed - showing full file]" >> "$REPORT_FILE"
        cat .agent/telemetry/metrics.json >> "$REPORT_FILE"
    fi
    
    echo '```' >> "$REPORT_FILE"
else
    echo "⚠️ **Telemetry file not found:** `.agent/telemetry/metrics.json`" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "**Possible reasons:**" >> "$REPORT_FILE"
    echo "- Workflow not yet executed" >> "$REPORT_FILE"
    echo "- Telemetry system not initialized" >> "$REPORT_FILE"
    echo "- Wrong directory" >> "$REPORT_FILE"
fi

echo "" >> "$REPORT_FILE"

cat >> "$REPORT_FILE" << 'EOF'

### Key Metrics

| Metric | Value |
|--------|-------|
| **Execution ID** | [AUTO-FILLED or MANUAL] |
| **Duration (seconds)** | [AUTO-FILLED or MANUAL] |
| **Files Created** | [AUTO-FILLED or MANUAL] |
| **Files Modified** | [AUTO-FILLED or MANUAL] |
| **Commands Executed** | [AUTO-FILLED or MANUAL] |
| **Lines of Code** | [AUTO-FILLED or MANUAL] |
| **Success** | [AUTO-FILLED or MANUAL] |

---

EOF

# ================================================================
# SECTION 3: IMPLEMENTATION PLAN
# ================================================================
cat >> "$REPORT_FILE" << 'EOF'
## 3. IMPLEMENTATION PLAN

### Plan Location

EOF

# Check common locations for implementation plans
PLAN_LOCATIONS=(
    "pre-production/analysis/${WORKFLOW_NAME}_implementation_plan.md"
    "pre-production/analysis/implementation_plan.md"
    ".agent/workflows/${WORKFLOW_NAME}_plan.md"
)

PLAN_FOUND=false

for plan_path in "${PLAN_LOCATIONS[@]}"; do
    if [ -f "$plan_path" ]; then
        echo "✅ **Found:** \`$plan_path\`" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        echo "### Plan Content" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        echo '```markdown' >> "$REPORT_FILE"
        cat "$plan_path" >> "$REPORT_FILE"
        echo '```' >> "$REPORT_FILE"
        PLAN_FOUND=true
        break
    fi
done

if [ "$PLAN_FOUND" = false ]; then
    echo "⚠️ **Implementation plan not found** in expected locations." >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "**Searched:**" >> "$REPORT_FILE"
    for plan_path in "${PLAN_LOCATIONS[@]}"; do
        echo "- \`$plan_path\`" >> "$REPORT_FILE"
    done
    echo "" >> "$REPORT_FILE"
    echo "**Action:** Manually copy plan below if generated elsewhere." >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo '```' >> "$REPORT_FILE"
    echo "[PASTE IMPLEMENTATION PLAN HERE]" >> "$REPORT_FILE"
    echo '```' >> "$REPORT_FILE"
fi

echo "" >> "$REPORT_FILE"
echo "---" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# ================================================================
# SECTION 4: WALKTHROUGH/ANALYSIS
# ================================================================
cat >> "$REPORT_FILE" << 'EOF'
## 4. WALKTHROUGH/ANALYSIS

### Analysis Document Location

EOF

# Check for analysis/walkthrough documents
ANALYSIS_LOCATIONS=(
    "pre-production/analysis/${WORKFLOW_NAME}_analysis.md"
    "pre-production/analysis/backend_analysis.md"
    ".agent/workflows/${WORKFLOW_NAME}_walkthrough.md"
)

ANALYSIS_FOUND=false

for analysis_path in "${ANALYSIS_LOCATIONS[@]}"; do
    if [ -f "$analysis_path" ]; then
        echo "✅ **Found:** \`$analysis_path\`" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        echo "### Analysis Content" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        echo '```markdown' >> "$REPORT_FILE"
        head -n 200 "$analysis_path" >> "$REPORT_FILE"  # First 200 lines to avoid huge files
        
        # Check if file is longer
        TOTAL_LINES=$(wc -l < "$analysis_path")
        if [ "$TOTAL_LINES" -gt 200 ]; then
            echo "" >> "$REPORT_FILE"
            echo "[... truncated, file has $TOTAL_LINES total lines ...]" >> "$REPORT_FILE"
            echo "" >> "$REPORT_FILE"
            echo "**Full file:** \`$analysis_path\`" >> "$REPORT_FILE"
        fi
        
        echo '```' >> "$REPORT_FILE"
        ANALYSIS_FOUND=true
        break
    fi
done

if [ "$ANALYSIS_FOUND" = false ]; then
    echo "⚠️ **Analysis document not found** in expected locations." >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "**Searched:**" >> "$REPORT_FILE"
    for analysis_path in "${ANALYSIS_LOCATIONS[@]}"; do
        echo "- \`$analysis_path\`" >> "$REPORT_FILE"
    done
fi

echo "" >> "$REPORT_FILE"
echo "---" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# ================================================================
# SECTION 5: GENERATED FILES
# ================================================================
cat >> "$REPORT_FILE" << 'EOF'
## 5. GENERATED FILES

### Expected Output Files

EOF

# Workflow-specific expected files
case "$WORKFLOW_NAME" in
    backend)
        echo "**For /backend workflow:**" >> "$REPORT_FILE"
        echo "- \`pre-production/schema/schema.prisma\`" >> "$REPORT_FILE"
        echo "- \`pre-production/analysis/backend_analysis.md\`" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        
        # Check if files exist
        echo "### File Status" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        
        if [ -f "pre-production/schema/schema.prisma" ]; then
            echo "- ✅ \`schema.prisma\` exists" >> "$REPORT_FILE"
            LINES=$(wc -l < "pre-production/schema/schema.prisma")
            echo "  - Lines: $LINES" >> "$REPORT_FILE"
        else
            echo "- ❌ \`schema.prisma\` NOT FOUND" >> "$REPORT_FILE"
        fi
        
        if [ -f "pre-production/analysis/backend_analysis.md" ]; then
            echo "- ✅ \`backend_analysis.md\` exists" >> "$REPORT_FILE"
            LINES=$(wc -l < "pre-production/analysis/backend_analysis.md")
            echo "  - Lines: $LINES" >> "$REPORT_FILE"
        else
            echo "- ❌ \`backend_analysis.md\` NOT FOUND" >> "$REPORT_FILE"
        fi
        ;;
    
    contracts)
        echo "**For /contracts workflow:**" >> "$REPORT_FILE"
        echo "- \`production/backend/src/modules/*/router.ts\`" >> "$REPORT_FILE"
        echo "- \`production/backend/src/trpc.ts\`" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        ;;
    
    tasks)
        echo "**For /tasks workflow:**" >> "$REPORT_FILE"
        echo "- \`pre-production/pdr/implementation_plan.json\`" >> "$REPORT_FILE"
        echo "- \`pre-production/pdr/task_dependencies.md\`" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        ;;
    
    migrate)
        echo "**For /migrate workflow:**" >> "$REPORT_FILE"
        echo "- \`prisma/migrations/XXXXXX_init/migration.sql\`" >> "$REPORT_FILE"
        echo "- \`prisma/seed.ts\`" >> "$REPORT_FILE"
        echo "- \`migration_report.md\`" >> "$REPORT_FILE"
        echo "- \`node_modules/@prisma/client/**\` (generated)" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        
        # Check if files exist
        echo "### File Status" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        
        # Find migration directory
        MIGRATION_DIR=$(ls -td prisma/migrations/*_init 2>/dev/null | head -1)
        if [ -n "$MIGRATION_DIR" ] && [ -d "$MIGRATION_DIR" ]; then
            echo "- ✅ Migration directory exists: \`$MIGRATION_DIR\`" >> "$REPORT_FILE"
            if [ -f "$MIGRATION_DIR/migration.sql" ]; then
                LINES=$(wc -l < "$MIGRATION_DIR/migration.sql")
                echo "  - Lines: $LINES" >> "$REPORT_FILE"
            else
                echo "  - ❌ migration.sql NOT FOUND" >> "$REPORT_FILE"
            fi
        else
            echo "- ❌ Migration directory NOT FOUND (pattern: prisma/migrations/*_init)" >> "$REPORT_FILE"
        fi
        
        if [ -f "prisma/seed.ts" ]; then
            echo "- ✅ \`seed.ts\` exists" >> "$REPORT_FILE"
            LINES=$(wc -l < "prisma/seed.ts")
            echo "  - Lines: $LINES" >> "$REPORT_FILE"
        else
            echo "- ❌ \`seed.ts\` NOT FOUND" >> "$REPORT_FILE"
        fi
        
        if [ -f "migration_report.md" ]; then
            echo "- ✅ \`migration_report.md\` exists" >> "$REPORT_FILE"
            LINES=$(wc -l < "migration_report.md")
            echo "  - Lines: $LINES" >> "$REPORT_FILE"
        else
            echo "- ❌ \`migration_report.md\` NOT FOUND" >> "$REPORT_FILE"
        fi
        
        if [ -d "node_modules/@prisma/client" ]; then
            echo "- ✅ Prisma Client generated" >> "$REPORT_FILE"
        else
            echo "- ❌ Prisma Client NOT FOUND" >> "$REPORT_FILE"
        fi
        ;;
    
    *)
        echo "**Files:** [Specify expected files for $WORKFLOW_NAME]" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        ;;
esac

echo "" >> "$REPORT_FILE"

# List all files in pre-production (if exists)
if [ -d "pre-production" ]; then
    echo "### All Files in pre-production/" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo '```' >> "$REPORT_FILE"
    find pre-production -type f -name "*.md" -o -name "*.prisma" -o -name "*.json" -o -name "*.ts" >> "$REPORT_FILE"
    echo '```' >> "$REPORT_FILE"
fi

echo "" >> "$REPORT_FILE"

# Schema content (if backend workflow)
if [ "$WORKFLOW_NAME" = "backend" ] && [ -f "pre-production/schema/schema.prisma" ]; then
    echo "### Generated Schema (schema.prisma)" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo '```prisma' >> "$REPORT_FILE"
    cat "pre-production/schema/schema.prisma" >> "$REPORT_FILE"
    echo '```' >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
fi

# Migration SQL content (if migrate workflow)
if [ "$WORKFLOW_NAME" = "migrate" ]; then
    MIGRATION_DIR=$(ls -td prisma/migrations/*_init 2>/dev/null | head -1)
    if [ -n "$MIGRATION_DIR" ] && [ -f "$MIGRATION_DIR/migration.sql" ]; then
        echo "### Generated Migration SQL" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        echo "**Location:** \`$MIGRATION_DIR/migration.sql\`" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        echo '```sql' >> "$REPORT_FILE"
        cat "$MIGRATION_DIR/migration.sql" >> "$REPORT_FILE"
        echo '```' >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
    fi
fi

echo "---" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# ================================================================
# SECTION 6: VALIDATION RESULTS
# ================================================================
cat >> "$REPORT_FILE" << 'EOF'
## 6. VALIDATION RESULTS

### Automated Validation

EOF

# Run validations based on workflow
case "$WORKFLOW_NAME" in
    backend)
        echo "#### Prisma Schema Validation" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        
        if [ -f "pre-production/schema/schema.prisma" ]; then
            # Try to validate schema
            echo '```bash' >> "$REPORT_FILE"
            echo "$ npx prisma validate --schema=pre-production/schema/schema.prisma" >> "$REPORT_FILE"
            echo '```' >> "$REPORT_FILE"
            echo "" >> "$REPORT_FILE"
            
            # Actually run validation (if in correct directory)
            if [ -d "production/backend" ]; then
                cd production/backend
                if npx prisma validate --schema=../../pre-production/schema/schema.prisma 2>&1 | tee -a "../../$REPORT_FILE"; then
                    echo "" >> "../../$REPORT_FILE"
                    echo "✅ **Schema validation PASSED**" >> "../../$REPORT_FILE"
                else
                    echo "" >> "../../$REPORT_FILE"
                    echo "❌ **Schema validation FAILED**" >> "../../$REPORT_FILE"
                fi
                cd ../..
            else
                echo "⚠️ Could not run validation (production/backend not found)" >> "$REPORT_FILE"
            fi
        else
            echo "❌ **Schema file not found** - cannot validate" >> "$REPORT_FILE"
        fi
        ;;
    
    migrate)
        echo "#### Database Migration Validation" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        
        # Check tables
        echo "**1. Tables Created:**" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        echo '```bash' >> "$REPORT_FILE"
        echo '$ npx prisma db execute --stdin <<< "SELECT table_name FROM information_schema.tables WHERE table_schema = '"'"'public'"'"' ORDER BY table_name;"' >> "$REPORT_FILE"
        echo '```' >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        
        TABLES=$(npx prisma db execute --stdin <<< "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name NOT LIKE '_prisma%' ORDER BY table_name;" 2>/dev/null | grep -v "Executed" | tail -n +2 || echo "")
        
        if [ -n "$TABLES" ]; then
            echo '```' >> "$REPORT_FILE"
            echo "$TABLES" >> "$REPORT_FILE"
            echo '```' >> "$REPORT_FILE"
            echo "" >> "$REPORT_FILE"
            
            # Check expected tables
            EXPECTED=(Tenant User UserTenant RefreshToken AuditLog SystemConfig)
            ALL_FOUND=true
            echo "**Expected Tables Check:**" >> "$REPORT_FILE"
            for table in "${EXPECTED[@]}"; do
                if echo "$TABLES" | grep -q "^$table$"; then
                    echo "- ✅ $table" >> "$REPORT_FILE"
                else
                    echo "- ❌ $table (MISSING)" >> "$REPORT_FILE"
                    ALL_FOUND=false
                fi
            done
            
            if [ "$ALL_FOUND" = true ]; then
                echo "" >> "$REPORT_FILE"
                echo "✅ **All tables created successfully!**" >> "$REPORT_FILE"
            else
                echo "" >> "$REPORT_FILE"
                echo "⚠️ **Some tables are missing**" >> "$REPORT_FILE"
            fi
        else
            echo "⚠️ **Could not query database** (may not be running)" >> "$REPORT_FILE"
        fi
        
        echo "" >> "$REPORT_FILE"
        
        # Check seed data
        echo "**2. Seed Data:**" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
        
        DATA=$(npx prisma db execute --stdin <<< 'SELECT (SELECT COUNT(*) FROM "User") as users, (SELECT COUNT(*) FROM "Tenant") as tenants, (SELECT COUNT(*) FROM "UserTenant") as user_tenants, (SELECT COUNT(*) FROM "SystemConfig") as configs;' 2>/dev/null | grep -v "Executed" | tail -1 || echo "")
        
        if [ -n "$DATA" ]; then
            echo '```' >> "$REPORT_FILE"
            echo "$DATA" >> "$REPORT_FILE"
            echo '```' >> "$REPORT_FILE"
            echo "" >> "$REPORT_FILE"
            echo "✅ **Seed data inserted**" >> "$REPORT_FILE"
        else
            echo "⚠️ **Could not query seed data**" >> "$REPORT_FILE"
        fi
        ;;
    
    *)
        echo "[Add validation steps for $WORKFLOW_NAME]" >> "$REPORT_FILE"
        ;;
esac

echo "" >> "$REPORT_FILE"

cat >> "$REPORT_FILE" << 'EOF'

### Manual Verification Checklist

#### General
- [ ] All expected files generated
- [ ] No error messages in logs
- [ ] File contents look correct
- [ ] Telemetry recorded execution

EOF

# Workflow-specific checklists
case "$WORKFLOW_NAME" in
    backend)
        cat >> "$REPORT_FILE" << 'EOF'

#### Backend-Specific
- [ ] Schema includes Tenant model
- [ ] Schema includes User model
- [ ] Schema includes UserTenant junction
- [ ] Schema includes RefreshToken model
- [ ] Schema includes AuditLog model
- [ ] Schema includes SystemConfig model
- [ ] Relationships defined correctly
- [ ] Indexes present (@@index)
- [ ] Enums defined (UserRole, TenantStatus, etc)
- [ ] `npx prisma validate` passes

EOF
        ;;
    
    migrate)
        cat >> "$REPORT_FILE" << 'EOF'

#### Migrate-Specific
- [ ] Migration SQL file created
- [ ] All 6 tables created in database
- [ ] All enums created (UserRole, TenantRole, TenantStatus)
- [ ] All indexes created
- [ ] All foreign keys created
- [ ] Seed script created (prisma/seed.ts)
- [ ] Seed data inserted (User, Tenant, SystemConfig)
- [ ] Prisma Client generated
- [ ] Migration report generated

EOF
        ;;
esac

echo "---" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# ================================================================
# SECTION 7: ISSUES & OBSERVATIONS
# ================================================================
cat >> "$REPORT_FILE" << 'EOF'
## 7. ISSUES & OBSERVATIONS

### Issues Encountered

**[FILL: Describe any issues, errors, or unexpected behavior]**

Examples:
- Workflow stuck at X step
- File Y not generated
- Validation failed with error Z

### Manual Adjustments Made

**[FILL: List any manual changes needed after workflow]**

Examples:
- Added missing index to schema
- Fixed typo in model name
- Adjusted enum values

### Observations

**[FILL: General observations about workflow execution]**

Examples:
- Took longer than expected (why?)
- Generated code quality (good/bad?)
- Missing features that should be added to v2.0.0

---

EOF

# ================================================================
# SECTION 8: NEXT STEPS
# ================================================================
cat >> "$REPORT_FILE" << 'EOF'
## 8. NEXT STEPS

### Immediate Actions

- [ ] Review this report
- [ ] Copy files to correct locations (if needed)
- [ ] Run manual validations
- [ ] Commit changes to git
- [ ] Proceed to next phase

### For Next Workflow Execution

**Improvements to make:**
- [FILL: Lessons learned]
- [FILL: PDR adjustments needed]
- [FILL: Workflow improvements for v2.0.0]

### Continue Implementation

**According to EXECUTION_GUIDE_HYBRID.md:**

EOF

# Next phase based on current workflow
case "$WORKFLOW_NAME" in
    backend)
        cat >> "$REPORT_FILE" << 'EOF'
- **Next:** Phase 3 - Migrate Schema to Production (30 min)
  - Copy schema.prisma to production/backend/prisma/
  - Run `npx prisma generate`
  - Run `npx prisma migrate dev --name init`
  - Verify with `npx prisma studio`

- **Then:** Phase 4 - Implement Auth Module (8h)
EOF
        ;;
    
    migrate)
        cat >> "$REPORT_FILE" << 'EOF'
- **Next:** Phase 5 - Implement Auth Module (8h)
  - Registration + email verification
  - Login + JWT + Refresh Token
  - 2FA TOTP
  - Password reset
  - Logout

- **Optional:** Verify with Prisma Studio
  - Run `npx prisma studio`
  - Check tables and seed data visually

- **Then:** Phase 6 - Implement Admin UI (8h)
EOF
        ;;
    
    contracts)
        echo "- **Next:** Phase 5 - Frontend Implementation" >> "$REPORT_FILE"
        ;;
    
    *)
        echo "- **Next:** [Refer to EXECUTION_GUIDE_HYBRID.md]" >> "$REPORT_FILE"
        ;;
esac

echo "" >> "$REPORT_FILE"
echo "---" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# ================================================================
# FOOTER
# ================================================================
cat >> "$REPORT_FILE" << 'EOF'

## 📎 APPENDIX

### Report Generation Info

- **Script:** `consolidate_workflow_report.sh`
- **Generated:** TIMESTAMP_PLACEHOLDER
- **Working Directory:** `PWD_PLACEHOLDER`
- **Git Branch:** `GIT_BRANCH_PLACEHOLDER`
- **Git Commit:** `GIT_COMMIT_PLACEHOLDER`

### Related Files

- PDR: `pre-production/pdr/PDR.md`
- Telemetry: `.agent/telemetry/metrics.json`
- Execution Guide: `EXECUTION_GUIDE_HYBRID.md`

---

**Report End**

EOF

# Replace additional placeholders
sed -i.bak "s/TIMESTAMP_PLACEHOLDER/$(date '+%Y-%m-%d %H:%M:%S')/g" "$REPORT_FILE"
sed -i.bak "s|PWD_PLACEHOLDER|$(pwd)|g" "$REPORT_FILE"

if git rev-parse --git-dir > /dev/null 2>&1; then
    BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
    COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
    sed -i.bak "s/GIT_BRANCH_PLACEHOLDER/$BRANCH/g" "$REPORT_FILE"
    sed -i.bak "s/GIT_COMMIT_PLACEHOLDER/$COMMIT/g" "$REPORT_FILE"
else
    sed -i.bak "s/GIT_BRANCH_PLACEHOLDER/not a git repo/g" "$REPORT_FILE"
    sed -i.bak "s/GIT_COMMIT_PLACEHOLDER/N\/A/g" "$REPORT_FILE"
fi

rm -f "${REPORT_FILE}.bak"

# ================================================================
# DONE
# ================================================================
echo ""
echo "✅ Report generated: $REPORT_FILE"
echo ""
echo "📋 Next steps:"
echo "  1. Review the report"
echo "  2. Fill in [FILL] sections with manual observations"
echo "  3. Share with team or use for documentation"
echo ""
echo "📊 View report:"
echo "  cat $REPORT_FILE"
echo "  # or"
echo "  open $REPORT_FILE  # macOS"
echo ""