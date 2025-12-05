---
description: "Kaven Phase 1.6 - Generate implementation_plan.json from PDR (with telemetry)"
---

# PDR to Tasks (Instrumented)

You are generating implementation_plan.json with sequential implementation tasks.
**This workflow automatically tracks execution metrics.**

## STEP 0: INITIALIZE TELEMETRY 🔍

// turbo
echo '{
  "timestamp_start": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
  "workflow_name": "tasks",
  "task_description": "Generate implementation plan from PDR",
  "files_created": [],
  "files_modified": [],
  "commands_executed": [],
  "success": true,
  "agent_mode": "plan"
}' > .agent/telemetry/current_execution.json

// Track command
// turbo
jq '.commands_executed += ["echo {...} > .agent/telemetry/current_execution.json"]' .agent/telemetry/current_execution.json > .agent/telemetry/current_execution.tmp.json && mv .agent/telemetry/current_execution.tmp.json .agent/telemetry/current_execution.json

## Prerequisites:

1. Verify that `PDR.md` exists.
2. Verify that `schema.prisma` exists.
3. Verify that `api_contracts.ts` (or router files) exist.
4. Read PDR Section 13: Incremental Roadmap.

## Steps:

**IMPORTANT:** Every feature in kickoff.json's core_v1 MUST have at least one task. Do not skip features.

1. Read the week-by-week roadmap from PDR Section 13.

2. Break each week into atomic tasks where:
   - 1 task = 1 day of work (4-8 hours)
   - Each task has clear inputs and outputs
   - Each task is testable (has acceptance criteria)

3. Generate `implementation_plan.json` with this structure:

```json
{
  "project": "project-name",
  "total_tasks": number,
  "estimated_hours": number,
  "tasks": [
    {
      "id": "task-001",
      "epic": "Setup|Backend|Frontend|Features|Deploy",
      "story": "One-line user story",
      "priority": "P0|P1|P2",
      "subtasks": ["Subtask 1", "Subtask 2"],
      "dependencies": ["task-000"],
      "estimated_hours": 4-8,
      "acceptance_criteria": ["Criterion 1 (testable)", "Criterion 2"],
      "files_to_modify": ["path/to/file.ts"]
    }
  ]
}
```

## Task Sequence (Standard):

1. task-001: Setup Environment (4h)
2. task-002: Database Setup (3h)
3. task-003: tRPC Router Validation (2-4h)
4. task-004-00X: UI Components (5-8h each)
5. task-00X+1: Integration (6h)
6. task-00X+2-00X+N: Features (varies)
7. task-00X+N+1: Deploy (4h)

## Task Rules:

- Dependencies MUST be satisfied (no circular deps)
- Acceptance criteria MUST be binary (pass/fail)
- estimated_hours sum MUST match PDR roadmap (within 10%)
- P0 = must-have (core_v1), P1 = should-have, P2 = nice-to-have

## STEP 1: Generate implementation_plan.json

Save to `implementation_plan.json` in project root.

// Track file creation
// turbo
jq '.files_created += ["implementation_plan.json"]' .agent/telemetry/current_execution.json > .agent/telemetry/current_execution.tmp.json && mv .agent/telemetry/current_execution.tmp.json .agent/telemetry/current_execution.json

## STEP 2: Generate task dependencies graph

Save Mermaid diagram to `task_dependencies.md`

// Track file creation
// turbo
jq '.files_created += ["task_dependencies.md"]' .agent/telemetry/current_execution.json > .agent/telemetry/current_execution.tmp.json && mv .agent/telemetry/current_execution.tmp.json .agent/telemetry/current_execution.json

## Validation:

After generating:

1. **Check JSON is valid**

```bash
node -e "JSON.parse(require('fs').readFileSync('implementation_plan.json', 'utf8'))"
```

// Track command
// turbo
jq '.commands_executed += ["node -e JSON.parse(...)"]' .agent/telemetry/current_execution.json > .agent/telemetry/current_execution.tmp.json && mv .agent/telemetry/current_execution.tmp.json .agent/telemetry/current_execution.json

2. **Verify no circular dependencies**
3. **Verify estimated_hours match PDR** (within 10%)
4. **Verify all P0 tasks cover core_v1 features**
5. **Verify critical path is realistic** (≤80% of total hours)

**If validation fails:**

// turbo
jq '.success = false | .error_message = "Task validation failed"' .agent/telemetry/current_execution.json > .agent/telemetry/current_execution.tmp.json && mv .agent/telemetry/current_execution.tmp.json .agent/telemetry/current_execution.json

// Then finalize telemetry
// turbo
node .agent/scripts/finalize_telemetry.js

**STOP here and fix errors before continuing.**

## Output Summary:

1. ✅ `implementation_plan.json` (all tasks)
2. ✅ `task_dependencies.md` (Mermaid diagram)
3. ✅ All validations passed

Show me the task list (id + story) and ask for approval before finalizing.

## STEP 3: FINALIZE TELEMETRY 🏁

After user approves:

// turbo
node .agent/scripts/finalize_telemetry.js

---

**📊 Execution metrics will be saved to:** `.agent/telemetry/metrics.json`
**📝 Note:** Use implementation_plan.json with Antigravity Agent Manager to execute tasks
