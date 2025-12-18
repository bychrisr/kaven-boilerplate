# 📁 Kaven Boilerplate - Agent Structure v2.0

> **Automation infrastructure with telemetry, self-healing, and data-driven engineering**

---

## 📊 What's New in v2.0

### 🎯 Major Improvements

1. **Snapshot-Based Reporting** (`last_execution.json`)
   - Reports now read from snapshot instead of historical accumulation
   - 100% accuracy in execution data
   - Solves the "stale data" problem

2. **Automated Command Tracking** (`execute()` wrapper)
   - All commands automatically logged via wrapper function
   - No more empty `commands_executed[]` arrays
   - Full audit trail of workflow execution

3. **Mathematical Duration Calculation**
   - Python-based ISO8601 timestamp parsing
   - Accurate to the second
   - No dependency on temporary files

4. **Self-Healing Docker** (AI Doctor)
   - Intelligent diagnosis of container issues
   - Automatic remediation of common problems
   - Prevents race conditions and restart loops

5. **Data-Driven KPIs**
   - LOC/second calculation
   - Success rate tracking
   - Historical metrics accumulation

---

## 📂 Directory Structure

```
.agent/
├── scripts/                      # Automation scripts
│   ├── init_telemetry.sh        # Initialize workflow telemetry
│   ├── finalize_telemetry.sh    # Finalize and calculate metrics
│   ├── consolidate_workflow_report.sh  # Generate markdown reports
│   └── docker_doctor.py         # Self-healing Docker monitor
│
├── workflows/                    # Antigravity workflow definitions
│   ├── 01-project-setup.md      # Turborepo + Prisma + Docker setup
│   ├── 02-backend-auth.md       # Authentication system (JWT + 2FA)
│   ├── 03-admin-panel.md        # Next.js admin panel
│   ├── 04-payment-system.md     # Stripe integration
│   └── 05-testing-deployment.md # Testing setup
│
├── telemetry/                    # Execution metrics (generated at runtime)
│   ├── current_execution.json   # Current workflow state
│   ├── last_execution.json      # 📸 SNAPSHOT of last execution
│   ├── metrics.json             # Historical accumulation
│   ├── files_tracker.txt        # Files created (temporary)
│   ├── commands_tracker.txt     # Commands executed (temporary)
│   └── archive/                 # Historical executions
│
└── reports/                      # Generated markdown reports
    └── WORKFLOW_REPORT_*.md     # Timestamped reports
```

---

## 🚀 Quick Start

### 1. Installation

```bash
# Copy .agent/ structure to your project root
cp -r .agent ~/projects/kaven-boilerplate/

# Make scripts executable
chmod +x ~/projects/kaven-boilerplate/.agent/scripts/*.sh
chmod +x ~/projects/kaven-boilerplate/.agent/scripts/*.py
```

### 2. Run Your First Workflow

```bash
cd ~/projects/kaven-boilerplate

# Execute workflow with Antigravity
antigravity run .agent/workflows/01-project-setup.md

# View the generated report
cat .agent/reports/WORKFLOW_REPORT_01-project-setup_*.md
```

### 3. Verify Telemetry

```bash
# Check snapshot (primary data source)
cat .agent/telemetry/last_execution.json

# Check historical metrics
cat .agent/telemetry/metrics.json

# List all archived executions
ls -la .agent/telemetry/archive/
```

---

## 🔧 How It Works

### Telemetry Flow

```
┌─────────────────────────────────────────────────────────────┐
│ WORKFLOW EXECUTION                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  STEP 0: init_telemetry.sh                                 │
│    │                                                        │
│    ├─ Creates current_execution.json                       │
│    ├─ Initializes files_tracker.txt                        │
│    └─ Initializes commands_tracker.txt                     │
│                                                             │
│  STEP 1-N: Workflow Steps                                  │
│    │                                                        │
│    ├─ execute("pnpm install")  → logs to commands_tracker  │
│    ├─ cat > file.ts            → logs to files_tracker     │
│    └─ execute("git commit")    → logs to commands_tracker  │
│                                                             │
│  STEP FINAL: finalize_telemetry.sh                         │
│    │                                                        │
│    ├─ Reads files_tracker.txt                              │
│    ├─ Reads commands_tracker.txt                           │
│    ├─ Calculates duration (Python)                         │
│    ├─ Counts LOC                                           │
│    ├─ Updates current_execution.json                       │
│    ├─ Creates last_execution.json (SNAPSHOT) ⭐            │
│    ├─ Appends to metrics.json (history)                    │
│    └─ Archives to archive/execution_*.json                 │
│                                                             │
│  Report Generation: consolidate_workflow_report.sh         │
│    │                                                        │
│    ├─ Reads last_execution.json (NOT metrics.json) ⭐      │
│    ├─ Extracts KPIs                                        │
│    └─ Generates markdown report                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### The `execute()` Wrapper

All workflows now use this pattern:

```bash
# STEP 0: Define wrapper function
execute() {
    local cmd="$*"
    echo "🤖 Executing: $cmd"
    echo "$cmd" >> .agent/telemetry/commands_tracker.txt
    eval "$cmd"
}

