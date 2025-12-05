---
description: "Kaven Phase 1.3 - Generate schema.prisma from PDR (with telemetry)"
---

# PDR to Backend (Instrumented)

You are generating a Prisma schema and backend analysis from the PDR.
**This workflow automatically tracks execution metrics.**

## STEP 0: INITIALIZE TELEMETRY 🔍

// turbo
echo '{
  "timestamp_start": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
  "workflow_name": "backend",
  "task_description": "Generate Prisma schema from PDR",
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
2. Read Section 6: Information Architecture.
3. Read Section 10: Architectural Decisions (to know if SQLite or PostgreSQL).

## Steps:

1. Extract entities from Section 6 of PDR.md.

2. For each entity, identify:
   - Fields (name, type)
   - Relationships (@relation)
   - Indexes (on filterable fields)
   - Constraints (unique, optional)

3. Generate `schema.prisma` with this structure:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"  // or "postgresql" based on PDR Section 10
  url      = env("DATABASE_URL")
}

// Models here
model Entity {
  id          String   @id @default(uuid())
  field1      String
  field2      Int?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([field1])
}

// Enums here (if needed)
enum Status {
  VALUE1
  VALUE2
}
```

4. Generate `backend_analysis.md` with:
   - Entity-Relationship diagram (textual)
   - RLS policies (if PostgreSQL + multi-tenancy)
   - Key architectural decisions
   - Security considerations

## Schema Requirements:

- Use `uuid()` for IDs (not auto-increment)
- Add `createdAt` and `updatedAt` to all models (DateTime)
- Add `@@index` on fields that will be filtered (status, dates, foreign keys)
- Use `String?` for optional fields (question mark)
- **CRITICAL - SQLite Enum Handling:**
  - If provider = "sqlite": Use `String` type for enum fields (SQLite has no native Enum)
  - Add comment documenting valid values: `status String // Enum: TODO, IN_PROGRESS, DONE`
  - Add `@default()` with string value: `@default("TODO")`
  - Document that Zod validation will enforce enum constraints
  - If provider = "postgresql": Use native Prisma enums
- If mode=personal: `provider = "sqlite"`
- If mode=business: `provider = "postgresql"`

## Example Schema (TaskFlow):

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Task {
  id          String     @id @default(uuid())
  title       String     @db.VarChar(200)  // Max 200 chars
  description String?
  status      String     @default("TODO")  // Enum: TODO, IN_PROGRESS, DONE
  priority    String     @default("MEDIUM") // Enum: LOW, MEDIUM, HIGH
  deadline    DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([status])
  @@index([createdAt])
  @@index([priority])
}
```

**Note:** For SQLite, enums are stored as Strings with application-level validation (Zod).

## STEP 1: Save schema.prisma

Save `schema.prisma` to `prisma/schema.prisma`

// Track file creation
// turbo
jq '.files_created += ["prisma/schema.prisma"]' .agent/telemetry/current_execution.json > .agent/telemetry/current_execution.tmp.json && mv .agent/telemetry/current_execution.tmp.json .agent/telemetry/current_execution.json

## STEP 2: Validation

After generating `schema.prisma`, validate it:

```bash
npx prisma validate
```

// Track command
// turbo
jq '.commands_executed += ["npx prisma validate"]' .agent/telemetry/current_execution.json > .agent/telemetry/current_execution.tmp.json && mv .agent/telemetry/current_execution.tmp.json .agent/telemetry/current_execution.json

If validation fails with "Enum not supported" error:
- You're using SQLite with Prisma 6.x (has bugs)
- Downgrade to Prisma 5.10.0: `npm install @prisma/client@5.10.0 prisma@5.10.0`
- Convert enums to String fields as documented above
- Re-run validation

If validation fails with other errors:
- Fix syntax errors
- Check relation fields (@relation)
- Ensure all models have `@@index` where needed

Only proceed when validation passes successfully.

**If validation fails:**

// turbo
jq '.success = false | .error_message = "Prisma validation failed"' .agent/telemetry/current_execution.json > .agent/telemetry/current_execution.tmp.json && mv .agent/telemetry/current_execution.tmp.json .agent/telemetry/current_execution.json

// Then finalize telemetry
// turbo
node .agent/scripts/finalize_telemetry.js

**STOP here and fix errors before continuing.**

## STEP 3: Generate backend_analysis.md

Save `backend_analysis.md` to project root.

// Track file creation
// turbo
jq '.files_created += ["backend_analysis.md"]' .agent/telemetry/current_execution.json > .agent/telemetry/current_execution.tmp.json && mv .agent/telemetry/current_execution.tmp.json .agent/telemetry/current_execution.json

## Output Summary:

1. ✅ `schema.prisma` in `prisma/schema.prisma`
2. ✅ `backend_analysis.md` in project root
3. ✅ Validation passed

Show me the generated schema and ask for approval before finalizing.

## STEP 4: FINALIZE TELEMETRY 🏁

After user approves:

// turbo
node .agent/scripts/finalize_telemetry.js

---

**📊 Execution metrics will be saved to:** `.agent/telemetry/metrics.json`