# STEP N: Use wrapper for commands
execute "pnpm install"
execute "git commit -m 'message'"
execute "docker-compose up -d"
```

**Benefits:**
- Automatic command logging
- No manual jq manipulation
- Full audit trail
- Zero-effort telemetry

### Docker AI Doctor

Intelligent container monitoring with self-healing:

```python
# Monitors containers in loop
for attempt in range(MAX_RETRIES):
    status = get_status(container)
    
    if status == "restarting":
        logs = get_logs(container)
        issue = diagnose(logs)  # AI diagnosis
        
        if issue == "permission":
            fix_permissions()
            restart_container()
        
        elif issue == "connection":
            restart_container()
```

**Detects:**
- Permission errors
- Connection refused (race conditions)
- Port conflicts
- Disk space issues
- Memory problems
- Timeouts

---

## 📊 Telemetry Files Explained

### `last_execution.json` (⭐ NEW - SNAPSHOT)

**Purpose:** Primary data source for reports
**When created:** By `finalize_telemetry.sh`
**Content:** Complete snapshot of last execution

```json
{
  "workflow_name": "01-project-setup",
  "timestamp_start": "2025-12-17T20:30:00Z",
  "timestamp_end": "2025-12-17T20:35:42Z",
  "duration_seconds": 342,
  "files_created": ["package.json", "..."],
  "commands_executed": ["pnpm install", "..."],
  "lines_of_code": 1250,
  "success": true,
  "execution_id": "exec-1734471342-12345"
}
```

### `metrics.json` (Historical Accumulation)

**Purpose:** Long-term analytics
**Content:** Array of all executions + summary

```json
{
  "project": "kaven-boilerplate",
  "version": "2.0.0",
  "executions": [
    { /* execution 1 */ },
    { /* execution 2 */ },
    { /* execution N */ }
  ],
  "summary": {
    "total_executions": 10,
    "success_rate": 95.5,
    "total_duration_seconds": 3420,
    "total_files_created": 120,
    "total_lines_of_code": 12500
  }
}
```

### `files_tracker.txt` & `commands_tracker.txt`

**Purpose:** Temporary accumulation during workflow execution
**Lifecycle:** Created → Written to → Read → Deleted
**Format:** Plain text, one item per line

```
# files_tracker.txt
package.json
turbo.json
apps/api/src/index.ts

# commands_tracker.txt
pnpm install
git commit -m 'message'
docker-compose up -d
```

---

## 🎯 Key Concepts

### 1. **Snapshot Pattern**

**Problem:** Reports reading from historical array were error-prone
**Solution:** Create snapshot of last execution in flat file
**Result:** 100% accurate reports

### 2. **Execute Wrapper**

**Problem:** Manual command tracking was forgotten
**Solution:** Proxy function that logs automatically
**Result:** Zero-effort audit trail

### 3. **Mathematical Duration**

**Problem:** Temporary file-based timing was fragile
**Solution:** ISO8601 timestamp arithmetic (Python)
**Result:** Accurate to the second

### 4. **Self-Healing**

**Problem:** Docker race conditions caused manual intervention
**Solution:** AI Doctor with pattern matching and auto-fix
**Result:** Zero manual debugging

---

## 📈 Data-Driven Engineering

### Current KPIs (v2.0)

- ✅ Duration (seconds)
- ✅ LOC generated
- ✅ Files created
- ✅ Commands executed
- ✅ Success rate
- ✅ LOC/second generation rate

### Future KPIs (Roadmap)

```json
{
  "steps": [
    {
      "sequence": 1,
      "command": "pnpm install",
      "status": "success",
      "duration_ms": 15420,
      "exit_code": 0,
      "stdout_lines": 245,
      "stderr_lines": 0
    },
    {
      "sequence": 2,
      "command": "npx prisma migrate",
      "status": "success",
      "duration_ms": 3240,
      "exit_code": 0
    }
  ]
}
```

**Enables:**
- Bottleneck detection (which step is slowest?)
- Regression detection (is pnpm install getting slower?)
- Cost estimation (CI/CD minutes)
- Failure correlation (which OS has most Docker issues?)

---

## 🔒 Best Practices

### 1. **Always Use execute() for Commands**

❌ **Bad:**
```bash
pnpm install
git commit -m "message"
```

✅ **Good:**
```bash
execute "pnpm install"
execute "git commit -m 'message'"
```

### 2. **Track File Creation**

```bash
cat > myfile.ts << 'EOF'
// content
EOF

echo "myfile.ts" >> .agent/telemetry/files_tracker.txt
```

### 3. **Run finalize_telemetry.sh Last**

```bash
# Last step in every workflow
.agent/scripts/finalize_telemetry.sh
bash .agent/scripts/consolidate_workflow_report.sh workflow-name
```

### 4. **Check Snapshot After Execution**

```bash
# Verify telemetry worked
jq '.' .agent/telemetry/last_execution.json

# Should show:
# - duration_seconds > 0
# - files_created.length > 0
# - commands_executed.length > 0
```

---

## 🐛 Troubleshooting

### Issue: Empty commands_executed

**Cause:** Not using `execute()` wrapper
**Fix:** Replace direct commands with `execute "command"`

### Issue: Duration is 0

**Cause:** Python not installed or timestamp format error
**Fix:** Install Python 3: `sudo apt install python3`

### Issue: Report shows "FAILED" but workflow succeeded

**Cause:** Old data from previous run
**Fix:** Check `last_execution.json` timestamp, re-run if stale

### Issue: Docker containers in restart loop

**Cause:** Race condition or permission error
**Fix:** Docker Doctor will auto-fix. If persists, check logs:
```bash
docker logs kaven-postgres
```

---

## 📚 Script Reference

### init_telemetry.sh

```bash
.agent/scripts/init_telemetry.sh "workflow-name" "Description"
```

**What it does:**
- Creates `current_execution.json`
- Initializes trackers
- Sets start timestamp

### finalize_telemetry.sh

```bash
.agent/scripts/finalize_telemetry.sh
```

**What it does:**
- Calculates duration (Python)
- Counts LOC
- Creates snapshot (`last_execution.json`)
- Updates history (`metrics.json`)
- Archives execution

### consolidate_workflow_report.sh

```bash
bash .agent/scripts/consolidate_workflow_report.sh workflow-name
```

**What it does:**
- Reads `last_execution.json` (snapshot)
- Extracts KPIs
- Generates markdown report

### docker_doctor.py

```bash
python3 .agent/scripts/docker_doctor.py
```

**What it does:**
- Monitors container health
- Diagnoses issues (regex patterns)
- Auto-heals common problems
- Provides troubleshooting tips

---

## 🎉 Success Indicators

After running a workflow, you should see:

```bash
✅ Telemetry initialized
✅ Commands logged automatically
✅ Files tracked
✅ Docker containers healthy
✅ Duration calculated: 342s
✅ LOC counted: 1250
✅ Snapshot created
✅ Report generated
```

---

## 📦 Version History

### v2.0 (Current)
- ✅ Snapshot-based reporting
- ✅ Execute wrapper
- ✅ Mathematical duration
- ✅ Docker AI Doctor
- ✅ Python-based timestamps

### v1.0 (Legacy)
- ❌ Manual jq tracking
- ❌ File-based duration
- ❌ Reading from metrics.json
- ❌ Empty commands_executed

---

## 🤝 Contributing

To add a new workflow:

1. Create `0N-workflow-name.md` in `workflows/`
2. Add STEP 0 with `execute()` wrapper definition
3. Use `execute "command"` for all critical commands
4. Manually append to `files_tracker.txt` for file creation
5. End with `finalize_telemetry.sh` + report generation

---

**Built with ❤️ for the Kaven Boilerplate project**

*Data-Driven Engineering: Measure Everything, Optimize Everything*
